import { useEffect, useState } from 'react';
import { fetchUserAchievements, recordPurchase } from '../api/achievements';
import AchievementList from '../components/AchievementList';
import BadgeDisplay from '../components/BadgeDisplay';
import ProgressBar from '../components/ProgressBar';

export default function AchievementsDashboard() {
  const [userId, setUserId]         = useState('1');
  const [inputId, setInputId]       = useState('1');
  const [data, setData]             = useState(null);
  const [loading, setLoading]       = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError]           = useState(null);
  const [toast, setToast]           = useState(null);

  function load(id) {
    setLoading(true);
    setError(null);
    fetchUserAchievements(id)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load(userId);
  }, [userId]);

  function handleSearch(e) {
    e.preventDefault();
    setUserId(inputId.trim());
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function handlePurchase() {
    setPurchasing(true);
    try {
      const result = await recordPurchase(userId, 500);
      showToast(`Purchase #${result.total_purchases} recorded!`);
      load(userId);
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setPurchasing(false);
    }
  }

  return (
    <div className="dashboard">
      {toast && <div className="toast">{toast}</div>}

      <header className="dashboard-header">
        <h1 className="dashboard-title">Loyalty Rewards</h1>
        <p className="dashboard-subtitle">Track your achievements and badges</p>

        <form className="user-form" onSubmit={handleSearch}>
          <input
            type="number"
            min="1"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            placeholder="User ID"
            className="user-input"
          />
          <button type="submit" className="btn-primary">Load</button>
        </form>
      </header>

      <main className="dashboard-main">
        {loading && (
          <div className="state-container">
            <div className="spinner" />
            <p>Loading achievements…</p>
          </div>
        )}

        {error && !loading && (
          <div className="state-container error-state">
            <p>⚠ {error}</p>
            <button className="btn-primary" onClick={() => load(userId)}>Retry</button>
          </div>
        )}

        {data && !loading && (
          <>
            <div className="content-grid">
              <section className="card badge-section">
                <h2 className="card-title">Your Badge</h2>
                <BadgeDisplay
                  currentBadge={data.current_badge}
                  nextBadge={data.next_badge}
                />
                {data.next_badge && (
                  <ProgressBar
                    current={data.remaining_to_unlock_next_badge}
                    total={
                      data.remaining_to_unlock_next_badge +
                      data.unlocked_achievements.length
                    }
                    label={`Progress to ${data.next_badge}`}
                  />
                )}
                {!data.next_badge && (
                  <p className="max-badge-msg">🎉 You have reached the highest badge!</p>
                )}
              </section>

              <section className="card achievements-section">
                <AchievementList
                  unlocked={data.unlocked_achievements}
                  nextAvailable={data.next_available_achievements}
                />
              </section>
            </div>

            <div className="simulate-section">
              <button
                className="btn-simulate"
                onClick={handlePurchase}
                disabled={purchasing}
              >
                {purchasing ? 'Processing…' : '+ Simulate Purchase (₦500)'}
              </button>
              <p className="simulate-hint">
                Each click records a purchase and recalculates your rewards in real time.
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
