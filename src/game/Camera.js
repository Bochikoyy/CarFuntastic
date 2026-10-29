import { DEFAULT_WORLD } from './constants.js';

/**
 * Maps between logical world coordinates (e.g. 1280 x 720) and canvas CSS
 * pixels using a letterboxed `contain` fit. Independent of `devicePixelRatio`
 * so pointer mapping and rendering stay consistent across screens.
 */
export class Camera {
  constructor(world = DEFAULT_WORLD) {
    this.worldWidth = world.width;
    this.worldHeight = world.height;
    this.viewportWidth = world.width;
    this.viewportHeight = world.height;
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  setWorld(world) {
    this.worldWidth = world.width;
    this.worldHeight = world.height;
    this.resize(this.viewportWidth, this.viewportHeight);
  }

  resize(width, height) {
    this.viewportWidth = Math.max(1, width);
    this.viewportHeight = Math.max(1, height);
    this.scale = Math.min(
      this.viewportWidth / this.worldWidth,
      this.viewportHeight / this.worldHeight,
    );
    this.offsetX = (this.viewportWidth - this.worldWidth * this.scale) / 2;
    this.offsetY = (this.viewportHeight - this.worldHeight * this.scale) / 2;
  }

  /** Convert canvas-local CSS pixels (clientX - rect.left, clientY - rect.top) to world units. */
  screenToWorld(x, y) {
    return {
      x: (x - this.offsetX) / this.scale,
      y: (y - this.offsetY) / this.scale,
    };
  }

  worldToScreen(x, y) {
    return {
      x: x * this.scale + this.offsetX,
      y: y * this.scale + this.offsetY,
    };
  }

  isInsideWorld(worldPoint) {
    return (
      worldPoint.x >= 0 &&
      worldPoint.x <= this.worldWidth &&
      worldPoint.y >= 0 &&
      worldPoint.y <= this.worldHeight
    );
  }

  /** Apply the world -> canvas pixel transform to a 2D context. */
  applyToContext(ctx, dpr = 1) {
    ctx.setTransform(
      this.scale * dpr,
      0,
      0,
      this.scale * dpr,
      this.offsetX * dpr,
      this.offsetY * dpr,
    );
  }
}
