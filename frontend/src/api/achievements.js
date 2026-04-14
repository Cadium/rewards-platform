const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    ...options,
  });

  const data = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));

  if (!response.ok) {
    throw new Error(data.message || `Request failed: ${response.status}`);
  }

  return data;
}

export const fetchUsers = () =>
  request('/api/users');

export const fetchUserAchievements = (userId) =>
  request(`/api/users/${userId}/achievements`);

export const recordPurchase = (userId, amount) =>
  request(`/api/users/${userId}/purchases`, {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
