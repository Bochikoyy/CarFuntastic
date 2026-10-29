import { box, goalOn, ground, spawnOn, spikes } from './helpers.js';

export const level11 = {
  id: 'level-11',
  number: 11,
  name: 'Needle in the Sky',
  subtitle: 'Precision skyway over death drop',
  world: { width: 1280, height: 720 },
  spawn: spawnOn(100, 360),
  goal: goalOn(1160, 360),
  terrain: [
    ground('start-ledge', 0, 320, 360),
    ground('needle-pillar', 610, 670, 340),
    ground('finish-ledge', 960, 1280, 360),
    ground('deep-pit', 320, 960, 680),
  ],
  hazards: [spikes('bed-of-spikes', 320, 960, 646, 680, 'up')],
  movingPlatforms: [],
  noDrawZones: [{ id: 'needle-zone', ...box(590, 690, 0, 320) }],
  decorations: [
    { type: 'cloud', x: 400, y: 120, scale: 0.9 },
    { type: 'cloud', x: 880, y: 100, scale: 1.1 },
  ],
  mechanics: ['precision', 'no-draw', 'hazards', 'budget'],
  constraints: { maxRoadLength: 640, maxStrokes: 2, allowUndo: true },
  stars: { targetRoadLength: 620 },
  instructions: 'Touchdown on the isolated needle, then bridge to the goal. Mind the dead zone!',
  hint: 'Two direct, shallow bridges prevent bottoming out.',
  failY: 780,
};
