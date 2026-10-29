import { ProgressStars } from './ProgressStars.jsx';

export function LevelTile({ level, unlocked, completed, stars, onSelect }) {
  return (
    <button
      type="button"
      className={`level-tile ${completed ? 'level-tile--done' : ''} ${!unlocked ? 'level-tile--locked' : ''}`.trim()}
      disabled={!unlocked}
      onClick={() => unlocked && onSelect(level.number)}
      aria-label={`Level ${level.number}: ${level.name}${!unlocked ? ' (locked)' : ''}`}
    >
      <div className="level-tile__top">
        <span className="level-tile__number">#{level.number}</span>
        {unlocked ? (
          <ProgressStars count={stars} size="sm" />
        ) : (
          <span className="level-tile__lock" aria-hidden="true">
            🔒
          </span>
        )}
      </div>
      <div className="level-tile__name">{level.name}</div>
      <div className="level-tile__sub">{level.subtitle}</div>
    </button>
  );
}
