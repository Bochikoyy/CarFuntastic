import { goalOn, ground, spawnOn } from './helpers.js';

export const level02 = {
  id: 'level-02',
  number: 2,
  name: 'Easy Does It',
  subtitle: 'Smooth slopes',
  world: { width: 1280, height: 720 },
  spawn: spawnOn(110, 480),
  goal: goalOn(1060, 440),
  terrain: [ground('start-ledge', 0, 300, 480), ground('finish-ledge', 820, 1280, 440)],
  hazards: [],
  movingPlatforms: [],
  noDrawZones: [],
  decorations: [
    { type: 'cloud', x: 420, y: 120, scale: 1 },
    { type: 'cloud', x: 1020, y: 160, scale: 0.7 },
    { type: 'bush', x: 900, y: 440 },
  ],
  mechanics: ['draw-road', 'slopes'],
  constraints: { maxRoadLength: 650, maxStrokes: 5, allowUndo: true },
  stars: { targetRoadLength: 610 },
  instructions: 'Draw a road that dips into the valley and climbs to the flag.',
  hint: 'Try a smooth dip and a gradual climb.',
  failY: 780,
};
