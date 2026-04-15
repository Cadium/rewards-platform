import { useState } from 'react';
import { recordPurchase } from '../api/achievements';

export function usePurchase(userId, onSuccess) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  async function purchase(amount = 500) {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await recordPurchase(userId, amount);
      await onSuccess(result);
    } catch (err) {
      setError(err.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  return { purchase, loading, error };
}
