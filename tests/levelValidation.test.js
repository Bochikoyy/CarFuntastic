import { describe, expect, it } from 'vitest';
import { levels } from '../src/levels/index.js';
import { level01 } from '../src/levels/level01.js';
import {
  assertValidLevel,
  LevelValidationError,
  validateLevel,
} from '../src/utils/validateLevel.js';

describe('validateLevel', () => {
  it('accepts all 20 shipped levels', () => {
    expect(levels).toHaveLength(20);
    levels.forEach((lvl, i) => {
      expect(lvl.number).toBe(i + 1);
      expect(validateLevel(lvl)).toEqual([]);
      expect(() => assertValidLevel(lvl)).not.toThrow();
    });
  });

  it('rejects missing spawn, goal, or invalid world dimensions', () => {
    const bad = { ...level01, world: { width: -10, height: 0 }, spawn: null, goal: null };
    const errors = validateLevel(bad);
    expect(errors.some((e) => e.includes('world.width'))).toBe(true);
    expect(errors.some((e) => e.includes('spawn'))).toBe(true);
    expect(errors.some((e) => e.includes('goal'))).toBe(true);
    expect(() => assertValidLevel(bad)).toThrow(LevelValidationError);
  });

  it('rejects duplicate entity IDs and unsupported entity types', () => {
    const dup = {
      ...level01,
      terrain: [
        ...level01.terrain,
        { id: level01.terrain[0].id, type: 'UnknownShape', x: 0, y: 0 },
      ],
    };
    const errors = validateLevel(dup);
    expect(errors.some((e) => e.includes('duplicated'))).toBe(true);
    expect(errors.some((e) => e.includes('not a supported terrain type'))).toBe(true);
  });

  it('rejects negative or excessive drawing budgets', () => {
    const badBudget = {
      ...level01,
      constraints: { maxRoadLength: -5, maxStrokes: 0 },
    };
    const errors = validateLevel(badBudget);
    expect(errors.some((e) => e.includes('maxRoadLength'))).toBe(true);
    expect(errors.some((e) => e.includes('maxStrokes'))).toBe(true);
  });
});
