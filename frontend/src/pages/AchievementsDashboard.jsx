import confetti from 'canvas-confetti';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchUsers } from '../api/achievements';
import AchievementGrid from '../components/AchievementGrid';
import BadgeHero from '../components/BadgeHero';
import BadgeProgressBar from '../components/BadgeProgressBar';
import StatsRow from '../components/StatsRow';
import UserSelector from '../components/UserSelector';
import { useAchievements } from '../hooks/useAchievements';
import { usePurchase } from '../hooks/usePurchase';

function fireConfetti(type = 'achievement') {
  const opts =
    type === 'badge'
      ? {
          particleCount: 160,
          spread: 100,
          origin: { y: 0.55 },
          colors: ['#fbbf24', '#d97706', '#f59e0b', '#ffffff'],
        }
      : {
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4711A', '#F5A623', '#fbbf24', '#ffffff'],
        };
  confetti(opts);
}

export default function AchievementsDashboard() {
  const [users, setUsers]           = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast]           = useState(null);
  const toastTimer                  = useRef(null);

  const {
    data, loading, error, reload, newlyUnlocked, badgeUpgraded,
  } = useAchievements(selectedId);

  const { purchase, loading: purchasing } = usePurchase(selectedId, async () => {
    await reload();
  });

  const showToast = useCallback((message) => {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }, []);

  const queueToast = useCallback((message) => {
    setTimeout(() => showToast(message), 0);
  }, [showToast]);

  useEffect(() => {
    fetchUsers()
      .then((list) => {
        setUsers(list);
        if (list.length > 0) setSelectedId(list[0].id);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (newlyUnlocked.length > 0) {
      fireConfetti('achievement');
      queueToast(
        newlyUnlocked.length === 1
          ? `🎉 Achievement unlocked: ${newlyUnlocked[0]}!`
          : `🎉 ${newlyUnlocked.length} achievements unlocked!`
      );
    }
  }, [newlyUnlocked, queueToast]);

  useEffect(() => {
    if (badgeUpgraded && data) {
      setTimeout(() => fireConfetti('badge'), 300);
      queueToast(`🏅 Badge upgraded to ${data.current_badge}! +₦300 cashback!`);
    }
  }, [badgeUpgraded, data, queueToast]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const totalAchievements = 8;
  const unlockedCount     = data?.unlocked_achievements?.length ?? 0;
  const purchaseCount     = data?.purchase_count ?? 0;

  return (
    <div className="page">
      <AnimatePresence>
        {toast && (
          <Motion.div
            className="toast"
            key="toast"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 30, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            {toast}
          </Motion.div>
        )}
      </AnimatePresence>

      <header className="page-header">
        <Motion.div
          className="header-brand"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="header-logo">✦</div>
          <div>
            <h1 className="header-title">Loyalty Rewards</h1>
            <p className="header-subtitle">Earn achievements. Unlock badges. Get rewarded.</p>
          </div>
        </Motion.div>

        {users.length > 0 && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <UserSelector
              users={users}
              selectedId={selectedId}
              onChange={(id) => setSelectedId(id)}
            />
          </Motion.div>
        )}
      </header>

      <main className="page-main">
        <AnimatePresence>
          {error && !loading && (
            <Motion.div
              className="error-banner"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <span>⚠ {error}</span>
              <button className="btn-ghost" onClick={reload}>Retry</button>
            </Motion.div>
          )}
        </AnimatePresence>

        {loading && !data && (
          <div className="skeleton-layout">
            <div className="skeleton-card tall" />
            <div className="skeleton-right">
              <div className="skeleton-card" />
              <div className="skeleton-card short" />
            </div>
          </div>
        )}

        {data && (
          <Motion.div
            className="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="top-grid">
              <Motion.div
                className="glass-card badge-card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              >
                <BadgeHero
                  currentBadge={data.current_badge}
                  nextBadge={data.next_badge}
                  achievementCount={unlockedCount}
                  totalAchievements={totalAchievements}
                />
              </Motion.div>

              <div className="right-col">
                <Motion.div
                  className="glass-card"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 0.08 }}
                >
                  <StatsRow
                    purchaseCount={purchaseCount}
                    unlockedCount={unlockedCount}
                  />
                </Motion.div>

                <Motion.div
                  className="glass-card"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 0.14 }}
                >
                  <BadgeProgressBar
                    currentBadge={data.current_badge}
                    nextBadge={data.next_badge}
                    unlocked={unlockedCount}
                    remaining={data.remaining_to_unlock_next_badge}
                  />
                </Motion.div>
              </div>
            </div>

            <Motion.div
              className="glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 240, damping: 28 }}
            >
              <AchievementGrid
                unlockedRows={data.unlocked_achievements}
                nextAvailable={data.next_available_achievements}
                newlyUnlocked={newlyUnlocked}
              />
            </Motion.div>

            <Motion.div
              className="cta-section"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
            >
              <Motion.button
                className="btn-purchase"
                onClick={purchase}
                disabled={purchasing}
                whileHover={!purchasing ? { scale: 1.04, y: -2 } : {}}
                whileTap={!purchasing ? { scale: 0.97 } : {}}
              >
                {purchasing ? (
                  <>
                    <Motion.span
                      className="btn-spinner"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                    />
                    Processing…
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🛒</span>
                    Simulate Purchase <span className="btn-amount">₦500</span>
                  </>
                )}
              </Motion.button>
              <p className="cta-hint">
                Each purchase is recorded and the full event chain runs in real time —
                achievements unlock, badges upgrade, and ₦300 cashback is issued automatically.
              </p>
            </Motion.div>
          </Motion.div>
        )}
      </main>
    </div>
  );
}
