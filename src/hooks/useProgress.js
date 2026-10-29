import { useCallback, useState } from 'react';
import { progressStore } from '../services/progressStore.js';
import { settingsStore } from '../services/settingsStore.js';

export function useProgress() {
  const [progress, setProgress] = useState(() => progressStore.load());
  const [settings, setSettings] = useState(() => settingsStore.load());

  const recordWin = useCallback(({ levelNumber, stars }) => {
    setProgress(progressStore.recordCompletion(levelNumber, stars));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(progressStore.reset());
  }, []);

  const updateSettings = useCallback((patch) => {
    setSettings(settingsStore.update(patch));
  }, []);

  return { progress, settings, recordWin, resetProgress, updateSettings };
}

