import { useState } from 'react';
import Avatar from './Avatar.jsx';
import { resolveImageUrl } from '../utils/imageUrl.js';

export default function ProfileHeader({
  name,
  subtitle,
  meta = [],
  actions,
  avatarText,
  profilePicture,
  coverPicture,
  onProfileImageUpload,
  onCoverImageUpload
}) {
  const coverUrl = resolveImageUrl(coverPicture);
  const [profileErrored, setProfileErrored] = useState(false);
  const profileUrl = !profileErrored ? resolveImageUrl(profilePicture) : null;

  return (
    <div className="profile-header">
      <div
        className="banner position-relative"
        style={{
          // Wrapped in quotes: an unquoted CSS url() breaks on unescaped
          // parentheses, which are common in Windows filenames like
          // "photo (2).jpg" — a quoted url() allows them safely.
          backgroundImage: coverUrl ? `url("${coverUrl}")` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {onCoverImageUpload && (
          <label
            className="btn btn-dark btn-sm position-absolute"
            style={{ right: 16, bottom: 16, borderRadius: 4 }}
          >
            <i className="bi bi-camera-fill me-1" />
            Change cover
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={onCoverImageUpload}
            />
          </label>
        )}
      </div>
      <div className="header-body">
        <div className="d-flex justify-content-between align-items-end flex-wrap">
          <div className="d-flex align-items-end">
            <div className="position-relative">

  {profileUrl ? (
    <img
      src={profileUrl}
      alt="Profile"
      className="rounded-circle avatar-xl"
      style={{
        width: 96,
        height: 96,
        objectFit: "cover",
        border: "3px solid white"
      }}
      onError={() => setProfileErrored(true)}
    />
  ) : (
    <Avatar
      name={avatarText || name}
      size={96}
      className="avatar-xl"
    />
  )}

  {onProfileImageUpload && (
    <label
      className="btn btn-primary btn-sm position-absolute"
      style={{
        bottom: 0,
        right: 0,
        borderRadius: "50%"
      }}
    >
      📷

      <input
        type="file"
        accept="image/*"
        hidden
        onChange={onProfileImageUpload}
      />
    </label>
  )}

</div>
            <div className="ms-3 mb-1">
              <h4 className="mb-0 profile-name">{name || '—'}</h4>
              {subtitle && <div className="profile-subtitle">{subtitle}</div>}
            </div>
          </div>
          {actions && <div className="mb-1">{actions}</div>}
        </div>
        {meta.filter(Boolean).length > 0 && (
          <div className="profile-meta mt-2">
            {meta.filter(Boolean).map((m, i) => (
              <span key={i}>{i > 0 && <span className="profile-meta-dot">·</span>}{m}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
