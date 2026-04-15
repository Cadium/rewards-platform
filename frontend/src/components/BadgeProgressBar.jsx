import { motion as Motion } from 'framer-motion';
import { BADGE_META } from '../constants/loyalty';

export default function BadgeProgressBar({ currentBadge, nextBadge, unlocked, remaining }) {
  const total      = unlocked + remaining;
  const pct        = total > 0 ? Math.round((unlocked / total) * 100) : 100;
  const nextMeta   = nextBadge ? BADGE_META[nextBadge] : null;

  return (
    <div className="progress-section">
      <div className="progress-labels">
        <span className="progress-badge-from">
          {BADGE_META[currentBadge]?.icon} {currentBadge}
        </span>
        {nextMeta && (
          <span className="progress-badge-to">
            {nextMeta.icon} {nextBadge}
          </span>
        )}
      </div>

      <div className="progress-track">
        <Motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="progress-shimmer" />
        </Motion.div>
      </div>

      <div className="progress-footer">
        {nextBadge ? (
          <>
            <span className="progress-pct">{pct}%</span>
            <span className="progress-remaining">
              {remaining === 0
                ? 'Badge unlocking…'
                : `${remaining} more achievement${remaining !== 1 ? 's' : ''} to ${nextBadge}`}
            </span>
          </>
        ) : (
          <span className="progress-max">You have reached the highest tier 🏆</span>
        )}
      </div>
    </div>
  );
}
