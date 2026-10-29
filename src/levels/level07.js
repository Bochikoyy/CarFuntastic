import { goalOn, ground, spawnOn } from './helpers.js';

export const level07 = {
  id: 'level-07',
  number: 7,
  name: 'Draw Less, Think More',
  subtitle: 'Limited road budget',
  world: { width: 1280, height: 720 },
  spawn: spawnOn(110, 500),
  goal: goalOn(1100, 460),
  terrain: [
    ground('start-ledge', 0, 330, 500),
    ground('middle-shelf', 460, 760, 440),
    ground('finish-ledge', 890, 1280, 460),
  ],
  hazards: [],
  movingPlatforms: [],
  noDrawZones: [],
  decorations: [
    { type: 'cloud', x: 380, y: 140, scale: 0.9 },
    { type: 'cloud', x: 980, y: 120, scale: 1 },
    { type: 'bush', x: 600, y: 440 },
  ],
  mechanics: ['draw-road', 'budget'],
  constraints: { maxRoadLength: 380, maxStrokes: 3, allowUndo: true },
  stars: { targetRoadLength: 360 },
  instructions: 'Two gaps, very little road. Plan before you draw!',
  hint: 'Plan your line before you draw.',
  failY: 780,
};
