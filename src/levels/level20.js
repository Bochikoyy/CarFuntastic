import { box, goalOn, ground, slab, spawnOn, spikes } from './helpers.js';

export const level20 = {
  id: 'level-20',
  number: 20,
  name: 'The Grand Gauntlet',
  subtitle: 'The ultimate test of precision, momentum, and timing',
  world: { width: 1280, height: 720 },
  spawn: spawnOn(80, 200),
  goal: goalOn(1160, 420),
  terrain: [
    ground('apex-start', 0, 200, 200),
    slab('mid-island', 500, 740, 440, 24),
    ground('finish-citadel', 960, 1280, 420),
    ground('lava-floor', 200, 960, 700),
  ],
  hazards: [spikes('floor-inferno', 200, 960, 666, 700, 'up')],
  movingPlatforms: [
    {
      id: 'citadel-elevator',
      width: 190,
      height: 24,
      from: { x: 860, y: 450 },
      to: { x: 860, y: 420 },
      moveTime: 1.8,
      dwellFrom: 2.4,
      dwellTo: 1.0,
      phase: 0,
    },
  ],
  noDrawZones: [{ id: 'elevator-air', ...box(760, 960, 0, 720) }],
  decorations: [
    { type: 'cloud', x: 300, y: 80, scale: 1.2 },
    { type: 'cloud', x: 780, y: 90, scale: 1 },
    { type: 'arrow', x: 380, y: 350 },
  ],
  mechanics: ['grandmaster', 'multi-stage', 'momentum', 'moving-platform', 'precision'],
  constraints: { maxRoadLength: 680, maxStrokes: 3, allowUndo: true },
  stars: { targetRoadLength: 580 },
  instructions:
    'Plunge from the heavens, touch down on the island, leap onto the elevator, and reach the Citadel.',
  hint: 'Use speed from the initial drop to coast over the spikes onto the central sanctuary.',
  failY: 780,
};
