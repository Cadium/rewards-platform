export default function ProgressBar({ current, total, label }) {
  const percentage = total > 0 ? Math.round(((total - current) / total) * 100) : 100;

  return (
    <div className="progress-wrapper">
      <div className="progress-label">
        <span>{label}</span>
        <span className="progress-count">
          {current === 0 ? 'Complete!' : `${current} remaining`}
        </span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
