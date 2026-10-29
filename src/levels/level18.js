import { box, goalOn, ground, slab, spawnOn, spikes } from './helpers.js';

export const level18 = {
  id: 'level-18',
  number: 18,
  name: 'The Sonic Funnel',
  subtitle: 'Supersonic acceleration into a precision landing slot',
  world: { width: 1280, height: 720 },
  spawn: spawnOn(80, 160),
  goal: goalOn(1160, 480),
  terrain: [
    ground('sky-perch', 0, 180, 160),
    slab('bunker-roof', 760, 1020, 360, 24),
    ground('bunker-floor', 760, 1280, 480),
    ground('death-drop', 180, 760, 700),
  ],
  hazards: [
    spikes('ground-bed', 180, 760, 666, 700, 'up'),
    spikes('bunker-roof-spikes', 760, 1020, 326, 360, 'up'),
  ],
  movingPlatforms: [],
  noDrawZones: [{ id: 'bunker-mouth', ...box(740, 1040, 200, 460) }],
  decorations: [
    { type: 'cloud', x: 500, y: 100, scale: 1.1 },
    { type: 'arrow', x: 420, y: 440 },
  ],
  mechanics: ['high-speed-entry', 'tunnel-landing', 'no-draw'],
  constraints: { maxRoadLength: 720, maxStrokes: 1, allowUndo: true },
  stars: { targetRoadLength: 680 },
  instructions:
    'Build a single unbroken slide from high in the sky directly into the narrow bunker mouth.',
  hint: 'A single stroke that plunges steeply and levels out perfectly at y=480 slips right in.',
  failY: 780,
};
