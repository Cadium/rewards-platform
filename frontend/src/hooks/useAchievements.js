import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchUserAchievements } from '../api/achievements';

export function useAchievements(userId) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const prevDataRef           = useRef(null);

  const load = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchUserAchievements(id);
      setData((current) => {
        prevDataRef.current = current;
        return result;
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(userId);
  }, [load, userId]);

  const unlockedNames = data?.unlocked_achievements?.map((a) => a.name) ?? [];
  const prevNames     = prevDataRef.current?.unlocked_achievements?.map((a) => a.name) ?? [];

  const newlyUnlocked = (() => {
    if (!prevDataRef.current || !data) return [];
    const prev = new Set(prevNames);
    return unlockedNames.filter((n) => !prev.has(n));
  })();

  const badgeUpgraded =
    data && prevDataRef.current &&
    data.current_badge !== prevDataRef.current.current_badge;

  return {
    data,
    loading,
    error,
    reload: () => load(userId),
    newlyUnlocked,
    badgeUpgraded,
    unlockedNames,
  };
}
