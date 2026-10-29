import { goalOn, ground, spawnOn } from './helpers.js';

export const level03 = {
  id: 'level-03',
  number: 3,
  name: 'Mind the Gap',
  subtitle: 'Bridge a wider gap',
  world: { width: 1280, height: 720 },
  spawn: spawnOn(100, 460),
  goal: goalOn(1050, 500),
  terrain: [ground('start-ledge', 0, 260, 460), ground('landing', 700, 1280, 500)],
  hazards: [],
  movingPlatforms: [],
  noDrawZones: [],
  decorations: [
    { type: 'cloud', x: 520, y: 130, scale: 1.2 },
    { type: 'sign', x: 200, y: 460 },
  ],
  mechanics: ['draw-road', 'budget'],
  constraints: { maxRoadLength: 520, maxStrokes: 4, allowUndo: true },
  stars: { targetRoadLength: 495 },
  instructions: 'The gap is wider now — watch your road budget.',
  hint: 'The shortest safe path is often the simplest.',
  failY: 780,
};
