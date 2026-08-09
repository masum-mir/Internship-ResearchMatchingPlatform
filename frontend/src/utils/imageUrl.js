const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, '');

export function resolveUploadUrl(path) {
  if (!path) return null;
  if (/^(https?:|blob:|data:)/i.test(path)) return path;
  const clean = String(path).replace(/^\/+/, '');
  return `${API_ORIGIN}/uploads/${clean}`;
}

export const resolveImageUrl = resolveUploadUrl;
