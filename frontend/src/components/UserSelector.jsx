import { motion as Motion } from 'framer-motion';

export default function UserSelector({ users, selectedId, onChange }) {
  return (
    <div className="user-selector-wrap">
      <p className="user-selector-label">View profile</p>
      <div className="user-selector-row" role="tablist" aria-label="Sample customers">
        {users.map((u) => (
          <Motion.button
            type="button"
            key={u.id}
            className={`user-chip ${u.id === selectedId ? 'active' : ''}`}
            onClick={() => onChange(u.id)}
            aria-pressed={u.id === selectedId}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="user-chip-avatar">
              {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </span>
            <span className="user-chip-name">{u.name.split(' ')[0]}</span>
            <span className="user-chip-count">{u.purchase_count}</span>
          </Motion.button>
        ))}
      </div>
    </div>
  );
}
