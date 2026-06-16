function initials(text = '') {
  const clean = text.trim();
  if (!clean) return '?';
  const parts = clean.split(/[\s@._-]+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({ name, email, size = 40, className = '', ring = false }) {
  const label = initials(name || email);
  return (
    <span
      className={`avatar ${ring ? 'ring' : ''} ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-hidden="true"
    >
      {label}
    </span>
  );
}
