import { DEFAULT_CAR_ID } from './CarCatalog.js';
import { MAX_STEPS_PER_FRAME, STEP_MS } from './constants.js';
import { AudioManager } from './AudioManager.js';
import { Camera } from './Camera.js';
import { DrawingController } from './DrawingController.js';
import { GAME_STATES, GameStateMachine } from './GameStateMachine.js';
import { GameSession } from './GameSession.js';
import { computeStars } from './GoalSystem.js';
import { FAIL_REASONS } from './HazardSystem.js';
import { InputController } from './InputController.js';
import { getLevelCount, loadLevel as loadValidatedLevel } from './LevelManager.js';
import { PhysicsWorld } from './PhysicsWorld.js';
import { Renderer } from './Renderer.js';

/**
 * Orchestrates level loading, drawing input, the fixed-timestep physics loop,
 * rendering and coarse UI notifications. React talks only to this public API.
 */
export class GameController {
  constructor(canvas, { muted = false, debug = false, carId = DEFAULT_CAR_ID, onWin } = {}) {
    this.canvas = canvas;
    this.onWin = onWin;
    this.listeners = new Set();
    this.stateMachine = new GameStateMachine(GAME_STATES.LOADING);
    this.camera = new Camera();
    this.renderer = new Renderer(canvas, this.camera, { debug, carId });
    this.audio = new AudioManager({ muted });

    this.level = null;
    this.session = null;
    this.drawing = null;
    this.physics = null;
    this.banner = '';
    this.failInfo = null;
    this.earnedStars = 0;

    this.rafId = null;
    this.lastFrameTime = 0;
    this.accumulator = 0;
    this.disposed = false;

    this.input = new InputController(canvas, this.camera, {
      onStart: (p) => this._beginStroke(p),
      onMove: (p) => this._extendStroke(p),
      onEnd: (p) => this._endStroke(p),
      onCancel: () => this._cancelStroke(),
    });

    this._onResize = () => this.renderer.resize();
    globalThis.addEventListener?.('resize', this._onResize);
    this.renderer.resize();
    this._startLoop();
  }

  subscribeToEvents(listener) {
    this.listeners.add(listener);
    if (this.level) listener(this.getSnapshot());
    return () => this.listeners.delete(listener);
  }

  _emit() {
    if (!this.level) return;
    const snap = this.getSnapshot();
    for (const fn of this.listeners) fn(snap);
  }

  getSnapshot() {
    const { level, session, drawing } = this;
    const previewLen = drawing?.active ? drawing.previewLength : 0;
    const usedLength = Math.round(session.totalLength + previewLen);
    const maxRoadLength = session.maxRoadLength;
    return {
      state: this.stateMachine.state,
      level: {
        id: level.id,
        number: level.number,
        name: level.name,
        subtitle: level.subtitle,
        instructions: level.instructions,
        hint: level.hint,
        hasNext: level.number < getLevelCount(),
      },
      budget: {
        usedLength,
        maxRoadLength,
        remainingLength: Math.max(0, Math.round(maxRoadLength - usedLength)),
        strokeCount: session.strokeCount,
        maxStrokes: session.maxStrokes,
      },
      canUndo:
        this.stateMachine.state === GAME_STATES.READY &&
        session.strokeCount > 0 &&
        level.constraints?.allowUndo !== false,
      canClear: this.stateMachine.state === GAME_STATES.READY && session.strokeCount > 0,
      banner: this.banner,
      failInfo: this.failInfo,
      earnedStars: this.earnedStars,
    };
  }

  loadLevel(levelNumber) {
    this.audio.stopEngine();
    if (this.stateMachine.state !== GAME_STATES.LOADING) {
      this.stateMachine.transition(GAME_STATES.LOADING);
    }
    this.level = loadValidatedLevel(levelNumber);
    this.camera.setWorld(this.level.world);
    this.renderer.resize();
    this.session = new GameSession(this.level);
    this.drawing = new DrawingController(this.level, this.session);
    this._rebuildPhysics({ preservePlatformPhase: false });
    this.banner = this.level.instructions;
    this.failInfo = null;
    this.earnedStars = 0;
    this.stateMachine.transition(GAME_STATES.READY);
    this._emit();
  }

  _rebuildPhysics({ preservePlatformPhase }) {
    const platformSteps = preservePlatformPhase && this.physics ? this.physics.platformSteps : 0;
    this.physics?.dispose();
    this.physics = new PhysicsWorld(this.level, { platformSteps });
    this.physics.setRoads(this.session.strokes);
  }

  start() {
    if (this.stateMachine.state !== GAME_STATES.READY) return;
    this.drawing.cancel();
    this._rebuildPhysics({ preservePlatformPhase: true });
    this.session.recordRun();
    this.banner = "Let's roll!";
    this.failInfo = null;
    this.stateMachine.transition(GAME_STATES.RUNNING);
    this.audio.startEngine();
    this._emit();
  }

  pause() {
    if (this.stateMachine.state !== GAME_STATES.RUNNING) return;
    this.audio.stopEngine();
    this.stateMachine.transition(GAME_STATES.PAUSED);
    this._emit();
  }

  resume() {
    if (this.stateMachine.state !== GAME_STATES.PAUSED) return;
    this.stateMachine.transition(GAME_STATES.RUNNING);
    this.audio.startEngine();
    this._emit();
  }

  retry() {
    if (this.stateMachine.state === GAME_STATES.LOADING) return;
    this.audio.stopEngine();
    this.drawing.cancel();
    this._rebuildPhysics({ preservePlatformPhase: false });
    this.banner = this.level.instructions;
    this.failInfo = null;
    if (this.stateMachine.state !== GAME_STATES.READY) {
      this.stateMachine.transition(GAME_STATES.READY);
    }
    this._emit();
  }

  undoStroke() {
    if (this.stateMachine.state !== GAME_STATES.READY) return;
    if (this.level.constraints?.allowUndo === false) return;
    if (!this.session.undo()) return;
    this.physics.setRoads(this.session.strokes);
    this.banner = 'Last road removed.';
    this._emit();
  }

  clearStrokes() {
    if (this.stateMachine.state !== GAME_STATES.READY) return;
    if (!this.session.clear()) return;
    this.physics.setRoads(this.session.strokes);
    this.banner = 'All roads cleared.';
    this._emit();
  }

  setMuted(muted) {
    this.audio.setMuted(muted);
  }

  setCarId(carId) {
    this.renderer.setCarId(carId);
  }

  _beginStroke(point) {
    if (this.stateMachine.state !== GAME_STATES.READY) return false;
    const res = this.drawing.begin(point);
    if (!res.ok) {
      this.banner = res.message;
      this.audio.playReject();
      this._emit();
      return false;
    }
    this.stateMachine.transition(GAME_STATES.DRAWING);
    this._emit();
    return true;
  }

  _extendStroke(point) {
    if (this.stateMachine.state !== GAME_STATES.DRAWING) return;
    if (this.drawing.extend(point)) {
      this.audio.playDrawTick();
      this._emit();
    }
  }

  _endStroke(point) {
    if (this.stateMachine.state !== GAME_STATES.DRAWING) return;
    this.drawing.extend(point);
    const res = this.drawing.end();
    this.stateMachine.transition(GAME_STATES.READY);
    if (res.ok) {
      this.session.addStroke(res.stroke);
      this.physics.setRoads(this.session.strokes);
      this.banner = this.level.instructions;
      this.audio.playCommit();
    } else if (res.message) {
      this.banner = res.message;
      this.audio.playReject();
    }
    this._emit();
  }

  _cancelStroke() {
    if (this.stateMachine.state !== GAME_STATES.DRAWING) return;
    this.drawing.cancel();
    this.stateMachine.transition(GAME_STATES.READY);
    this._emit();
  }

  _startLoop() {
    const tick = (now) => {
      if (this.disposed) return;
      const dt = this.lastFrameTime ? Math.min(100, now - this.lastFrameTime) : STEP_MS;
      this.lastFrameTime = now;
      this._update(dt);
      this._render();
      this.rafId = globalThis.requestAnimationFrame?.(tick) ?? null;
    };
    this.rafId = globalThis.requestAnimationFrame?.(tick) ?? null;
  }

  _update(dt) {
    if (!this.physics) return;
    this.accumulator += dt;
    let steps = 0;
    while (this.accumulator >= STEP_MS && steps < MAX_STEPS_PER_FRAME) {
      this.accumulator -= STEP_MS;
      steps += 1;
      const state = this.stateMachine.state;
      if (state === GAME_STATES.READY || state === GAME_STATES.DRAWING) {
        this.physics.advanceIdle();
      } else if (state === GAME_STATES.RUNNING) {
        const result = this.physics.step();
        if (result.status === 'won') {
          this._handleWin();
          break;
        }
        if (result.status === 'failed') {
          this._handleFail(result.reason);
          break;
        }
      }
    }
  }

  _handleWin() {
    if (this.stateMachine.state !== GAME_STATES.RUNNING) return;
    this.stateMachine.transition(GAME_STATES.WON);
    this.earnedStars = computeStars(this.level, {
      roadLength: this.session.totalLength,
      failures: this.session.failures,
    });
    this.banner = 'Fantastic! You made it!';
    this.audio.playWin();
    this.onWin?.({ levelNumber: this.level.number, stars: this.earnedStars });
    this._emit();
  }

  _handleFail(reason) {
    if (this.stateMachine.state !== GAME_STATES.RUNNING) return;
    this.stateMachine.transition(GAME_STATES.FAILED);
    this.session.recordFailure();
    this.failInfo = FAIL_REASONS[reason] ?? FAIL_REASONS.fall;
    this.banner = this.failInfo.message;
    this.audio.playFail();
    this._emit();
  }

  _render() {
    if (!this.level || !this.physics) return;
    this.renderer.render({
      level: this.level,
      renderState: this.physics.getRenderState(),
      strokes: this.session.strokes,
      preview: this.drawing.preview,
      previewBlocked: this.drawing.blocked,
      bodies: this.renderer.debug ? this.physics.getAllBodies() : null,
    });
  }

  dispose() {
    this.disposed = true;
    if (this.rafId !== null) globalThis.cancelAnimationFrame?.(this.rafId);
    globalThis.removeEventListener?.('resize', this._onResize);
    this.input.dispose();
    this.audio.dispose();
    this.physics?.dispose();
    this.listeners.clear();
  }
}
