export default function StatCard({ label, value, icon = 'bi-graph-up', tone, onClick }) {
  const toneStyle = tone === 'success'
    ? { background: 'rgba(11,128,67,.22)', color: '#0b8043' }
    : tone === 'danger'
    ? { background: 'rgba(192,57,43,.22)', color: '#c0392b' }
    : undefined;

  const clickableProps = onClick
    ? {
        role: 'button',
        tabIndex: 0,
        onClick,
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(e);
          }
        }
      }
    : {};

  return (
    <div
      className={`card stat-card border-0 shadow-sm h-100${onClick ? ' stat-card-clickable' : ''}`}
      {...clickableProps}
    >
      <div className="card-body d-flex align-items-center">
        <span className="stat-icon me-3" style={toneStyle}>
          <i className={`bi ${icon}`} />
        </span>
        <div>
          <div className="stat-value">{value ?? 0}</div>
          <div className="stat-label">{label}</div>
        </div>
      </div>
    </div>
  );
}
