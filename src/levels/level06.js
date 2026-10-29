import { goalOn, ground, spawnOn } from './helpers.js';

export const level06 = {
  id: 'level-06',
  number: 6,
  name: 'The Long Jump',
  subtitle: 'Launch and land',
  world: { width: 1280, height: 720 },
  spawn: spawnOn(80, 240),
  goal: goalOn(1060, 560),
  terrain: [ground('high-start', 0, 220, 240), ground('landing', 620, 1280, 560)],
  hazards: [],
  movingPlatforms: [],
  noDrawZones: [],
  decorations: [
    { type: 'cloud', x: 520, y: 110, scale: 1.2 },
    { type: 'cloud', x: 1000, y: 180, scale: 0.8 },
    { type: 'arrow', x: 700, y: 360 },
  ],
  mechanics: ['draw-road', 'jump'],
  constraints: { maxRoadLength: 480, maxStrokes: 3, allowUndo: true },
  stars: { targetRoadLength: 460 },
  instructions: 'Too far for a bridge — build speed downhill and jump!',
  hint: 'A ramp can turn forward speed into a jump.',
  failY: 780,
};
