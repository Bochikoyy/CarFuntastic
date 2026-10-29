import Matter from 'matter-js';
import { PHYSICS, ROAD, STEP_MS, TERRAIN } from './constants.js';
import { KIND } from './CollisionRules.js';
import { toSegments } from './RoadGeometry.js';
import { applyDrive, createVehicle, limitVehicle } from './VehicleFactory.js';
import { isInGoal } from './GoalSystem.js';
import { RunMonitor, findHazardHit } from './HazardSystem.js';
import { lerp, mod, smoothstep } from '../utils/math.js';

const { Bodies, Body, Composite, Engine, Events } = Matter;

/**
 * Builds static capsule-chain bodies for a polyline: one rotated rectangle per
 * segment plus a circle at each vertex. The circles round off every joint so
 * wheels never catch on a lip between segments.
 */
export function createPolylineBodies(
  points,
  { thickness, friction, frictionStatic, kind, entityId },
) {
  const bodies = [];
  const common = {
    isStatic: true,
    friction,
    frictionStatic,
    restitution: 0,
    plugin: { kind, entityId },
  };
  for (const seg of toSegments(points)) {
    bodies.push(
      Bodies.rectangle(seg.cx, seg.cy, seg.length, thickness, { ...common, angle: seg.angle }),
    );
  }
  for (const p of points) {
    bodies.push(Bodies.circle(p.x, p.y, thickness / 2, { ...common }));
  }
  return bodies;
}

/** Deterministic periodic position of a moving platform at time `seconds`. */
export function platformPositionAt(platform, seconds) {
  const dwellFrom = platform.dwellFrom ?? 0;
  const dwellTo = platform.dwellTo ?? 0;
  const move = platform.moveTime;
  const cycle = dwellFrom + move + dwellTo + move;
  const t = mod(seconds + (platform.phase ?? 0) * cycle, cycle);
  let u;
  if (t < dwellFrom) u = 0;
  else if (t < dwellFrom + move) u = smoothstep((t - dwellFrom) / move);
  else if (t < dwellFrom + move + dwellTo) u = 1;
  else u = 1 - smoothstep((t - dwellFrom - move - dwellTo) / move);
  return { x: lerp(platform.from.x, platform.to.x, u), y: lerp(platform.from.y, platform.to.y, u) };
}

/**
 * Owns the Matter.js engine for one level attempt: terrain, hazards, goal,
 * moving platforms, player roads and the car. It contains no DOM code, so it
 * can be driven headlessly in tests.
 */
export class PhysicsWorld {
  constructor(level, { platformSteps = 0 } = {}) {
    this.level = level;
    this.engine = Engine.create({
      gravity: { x: 0, y: PHYSICS.gravityY },
      positionIterations: PHYSICS.positionIterations,
      velocityIterations: PHYSICS.velocityIterations,
      constraintIterations: PHYSICS.constraintIterations,
      enableSleeping: false,
    });
    this.world = this.engine.world;
    this.platformSteps = platformSteps;
    this.roadBodies = [];
    this.platforms = [];
    this.pendingHazard = null;
    this.result = { status: 'ready' };
    this.monitor = new RunMonitor(level);

    this._buildTerrain();
    this._buildHazards();
    this._buildPlatforms();
    this.vehicle = createVehicle(level.spawn);
    Composite.add(this.world, this.vehicle.composite);

    this._onCollisionStart = (event) => {
      if (this.pendingHazard) return;
      const hit = findHazardHit(event.pairs);
      if (hit) this.pendingHazard = hit;
    };
    Events.on(this.engine, 'collisionStart', this._onCollisionStart);
  }

  _buildTerrain() {
    const bodies = [];
    const common = {
      isStatic: true,
      friction: TERRAIN.friction,
      frictionStatic: TERRAIN.frictionStatic,
      restitution: 0,
    };
    for (const t of this.level.terrain ?? []) {
      const plugin = { kind: KIND.TERRAIN, entityId: t.id };
      if (t.type === 'rectangle') {
        const chamfer = { radius: Math.min(TERRAIN.cornerRadius, t.width / 2, t.height / 2) };
        bodies.push(
          Bodies.rectangle(t.x, t.y, t.width, t.height, {
            ...common,
            chamfer,
            angle: t.angle ?? 0,
            plugin,
          }),
        );
      } else if (t.type === 'circle') {
        bodies.push(Bodies.circle(t.x, t.y, t.radius, { ...common, plugin }));
      } else if (t.type === 'segment') {
        bodies.push(
          ...createPolylineBodies(
            [
              { x: t.x1, y: t.y1 },
              { x: t.x2, y: t.y2 },
            ],
            {
              thickness: t.thickness ?? TERRAIN.segmentThickness,
              friction: TERRAIN.friction,
              frictionStatic: TERRAIN.frictionStatic,
              kind: KIND.TERRAIN,
              entityId: t.id,
            },
          ),
        );
      }
    }
    Composite.add(this.world, bodies);
  }

  _buildHazards() {
    const bodies = (this.level.hazards ?? []).map((h) =>
      Bodies.rectangle(h.x, h.y, h.width, h.height, {
        isStatic: true,
        isSensor: true,
        plugin: { kind: KIND.HAZARD, entityId: h.id },
      }),
    );
    Composite.add(this.world, bodies);
  }

  _buildPlatforms() {
    const seconds = this.platformSeconds;
    for (const def of this.level.movingPlatforms ?? []) {
      const pos = platformPositionAt(def, seconds);
      const body = Bodies.rectangle(pos.x, pos.y, def.width, def.height, {
        isStatic: true,
        friction: 1,
        frictionStatic: 2,
        restitution: 0,
        plugin: { kind: KIND.PLATFORM, entityId: def.id },
      });
      this.platforms.push({ def, body });
    }
    Composite.add(
      this.world,
      this.platforms.map((p) => p.body),
    );
  }

  get platformSeconds() {
    return (this.platformSteps * STEP_MS) / 1000;
  }

  _updatePlatforms() {
    const seconds = this.platformSeconds;
    for (const { def, body } of this.platforms) {
      Body.setPosition(body, platformPositionAt(def, seconds), true);
    }
  }

  /** Replace all player-drawn road bodies with bodies for the given strokes. */
  setRoads(strokes) {
    if (this.roadBodies.length > 0) Composite.remove(this.world, this.roadBodies);
    this.roadBodies = [];
    for (const stroke of strokes) {
      this.roadBodies.push(
        ...createPolylineBodies(stroke.points, {
          thickness: ROAD.thickness,
          friction: ROAD.friction,
          frictionStatic: ROAD.frictionStatic,
          kind: KIND.ROAD,
          entityId: stroke.id,
        }),
      );
    }
    if (this.roadBodies.length > 0) Composite.add(this.world, this.roadBodies);
  }

  /** Advance only the moving platforms (used while the player is drawing / waiting). */
  advanceIdle() {
    this.platformSteps += 1;
    this._updatePlatforms();
  }

  /** Advance the full simulation by one fixed step and evaluate win/fail rules. */
  step() {
    if (this.result.status === 'won' || this.result.status === 'failed') return this.result;

    this.platformSteps += 1;
    this._updatePlatforms();
    applyDrive(this.vehicle);
    Engine.update(this.engine, STEP_MS);
    limitVehicle(this.vehicle);

    this.result = this._evaluate();
    return this.result;
  }

  _evaluate() {
    const { chassis } = this.vehicle;
    if (this.pendingHazard)
      return { status: 'failed', reason: 'hazard', entityId: this.pendingHazard };
    if (isInGoal(chassis.position, this.level.goal)) return { status: 'won' };
    const reason = this.monitor.update({
      position: chassis.position,
      speed: Body.getSpeed(chassis),
      angle: chassis.angle,
    });
    if (reason) return { status: 'failed', reason };
    return { status: 'running' };
  }

  /** Read-only snapshot data for the renderer. */
  getRenderState() {
    const { chassis, wheels } = this.vehicle;
    return {
      chassis: { x: chassis.position.x, y: chassis.position.y, angle: chassis.angle },
      wheels: wheels.map((w) => ({
        x: w.position.x,
        y: w.position.y,
        angle: w.angle,
        radius: w.circleRadius,
      })),
      platforms: this.platforms.map(({ def, body }) => ({
        id: def.id,
        x: body.position.x,
        y: body.position.y,
        width: def.width,
        height: def.height,
        def,
      })),
    };
  }

  getAllBodies() {
    return Composite.allBodies(this.world);
  }

  dispose() {
    Events.off(this.engine, 'collisionStart', this._onCollisionStart);
    Composite.clear(this.world, false, true);
    Engine.clear(this.engine);
    this.roadBodies = [];
    this.platforms = [];
  }
}
