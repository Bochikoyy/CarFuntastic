import { DRAWING, ROAD } from './constants.js';
import { offsetPoints, processStroke, snapEndpoints, terrainSurfaces } from './RoadGeometry.js';
import { clamp } from '../utils/clamp.js';
import { distance, pointInRect, segmentIntersectsRect } from '../utils/geometry.js';

export const DRAW_REJECTIONS = Object.freeze({
  maxStrokes: (n) =>
    `You can only draw ${n} road${n === 1 ? '' : 's'} here. Undo or Clear to redraw.`,
  budgetEmpty: () => 'Out of road! Undo or Clear to free some up.',
  noDraw: () => "You can't build in the striped zone.",
  tooShort: () => 'That road is too short — try a longer line.',
});

/**
 * Captures a single in-progress stroke, enforces the level's drawing rules
 * (stroke count, length budget, no-draw zones) and produces a processed stroke
 * on commit. It never mutates committed strokes; that's the session's job.
 */
export class DrawingController {
  constructor(level, session, options = DRAWING) {
    this.level = level;
    this.session = session;
    this.options = options;
    this.surfaces = terrainSurfaces(level);
    this.reset();
  }

  reset() {
    this.points = [];
    this.rawLength = 0;
    this.active = false;
    this.blocked = false;
    this.limitReached = false;
  }

  get preview() {
    return this.points;
  }

  get previewLength() {
    return this.rawLength;
  }

  /** Budget available for the stroke currently being drawn. */
  get availableLength() {
    return this.session.remainingLength;
  }

  _clampPoint(p) {
    return {
      x: clamp(p.x, 0, this.level.world.width),
      y: clamp(p.y, 0, this.level.world.height),
    };
  }

  _zones() {
    return this.level.noDrawZones ?? [];
  }

  canBegin() {
    const { session } = this;
    if (session.strokeCount >= session.maxStrokes) {
      return {
        ok: false,
        reason: 'maxStrokes',
        message: DRAW_REJECTIONS.maxStrokes(session.maxStrokes),
      };
    }
    if (session.remainingLength < this.options.minStrokeLength) {
      return { ok: false, reason: 'budgetEmpty', message: DRAW_REJECTIONS.budgetEmpty() };
    }
    return { ok: true };
  }

  begin(point) {
    const check = this.canBegin();
    if (!check.ok) return check;
    const p = this._clampPoint(point);
    if (this._zones().some((z) => pointInRect(p, z))) {
      return { ok: false, reason: 'noDraw', message: DRAW_REJECTIONS.noDraw() };
    }
    this.reset();
    this.active = true;
    this.points.push(p);
    return { ok: true };
  }

  /** Add a pointer sample. Returns true when the preview changed. */
  extend(point) {
    if (!this.active || this.limitReached) return false;
    if (this.points.length >= this.options.maxRawPoints) {
      this.limitReached = true;
      return false;
    }
    let p = this._clampPoint(point);
    const last = this.points[this.points.length - 1];
    let d = distance(last, p);
    if (d < this.options.minPointDistance) return false;

    const available = this.availableLength - this.rawLength;
    if (d > available) {
      const t = Math.max(0, available) / d;
      p = { x: last.x + (p.x - last.x) * t, y: last.y + (p.y - last.y) * t };
      d = distance(last, p);
      this.limitReached = true;
    }

    if (this._zones().some((z) => segmentIntersectsRect(last, p, z))) this.blocked = true;

    if (d > 0) {
      this.points.push(p);
      this.rawLength += d;
    }
    return true;
  }

  /** Finish the stroke. Returns `{ ok: true, stroke }` or `{ ok: false, reason, message }`. */
  end() {
    if (!this.active) return { ok: false, reason: 'inactive', message: '' };
    const points = this.points;
    const blocked = this.blocked;
    this.reset();

    if (blocked) return { ok: false, reason: 'noDraw', message: DRAW_REJECTIONS.noDraw() };
    const processed = processStroke(points, { bounds: this.level.world, ...this.options });
    if (!processed) return { ok: false, reason: 'tooShort', message: DRAW_REJECTIONS.tooShort() };
    const snapped = snapEndpoints(processed.points, this.surfaces, {
      above: ROAD.snapAbove,
      below: ROAD.snapBelow,
    });
    return {
      ok: true,
      stroke: { points: offsetPoints(snapped, ROAD.surfaceOffset), length: processed.length },
    };
  }

  cancel() {
    this.reset();
  }
}
