import { KIND, classifyPair, getKind } from './CollisionRules.js';
import { RULES } from './constants.js';
import { normalizeAngle } from '../utils/math.js';

export const FAIL_REASONS = Object.freeze({
  fall: { id: 'fall', title: 'Off the map!', message: 'That road needs a little work. Try again!' },
  hazard: { id: 'hazard', title: 'Ouch!', message: 'Watch out for the spikes!' },
  stuck: {
    id: 'stuck',
    title: 'Stuck!',
    message: 'Try a steeper ramp or a smoother road.',
  },
  flipped: {
    id: 'flipped',
    title: 'Flipped over!',
    message: 'Smooth out sharp bumps and steep drops.',
  },
  outOfBounds: {
    id: 'outOfBounds',
    title: 'Out of bounds!',
    message: 'The car left the level. Try again!',
  },
});

/** Returns the id of the first lethal hazard touched by the car in these pairs, or null. */
export function findHazardHit(pairs) {
  for (const pair of pairs) {
    const match = classifyPair(pair);
    if (match && getKind(match.other) === KIND.HAZARD) {
      return match.other.plugin?.entityId ?? 'hazard';
    }
  }
  return null;
}

/**
 * Tracks per-run vehicle health (stalling, rollover, bounds) and returns a
 * failure reason id once a failure condition holds.
 */
export class RunMonitor {
  constructor(level, rules = RULES) {
    this.level = level;
    this.rules = rules;
    this.steps = 0;
    this.slowSteps = 0;
    this.flippedSteps = 0;
  }

  update({ position, speed, angle }) {
    const { rules, level } = this;
    this.steps += 1;

    if (position.y > level.failY) return 'fall';
    if (position.x < -rules.killMarginX || position.x > level.world.width + rules.killMarginX) {
      return 'outOfBounds';
    }

    if (Math.abs(normalizeAngle(angle)) > rules.flipAngle) this.flippedSteps += 1;
    else this.flippedSteps = 0;
    if (this.flippedSteps >= rules.flipSteps) return 'flipped';

    if (this.steps > rules.stallGraceSteps && speed < rules.stallSpeed) this.slowSteps += 1;
    else this.slowSteps = 0;
    const stallSteps = level.stallSteps ?? rules.stallSteps;
    if (this.slowSteps >= stallSteps) return 'stuck';

    if (this.steps >= rules.maxRunSteps) return 'stuck';
    return null;
  }
}
