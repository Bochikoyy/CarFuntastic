/**
 * Reference solutions used by the headless solvability tests. Each solution
 * is a list of raw strokes (as a player might draw them) plus the number of
 * idle steps to wait before pressing Play (for timing-based levels).
 */
export const solutions = {
  1: {
    strokes: [
      [
        { x: 330, y: 540 },
        { x: 440, y: 528 },
        { x: 560, y: 510 },
      ],
    ],
  },
  2: {
    strokes: [
      [
        { x: 280, y: 480 },
        { x: 420, y: 540 },
        { x: 560, y: 560 },
        { x: 700, y: 520 },
        { x: 840, y: 440 },
      ],
    ],
  },
  3: {
    strokes: [
      [
        { x: 240, y: 460 },
        { x: 480, y: 480 },
        { x: 720, y: 500 },
      ],
    ],
  },
  4: {
    strokes: [
      [
        { x: 340, y: 560 },
        { x: 600, y: 470 },
        { x: 880, y: 340 },
      ],
    ],
  },
  5: {
    strokes: [
      [
        { x: 320, y: 500 },
        { x: 600, y: 485 },
        { x: 880, y: 460 },
      ],
    ],
  },
  6: {
    strokes: [
      [
        { x: 200, y: 240 },
        { x: 300, y: 320 },
        { x: 400, y: 420 },
        { x: 470, y: 460 },
        { x: 520, y: 455 },
        { x: 560, y: 435 },
      ],
    ],
  },
  7: {
    strokes: [
      [
        { x: 310, y: 500 },
        { x: 480, y: 440 },
      ],
      [
        { x: 745, y: 440 },
        { x: 905, y: 460 },
      ],
    ],
  },
  8: {
    waitSteps: 210,
    strokes: [
      [
        { x: 740, y: 520 },
        { x: 920, y: 450 },
      ],
    ],
  },
  9: {
    strokes: [
      [
        { x: 320, y: 440 },
        { x: 495, y: 410 },
      ],
      [
        { x: 685, y: 410 },
        { x: 855, y: 400 },
      ],
    ],
  },
  10: {
    strokes: [
      [
        { x: 200, y: 480 },
        { x: 440, y: 410 },
      ],
      [
        { x: 580, y: 410 },
        { x: 760, y: 440 },
        { x: 940, y: 470 },
      ],
    ],
  },
};
