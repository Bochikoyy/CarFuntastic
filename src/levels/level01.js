import { goalOn, ground, spawnOn } from './helpers.js';

export const level01 = {
  id: 'level-01',
  number: 1,
  name: 'First Lines',
  subtitle: 'Draw a simple bridge',
  world: { width: 1280, height: 720 },
  spawn: spawnOn(120, 540),
  goal: goalOn(1000, 510),
  terrain: [ground('start-ledge', 0, 360, 540), ground('finish-ledge', 520, 1280, 510)],
  hazards: [],
  movingPlatforms: [],
  noDrawZones: [],
  decorations: [
    { type: 'cloud', x: 260, y: 140, scale: 1.1 },
    { type: 'cloud', x: 880, y: 100, scale: 0.8 },
    { type: 'bush', x: 1180, y: 510 },
    { type: 'arrow', x: 440, y: 420 },
  ],
  mechanics: ['draw-road'],
  constraints: { maxRoadLength: 700, maxStrokes: 5, allowUndo: true },
  stars: { targetRoadLength: 260 },
  instructions: 'Draw a road across the gap, then press Play.',
  hint: 'Connect both sides with a gentle line.',
  failY: 780,
};
