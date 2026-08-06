import { useState } from 'react';
import { resolveImageUrl } from '../utils/imageUrl.js';

function initials(text = '') {
  const clean = text.trim();

  if (!clean) return '?';

  const parts = clean.split(/[\s@._-]+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({
  name,
  email,
  image,
  size = 40,
  className = '',
  ring = false
}) {
  const [errored, setErrored] = useState(false);

  // `image` is the raw path returned by the backend (e.g. "profile/abc.png"),
  // NOT a pre-built URL — resolveImageUrl is the single place that turns it
  // into an absolute src, so it never gets wrapped twice.
  const imageUrl = !errored ? resolveImageUrl(image) : null;

  const label = initials(name || email);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt="Profile"
        className={`rounded-circle ${ring ? 'ring' : ''} ${className}`}
        style={{
          width: size,
          height: size,
          objectFit: 'cover'
        }}
        onError={() => setErrored(true)}
      />
    );
  }

  return (
    <span
      className={`avatar ${ring ? 'ring' : ''} ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4
      }}
      aria-hidden="true"
    >
      {label}
    </span>
  );
}
