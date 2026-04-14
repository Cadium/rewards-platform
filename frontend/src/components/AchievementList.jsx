export default function AchievementList({ unlocked, nextAvailable }) {
  return (
    <div className="achievement-list">
      <h3 className="section-title">Achievements</h3>

      {unlocked.length === 0 && (
        <p className="empty-state">Make your first purchase to start earning achievements!</p>
      )}

      <div className="achievement-grid">
        {unlocked.map((name) => (
          <div key={name} className="achievement-card unlocked">
            <span className="achievement-check">✓</span>
            <span className="achievement-name">{name}</span>
          </div>
        ))}

        {nextAvailable.map((name) => (
          <div key={name} className="achievement-card next">
            <span className="achievement-lock">🔓</span>
            <span className="achievement-name">{name}</span>
            <span className="achievement-tag">Next</span>
          </div>
        ))}
      </div>
    </div>
  );
}
