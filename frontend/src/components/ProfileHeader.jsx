import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Avatar from './Avatar.jsx';
import ProfileImageEditor from './ProfileImageEditor.jsx';
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
  const [preview, setPreview] = useState(null);
  const [viewerZoom, setViewerZoom] = useState(1);
  const [editor, setEditor] = useState(null);
  const pinchDistance = useRef(null);
  const pinchZoom = useRef(1);
  const profileUrl = !profileErrored ? resolveImageUrl(profilePicture) : null;
  const subtitleParts = String(subtitle || '').split(/\s*[|•]\s*/).filter(Boolean);

  useEffect(() => {
    if (!preview) return undefined;
    const closeOnEscape = (event) => event.key === 'Escape' && setPreview(null);
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [preview]);

  useEffect(() => { setViewerZoom(1); }, [preview?.url]);

  const clampZoom = (value) => Math.min(4, Math.max(1, value));
  const touchDistance = (touches) => Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);

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
        role={coverUrl ? 'button' : undefined}
        tabIndex={coverUrl ? 0 : undefined}
        aria-label={coverUrl ? 'View cover photo' : undefined}
        onClick={() => coverUrl && setPreview({ url: coverUrl, label: `${name || 'Profile'} cover photo`, type: 'cover' })}
        onKeyDown={(event) => {
          if (coverUrl && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            setPreview({ url: coverUrl, label: `${name || 'Profile'} cover photo`, type: 'cover' });
          }
        }}
      >
        {onCoverImageUpload && (
          <label
            className="btn btn-dark btn-sm position-absolute"
            style={{ right: 16, bottom: 16, borderRadius: 4 }}
            onClick={(event) => event.stopPropagation()}
          >
            <i className="bi bi-camera-fill me-1" />
            Change cover
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) setEditor({ type: 'cover', file, onUpload: onCoverImageUpload });
                event.target.value = '';
              }}
            />
          </label>
        )}
      </div>
      <div className="header-body">
        <div className="d-flex justify-content-between align-items-end flex-wrap">
          <div className="d-flex align-items-end">
            <div className="position-relative">

  {profileUrl ? (
    <button
      type="button"
      className="profile-photo-trigger"
      onClick={() => setPreview({ url: profileUrl, label: `${name || 'Profile'} profile photo`, type: 'profile' })}
      aria-label="View profile photo"
    >
      <img
        src={profileUrl}
        alt={`${name || 'Profile'} profile`}
        className="rounded-circle avatar-xl"
        style={{
          width: 96,
          height: 96,
          objectFit: "cover",
          border: "3px solid white"
        }}
        onError={() => setProfileErrored(true)}
      />
    </button>
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
        borderRadius: "50%",
        width: 30,
        height: 30,
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid white"
      }}
      onClick={(event) => event.stopPropagation()}
    >
      <i className="bi bi-pencil-fill" style={{ fontSize: 13 }} />

      <input
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) setEditor({ type: 'profile', file, onUpload: onProfileImageUpload });
          event.target.value = '';
        }}
      />
    </label>
  )}

</div>
            <div className="profile-identity ms-3 mb-1">
              <h4 className="mb-0 profile-name">{name || '—'}</h4>
              {subtitleParts.length > 0 && (
                <div className="profile-subtitle" aria-label={subtitle}>
                  {subtitleParts.map((part, index) => (
                    <span key={`${part}-${index}`} className="profile-subtitle-part">{part}</span>
                  ))}
                </div>
              )}
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
      {preview && createPortal(
        <div className="profile-photo-viewer" role="dialog" aria-modal="true" aria-label={preview.label} onMouseDown={() => setPreview(null)}>
          <button className="profile-photo-viewer-close" type="button" aria-label="Close photo viewer" onClick={() => setPreview(null)}>
            <i className="bi bi-x-lg" />
          </button>
          <div className="profile-photo-viewer-zoom-controls" onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" aria-label="Zoom out" disabled={viewerZoom <= 1} onClick={() => setViewerZoom((zoom) => clampZoom(zoom - .25))}><i className="bi bi-dash-lg" /></button>
            <button type="button" aria-label="Reset zoom" onClick={() => setViewerZoom(1)}>{Math.round(viewerZoom * 100)}%</button>
            <button type="button" aria-label="Zoom in" disabled={viewerZoom >= 4} onClick={() => setViewerZoom((zoom) => clampZoom(zoom + .25))}><i className="bi bi-plus-lg" /></button>
          </div>
          <div
            className="profile-photo-viewer-canvas"
            onMouseDown={(event) => event.stopPropagation()}
            onWheel={(event) => {
              event.preventDefault();
              setViewerZoom((zoom) => clampZoom(zoom + (event.deltaY < 0 ? .2 : -.2)));
            }}
            onTouchStart={(event) => {
              if (event.touches.length === 2) {
                pinchDistance.current = touchDistance(event.touches);
                pinchZoom.current = viewerZoom;
              }
            }}
            onTouchMove={(event) => {
              if (event.touches.length !== 2 || !pinchDistance.current) return;
              event.preventDefault();
              setViewerZoom(clampZoom(pinchZoom.current * (touchDistance(event.touches) / pinchDistance.current)));
            }}
            onTouchEnd={() => { pinchDistance.current = null; }}
          >
            <img style={{ transform: `scale(${viewerZoom})` }} className={preview.type === 'profile' ? 'profile-photo-viewer-profile-image' : ''} src={preview.url} alt={preview.label} />
          </div>
        </div>,
        document.body
      )}
      <ProfileImageEditor
        file={editor?.file || null}
        type={editor?.type}
        onClose={() => setEditor(null)}
        onSave={(file) => {
          editor?.onUpload?.({ target: { files: [file] } });
          setEditor(null);
        }}
      />
    </div>
  );
}
