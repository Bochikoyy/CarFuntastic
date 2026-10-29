import { useCallback, useEffect, useState } from 'react';
import { buildHash, parseHash, SCREENS } from './routes.js';
import { useProgress } from '../hooks/useProgress.js';
import { GameScreen } from '../screens/GameScreen.jsx';
import { LevelSelectScreen } from '../screens/LevelSelectScreen.jsx';
import { NotFoundScreen } from '../screens/NotFoundScreen.jsx';
import { SettingsScreen } from '../screens/SettingsScreen.jsx';
import { TitleScreen } from '../screens/TitleScreen.jsx';
import './app.css';

export function App() {
  const { progress, settings, recordWin, resetProgress, updateSettings } = useProgress();
  const [route, setRoute] = useState(() => parseHash(globalThis.location?.hash));

  const navigate = useCallback((next) => {
    const hash = buildHash(next);
    if (globalThis.location && globalThis.location.hash !== hash) {
      globalThis.location.hash = hash;
    }
    setRoute(next);
  }, []);

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(globalThis.location?.hash));
    globalThis.addEventListener?.('hashchange', onHashChange);
    return () => globalThis.removeEventListener?.('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = settings.reducedMotion ? 'true' : 'false';
  }, [settings.reducedMotion]);

  const activeLevel =
    route.screen === SCREENS.GAME ? Math.min(route.levelNumber, progress.unlockedLevel) : 1;

  return (
    <div className="app-root">
      {route.screen === SCREENS.TITLE && (
        <TitleScreen
          progress={progress}
          onPlay={() => navigate({ screen: SCREENS.GAME, levelNumber: 1 })}
          onContinue={() => navigate({ screen: SCREENS.GAME, levelNumber: progress.unlockedLevel })}
          onLevelSelect={() => navigate({ screen: SCREENS.LEVEL_SELECT })}
          onSettings={() => navigate({ screen: SCREENS.SETTINGS })}
        />
      )}

      {route.screen === SCREENS.LEVEL_SELECT && (
        <LevelSelectScreen
          progress={progress}
          onSelectLevel={(n) => navigate({ screen: SCREENS.GAME, levelNumber: n })}
          onBack={() => navigate({ screen: SCREENS.TITLE })}
        />
      )}

      {route.screen === SCREENS.SETTINGS && (
        <SettingsScreen
          settings={settings}
          onUpdateSettings={updateSettings}
          onResetProgress={resetProgress}
          onBack={() => navigate({ screen: SCREENS.TITLE })}
        />
      )}

      {route.screen === SCREENS.GAME && (
        <GameScreen
          levelNumber={activeLevel}
          settings={settings}
          onToggleMute={() => updateSettings({ muted: !settings.muted })}
          onWin={recordWin}
          onNextLevel={() => navigate({ screen: SCREENS.GAME, levelNumber: activeLevel + 1 })}
          onLevelSelect={() => navigate({ screen: SCREENS.LEVEL_SELECT })}
          onHome={() => navigate({ screen: SCREENS.TITLE })}
        />
      )}

      {route.screen === SCREENS.NOT_FOUND && (
        <NotFoundScreen onHome={() => navigate({ screen: SCREENS.TITLE })} />
      )}
    </div>
  );
}
