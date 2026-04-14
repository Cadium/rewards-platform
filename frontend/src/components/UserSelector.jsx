import { motion } from 'framer-motion';

export default function UserSelector({ users, selectedId, onChange }) {
  return (
    <div className="user-selector-wrap">
      <label className="user-selector-label" htmlFor="user-select">
        View profile
      </label>
      <div className="user-selector-row">
        {users.map((u) => (
          <motion.button
            key={u.id}
            className={`user-chip ${u.id === selectedId ? 'active' : ''}`}
            onClick={() => onChange(u.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="user-chip-avatar">
              {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </span>
            <span className="user-chip-name">{u.name.split(' ')[0]}</span>
            <span className="user-chip-count">{u.purchase_count}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
