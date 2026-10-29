import { describe, expect, it } from 'vitest';
import { createProgressStore, PROGRESS_STORAGE_KEY } from '../src/services/progressStore.js';
import { createSettingsStore, SETTINGS_STORAGE_KEY } from '../src/services/settingsStore.js';

function memoryStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
  };
}

describe('progressStore and settingsStore', () => {
  it('starts with Level 1 unlocked and unlocks sequential levels on completion', () => {
    const store = createProgressStore(memoryStorage());
    expect(store.load().unlockedLevel).toBe(1);

    const after1 = store.recordCompletion(1, 2);
    expect(after1.unlockedLevel).toBe(2);
    expect(after1.completedLevels).toEqual([1]);
    expect(after1.starsByLevel[1]).toBe(2);

    // Replaying with fewer stars keeps the best star count.
    const replay = store.recordCompletion(1, 1);
    expect(replay.starsByLevel[1]).toBe(2);

    // Completing Level 10 caps unlockedLevel at 10.
    const after10 = store.recordCompletion(10, 3);
    expect(after10.unlockedLevel).toBe(10);
    expect(after10.starsByLevel[10]).toBe(3);
  });

  it('recovers gracefully from corrupted JSON in storage', () => {
    const store = createProgressStore(memoryStorage({ [PROGRESS_STORAGE_KEY]: '{not-json' }));
    expect(store.load()).toEqual({
      version: 1,
      unlockedLevel: 1,
      completedLevels: [],
      starsByLevel: {},
    });
  });

  it('falls back to in-memory persistence when storage throws', () => {
    const broken = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
    };
    const progress = createProgressStore(broken);
    progress.recordCompletion(1, 3);
    expect(progress.load().unlockedLevel).toBe(2);

    const settings = createSettingsStore(broken);
    settings.update({ muted: true });
    expect(settings.load().muted).toBe(true);
  });

  it('sanitizes invalid settings payloads and persists valid carId choices', () => {
    const settings = createSettingsStore(
      memoryStorage({
        [SETTINGS_STORAGE_KEY]: JSON.stringify({
          muted: 'yes',
          reducedMotion: 42,
          carId: 'not-a-real-car',
        }),
      }),
    );
    expect(settings.load().muted).toBe(false);
    expect(typeof settings.load().reducedMotion).toBe('boolean');
    expect(settings.load().carId).toBe('polestar-2');

    settings.update({ carId: 'm4-gt' });
    expect(settings.load().carId).toBe('m4-gt');
  });
});
