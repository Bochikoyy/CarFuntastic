import { goalOn, ground, slab, spawnOn, spikes } from './helpers.js';

export const level09 = {
  id: 'level-09',
  number: 9,
  name: 'The Narrow Route',
  subtitle: 'Precision and control',
  world: { width: 1280, height: 720 },
  spawn: spawnOn(110, 440),
  goal: goalOn(920, 400),
  terrain: [
    ground('start-ledge', 0, 340, 440),
    slab('narrow-shelf', 480, 700, 410),
    ground('spike-floor', 340, 840, 700),
    ground('finish-pillar', 840, 1000, 400),
  ],
  hazards: [
    spikes('floor-spikes', 340, 840, 670, 700, 'up'),
    spikes('ceiling-spikes', 470, 710, 250, 280, 'down'),
  ],
  movingPlatforms: [],
  noDrawZones: [],
  decorations: [{ type: 'cloud', x: 1120, y: 140, scale: 1 }],
  mechanics: ['draw-road', 'hazards', 'budget', 'precision'],
  constraints: { maxRoadLength: 420, maxStrokes: 3, allowUndo: true },
  stars: { targetRoadLength: 380 },
  instructions: 'Use the narrow shelf to reach the small platform. Avoid all spikes!',
  hint: 'A smoother, lower-risk route beats a dramatic shortcut.',
  failY: 780,
};
