/** Fixed simulation timestep in milliseconds (60 Hz). */
export const STEP_MS = 1000 / 60;

/** Upper bound on simulation steps per animation frame to avoid a spiral of death. */
export const MAX_STEPS_PER_FRAME = 5;

export const DEFAULT_WORLD = Object.freeze({ width: 1280, height: 720 });

export const PHYSICS = Object.freeze({
  gravityY: 1,
  positionIterations: 10,
  velocityIterations: 8,
  constraintIterations: 4,
});

export const ROAD = Object.freeze({
  thickness: 14,
  friction: 1,
  frictionStatic: 1,
  /**
   * The drawn line is treated as the road's top surface, so the collision
   * centerline sits half a thickness below it. This keeps strokes that start
   * on a ledge flush with the ground instead of forming a bump.
   */
  surfaceOffset: 7,
  /** Stroke endpoints this close above/below a terrain top are snapped onto it. */
  snapAbove: 18,
  snapBelow: 12,
});

export const TERRAIN = Object.freeze({
  friction: 1,
  frictionStatic: 1,
  segmentThickness: 16,
  /** Rounded corners on terrain blocks so wheels roll over small lips. */
  cornerRadius: 8,
});

export const VEHICLE = Object.freeze({
  chassisWidth: 54,
  chassisHeight: 22,
  chassisDensity: 0.0025,
  wheelRadius: 11,
  wheelOffsetX: 19,
  wheelOffsetY: 11,
  wheelDensity: 0.0015,
  wheelFriction: 0.95,
  axleStiffness: 0.5,
  axleDamping: 0.15,
  /** Target wheel spin in radians per step; drive accelerates toward this. */
  maxWheelAngularVelocity: 0.3,
  wheelAcceleration: 0.3,
  frictionAir: 0.002,
  /** Safety caps against runaway simulation. */
  maxSpeed: 20,
  maxChassisAngularVelocity: 0.25,
});

export const RULES = Object.freeze({
  /** How far outside the world horizontally the car can go before failing. */
  killMarginX: 80,
  /** Chassis speed (units/step) under which the car is considered stalled. */
  stallSpeed: 0.2,
  /** Steps after Play before stall detection starts. */
  stallGraceSteps: 90,
  /** Consecutive slow steps that count as stuck. */
  stallSteps: 210,
  /** |angle| above this (radians) is treated as upside-down. */
  flipAngle: 2.2,
  flipSteps: 90,
  /** Hard cap on a single run (60 seconds). */
  maxRunSteps: 60 * 60,
});

export const DRAWING = Object.freeze({
  minPointDistance: 3,
  resampleSpacing: 10,
  simplifyTolerance: 1.5,
  minStrokeLength: 24,
  maxRawPoints: 500,
  /** Budget fraction remaining below which the meter shows a warning. */
  lowBudgetRatio: 0.2,
});

export const RENDER = Object.freeze({
  maxDevicePixelRatio: 2,
});
