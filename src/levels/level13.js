import { goalOn, ground, slab, spawnOn, spikes } from './helpers.js';

export const level13 = {
  id: 'level-13',
  number: 13,
  name: 'The Razor Cavern',
  subtitle: 'Claustrophobic double hazard tunnel',
  world: { width: 1280, height: 720 },
  spawn: spawnOn(100, 480),
  goal: goalOn(1140, 480),
  terrain: [
    ground('start-zone', 0, 320, 480),
    slab('ceiling-slab', 380, 880, 310, 20),
    ground('spikes-base', 320, 940, 680),
    ground('exit-ledge', 940, 1280, 480),
  ],
  hazards: [
    spikes('floor-danger', 320, 940, 646, 680, 'up'),
    spikes('ceiling-teeth', 380, 880, 330, 364, 'down'),
  ],
  movingPlatforms: [],
  noDrawZones: [],
  decorations: [
    { type: 'cloud', x: 200, y: 120, scale: 0.8 },
    { type: 'sign', x: 240, y: 480 },
  ],
  mechanics: ['precision', 'ceiling-hazard', 'narrow-tunnel'],
  constraints: { maxRoadLength: 680, maxStrokes: 1, allowUndo: true },
  stars: { targetRoadLength: 640 },
  instructions: 'Thread the needle between floor spikes and hanging ceiling fangs.',
  hint: 'Keep the bridge strictly horizontal at y=480 so the car never bounces into the roof.',
  failY: 780,
};
