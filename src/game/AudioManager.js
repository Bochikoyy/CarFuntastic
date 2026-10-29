/**
 * Lightweight Web Audio synthesizer for feedback cues (draw tick, engine hum,
 * win fanfare, fail tone). Degrades silently when Web Audio is unavailable or
 * when the player has muted sound.
 */
export class AudioManager {
  constructor({ muted = false } = {}) {
    this.muted = Boolean(muted);
    this.ctx = null;
    this.engineNodes = null;
    this.lastDrawTick = 0;
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    if (this.muted) this.stopEngine();
  }

  _context() {
    if (this.muted) return null;
    const AudioCtx = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AudioCtx) return null;
    try {
      if (!this.ctx) this.ctx = new AudioCtx();
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
      return this.ctx;
    } catch {
      return null;
    }
  }

  _tone(freq, duration, { type = 'triangle', volume = 0.08, delay = 0, endFreq } = {}) {
    const ctx = this._context();
    if (!ctx) return;
    try {
      const start = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, start);
      if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, start + duration);
      gain.gain.setValueAtTime(volume, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration);
    } catch {
      // Ignore audio errors (e.g. blocked autoplay).
    }
  }

  playDrawTick() {
    const now = Date.now();
    if (now - this.lastDrawTick < 55) return;
    this.lastDrawTick = now;
    this._tone(420 + (now % 120), 0.035, { type: 'sine', volume: 0.03 });
  }

  playCommit() {
    this._tone(520, 0.07, { type: 'triangle', volume: 0.06, endFreq: 660 });
  }

  playReject() {
    this._tone(210, 0.14, { type: 'sawtooth', volume: 0.05, endFreq: 150 });
  }

  playWin() {
    this.stopEngine();
    [523.25, 659.25, 783.99, 1046.5].forEach((n, i) => {
      this._tone(n, 0.16, { type: 'triangle', volume: 0.08, delay: i * 0.08 });
    });
  }

  playFail() {
    this.stopEngine();
    this._tone(310, 0.18, { type: 'sawtooth', volume: 0.06, endFreq: 180 });
    this._tone(180, 0.25, { type: 'sawtooth', volume: 0.06, delay: 0.16, endFreq: 110 });
  }

  startEngine() {
    this.stopEngine();
    const ctx = this._context();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = 68;
      gain.gain.value = 0.018;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      this.engineNodes = { osc, gain };
    } catch {
      this.engineNodes = null;
    }
  }

  stopEngine() {
    if (!this.engineNodes) return;
    try {
      this.engineNodes.osc.stop();
      this.engineNodes.osc.disconnect();
      this.engineNodes.gain.disconnect();
    } catch {
      // Ignore if already stopped.
    }
    this.engineNodes = null;
  }

  dispose() {
    this.stopEngine();
    if (this.ctx) {
      this.ctx.close?.().catch(() => {});
      this.ctx = null;
    }
  }
}
