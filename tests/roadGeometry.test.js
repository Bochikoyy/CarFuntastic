import { describe, expect, it } from 'vitest';
import {
  clampPoints,
  filterPoints,
  offsetPoints,
  pathLength,
  processStroke,
  resample,
  simplify,
  snapEndpoints,
  toSegments,
  truncateToLength,
} from '../src/game/RoadGeometry.js';
import { Camera } from '../src/game/Camera.js';

describe('RoadGeometry', () => {
  it('filters duplicate and near-duplicate points while keeping the final point', () => {
    const raw = [
      { x: 0, y: 0 },
      { x: 0.5, y: 0.5 },
      { x: 1, y: 1 },
      { x: 10, y: 0 },
      { x: 10.4, y: 0 },
    ];
    const filtered = filterPoints(raw, 3);
    expect(filtered[0]).toEqual({ x: 0, y: 0 });
    expect(filtered).toContainEqual({ x: 10, y: 0 });
    expect(filtered[filtered.length - 1]).toEqual({ x: 10.4, y: 0 });
  });

  it('resamples a line at uniform spacing and preserves the total length', () => {
    const pts = resample(
      [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
      ],
      25,
    );
    expect(pts).toHaveLength(5);
    expect(Math.round(pathLength(pts))).toBe(100);
  });

  it('simplifies collinear points with Ramer–Douglas–Peucker', () => {
    const collinear = [
      { x: 0, y: 0 },
      { x: 25, y: 0.2 },
      { x: 50, y: -0.1 },
      { x: 100, y: 0 },
    ];
    const simplified = simplify(collinear, 1);
    expect(simplified).toEqual([
      { x: 0, y: 0 },
      { x: 100, y: 0 },
    ]);
  });

  it('clamps points into world bounds and truncates to a maximum length', () => {
    const clamped = clampPoints([{ x: -20, y: 900 }], { width: 1280, height: 720 });
    expect(clamped).toEqual([{ x: 0, y: 720 }]);

    const cut = truncateToLength(
      [
        { x: 0, y: 0 },
        { x: 200, y: 0 },
      ],
      75,
    );
    expect(Math.round(pathLength(cut))).toBe(75);
  });

  it('rejects strokes that are too short and processes valid strokes into segments', () => {
    expect(
      processStroke([
        { x: 10, y: 10 },
        { x: 15, y: 10 },
      ]),
    ).toBeNull();

    const processed = processStroke(
      [
        { x: 100, y: 300 },
        { x: 200, y: 300 },
      ],
      { bounds: { width: 1280, height: 720 } },
    );
    expect(processed).not.toBeNull();
    expect(Math.round(processed.length)).toBe(100);
    expect(toSegments(processed.points).length).toBeGreaterThanOrEqual(1);
  });

  it('snaps stroke endpoints near terrain tops and offsets the surface centerline', () => {
    const surfaces = [{ left: 0, right: 300, y: 500 }];
    const snapped = snapEndpoints(
      [
        { x: 200, y: 492 },
        { x: 400, y: 492 },
      ],
      surfaces,
      { above: 18, below: 12 },
    );
    expect(snapped[0].y).toBe(500);
    expect(snapped[1].y).toBe(492);
    expect(offsetPoints(snapped, 7)[0].y).toBe(507);
  });

  it('maps screen coordinates to world coordinates and back under letterboxing', () => {
    const cam = new Camera({ width: 1280, height: 720 });
    cam.resize(640, 500); // letterboxed vertically
    const screen = cam.worldToScreen(640, 360);
    const world = cam.screenToWorld(screen.x, screen.y);
    expect(world.x).toBeCloseTo(640, 5);
    expect(world.y).toBeCloseTo(360, 5);
  });
});

