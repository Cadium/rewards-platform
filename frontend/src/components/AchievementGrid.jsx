import { motion } from 'framer-motion';
import { ALL_ACHIEVEMENTS } from '../constants/loyalty';
import AchievementCard from './AchievementCard';

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } },
};

export default function AchievementGrid({ unlocked, nextAvailable, newlyUnlocked = [] }) {
  const unlockedSet = new Set(unlocked);
  const nextSet     = new Set(nextAvailable);
  const newSet      = new Set(newlyUnlocked);

  function getStatus(name) {
    if (unlockedSet.has(name)) return 'unlocked';
    if (nextSet.has(name))     return 'next';
    return 'locked';
  }

  return (
    <div className="achievement-grid-section">
      <div className="achievement-grid-header">
        <h3 className="section-heading">Achievements</h3>
        <span className="achievement-count-badge">
          {unlocked.length} / {ALL_ACHIEVEMENTS.length}
        </span>
      </div>

      <motion.div
        className="achievement-grid"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {ALL_ACHIEVEMENTS.map((name) => (
          <motion.div key={name} variants={item}>
            <AchievementCard
              name={name}
              status={getStatus(name)}
              isNew={newSet.has(name)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
