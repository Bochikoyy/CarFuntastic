import { isFiniteNumber } from './math.js';

/**
 * Level schema validation. Returns a list of human-readable errors; an empty
 * list means the level is valid. Use `assertValidLevel` to throw instead.
 */

export const TERRAIN_TYPES = ['segment', 'rectangle', 'circle'];
export const HAZARD_TYPES = ['spikes'];
export const SPIKE_DIRECTIONS = ['up', 'down', 'left', 'right'];
export const DECORATION_TYPES = ['cloud', 'bush', 'sign', 'arrow'];

/** Safety limit for drawing budgets (world units). */
export const MAX_ROAD_BUDGET = 5000;
export const MAX_STROKES_LIMIT = 50;

export class LevelValidationError extends Error {
  constructor(levelId, errors) {
    super(`Level "${levelId}" is invalid:\n- ${errors.join('\n- ')}`);
    this.name = 'LevelValidationError';
    this.levelId = levelId;
    this.errors = errors;
  }
}

function checkNumbers(errors, prefix, obj, keys) {
  for (const key of keys) {
    if (!isFiniteNumber(obj?.[key])) errors.push(`${prefix}.${key} must be a finite number`);
  }
}

function checkPositive(errors, prefix, obj, keys) {
  for (const key of keys) {
    if (isFiniteNumber(obj?.[key]) && obj[key] <= 0) errors.push(`${prefix}.${key} must be > 0`);
  }
}

function checkRect(errors, prefix, rect) {
  checkNumbers(errors, prefix, rect, ['x', 'y', 'width', 'height']);
  checkPositive(errors, prefix, rect, ['width', 'height']);
}

function checkId(errors, ids, prefix, entity) {
  if (typeof entity?.id !== 'string' || entity.id.length === 0) {
    errors.push(`${prefix}.id must be a non-empty string`);
    return;
  }
  if (ids.has(entity.id)) errors.push(`${prefix}.id "${entity.id}" is duplicated`);
  ids.add(entity.id);
}

function validateTerrain(errors, ids, entity, prefix) {
  checkId(errors, ids, prefix, entity);
  switch (entity.type) {
    case 'segment':
      checkNumbers(errors, prefix, entity, ['x1', 'y1', 'x2', 'y2']);
      if (entity.thickness !== undefined) {
        checkNumbers(errors, prefix, entity, ['thickness']);
        checkPositive(errors, prefix, entity, ['thickness']);
      }
      break;
    case 'rectangle':
      checkRect(errors, prefix, entity);
      break;
    case 'circle':
      checkNumbers(errors, prefix, entity, ['x', 'y', 'radius']);
      checkPositive(errors, prefix, entity, ['radius']);
      break;
    default:
      errors.push(`${prefix}.type "${entity?.type}" is not a supported terrain type`);
  }
}

function validateHazard(errors, ids, entity, prefix) {
  checkId(errors, ids, prefix, entity);
  if (!HAZARD_TYPES.includes(entity?.type)) {
    errors.push(`${prefix}.type "${entity?.type}" is not a supported hazard type`);
    return;
  }
  checkRect(errors, prefix, entity);
  if (entity.direction !== undefined && !SPIKE_DIRECTIONS.includes(entity.direction)) {
    errors.push(`${prefix}.direction must be one of ${SPIKE_DIRECTIONS.join(', ')}`);
  }
}

function validatePlatform(errors, ids, entity, prefix) {
  checkId(errors, ids, prefix, entity);
  checkNumbers(errors, prefix, entity, ['width', 'height', 'moveTime']);
  checkPositive(errors, prefix, entity, ['width', 'height', 'moveTime']);
  checkNumbers(errors, `${prefix}.from`, entity?.from, ['x', 'y']);
  checkNumbers(errors, `${prefix}.to`, entity?.to, ['x', 'y']);
  for (const key of ['dwellFrom', 'dwellTo', 'phase']) {
    if (entity?.[key] !== undefined) {
      checkNumbers(errors, prefix, entity, [key]);
      if (isFiniteNumber(entity[key]) && entity[key] < 0)
        errors.push(`${prefix}.${key} must be >= 0`);
    }
  }
}

export function validateLevel(level) {
  const errors = [];
  if (!level || typeof level !== 'object') return ['level must be an object'];

  if (typeof level.id !== 'string' || level.id.length === 0)
    errors.push('id must be a non-empty string');
  if (!Number.isInteger(level.number) || level.number < 1)
    errors.push('number must be a positive integer');
  if (typeof level.name !== 'string' || level.name.length === 0)
    errors.push('name must be a non-empty string');

  checkNumbers(errors, 'world', level.world, ['width', 'height']);
  checkPositive(errors, 'world', level.world, ['width', 'height']);

  if (!level.spawn) errors.push('spawn is required');
  else checkNumbers(errors, 'spawn', level.spawn, ['x', 'y']);

  if (!level.goal) errors.push('goal is required');
  else checkRect(errors, 'goal', level.goal);

  if (!isFiniteNumber(level.failY)) errors.push('failY must be a finite number');

  const ids = new Set();
  const lists = {
    terrain: validateTerrain,
    hazards: validateHazard,
    movingPlatforms: validatePlatform,
  };
  for (const [key, validator] of Object.entries(lists)) {
    const list = level[key] ?? [];
    if (!Array.isArray(list)) {
      errors.push(`${key} must be an array`);
      continue;
    }
    list.forEach((entity, i) => validator(errors, ids, entity, `${key}[${i}]`));
  }

  (level.noDrawZones ?? []).forEach((zone, i) => {
    checkId(errors, ids, `noDrawZones[${i}]`, zone);
    checkRect(errors, `noDrawZones[${i}]`, zone);
  });

  (level.decorations ?? []).forEach((deco, i) => {
    if (!DECORATION_TYPES.includes(deco?.type)) {
      errors.push(`decorations[${i}].type "${deco?.type}" is not supported`);
    }
    checkNumbers(errors, `decorations[${i}]`, deco, ['x', 'y']);
  });

  const c = level.constraints ?? {};
  if (c.maxRoadLength !== undefined) {
    if (
      !isFiniteNumber(c.maxRoadLength) ||
      c.maxRoadLength < 0 ||
      c.maxRoadLength > MAX_ROAD_BUDGET
    ) {
      errors.push(`constraints.maxRoadLength must be between 0 and ${MAX_ROAD_BUDGET}`);
    }
  }
  if (c.maxStrokes !== undefined) {
    if (!Number.isInteger(c.maxStrokes) || c.maxStrokes < 1 || c.maxStrokes > MAX_STROKES_LIMIT) {
      errors.push(`constraints.maxStrokes must be an integer between 1 and ${MAX_STROKES_LIMIT}`);
    }
  }

  if (level.world && level.spawn && isFiniteNumber(level.world.width)) {
    const { width, height } = level.world;
    if (level.spawn.x < 0 || level.spawn.x > width || level.spawn.y < 0 || level.spawn.y > height) {
      errors.push('spawn must be inside the world');
    }
    if (
      level.goal &&
      (level.goal.x < 0 || level.goal.x > width || level.goal.y < 0 || level.goal.y > height)
    ) {
      errors.push('goal center must be inside the world');
    }
    if (isFiniteNumber(level.failY) && level.failY <= height) {
      errors.push('failY must be below the bottom of the world');
    }
  }

  return errors;
}

export function assertValidLevel(level) {
  const errors = validateLevel(level);
  if (errors.length > 0) throw new LevelValidationError(level?.id ?? 'unknown', errors);
  return level;
}
