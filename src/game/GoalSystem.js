import { pointInRect } from '../utils/geometry.js';

/** True when the car's goal sensor point (chassis center) is inside the goal zone. */
export function isInGoal(position, goal) {
  return pointInRect(position, goal);
}

/**
 * Star rating (1–3):
 *  1 star  — level completed
 *  +1 star — total road length within `stars.targetRoadLength` (if defined)
 *  +1 star — completed without any failed run since the level was opened
 */
export function computeStars(level, { roadLength, failures }) {
  let stars = 1;
  const target = level.stars?.targetRoadLength;
  if (target === undefined || roadLength <= target) stars += 1;
  if (failures === 0) stars += 1;
  return stars;
}
