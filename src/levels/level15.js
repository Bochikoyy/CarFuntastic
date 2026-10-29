import { goalOn, ground, spawnOn, spikes } from './helpers.js';

export const level15 = {
  id: 'level-15',
  number: 15,
  name: 'Micro Budget Staircase',
  subtitle: 'Extreme length constraint with elevation gain',
  world: { width: 1280, height: 720 },
  spawn: spawnOn(100, 560),
  goal: goalOn(1140, 240),
  terrain: [
    ground('tier-1', 0, 250, 560),
    ground('tier-2', 420, 680, 410),
    ground('tier-3', 850, 1050, 270),
    ground('tier-4-finish', 1050, 1280, 240),
    ground('pit-1', 250, 420, 700),
    ground('pit-2', 680, 850, 700),
  ],
  hazards: [
    spikes('spikes-1', 250, 420, 666, 700, 'up'),
    spikes('spikes-2', 680, 850, 666, 700, 'up'),
  ],
  movingPlatforms: [],
  noDrawZones: [],
  decorations: [
    { type: 'cloud', x: 320, y: 120, scale: 0.9 },
    { type: 'cloud', x: 740, y: 80, scale: 1 },
    { type: 'bush', x: 550, y: 410 },
  ],
  mechanics: ['ultra-budget', 'step-climber', 'steep-ramps'],
  constraints: { maxRoadLength: 580, maxStrokes: 2, allowUndo: true },
  stars: { targetRoadLength: 540 },
  instructions: 'Barely enough road for two tiny ramps. Every millimeter counts!',
  hint: 'Short, steep kickers placed right at the edges vault the car from terrace to terrace.',
  failY: 780,
};
