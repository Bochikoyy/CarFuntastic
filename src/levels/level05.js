import { goalOn, ground, spawnOn, spikes } from './helpers.js';

export const level05 = {
  id: 'level-05',
  number: 5,
  name: 'The First Danger',
  subtitle: 'Introducing spikes',
  world: { width: 1280, height: 720 },
  spawn: spawnOn(110, 500),
  goal: goalOn(1080, 460),
  terrain: [
    ground('start-ledge', 0, 340, 500),
    ground('pit-floor', 340, 860, 670),
    ground('far-platform', 860, 1280, 460),
  ],
  hazards: [spikes('spike-pit', 340, 860, 636, 670, 'up')],
  movingPlatforms: [],
  noDrawZones: [],
  decorations: [
    { type: 'cloud', x: 600, y: 120, scale: 1 },
    { type: 'sign', x: 290, y: 500 },
  ],
  mechanics: ['draw-road', 'hazards'],
  constraints: { maxRoadLength: 700, maxStrokes: 4, allowUndo: true },
  stars: { targetRoadLength: 600 },
  instructions: 'Spikes are deadly! Build a road over the pit.',
  hint: 'Keep the car above the spikes and land safely.',
  failY: 780,
};
