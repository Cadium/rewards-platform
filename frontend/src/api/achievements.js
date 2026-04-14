const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function fetchUserAchievements(userId) {
  const response = await fetch(`${BASE_URL}/api/users/${userId}/achievements`);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export async function recordPurchase(userId, amount) {
  const response = await fetch(`${BASE_URL}/api/users/${userId}/purchases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });

  if (!response.ok) {
    throw new Error(`Purchase failed: ${response.status}`);
  }

  return response.json();
}
