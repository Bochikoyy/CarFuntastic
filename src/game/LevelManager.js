import { levels } from '../levels/index.js';
import { assertValidLevel } from '../utils/validateLevel.js';

/** Loads level definitions by number or id and validates them before use. */

export function getLevelCount() {
  return levels.length;
}

export function getLevelByNumber(number) {
  return levels.find((l) => l.number === number) ?? null;
}

export function getLevelById(id) {
  return levels.find((l) => l.id === id) ?? null;
}

export function getLevelSummaries() {
  return levels.map(({ id, number, name, subtitle }) => ({ id, number, name, subtitle }));
}

/** Returns a validated level or throws a descriptive error. */
export function loadLevel(number) {
  const level = getLevelByNumber(number);
  if (!level) throw new Error(`Level ${number} does not exist.`);
  return assertValidLevel(level);
}
