/**
 * Pointer Events adapter for the playfield canvas. Touch, pen and mouse share
 * one code path. Scrolling/selection is prevented only during an active stroke.
 */
export class InputController {
  constructor(canvas, camera, handlers) {
    this.canvas = canvas;
    this.camera = camera;
    this.handlers = handlers;
    this.activePointerId = null;

    this._onPointerDown = this._onPointerDown.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);
    this._onPointerCancel = this._onPointerCancel.bind(this);

    canvas.addEventListener('pointerdown', this._onPointerDown);
    canvas.addEventListener('pointermove', this._onPointerMove);
    canvas.addEventListener('pointerup', this._onPointerUp);
    canvas.addEventListener('pointercancel', this._onPointerCancel);
    canvas.addEventListener('lostpointercapture', this._onPointerCancel);
  }

  _eventToWorld(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.camera.resize(rect.width, rect.height);
    return this.camera.screenToWorld(event.clientX - rect.left, event.clientY - rect.top);
  }

  _onPointerDown(event) {
    if (this.activePointerId !== null) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const point = this._eventToWorld(event);
    if (!this.camera.isInsideWorld(point)) return;
    const started = this.handlers.onStart?.(point);
    if (!started) return;
    this.activePointerId = event.pointerId;
    event.preventDefault();
    this.canvas.setPointerCapture?.(event.pointerId);
  }

  _onPointerMove(event) {
    if (event.pointerId !== this.activePointerId) return;
    event.preventDefault();
    this.handlers.onMove?.(this._eventToWorld(event));
  }

  _onPointerUp(event) {
    if (event.pointerId !== this.activePointerId) return;
    event.preventDefault();
    this._release(event.pointerId);
    this.handlers.onEnd?.(this._eventToWorld(event));
  }

  _onPointerCancel(event) {
    if (event.pointerId !== this.activePointerId) return;
    this._release(event.pointerId);
    this.handlers.onCancel?.();
  }

  _release(pointerId) {
    this.activePointerId = null;
    try {
      if (this.canvas.hasPointerCapture?.(pointerId)) {
        this.canvas.releasePointerCapture(pointerId);
      }
    } catch {
      // Ignore if pointer was already released by the browser.
    }
  }

  dispose() {
    this.activePointerId = null;
    this.canvas.removeEventListener('pointerdown', this._onPointerDown);
    this.canvas.removeEventListener('pointermove', this._onPointerMove);
    this.canvas.removeEventListener('pointerup', this._onPointerUp);
    this.canvas.removeEventListener('pointercancel', this._onPointerCancel);
    this.canvas.removeEventListener('lostpointercapture', this._onPointerCancel);
  }
}
