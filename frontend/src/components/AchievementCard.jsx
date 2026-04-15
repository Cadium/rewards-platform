import { motion as Motion } from 'framer-motion';
import { ACHIEVEMENT_META } from '../constants/loyalty';

function formatUnlockedAt(ts) {
  if (!ts) return null;
  try {
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }).format(new Date(ts));
  } catch {
    return null;
  }
}

export default function AchievementCard({ name, status, unlockedAt, isNew }) {
  const meta = ACHIEVEMENT_META[name] ?? { icon: '🏅', label: '' };

  const variants = {
    unlocked: {
      background: 'rgba(16,185,129,0.11)',
      borderColor: 'rgba(16,185,129,0.32)',
      opacity: 1,
    },
    next: {
      background: 'rgba(212,113,26,0.09)',
      borderColor: 'rgba(212,113,26,0.45)',
      opacity: 1,
    },
    locked: {
      background: 'rgba(255,255,255,0.02)',
      borderColor: 'rgba(255,255,255,0.06)',
      opacity: 0.45,
    },
  };

  const unlockedDate = status === 'unlocked' ? formatUnlockedAt(unlockedAt) : null;

  return (
    <Motion.div
      className={`achievement-card achievement-${status}`}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={variants[status]}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      whileHover={status !== 'locked' ? { scale: 1.04, y: -2 } : {}}
    >
      {isNew && (
        <Motion.div
          className="achievement-new-burst"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}

      <div className="achievement-card-icon">{meta.icon}</div>

      <div className="achievement-card-body">
        <p className="achievement-card-name">{name}</p>
        <p className="achievement-card-req">{meta.label}</p>
      </div>

      <div className="achievement-card-status">
        {status === 'unlocked' && (
          <>
            <Motion.span
              className="check-mark"
              initial={isNew ? { scale: 0, rotate: -45 } : { scale: 1 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              ✓
            </Motion.span>
            {unlockedDate && (
              <p className="achievement-unlocked-at">{unlockedDate}</p>
            )}
          </>
        )}
        {status === 'next' && (
          <Motion.span
            className="next-tag"
            animate={{ opacity: [1, 0.55, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            NEXT
          </Motion.span>
        )}
        {status === 'locked' && <span className="lock-icon">🔒</span>}
      </div>
    </Motion.div>
  );
}
