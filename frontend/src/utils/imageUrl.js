// Backend always returns/stores paths already prefixed with "profile/" or
// "cover/" (see FileStorageService), served statically under /uploads/**
// (see WebConfig). This is the ONE place that turns a stored path into an
// absolute <img src>, so every component stays consistent.
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, '');

export function resolveImageUrl(path) {
  if (!path) return null;
  // Already an absolute URL (e.g. a placeholder) — leave it alone.
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.replace(/^\/+/, '');
  return `${API_ORIGIN}/uploads/${clean}`;
}
