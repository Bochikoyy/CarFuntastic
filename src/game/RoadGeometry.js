import { DRAWING } from './constants.js';
import { clamp } from '../utils/clamp.js';
import { distance, distanceToSegment, polylineLength } from '../utils/geometry.js';

/**
 * Pure functions that turn raw pointer samples into clean road geometry.
 * The exact same processed points are used for rendering and collision so
 * the visible road and the physical road never diverge.
 */

/** Drop points closer than `minDistance` to the previously kept point. */
export function filterPoints(points, minDistance = DRAWING.minPointDistance) {
  if (points.length === 0) return [];
  const result = [points[0]];
  for (let i = 1; i < points.length; i += 1) {
    if (distance(result[result.length - 1], points[i]) >= minDistance) {
      result.push(points[i]);
    }
  }
  // Always keep the true end point so short final movements are not lost.
  const last = points[points.length - 1];
  const kept = result[result.length - 1];
  if (kept !== last && distance(kept, last) > 0) result.push(last);
  return result;
}

/** Resample a polyline so consecutive points are `spacing` apart (last gap may be shorter). */
export function resample(points, spacing = DRAWING.resampleSpacing) {
  if (points.length < 2) return points.slice();
  const result = [{ ...points[0] }];
  let carry = 0;
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1];
    const b = points[i];
    const segLength = distance(a, b);
    if (segLength === 0) continue;
    let d = spacing - carry;
    while (d <= segLength) {
      const t = d / segLength;
      result.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      d += spacing;
    }
    carry = segLength - (d - spacing);
  }
  const last = points[points.length - 1];
  if (distance(result[result.length - 1], last) > 1e-6) result.push({ ...last });
  return result;
}

/** Ramer–Douglas–Peucker simplification. */
export function simplify(points, tolerance = DRAWING.simplifyTolerance) {
  if (points.length <= 2) return points.slice();
  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length > 0) {
    const [start, end] = stack.pop();
    let maxDist = 0;
    let index = -1;
    for (let i = start + 1; i < end; i += 1) {
      const d = distanceToSegment(points[i], points[start], points[end]);
      if (d > maxDist) {
        maxDist = d;
        index = i;
      }
    }
    if (index !== -1 && maxDist > tolerance) {
      keep[index] = 1;
      stack.push([start, index], [index, end]);
    }
  }
  return points.filter((_, i) => keep[i] === 1);
}

export function pathLength(points) {
  return polylineLength(points);
}

/** Clamp every point into the world rectangle [0, width] x [0, height]. */
export function clampPoints(points, bounds) {
  return points.map((p) => ({
    x: clamp(p.x, 0, bounds.width),
    y: clamp(p.y, 0, bounds.height),
  }));
}

/** Cut a polyline so that its total length is at most `maxLength`. */
export function truncateToLength(points, maxLength) {
  if (points.length < 2 || maxLength <= 0) return points.slice(0, 1);
  const result = [points[0]];
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1];
    const b = points[i];
    const segLength = distance(a, b);
    if (total + segLength <= maxLength) {
      result.push(b);
      total += segLength;
      continue;
    }
    const remaining = maxLength - total;
    if (remaining > 0) {
      const t = remaining / segLength;
      result.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    }
    break;
  }
  return result;
}

/**
 * Full pipeline: clamp -> filter -> resample -> simplify.
 * Returns `{ points, length }`, or `null` when the stroke is too short to be useful.
 */
export function processStroke(rawPoints, options = {}) {
  const {
    bounds,
    minPointDistance = DRAWING.minPointDistance,
    resampleSpacing = DRAWING.resampleSpacing,
    simplifyTolerance = DRAWING.simplifyTolerance,
    minStrokeLength = DRAWING.minStrokeLength,
  } = options;

  let points = bounds ? clampPoints(rawPoints, bounds) : rawPoints.slice();
  points = filterPoints(points, minPointDistance);
  if (points.length < 2) return null;
  points = resample(points, resampleSpacing);
  points = simplify(points, simplifyTolerance);
  const length = pathLength(points);
  if (points.length < 2 || length < minStrokeLength) return null;
  return { points, length };
}

/**
 * Top surfaces (`{ left, right, y }`) of axis-aligned terrain rectangles and
 * moving-platform-free ground, used for endpoint snapping.
 */
export function terrainSurfaces(level) {
  return (level.terrain ?? [])
    .filter((t) => t.type === 'rectangle' && !t.angle)
    .map((t) => ({ left: t.x - t.width / 2, right: t.x + t.width / 2, y: t.y - t.height / 2 }));
}

/**
 * Snap the first and last point of a stroke onto a terrain top surface when
 * they are within `above` units over it (or `below` units under it). This makes
 * "start the road on the ledge" forgiving for imprecise mouse/touch input.
 */
export function snapEndpoints(points, surfaces, { above, below }) {
  if (points.length < 2 || surfaces.length === 0) return points;
  const snap = (p) => {
    let best = null;
    for (const s of surfaces) {
      if (p.x < s.left || p.x > s.right) continue;
      const dy = s.y - p.y; // positive when the point is above the surface
      if (dy <= above && dy >= -below) {
        if (!best || Math.abs(dy) < Math.abs(best.y - p.y)) best = s;
      }
    }
    return best ? { x: p.x, y: best.y } : p;
  };
  const result = points.slice();
  result[0] = snap(points[0]);
  result[result.length - 1] = snap(points[points.length - 1]);
  return result;
}

/** Shift every point down by `offset` (the drawn line becomes the road's top surface). */
export function offsetPoints(points, offset) {
  if (!offset) return points;
  return points.map((p) => ({ x: p.x, y: p.y + offset }));
}

/** Convert a polyline into segment descriptors used to build collision bodies. */
export function toSegments(points) {
  const segments = [];
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1];
    const b = points[i];
    const length = distance(a, b);
    if (length === 0) continue;
    segments.push({
      x1: a.x,
      y1: a.y,
      x2: b.x,
      y2: b.y,
      cx: (a.x + b.x) / 2,
      cy: (a.y + b.y) / 2,
      length,
      angle: Math.atan2(b.y - a.y, b.x - a.x),
    });
  }
  return segments;
}
