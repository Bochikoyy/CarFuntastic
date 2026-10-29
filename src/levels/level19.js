import { box, goalOn, ground, spawnOn, spikes } from './helpers.js';

export const level19 = {
  id: 'level-19',
  number: 19,
  name: 'Pendulum Alley',
  subtitle: 'Synchronized diagonal platforms across spike canyon',
  world: { width: 1280, height: 720 },
  spawn: spawnOn(100, 320),
  goal: goalOn(1160, 520),
  terrain: [
    ground('start-crag', 0, 130, 320),
    ground('canyon-depths', 220, 960, 700),
    ground('finish-crag', 960, 1280, 520),
  ],
  hazards: [spikes('valley-spikes', 220, 960, 666, 700, 'up')],
  movingPlatforms: [
    {
      id: 'diagonal-lift-1',
      width: 190,
      height: 24,
      from: { x: 340, y: 340 },
      to: { x: 560, y: 460 },
      moveTime: 2.2,
      dwellFrom: 1.2,
      dwellTo: 1.2,
      phase: 0,
    },
    {
      id: 'diagonal-lift-2',
      width: 190,
      height: 24,
      from: { x: 670, y: 460 },
      to: { x: 920, y: 532 },
      moveTime: 2.2,
      dwellFrom: 2.4,
      dwellTo: 1.2,
      phase: 0,
    },
  ],
  noDrawZones: [{ id: 'swing-channel', ...box(220, 960, 0, 660) }],
  decorations: [
    { type: 'cloud', x: 380, y: 120, scale: 1 },
    { type: 'cloud', x: 820, y: 90, scale: 0.9 },
  ],
  mechanics: ['moving-platform', 'dual-timing', 'zero-mid-build'],
  constraints: { maxRoadLength: 280, maxStrokes: 2, allowUndo: true },
  stars: { targetRoadLength: 220 },
  instructions:
    'No drawing allowed in the center airspace! Connect to the platforms when they dock.',
  hint: 'Draw tiny bridgeheads to board the first lift and disembark from the second.',
  failY: 780,
};
