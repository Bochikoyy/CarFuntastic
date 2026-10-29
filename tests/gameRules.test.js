import { describe, expect, it } from 'vitest';
import { DrawingController } from '../src/game/DrawingController.js';
import { GAME_STATES, GameStateMachine } from '../src/game/GameStateMachine.js';
import { GameSession } from '../src/game/GameSession.js';
import { computeStars } from '../src/game/GoalSystem.js';
import { PhysicsWorld } from '../src/game/PhysicsWorld.js';
import { levels } from '../src/levels/index.js';
import { level01 } from '../src/levels/level01.js';
import { level08 } from '../src/levels/level08.js';
import { solutions } from './fixtures/levelSolutions.js';
import { drawStroke, simulate } from './helpers/simulate.js';

describe('GameStateMachine', () => {
  it('enforces valid state transitions and blocks repeated terminal transitions', () => {
    const sm = new GameStateMachine();
    expect(sm.state).toBe(GAME_STATES.LOADING);
    sm.transition(GAME_STATES.READY);
    sm.transition(GAME_STATES.RUNNING);
    sm.transition(GAME_STATES.WON);
    expect(sm.isTerminal()).toBe(true);
    expect(() => sm.transition(GAME_STATES.FAILED)).toThrow();
    sm.transition(GAME_STATES.READY);
    expect(sm.isTerminal()).toBe(false);
  });
});

describe('DrawingController & PhysicsWorld integration', () => {
  it('commits strokes, creates matching physics bodies, and removes them on undo/clear', () => {
    const session = new GameSession(level01);
    const drawing = new DrawingController(level01, session);
    const world = new PhysicsWorld(level01);

    const res = drawStroke(drawing, session, solutions[1].strokes[0]);
    expect(res.ok).toBe(true);
    world.setRoads(session.strokes);
    expect(world.roadBodies.length).toBeGreaterThan(0);

    session.undo();
    world.setRoads(session.strokes);
    expect(world.roadBodies).toHaveLength(0);

    drawStroke(drawing, session, solutions[1].strokes[0]);
    session.clear();
    world.setRoads(session.strokes);
    expect(world.roadBodies).toHaveLength(0);
    world.dispose();
  });

  it('rejects strokes inside a no-draw zone and enforces stroke limits', () => {
    const session = new GameSession(level08);
    const drawing = new DrawingController(level08, session);
    const blocked = drawing.begin({ x: 480, y: 500 });
    expect(blocked.ok).toBe(false);
    expect(blocked.reason).toBe('noDraw');
  });
});

describe('All 20 levels — headless playtest', () => {
  it.each(levels.map((l) => [l.number, l.name, l]))(
    'Level %i (%s) fails without a road and is solvable with its reference drawing',
    (num, _name, level) => {
      const noRoad = simulate(level, { strokes: [] });
      expect(noRoad.status).toBe('failed');

      const solved = simulate(level, solutions[num]);
      expect(solved.drawResults.every((d) => d.ok)).toBe(true);
      expect(solved.roadLength).toBeLessThanOrEqual(level.constraints.maxRoadLength);
      expect(solved.status).toBe('won');
      expect(computeStars(level, { roadLength: solved.roadLength, failures: 0 })).toBe(3);
    },
  );
});
