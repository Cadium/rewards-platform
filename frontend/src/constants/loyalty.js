export const BADGE_META = {
  Beginner: {
    icon: '🌱',
    color: '#64748b',
    glow: 'rgba(100,116,139,0.5)',
    gradient: 'linear-gradient(135deg, #475569, #64748b)',
  },
  Bronze: {
    icon: '🥉',
    color: '#b45309',
    glow: 'rgba(180,83,9,0.6)',
    gradient: 'linear-gradient(135deg, #92400e, #d97706)',
  },
  Silver: {
    icon: '🥈',
    color: '#94a3b8',
    glow: 'rgba(148,163,184,0.6)',
    gradient: 'linear-gradient(135deg, #64748b, #cbd5e1)',
  },
  Gold: {
    icon: '🥇',
    color: '#d97706',
    glow: 'rgba(217,119,6,0.7)',
    gradient: 'linear-gradient(135deg, #d97706, #fbbf24)',
  },
};

export const ACHIEVEMENT_META = {
  'First Purchase': { icon: '🛍️', label: '1 purchase' },
  '5 Purchases':    { icon: '⭐', label: '5 purchases' },
  '10 Purchases':   { icon: '🌟', label: '10 purchases' },
  '25 Purchases':   { icon: '💎', label: '25 purchases' },
  '50 Purchases':   { icon: '🏆', label: '50 purchases' },
  '100 Purchases':  { icon: '👑', label: '100 purchases' },
  '200 Purchases':  { icon: '🔥', label: '200 purchases' },
  '500 Purchases':  { icon: '💫', label: '500 purchases' },
};

export const ALL_ACHIEVEMENTS = Object.keys(ACHIEVEMENT_META);
