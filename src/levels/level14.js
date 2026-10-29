import { box, goalOn, ground, spawnOn, spikes } from './helpers.js';

export const level14 = {
  id: 'level-14',
  number: 14,
  name: 'Pendulum Bay',
  subtitle: 'Dual synchronized moving platforms',
  world: { width: 1280, height: 720 },
  spawn: spawnOn(100, 460),
  goal: goalOn(1160, 460),
  terrain: [
    ground('start-port', 0, 300, 460),
    ground('chasm-deep', 300, 980, 700),
    ground('finish-port', 980, 1280, 460),
  ],
  hazards: [spikes('water-spikes', 300, 980, 666, 700, 'up')],
  movingPlatforms: [
    {
      id: 'ferry-1',
      width: 190,
      height: 24,
      from: { x: 420, y: 472 },
      to: { x: 640, y: 472 },
      moveTime: 2.0,
      dwellFrom: 1.0,
      dwellTo: 1.0,
      phase: 0,
    },
    {
      id: 'ferry-2',
      width: 190,
      height: 24,
      from: { x: 860, y: 472 },
      to: { x: 640, y: 472 },
      moveTime: 2.0,
      dwellFrom: 1.0,
      dwellTo: 1.0,
      phase: 0.5,
    },
  ],
  noDrawZones: [{ id: 'ferry-lane', ...box(310, 970, 0, 720) }],
  decorations: [
    { type: 'cloud', x: 450, y: 130, scale: 1 },
    { type: 'cloud', x: 850, y: 100, scale: 1.2 },
  ],
  mechanics: ['moving-platform', 'timing', 'no-draw'],
  constraints: { maxRoadLength: 220, maxStrokes: 2, allowUndo: true },
  stars: { targetRoadLength: 160 },
  instructions:
    'Two ferries cross in the bay. Ride them across or jump the gap with impeccable timing.',
  hint: 'Bridge the start and end gaps cleanly so the car steps onto the shifting decks.',
  failY: 780,
};
