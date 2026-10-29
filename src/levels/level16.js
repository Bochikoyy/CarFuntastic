import { box, goalOn, ground, spawnOn, spikes } from './helpers.js';

export const level16 = {
  id: 'level-16',
  number: 16,
  name: 'Skyhook Leap',
  subtitle: 'Blind canyon jump over vertical spiked monolith',
  world: { width: 1280, height: 720 },
  spawn: spawnOn(90, 240),
  goal: goalOn(1160, 480),
  terrain: [
    ground('launch-deck', 0, 320, 240),
    ground('middle-isle', 540, 720, 360),
    ground('landing-strip', 940, 1280, 480),
    ground('abyss', 320, 940, 710),
  ],
  hazards: [
    spikes('pit-spikes-1', 320, 540, 676, 710, 'up'),
    spikes('pit-spikes-2', 720, 940, 676, 710, 'up'),
  ],
  movingPlatforms: [],
  noDrawZones: [{ id: 'center-airspace', ...box(460, 520, 0, 720) }],
  decorations: [
    { type: 'cloud', x: 440, y: 80, scale: 1.2 },
    { type: 'arrow', x: 380, y: 220 },
  ],
  mechanics: ['double-jump', 'stepping-stone', 'no-draw'],
  constraints: { maxRoadLength: 540, maxStrokes: 2, allowUndo: true },
  stars: { targetRoadLength: 480 },
  instructions: 'Launch over the towering spiked pillar without clipping the no-build airspace.',
  hint: 'A sharp, concave ramp converts horizontal speed into high vertical arc.',
  failY: 780,
};
