import { useEffect, useRef, useState } from 'react';
import { Button } from '../components/Button.jsx';
import { Modal } from '../components/Modal.jsx';
import { ProgressStars } from '../components/ProgressStars.jsx';
import { DRAWING } from '../game/constants.js';
import { GAME_STATES } from '../game/GameStateMachine.js';
import { useGameController } from '../hooks/useGameController.js';

export function GameScreen({
  levelNumber,
  settings,
  onToggleMute,
  onWin,
  onNextLevel,
  onLevelSelect,
  onHome,
}) {
  const canvasRef = useRef(null);
  const [hintLevel, setHintLevel] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const showHint = hintLevel === levelNumber;

  const { snapshot, error, start, pause, resume, retry, undo, clear } = useGameController(
    canvasRef,
    {
      levelNumber,
      muted: settings.muted,
      onWin,
    },
  );

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.target && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        retry();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (snapshot?.state === GAME_STATES.RUNNING) pause();
        else if (snapshot?.state === GAME_STATES.PAUSED) resume();
      } else if (e.key === ' ' && snapshot?.state === GAME_STATES.READY) {
        e.preventDefault();
        start();
      }
    };
    globalThis.addEventListener?.('keydown', onKeyDown);
    return () => globalThis.removeEventListener?.('keydown', onKeyDown);
  }, [snapshot?.state, start, pause, resume, retry, undo]);

  if (error) {
    return (
      <main className="screen screen--game">
        <Modal title="Unable to Load Level" tone="danger">
          <p className="error-pre">{error}</p>
          <div className="modal__actions">
            <Button variant="primary" onClick={onLevelSelect}>
              Level Select
            </Button>
            <Button variant="secondary" onClick={onHome}>
              Home
            </Button>
          </div>
        </Modal>
      </main>
    );
  }

  const state = snapshot?.state ?? GAME_STATES.LOADING;
  const level = snapshot?.level;
  const budget = snapshot?.budget;
  const ratioRemaining =
    budget && budget.maxRoadLength > 0 ? budget.remainingLength / budget.maxRoadLength : 1;
  const lowBudget = ratioRemaining <= DRAWING.lowBudgetRatio;
  const isReady = state === GAME_STATES.READY || state === GAME_STATES.DRAWING;
  const isRunning = state === GAME_STATES.RUNNING;

  return (
    <main className="screen screen--game">
      <header className="hud-top">
        <div className="hud-top__left">
          <Button variant="ghost" size="sm" onClick={onHome} aria-label="Home">
            ⌂ Home
          </Button>
          <Button variant="ghost" size="sm" onClick={onLevelSelect}>
            Levels
          </Button>
        </div>

        <div className="hud-top__title">
          {level ? (
            <>
              <span className="hud-top__num">Level {level.number}</span>
              <span className="hud-top__name">{level.name}</span>
            </>
          ) : (
            <span>Loading…</span>
          )}
        </div>

        <div className="hud-top__right">
          {level?.hint && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHintLevel(showHint ? null : levelNumber)}
            >
              {showHint ? 'Hide Hint' : '💡 Hint'}
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => setShowHelp(true)}>
            ? Help
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleMute}
            aria-label={settings.muted ? 'Unmute sound' : 'Mute sound'}
          >
            {settings.muted ? '🔇' : '🔊'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => (isRunning ? pause() : resume())}
            disabled={!isRunning && state !== GAME_STATES.PAUSED}
          >
            {state === GAME_STATES.PAUSED ? 'Resume' : 'Pause'}
          </Button>
        </div>
      </header>

      <div className="instruction-strip" role="status" aria-live="polite">
        <span>{snapshot?.banner || level?.instructions}</span>
        {showHint && level?.hint && (
          <span className="instruction-strip__hint">Hint: {level.hint}</span>
        )}
      </div>

      <div className="playfield-wrap">
        <canvas ref={canvasRef} className="playfield-canvas" aria-label="Game playfield" />

        {state === GAME_STATES.PAUSED && (
          <Modal title="Paused">
            <p>Take a breather — your road is safe.</p>
            <div className="modal__actions">
              <Button variant="primary" onClick={resume}>
                Resume
              </Button>
              <Button variant="secondary" onClick={retry}>
                Retry
              </Button>
              <Button variant="ghost" onClick={onLevelSelect}>
                Level Select
              </Button>
            </div>
          </Modal>
        )}

        {state === GAME_STATES.WON && (
          <Modal
            title={level?.hasNext ? 'Fantastic! You made it!' : 'Chapter Complete!'}
            tone="success"
          >
            <ProgressStars count={snapshot.earnedStars} size="lg" />
            <p>
              {level?.hasNext
                ? `Level ${level.number + 1} is now unlocked!`
                : 'You conquered all 10 levels of Carfuntastic!'}
            </p>
            <div className="modal__actions">
              {level?.hasNext && (
                <Button variant="primary" size="lg" onClick={onNextLevel}>
                  Next Level →
                </Button>
              )}
              <Button variant="secondary" onClick={retry}>
                Replay
              </Button>
              <Button variant="ghost" onClick={onLevelSelect}>
                Level Select
              </Button>
            </div>
          </Modal>
        )}

        {state === GAME_STATES.FAILED && (
          <Modal title={snapshot.failInfo?.title ?? 'Try Again!'} tone="danger">
            <p>{snapshot.failInfo?.message}</p>
            <div className="modal__actions">
              <Button variant="primary" size="lg" onClick={retry}>
                Retry (Keep Road)
              </Button>
              <Button variant="ghost" onClick={onLevelSelect}>
                Level Select
              </Button>
            </div>
          </Modal>
        )}

        {showHelp && (
          <Modal title="How to Play">
            <ul className="help-list">
              <li>Drag on the paper to draw a solid road for the car.</li>
              <li>Watch the road meter — some levels limit total length and strokes.</li>
              <li>
                Press <strong>Play</strong> (or <kbd>Space</kbd>) to release the car.
              </li>
              <li>
                <strong>Retry</strong> (<kbd>R</kbd>) resets the car while keeping your roads so you
                can tweak one piece at a time.
              </li>
              <li>
                Use <strong>Undo</strong> (<kbd>Ctrl+Z</kbd>) or <strong>Clear</strong> to redraw.
              </li>
            </ul>
            <div className="modal__actions">
              <Button variant="primary" onClick={() => setShowHelp(false)}>
                Got it!
              </Button>
            </div>
          </Modal>
        )}
      </div>

      <footer className="hud-bottom">
        {budget && (
          <div className={`budget ${lowBudget ? 'budget--low' : ''}`}>
            <div className="budget__labels">
              <span>
                Road left: <strong>{budget.remainingLength}</strong> / {budget.maxRoadLength}
              </span>
              <span>
                Strokes: <strong>{budget.strokeCount}</strong> / {budget.maxStrokes}
              </span>
            </div>
            <div
              className="budget__bar"
              role="progressbar"
              aria-valuenow={budget.remainingLength}
              aria-valuemin={0}
              aria-valuemax={budget.maxRoadLength}
            >
              <div
                className="budget__fill"
                style={{ width: `${Math.max(0, Math.min(100, ratioRemaining * 100))}%` }}
              />
            </div>
          </div>
        )}

        <div className="controls">
          <Button variant="secondary" onClick={undo} disabled={!snapshot?.canUndo}>
            ↶ Undo
          </Button>
          <Button variant="secondary" onClick={clear} disabled={!snapshot?.canClear}>
            ✕ Clear
          </Button>
          <Button variant="secondary" onClick={retry}>
            ↻ Retry
          </Button>
          <Button variant="primary" size="lg" onClick={start} disabled={!isReady}>
            ▶ Play
          </Button>
        </div>
      </footer>
    </main>
  );
}
