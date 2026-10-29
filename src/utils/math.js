export { clamp } from './clamp.js';

/** Linear interpolation between a and b. */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/** Smooth Hermite easing for t in [0, 1]. */
export function smoothstep(t) {
  const x = t < 0 ? 0 : t > 1 ? 1 : t;
  return x * x * (3 - 2 * x);
}

/** True when the value is a finite number (rejects NaN, Infinity and non-numbers). */
export function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

/** Wrap an angle in radians into the range (-PI, PI]. */
export function normalizeAngle(angle) {
  const twoPi = Math.PI * 2;
  let a = angle % twoPi;
  if (a <= -Math.PI) a += twoPi;
  if (a > Math.PI) a -= twoPi;
  return a;
}

/** Positive modulo (always returns a value in [0, m)). */
export function mod(n, m) {
  return ((n % m) + m) % m;
}
