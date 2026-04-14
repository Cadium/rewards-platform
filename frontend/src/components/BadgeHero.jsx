import { motion } from 'framer-motion';
import { BADGE_META } from '../constants/loyalty';

export default function BadgeHero({ currentBadge, nextBadge, achievementCount, totalAchievements }) {
  const meta  = BADGE_META[currentBadge] ?? BADGE_META.Beginner;
  const isMax = !nextBadge;

  return (
    <div className="badge-hero">
      {/* Animated glow ring */}
      <div className="badge-ring-wrap">
        <motion.div
          className="badge-ring"
          style={{ background: `conic-gradient(${meta.color} 0%, transparent 60%)` }}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="badge-ring ring-2"
          style={{ background: `conic-gradient(transparent 40%, ${meta.color} 100%)` }}
          animate={{ rotate: -360 }}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
        />

        {/* Badge icon */}
        <motion.div
          className="badge-icon-wrap"
          key={currentBadge}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <motion.div
            className="badge-glow"
            style={{ background: meta.glow }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="badge-emoji">{meta.icon}</span>
        </motion.div>
      </div>

      {/* Badge info */}
      <motion.div
        className="badge-info"
        key={`info-${currentBadge}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <p className="badge-tier-label">Current Badge</p>
        <h2 className="badge-tier-name" style={{ color: meta.color }}>
          {currentBadge}
        </h2>
        <p className="badge-sub">
          {achievementCount} / {totalAchievements} achievements unlocked
        </p>
        {isMax && (
          <motion.span
            className="badge-max-tag"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
          >
            MAX TIER 🎉
          </motion.span>
        )}
      </motion.div>

      {nextBadge && (
        <div className="badge-next">
          <span className="badge-next-label">Next:</span>
          <span className="badge-next-name">
            {BADGE_META[nextBadge]?.icon} {nextBadge}
          </span>
        </div>
      )}
    </div>
  );
}
