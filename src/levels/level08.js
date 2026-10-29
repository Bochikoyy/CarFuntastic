import { box, goalOn, ground, spawnOn, spikes } from './helpers.js';

export const level08 = {
  id: 'level-08',
  number: 8,
  name: 'Moving Target',
  subtitle: 'Ride the lift',
  world: { width: 1280, height: 720 },
  spawn: spawnOn(110, 520),
  goal: goalOn(1110, 450),
  terrain: [
    ground('start-ledge', 0, 380, 520),
    ground('middle-ledge', 580, 760, 520),
    ground('goal-platform', 900, 1280, 450),
  ],
  hazards: [spikes('pit-wall-spikes', 574, 580, 580, 720, 'left')],
  movingPlatforms: [
    {
      id: 'lift',
      width: 196,
      height: 24,
      from: { x: 480, y: 532 },
      to: { x: 480, y: 700 },
      moveTime: 1.6,
      dwellFrom: 2.4,
      dwellTo: 0.8,
      phase: 0,
    },
  ],
  noDrawZones: [{ id: 'lift-shaft', ...box(380, 580, 0, 720) }],
  decorations: [
    { type: 'cloud', x: 300, y: 130, scale: 1 },
    { type: 'cloud', x: 820, y: 100, scale: 0.9 },
  ],
  mechanics: ['draw-road', 'moving-platform', 'timing'],
  constraints: { maxRoadLength: 450, maxStrokes: 3, allowUndo: true },
  stars: { targetRoadLength: 260 },
  instructions: 'Ride the lift across the shaft, then ramp up to the flag.',
  hint: "Watch the platform's rhythm before you press Play.",
  failY: 780,
};
