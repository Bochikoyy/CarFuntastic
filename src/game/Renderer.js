import { RENDER, ROAD, TERRAIN, VEHICLE } from './constants.js';
import { rectBounds } from '../utils/geometry.js';

const PALETTE = Object.freeze({
  letterbox: '#efe6d5',
  paper: '#fff8ec',
  grid: 'rgba(43, 43, 43, 0.055)',
  ink: '#2b2b2b',
  earth: '#d7c3a3',
  grass: '#6ac46a',
  road: '#2b2b2b',
  roadStripe: '#ffd166',
  preview: '#4a4a4a',
  previewBlocked: '#e63946',
  carBody: '#ff5a3c',
  carRoof: '#8fd3ff',
  carHub: '#fff8ec',
  goalGlow: 'rgba(56, 176, 0, 0.14)',
  goalFlag: '#ffbe0b',
  hazard: '#e63946',
  hazardWarn: '#ffb703',
  platform: '#4361ee',
  platformTrack: 'rgba(67, 97, 238, 0.35)',
  noDraw: 'rgba(230, 57, 70, 0.12)',
});

/**
 * Pure canvas renderer. Receives read-only snapshots of the level, session,
 * preview stroke and physics bodies; it never mutates physics state.
 */
export class Renderer {
  constructor(canvas, camera, { debug = false } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = camera;
    this.debug = debug;
    this.dpr = 1;
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(globalThis.devicePixelRatio || 1, RENDER.maxDevicePixelRatio);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    this.dpr = dpr;
    this.camera.resize(rect.width, rect.height);
  }

  render({ level, renderState, strokes, preview, previewBlocked, bodies }) {
    const { ctx, camera, dpr } = this;
    if (!ctx) return;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = PALETTE.letterbox;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    camera.applyToContext(ctx, dpr);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, level.world.width, level.world.height);
    ctx.clip();

    this._drawPaper(level.world);
    this._drawDecorations(level.decorations ?? []);
    this._drawNoDrawZones(level.noDrawZones ?? []);
    this._drawSpawn(level.spawn);
    this._drawGoal(level.goal);
    this._drawPlatformTracks(level.movingPlatforms ?? []);
    this._drawTerrain(level.terrain ?? []);
    this._drawPlatforms(renderState.platforms);
    this._drawHazards(level.hazards ?? []);
    this._drawRoads(strokes);
    this._drawPreview(preview, previewBlocked);
    this._drawVehicle(renderState);
    if (this.debug && bodies) this._drawDebug(bodies);

    ctx.restore();
  }

  _drawPaper({ width, height }) {
    const { ctx } = this;
    ctx.fillStyle = PALETTE.paper;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = PALETTE.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 40; x < width; x += 40) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 40; y < height; y += 40) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();
  }

  _drawDecorations(list) {
    const { ctx } = this;
    for (const d of list) {
      ctx.save();
      ctx.translate(d.x, d.y);
      const s = d.scale ?? 1;
      ctx.scale(s, s);
      if (d.type === 'cloud') {
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = 'rgba(43,43,43,0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(-22, 4, 16, 0, Math.PI * 2);
        ctx.arc(0, -4, 22, 0, Math.PI * 2);
        ctx.arc(24, 4, 15, 0, Math.PI * 2);
        ctx.fill();
      } else if (d.type === 'bush') {
        ctx.fillStyle = PALETTE.grass;
        ctx.beginPath();
        ctx.arc(-12, -8, 12, 0, Math.PI * 2);
        ctx.arc(4, -12, 15, 0, Math.PI * 2);
        ctx.arc(18, -7, 10, 0, Math.PI * 2);
        ctx.fill();
      } else if (d.type === 'sign') {
        ctx.strokeStyle = PALETTE.ink;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -34);
        ctx.stroke();
        ctx.fillStyle = PALETTE.hazardWarn;
        ctx.beginPath();
        ctx.moveTo(0, -54);
        ctx.lineTo(16, -28);
        ctx.lineTo(-16, -28);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (d.type === 'arrow') {
        ctx.strokeStyle = 'rgba(43,43,43,0.28)';
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(-40, 0);
        ctx.lineTo(40, 0);
        ctx.moveTo(26, -10);
        ctx.lineTo(40, 0);
        ctx.lineTo(26, 10);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  _drawNoDrawZones(zones) {
    const { ctx } = this;
    for (const z of zones) {
      const b = rectBounds(z);
      ctx.save();
      ctx.fillStyle = PALETTE.noDraw;
      ctx.fillRect(b.left, b.top, z.width, z.height);
      ctx.strokeStyle = 'rgba(230, 57, 70, 0.35)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.strokeRect(b.left, b.top, z.width, z.height);
      ctx.restore();
    }
  }

  _drawSpawn(spawn) {
    const { ctx } = this;
    ctx.save();
    ctx.strokeStyle = 'rgba(43,43,43,0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(spawn.x, spawn.y, 34, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  _drawGoal(goal) {
    const { ctx } = this;
    const b = rectBounds(goal);
    ctx.save();
    ctx.fillStyle = PALETTE.goalGlow;
    ctx.strokeStyle = '#38b000';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.fillRect(b.left, b.top, goal.width, goal.height);
    ctx.strokeRect(b.left, b.top, goal.width, goal.height);
    ctx.setLineDash([]);

    const poleX = goal.x - 10;
    ctx.strokeStyle = PALETTE.ink;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(poleX, b.bottom);
    ctx.lineTo(poleX, b.top + 10);
    ctx.stroke();

    ctx.fillStyle = PALETTE.goalFlag;
    ctx.beginPath();
    ctx.moveTo(poleX, b.top + 10);
    ctx.lineTo(poleX + 42, b.top + 24);
    ctx.lineTo(poleX, b.top + 40);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  _drawTerrain(terrain) {
    const { ctx } = this;
    for (const t of terrain) {
      if (t.type === 'rectangle') {
        const b = rectBounds(t);
        ctx.fillStyle = PALETTE.earth;
        ctx.strokeStyle = PALETTE.ink;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(b.left, b.top, t.width, t.height, 8);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = PALETTE.grass;
        ctx.fillRect(b.left + 3, b.top + 2, t.width - 6, Math.min(10, t.height / 3));
      } else if (t.type === 'circle') {
        ctx.fillStyle = PALETTE.earth;
        ctx.strokeStyle = PALETTE.ink;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (t.type === 'segment') {
        ctx.strokeStyle = PALETTE.ink;
        ctx.lineWidth = t.thickness ?? TERRAIN.segmentThickness;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(t.x1, t.y1);
        ctx.lineTo(t.x2, t.y2);
        ctx.stroke();
      }
    }
  }

  _drawPlatformTracks(defs) {
    const { ctx } = this;
    for (const d of defs) {
      ctx.save();
      ctx.strokeStyle = PALETTE.platformTrack;
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(d.from.x, d.from.y);
      ctx.lineTo(d.to.x, d.to.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = PALETTE.platform;
      for (const p of [d.from, d.to]) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  _drawPlatforms(platforms) {
    const { ctx } = this;
    for (const p of platforms) {
      const b = rectBounds(p);
      ctx.fillStyle = PALETTE.platform;
      ctx.strokeStyle = PALETTE.ink;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(b.left, b.top, p.width, p.height, 6);
      ctx.fill();
      ctx.stroke();
    }
  }

  _drawHazards(hazards) {
    const { ctx } = this;
    for (const h of hazards) {
      const b = rectBounds(h);
      const dir = h.direction ?? 'up';
      const vertical = dir === 'left' || dir === 'right';
      const span = vertical ? h.height : h.width;
      const count = Math.max(2, Math.round(span / 22));
      const step = span / count;

      ctx.fillStyle = PALETTE.hazard;
      ctx.strokeStyle = PALETTE.ink;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < count; i += 1) {
        if (dir === 'up') {
          const x = b.left + i * step;
          ctx.moveTo(x, b.bottom);
          ctx.lineTo(x + step / 2, b.top);
          ctx.lineTo(x + step, b.bottom);
        } else if (dir === 'down') {
          const x = b.left + i * step;
          ctx.moveTo(x, b.top);
          ctx.lineTo(x + step / 2, b.bottom);
          ctx.lineTo(x + step, b.top);
        } else if (dir === 'left') {
          const y = b.top + i * step;
          ctx.moveTo(b.right, y);
          ctx.lineTo(b.left, y + step / 2);
          ctx.lineTo(b.right, y + step);
        } else {
          const y = b.top + i * step;
          ctx.moveTo(b.left, y);
          ctx.lineTo(b.right, y + step / 2);
          ctx.lineTo(b.left, y + step);
        }
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }

  _strokePolyline(points) {
    const { ctx } = this;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i].x, points[i].y);
    ctx.stroke();
  }

  _drawRoads(strokes) {
    const { ctx } = this;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const s of strokes) {
      if (s.points.length < 2) continue;
      ctx.strokeStyle = PALETTE.road;
      ctx.lineWidth = ROAD.thickness;
      this._strokePolyline(s.points);

      ctx.strokeStyle = PALETTE.roadStripe;
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 10]);
      this._strokePolyline(s.points);
      ctx.setLineDash([]);
    }
    ctx.restore();
  }

  _drawPreview(points, blocked) {
    if (!points || points.length < 2) return;
    const { ctx } = this;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = blocked ? PALETTE.previewBlocked : PALETTE.preview;
    ctx.lineWidth = ROAD.thickness;
    ctx.setLineDash([10, 8]);
    this._strokePolyline(points);
    ctx.restore();
  }

  _drawVehicle({ chassis, wheels }) {
    const { ctx } = this;
    const w = VEHICLE.chassisWidth;
    const h = VEHICLE.chassisHeight;

    ctx.save();
    ctx.translate(chassis.x, chassis.y);
    ctx.rotate(chassis.angle);
    ctx.fillStyle = PALETTE.carRoof;
    ctx.strokeStyle = PALETTE.ink;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(-w * 0.22, -h * 0.95, w * 0.5, h * 0.65, 5);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = PALETTE.carBody;
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, 6);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    for (const wheel of wheels) {
      ctx.save();
      ctx.translate(wheel.x, wheel.y);
      ctx.rotate(wheel.angle);
      ctx.fillStyle = PALETTE.ink;
      ctx.beginPath();
      ctx.arc(0, 0, wheel.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = PALETTE.carHub;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, wheel.radius * 0.38, 0, Math.PI * 2);
      ctx.moveTo(0, 0);
      ctx.lineTo(wheel.radius * 0.85, 0);
      ctx.stroke();
      ctx.restore();
    }
  }

  _drawDebug(bodies) {
    const { ctx } = this;
    ctx.save();
    ctx.strokeStyle = '#00b4d8';
    ctx.lineWidth = 1;
    for (const b of bodies) {
      const v = b.vertices;
      if (!v || v.length === 0) continue;
      ctx.beginPath();
      ctx.moveTo(v[0].x, v[0].y);
      for (let i = 1; i < v.length; i += 1) ctx.lineTo(v[i].x, v[i].y);
      ctx.closePath();
      ctx.stroke();
    }
    ctx.restore();
  }
}

