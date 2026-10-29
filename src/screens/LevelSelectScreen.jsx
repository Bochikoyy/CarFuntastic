import { Button } from '../components/Button.jsx';
import { LevelTile } from '../components/LevelTile.jsx';
import { ProgressStars } from '../components/ProgressStars.jsx';
import { getLevelSummaries } from '../game/LevelManager.js';

export function LevelSelectScreen({ progress, onSelectLevel, onBack }) {
  const summaries = getLevelSummaries();
  const totalStars = Object.values(progress.starsByLevel).reduce((a, b) => a + b, 0);
  const maxStars = summaries.length * 3;

  return (
    <main className="screen screen--levels">
      <header className="screen-header">
        <Button variant="ghost" onClick={onBack}>
          ← Home
        </Button>
        <h1 className="screen-header__title">Select a Level</h1>
        <div className="screen-header__progress" aria-label="Overall progress">
          <span>
            {progress.completedLevels.length}/{summaries.length} completed
          </span>
          <ProgressStars count={Math.min(3, Math.round((totalStars / maxStars) * 3))} size="sm" />
          <span className="badge">
            {totalStars}/{maxStars} ★
          </span>
        </div>
      </header>

      <section className="level-grid" aria-label="Levels">
        {summaries.map((lvl) => {
          const unlocked = lvl.number <= progress.unlockedLevel;
          const completed = progress.completedLevels.includes(lvl.number);
          const stars = progress.starsByLevel[lvl.number] ?? 0;
          return (
            <LevelTile
              key={lvl.id}
              level={lvl}
              unlocked={unlocked}
              completed={completed}
              stars={stars}
              onSelect={onSelectLevel}
            />
          );
        })}
      </section>
    </main>
  );
}
