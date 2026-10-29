import { LEVEL_COUNT } from '../levels/index.js';
import { clamp } from '../utils/clamp.js';

export const PROGRESS_STORAGE_KEY = 'carfuntastic:progress:v1';

export function defaultProgress() {
  return {
    version: 1,
    unlockedLevel: 1,
    completedLevels: [],
    starsByLevel: {},
  };
}

export function sanitizeProgress(raw, totalLevels = LEVEL_COUNT) {
  const base = defaultProgress();
  if (!raw || typeof raw !== 'object') return base;

  const completed = Array.isArray(raw.completedLevels)
    ? [
        ...new Set(
          raw.completedLevels.filter((n) => Number.isInteger(n) && n >= 1 && n <= totalLevels),
        ),
      ].sort((a, b) => a - b)
    : [];

  const starsByLevel = {};
  if (raw.starsByLevel && typeof raw.starsByLevel === 'object') {
    for (const [k, v] of Object.entries(raw.starsByLevel)) {
      const level = Number(k);
      if (Number.isInteger(level) && level >= 1 && level <= totalLevels && Number.isInteger(v)) {
        starsByLevel[level] = clamp(v, 1, 3);
      }
    }
  }

  const maxFromCompleted =
    completed.length > 0 ? Math.min(totalLevels, Math.max(...completed) + 1) : 1;
  const rawUnlocked = Number.isInteger(raw.unlockedLevel)
    ? clamp(raw.unlockedLevel, 1, totalLevels)
    : 1;

  return {
    version: 1,
    unlockedLevel: Math.max(rawUnlocked, maxFromCompleted),
    completedLevels: completed,
    starsByLevel,
  };
}

/**
 * Storage adapter with automatic in-memory fallback when `localStorage` is
 * unavailable or throws (e.g. private browsing restrictions).
 */
export function createProgressStore(storage = globalThis.localStorage, totalLevels = LEVEL_COUNT) {
  let memory = defaultProgress();

  const read = () => {
    try {
      const text = storage?.getItem(PROGRESS_STORAGE_KEY);
      if (!text) return memory;
      memory = sanitizeProgress(JSON.parse(text), totalLevels);
    } catch {
      memory = sanitizeProgress(memory, totalLevels);
    }
    return memory;
  };

  const write = (next) => {
    memory = sanitizeProgress(next, totalLevels);
    try {
      storage?.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(memory));
    } catch {
      // Fall back to in-memory copy.
    }
    return memory;
  };

  return {
    load: read,
    save: write,
    recordCompletion(levelNumber, stars = 1) {
      const current = read();
      const completed = current.completedLevels.includes(levelNumber)
        ? current.completedLevels
        : [...current.completedLevels, levelNumber];
      const bestStars = Math.max(current.starsByLevel[levelNumber] ?? 0, clamp(stars, 1, 3));
      const nextUnlocked = Math.min(totalLevels, Math.max(current.unlockedLevel, levelNumber + 1));
      return write({
        ...current,
        unlockedLevel: nextUnlocked,
        completedLevels: completed,
        starsByLevel: { ...current.starsByLevel, [levelNumber]: bestStars },
      });
    },
    reset() {
      return write(defaultProgress());
    },
  };
}

export const progressStore = createProgressStore();
