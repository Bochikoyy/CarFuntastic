import { CAR_IDS, DEFAULT_CAR_ID } from '../game/CarCatalog.js';

export const SETTINGS_STORAGE_KEY = 'carfuntastic:settings:v1';

export function defaultSettings() {
  const prefersReduced =
    typeof globalThis.matchMedia === 'function' &&
    globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return {
    version: 1,
    muted: false,
    reducedMotion: Boolean(prefersReduced),
    carId: DEFAULT_CAR_ID,
  };
}

export function sanitizeSettings(raw) {
  const base = defaultSettings();
  if (!raw || typeof raw !== 'object') return base;
  return {
    version: 1,
    muted: typeof raw.muted === 'boolean' ? raw.muted : base.muted,
    reducedMotion: typeof raw.reducedMotion === 'boolean' ? raw.reducedMotion : base.reducedMotion,
    carId: typeof raw.carId === 'string' && CAR_IDS.includes(raw.carId) ? raw.carId : base.carId,
  };
}

export function createSettingsStore(storage = globalThis.localStorage) {
  let memory = defaultSettings();

  const read = () => {
    try {
      const text = storage?.getItem(SETTINGS_STORAGE_KEY);
      if (!text) return memory;
      memory = sanitizeSettings(JSON.parse(text));
    } catch {
      memory = sanitizeSettings(memory);
    }
    return memory;
  };

  const write = (patch) => {
    memory = sanitizeSettings({ ...read(), ...patch });
    try {
      storage?.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(memory));
    } catch {
      // Keep in-memory copy when storage is blocked.
    }
    return memory;
  };

  return {
    load: read,
    update: write,
    reset: () => write(defaultSettings()),
  };
}

export const settingsStore = createSettingsStore();
