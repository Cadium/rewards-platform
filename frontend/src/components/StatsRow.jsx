import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { ALL_ACHIEVEMENTS } from '../constants/loyalty';

function Counter({ to }) {
  const count    = useMotionValue(0);
  const rounded  = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(count, to, { duration: 0.8, ease: 'easeOut' });
    return controls.stop;
  }, [to]); // eslint-disable-line

  return <motion.span>{rounded}</motion.span>;
}

export default function StatsRow({ purchaseCount, unlockedCount }) {
  const stats = [
    { label: 'Total Purchases',      value: purchaseCount,           icon: '🛒' },
    { label: 'Achievements Earned',  value: unlockedCount,           icon: '⚡' },
    { label: 'Achievements Left',    value: ALL_ACHIEVEMENTS.length - unlockedCount, icon: '🎯' },
  ];

  return (
    <div className="stats-row">
      {stats.map(({ label, value, icon }, i) => (
        <motion.div
          key={label}
          className="stat-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, type: 'spring', stiffness: 280, damping: 24 }}
        >
          <span className="stat-icon">{icon}</span>
          <span className="stat-value">
            <Counter to={value} />
          </span>
          <span className="stat-label">{label}</span>
        </motion.div>
      ))}
    </div>
  );
}
