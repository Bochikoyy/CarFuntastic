/**
 * Body metadata used to make collision logic readable. Every body created by
 * the game carries `plugin.kind` set to one of these values.
 */
export const KIND = Object.freeze({
  CAR: 'car',
  ROAD: 'road',
  TERRAIN: 'terrain',
  GOAL: 'goal',
  HAZARD: 'hazard',
  PLATFORM: 'platform',
});

export function getKind(body) {
  return body?.plugin?.kind ?? body?.parent?.plugin?.kind ?? null;
}

export function isCarPart(body) {
  return getKind(body) === KIND.CAR;
}

/**
 * If the collision pair involves the car, return `{ car, other }`, otherwise null.
 */
export function classifyPair(pair) {
  const { bodyA, bodyB } = pair;
  if (isCarPart(bodyA) && !isCarPart(bodyB)) return { car: bodyA, other: bodyB };
  if (isCarPart(bodyB) && !isCarPart(bodyA)) return { car: bodyB, other: bodyA };
  return null;
}
