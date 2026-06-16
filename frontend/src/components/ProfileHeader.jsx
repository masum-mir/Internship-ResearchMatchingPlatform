import Avatar from './Avatar.jsx';

export default function ProfileHeader({ name, subtitle, meta = [], actions, avatarText }) {
  return (
    <div className="profile-header">
      <div className="banner" />
      <div className="header-body">
        <div className="d-flex justify-content-between align-items-end flex-wrap">
          <div className="d-flex align-items-end">
            <Avatar name={avatarText || name} size={96} className="avatar-xl" />
            <div className="ms-3 mb-1">
              <h4 className="mb-0">{name || '—'}</h4>
              {subtitle && <div className="text-muted">{subtitle}</div>}
            </div>
          </div>
          {actions && <div className="mb-1">{actions}</div>}
        </div>
        {meta.filter(Boolean).length > 0 && (
          <div className="text-muted small mt-2">
            {meta.filter(Boolean).map((m, i) => (
              <span key={i}>{i > 0 && <span className="mx-2">·</span>}{m}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
