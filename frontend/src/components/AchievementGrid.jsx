import { motion as Motion } from 'framer-motion';
import { ALL_ACHIEVEMENTS } from '../constants/loyalty';
import AchievementCard from './AchievementCard';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.98 },
  show:   { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 24 } },
};

export default function AchievementGrid({ unlockedRows, nextAvailable, newlyUnlocked = [] }) {
  const unlockedMap = Object.fromEntries((unlockedRows ?? []).map((a) => [a.name, a.unlocked_at]));
  const nextSet     = new Set(nextAvailable ?? []);
  const newSet      = new Set(newlyUnlocked);

  function getStatus(name) {
    if (unlockedMap[name] !== undefined) return 'unlocked';
    if (nextSet.has(name))              return 'next';
    return 'locked';
  }

  return (
    <div className="achievement-grid-section">
      <div className="achievement-grid-header">
        <h3 className="section-heading">Achievements</h3>
        <span className="achievement-count-badge">
          {Object.keys(unlockedMap).length} / {ALL_ACHIEVEMENTS.length}
        </span>
      </div>

      <Motion.div
        className="achievement-grid"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {ALL_ACHIEVEMENTS.map((name) => (
          <Motion.div key={name} variants={item} className="achievement-grid-item">
            <AchievementCard
              name={name}
              status={getStatus(name)}
              unlockedAt={unlockedMap[name] ?? null}
              isNew={newSet.has(name)}
            />
          </Motion.div>
        ))}
      </Motion.div>
    </div>
  );
}
