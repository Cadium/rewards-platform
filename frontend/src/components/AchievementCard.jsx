import { motion } from 'framer-motion';
import { ACHIEVEMENT_META } from '../constants/loyalty';

export default function AchievementCard({ name, status, isNew }) {
  const meta = ACHIEVEMENT_META[name] ?? { icon: '🏅', label: '' };

  const variants = {
    unlocked: {
      background: 'rgba(16,185,129,0.12)',
      borderColor: 'rgba(16,185,129,0.35)',
      opacity: 1,
    },
    next: {
      background: 'rgba(139,92,246,0.1)',
      borderColor: 'rgba(139,92,246,0.5)',
      opacity: 1,
    },
    locked: {
      background: 'rgba(255,255,255,0.02)',
      borderColor: 'rgba(255,255,255,0.07)',
      opacity: 0.5,
    },
  };

  return (
    <motion.div
      className={`achievement-card achievement-${status}`}
      layout
      initial={{ opacity: 0, y: 16, scale: 0.92 }}
      animate={variants[status]}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      whileHover={status !== 'locked' ? { scale: 1.04, y: -2 } : {}}
    >
      {isNew && (
        <motion.div
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
          <motion.span
            className="check-mark"
            initial={isNew ? { scale: 0, rotate: -45 } : { scale: 1 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            ✓
          </motion.span>
        )}
        {status === 'next' && (
          <motion.span
            className="next-tag"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            NEXT
          </motion.span>
        )}
        {status === 'locked' && <span className="lock-icon">🔒</span>}
      </div>
    </motion.div>
  );
}
