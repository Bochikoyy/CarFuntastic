import Matter from 'matter-js';
import { VEHICLE } from './constants.js';
import { KIND } from './CollisionRules.js';

const { Bodies, Body, Composite, Constraint, Vector } = Matter;

/**
 * Creates the two-wheel car: a rounded rectangular chassis plus two circular
 * wheels attached with slightly soft axle constraints (mild suspension).
 * Car parts share a negative collision group so they never collide with each other.
 */
export function createVehicle(spawn, config = VEHICLE) {
  const { x, y, angle = 0 } = spawn;
  const group = Body.nextGroup(true);
  const r = config.wheelRadius;
  const ox = config.wheelOffsetX;
  const oy = config.wheelOffsetY;

  const chassis = Bodies.rectangle(x, y, config.chassisWidth, config.chassisHeight, {
    label: 'car-chassis',
    collisionFilter: { group },
    density: config.chassisDensity,
    friction: 0.4,
    frictionAir: config.frictionAir,
    restitution: 0,
    chamfer: { radius: 6 },
    plugin: { kind: KIND.CAR, part: 'chassis' },
  });

  const wheelOptions = (label) => ({
    label,
    collisionFilter: { group },
    density: config.wheelDensity,
    friction: config.wheelFriction,
    frictionAir: config.frictionAir,
    frictionStatic: 2,
    restitution: 0,
    plugin: { kind: KIND.CAR, part: 'wheel' },
  });

  const rot = (p) => Vector.rotate(p, angle);
  const backOffset = rot({ x: -ox, y: oy });
  const frontOffset = rot({ x: ox, y: oy });

  const wheelBack = Bodies.circle(
    x + backOffset.x,
    y + backOffset.y,
    r,
    wheelOptions('car-wheel-back'),
  );
  const wheelFront = Bodies.circle(
    x + frontOffset.x,
    y + frontOffset.y,
    r,
    wheelOptions('car-wheel-front'),
  );
  if (angle) Body.setAngle(chassis, angle);

  const axle = (wheel, offset) =>
    Constraint.create({
      bodyA: chassis,
      pointA: offset,
      bodyB: wheel,
      pointB: { x: 0, y: 0 },
      length: 0,
      stiffness: config.axleStiffness,
      damping: config.axleDamping,
      render: { visible: false },
    });

  const composite = Composite.create({ label: 'vehicle' });
  Composite.add(composite, [
    chassis,
    wheelBack,
    wheelFront,
    axle(wheelBack, backOffset),
    axle(wheelFront, frontOffset),
  ]);

  return {
    composite,
    chassis,
    wheels: [wheelBack, wheelFront],
    parts: [chassis, wheelBack, wheelFront],
  };
}

/** Automatic forward drive: spin both wheels up toward a capped angular velocity. */
export function applyDrive(vehicle, config = VEHICLE) {
  for (const wheel of vehicle.wheels) {
    const av = Body.getAngularVelocity(wheel);
    if (av < config.maxWheelAngularVelocity) {
      Body.setAngularVelocity(
        wheel,
        Math.min(config.maxWheelAngularVelocity, av + config.wheelAcceleration),
      );
    }
  }
}

/** Velocity safeguards to avoid runaway simulation after extreme collisions. */
export function limitVehicle(vehicle, config = VEHICLE) {
  for (const body of vehicle.parts) {
    const speed = Body.getSpeed(body);
    if (speed > config.maxSpeed) {
      const v = Body.getVelocity(body);
      const k = config.maxSpeed / speed;
      Body.setVelocity(body, { x: v.x * k, y: v.y * k });
    }
  }
  const { chassis } = vehicle;
  const av = Body.getAngularVelocity(chassis);
  const maxAv = config.maxChassisAngularVelocity;
  if (Math.abs(av) > maxAv) Body.setAngularVelocity(chassis, Math.sign(av) * maxAv);
}
