import { box, goalOn, ground, spawnOn, spikes } from './helpers.js';

export const level12 = {
  id: 'level-12',
  number: 12,
  name: 'The Rollercoaster Dip',
  subtitle: 'Extreme momentum and uphill loop',
  world: { width: 1280, height: 720 },
  spawn: spawnOn(90, 220),
  goal: goalOn(1160, 320),
  terrain: [
    ground('high-spawn', 0, 220, 220),
    ground('chasm-floor', 320, 880, 690),
    ground('finish-cliff', 960, 1280, 320),
  ],
  hazards: [spikes('chasm-spikes', 320, 880, 656, 690, 'up')],
  movingPlatforms: [],
  noDrawZones: [{ id: 'center-exclusion', ...box(560, 640, 0, 440) }],
  decorations: [
    { type: 'cloud', x: 600, y: 90, scale: 1.3 },
    { type: 'arrow', x: 420, y: 380 },
  ],
  mechanics: ['momentum', 'steep-climb', 'hazards'],
  constraints: { maxRoadLength: 940, maxStrokes: 1, allowUndo: true },
  stars: { targetRoadLength: 900 },
  instructions: 'Plunge deep for maximum speed, then catapult up to the cliff without flipping.',
  hint: 'A smooth parabolic sweep turns steep descent into soaring climbing power.',
  failY: 780,
};
