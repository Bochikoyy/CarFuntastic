import { goalOn, ground, spawnOn, spikes } from './helpers.js';

export const level10 = {
  id: 'level-10',
  number: 10,
  name: 'Carfuntastic Finale',
  subtitle: 'Combine everything you learned',
  world: { width: 1280, height: 720 },
  spawn: spawnOn(90, 480),
  goal: goalOn(1150, 470),
  terrain: [
    ground('start-ledge', 0, 220, 480),
    ground('raised-platform', 420, 600, 410),
    ground('spike-floor', 600, 920, 660),
    ground('final-landing', 920, 1280, 470),
  ],
  hazards: [spikes('spike-zone', 600, 920, 626, 660, 'up')],
  movingPlatforms: [],
  noDrawZones: [],
  decorations: [
    { type: 'cloud', x: 300, y: 120, scale: 1.1 },
    { type: 'cloud', x: 780, y: 160, scale: 0.9 },
    { type: 'bush', x: 1240, y: 470 },
  ],
  mechanics: ['draw-road', 'ramps', 'hazards', 'budget'],
  constraints: { maxRoadLength: 720, maxStrokes: 4, allowUndo: true },
  stars: { targetRoadLength: 640 },
  instructions: 'Cross, climb, clear the spikes, then land on the flag.',
  hint: 'Think in sections: cross, climb, clear the danger, then land.',
  failY: 780,
};
