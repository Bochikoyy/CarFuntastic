/**
 * Per-level attempt data: committed road strokes and run statistics.
 * Strokes persist across retries; they are cleared when a new level loads.
 */
export class GameSession {
  constructor(level) {
    this.level = level;
    this.strokes = [];
    this.nextStrokeId = 1;
    this.runs = 0;
    this.failures = 0;
  }

  get totalLength() {
    return this.strokes.reduce((sum, s) => sum + s.length, 0);
  }

  get strokeCount() {
    return this.strokes.length;
  }

  get maxRoadLength() {
    return this.level.constraints?.maxRoadLength ?? Infinity;
  }

  get maxStrokes() {
    return this.level.constraints?.maxStrokes ?? Infinity;
  }

  get remainingLength() {
    return Math.max(0, this.maxRoadLength - this.totalLength);
  }

  addStroke({ points, length }) {
    const stroke = { id: `stroke-${this.nextStrokeId}`, points, length };
    this.nextStrokeId += 1;
    this.strokes = [...this.strokes, stroke];
    return stroke;
  }

  undo() {
    if (this.strokes.length === 0) return null;
    const removed = this.strokes[this.strokes.length - 1];
    this.strokes = this.strokes.slice(0, -1);
    return removed;
  }

  clear() {
    const count = this.strokes.length;
    this.strokes = [];
    return count;
  }

  recordRun() {
    this.runs += 1;
  }

  recordFailure() {
    this.failures += 1;
  }
}
