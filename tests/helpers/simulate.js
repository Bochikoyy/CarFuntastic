import { DrawingController } from '../../src/game/DrawingController.js';
import { GameSession } from '../../src/game/GameSession.js';
import { PhysicsWorld } from '../../src/game/PhysicsWorld.js';

/** Feed raw points into the drawing pipeline in small increments, like a pointer would. */
export function drawStroke(drawing, session, rawPoints) {
  const begin = drawing.begin(rawPoints[0]);
  if (!begin.ok) return begin;
  for (let i = 1; i < rawPoints.length; i += 1) {
    const a = rawPoints[i - 1];
    const b = rawPoints[i];
    const steps = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 6));
    for (let s = 1; s <= steps; s += 1) {
      drawing.extend({ x: a.x + ((b.x - a.x) * s) / steps, y: a.y + ((b.y - a.y) * s) / steps });
    }
  }
  const result = drawing.end();
  if (result.ok) session.addStroke(result.stroke);
  return result;
}

/** Run a level headlessly with the given solution; returns the final result and step count. */
export function simulate(level, solution = { strokes: [] }, maxSteps = 60 * 40) {
  const session = new GameSession(level);
  const drawing = new DrawingController(level, session);
  const drawResults = solution.strokes.map((s) => drawStroke(drawing, session, s));
  const world = new PhysicsWorld(level);
  world.setRoads(session.strokes);
  for (let i = 0; i < (solution.waitSteps ?? 0); i += 1) world.advanceIdle();
  let result = { status: 'running' };
  let steps = 0;
  while (result.status === 'running' && steps < maxSteps) {
    result = world.step();
    steps += 1;
  }
  const chassis = world.vehicle.chassis.position;
  const out = {
    ...result,
    steps,
    drawResults,
    roadLength: session.totalLength,
    x: chassis.x,
    y: chassis.y,
  };
  world.dispose();
  return out;
}
