import { box, goalOn, ground, spawnOn, spikes } from './helpers.js';

export const level17 = {
  id: 'level-17',
  number: 17,
  name: 'Hydraulic Piston',
  subtitle: 'Vertical lift with lethal crushing ceiling',
  world: { width: 1280, height: 720 },
  spawn: spawnOn(100, 540),
  goal: goalOn(1160, 480),
  terrain: [
    ground('lower-dock', 0, 360, 540),
    ground('crusher-roof', 400, 680, 0, 150),
    ground('upper-dock', 680, 1280, 480),
    ground('pit-base', 360, 680, 700),
  ],
  hazards: [
    spikes('roof-spikes', 400, 680, 150, 184, 'down'),
    spikes('pit-spikes', 360, 680, 666, 700, 'up'),
  ],
  movingPlatforms: [
    {
      id: 'piston-lift',
      width: 260,
      height: 24,
      from: { x: 530, y: 552 },
      to: { x: 530, y: 492 },
      moveTime: 2.0,
      dwellFrom: 2.6,
      dwellTo: 1.0,
      phase: 0,
    },
  ],
  noDrawZones: [{ id: 'piston-shaft', ...box(400, 680, 0, 720) }],
  decorations: [
    { type: 'cloud', x: 250, y: 120, scale: 0.9 },
    { type: 'cloud', x: 980, y: 110, scale: 1 },
  ],
  mechanics: ['vertical-lift', 'ceiling-hazard', 'timing'],
  constraints: { maxRoadLength: 420, maxStrokes: 2, allowUndo: true },
  stars: { targetRoadLength: 280 },
  instructions:
    'Ride the piston from the depths to the high ledge. Jump before the spikes crush you!',
  hint: 'Roll onto the lift as it ascends, then exit to the right before it hits the roof.',
  failY: 780,
};
