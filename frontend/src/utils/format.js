export function enumLabel(value) {
  if (!value) return '';
  return String(value)
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function formatDate(value, options = {}) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: options.day === false ? undefined : 'numeric'
  }).format(d);
}

export function timeAgo(value) {
  if (!value) return '';
  const date = new Date(value);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (!Number.isFinite(seconds)) return '';

  const units = [
    ['y', 31536000],
    ['mo', 2592000],
    ['d', 86400],
    ['h', 3600],
    ['m', 60]
  ];
  for (const [label, size] of units) {
    const count = Math.floor(seconds / size);
    if (count >= 1) return `${count}${label}`;
  }
  return 'now';
}

export function formatMoney(min, max, currency = 'BDT') {
  if (min == null && max == null) return null;
  const fmt = (v) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return v;
    return new Intl.NumberFormat('en', { maximumFractionDigits: 0 }).format(n);
  };
  if (min != null && max != null) return `${currency} ${fmt(min)} – ${fmt(max)}`;
  if (min != null) return `From ${currency} ${fmt(min)}`;
  return `Up to ${currency} ${fmt(max)}`;
}

export function joinNonEmpty(values, separator = ' • ') {
  return values.filter((x) => x !== null && x !== undefined && String(x).trim() !== '').join(separator);
}

// Mirrors the backend's own "accepting applications" check (ApplicationServiceImpl):
// an opportunity stops accepting applications once its status is no longer ACTIVE,
// or its deadline has passed. Internships use `deadline` (date-only) and research
// posts use `applicationDeadline` (date-time), so we accept either field name.
export function isOpportunityClosed(opportunity) {
  if (!opportunity) return false;
  if (opportunity.status && opportunity.status !== 'ACTIVE') return true;
  const deadline = opportunity.deadline || opportunity.applicationDeadline;
  if (!deadline) return false;
  const d = new Date(deadline);
  if (Number.isNaN(d.getTime())) return false;
  return d.getTime() < Date.now();
}
