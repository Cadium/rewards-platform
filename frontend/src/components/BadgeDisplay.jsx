const BADGE_ICONS = {
  Beginner: '🌱',
  Bronze:   '🥉',
  Silver:   '🥈',
  Gold:     '🥇',
};

const BADGE_COLORS = {
  Beginner: '#6b7280',
  Bronze:   '#b45309',
  Silver:   '#6b7280',
  Gold:     '#d97706',
};

export default function BadgeDisplay({ currentBadge, nextBadge }) {
  const icon  = BADGE_ICONS[currentBadge]  ?? '🏅';
  const color = BADGE_COLORS[currentBadge] ?? '#6366f1';

  return (
    <div className="badge-display">
      <div className="current-badge" style={{ borderColor: color }}>
        <span className="badge-icon">{icon}</span>
        <div>
          <p className="badge-label">Current Badge</p>
          <p className="badge-name" style={{ color }}>{currentBadge}</p>
        </div>
      </div>
      {nextBadge && (
        <div className="next-badge-hint">
          <span>Next up:</span>
          <span className="next-badge-name">
            {BADGE_ICONS[nextBadge] ?? '🏅'} {nextBadge}
          </span>
        </div>
      )}
    </div>
  );
}
