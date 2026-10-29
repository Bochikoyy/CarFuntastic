/**
 * Small helpers to keep level files readable. All rectangles produced here
 * are center-based, matching the level schema.
 */

/** Solid ground block spanning [left, right] horizontally from `top` down past the world bottom. */
export function ground(id, left, right, top, bottom = 760) {
  return {
    id,
    type: 'rectangle',
    x: (left + right) / 2,
    y: (top + bottom) / 2,
    width: right - left,
    height: bottom - top,
  };
}

/** A floating slab with its top surface at `top`. */
export function slab(id, left, right, top, thickness = 24) {
  return {
    id,
    type: 'rectangle',
    x: (left + right) / 2,
    y: top + thickness / 2,
    width: right - left,
    height: thickness,
  };
}

/** A row of spikes occupying the box [left, right] x [top, bottom]. */
export function spikes(id, left, right, top, bottom, direction = 'up') {
  return {
    id,
    type: 'spikes',
    direction,
    x: (left + right) / 2,
    y: (top + bottom) / 2,
    width: right - left,
    height: bottom - top,
  };
}

/** A center-based rectangle from edges. */
export function box(left, right, top, bottom) {
  return {
    x: (left + right) / 2,
    y: (top + bottom) / 2,
    width: right - left,
    height: bottom - top,
  };
}

/** Goal zone (70 x 100) standing on a surface whose top is at `surfaceY`. */
export function goalOn(x, surfaceY, width = 70, height = 100) {
  return { x, y: surfaceY - height / 2, width, height };
}

/** Spawn point for the car resting above a surface whose top is at `surfaceY`. */
export function spawnOn(x, surfaceY) {
  return { x, y: surfaceY - 30, angle: 0 };
}
