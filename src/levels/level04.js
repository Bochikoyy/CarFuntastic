import { goalOn, ground, spawnOn } from './helpers.js';

export const level04 = {
  id: 'level-04',
  number: 4,
  name: 'Up We Go',
  subtitle: 'Climb to a high platform',
  world: { width: 1280, height: 720 },
  spawn: spawnOn(100, 560),
  goal: goalOn(1080, 340),
  terrain: [
    ground('start-ledge', 0, 360, 560),
    ground('valley-floor', 360, 860, 690),
    ground('high-platform', 860, 1280, 340),
  ],
  hazards: [],
  movingPlatforms: [],
  noDrawZones: [],
  decorations: [
    { type: 'cloud', x: 300, y: 120, scale: 0.9 },
    { type: 'cloud', x: 760, y: 90, scale: 1.1 },
    { type: 'bush', x: 1200, y: 340 },
  ],
  mechanics: ['draw-road', 'ramps'],
  constraints: { maxRoadLength: 680, maxStrokes: 4, allowUndo: true },
  stars: { targetRoadLength: 620 },
  instructions: 'The flag is up high. Build a ramp to reach it.',
  hint: 'Give your car room to build speed before the climb.',
  failY: 780,
};
