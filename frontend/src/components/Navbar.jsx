import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { studentApi } from '../api/studentApi.js';
import { facultyApi, companyApi } from '../api/profileApi.js';
import { adminApi } from '../api/adminApi.js';
import { notificationApi } from '../api/notificationApi.js';
import { useAuth } from '../auth/AuthContext.jsx';
import { useTheme } from '../auth/ThemeContext.jsx';
import { PROFILE_UPDATED_EVENT, NOTIFICATIONS_UPDATED_EVENT } from '../utils/profileEvents.js';
import Avatar from './Avatar.jsx';
import OppzyMark from '../assets/OppzyMark.jsx';

const PROFILE_PATH = {
  STUDENT: '/student/profile',
  COMPANY: '/company/profile',
  FACULTY: '/faculty/profile',
  ADMIN: '/admin/profile'
};

async function getRoleProfile(role) {
  if (role === 'STUDENT') return studentApi.getMyProfile();
  if (role === 'FACULTY') return facultyApi.getMyProfile();
  if (role === 'COMPANY') return companyApi.getMyProfile();
  if (role === 'ADMIN') return adminApi.getMyProfile();
  return null;
}

function displayName(profile, user, role) {
  if (role === 'COMPANY') return profile?.companyName || user?.email;
  return profile?.name || profile?.fullName || user?.email;
}

export default function Navbar({ onToggleSidebar }) {
  const { user, role, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [profile, setProfile] = useState(null);
  const [unread, setUnread] = useState(0);
  const menuRef = useRef(null);

  const loadProfile = useCallback(() => {
    if (!role) return;
    getRoleProfile(role).then(setProfile).catch(() => setProfile(null));
  }, [role]);

  const loadUnread = useCallback(() => {
    notificationApi.unreadCount()
      .then((data) => setUnread(Number(data?.count || 0)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadProfile();
    window.addEventListener(PROFILE_UPDATED_EVENT, loadProfile);
    return () => window.removeEventListener(PROFILE_UPDATED_EVENT, loadProfile);
  }, [loadProfile]);

  useEffect(() => {
    loadUnread();
    const timer = window.setInterval(loadUnread, 30000);
    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, loadUnread);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, loadUnread);
    };
  }, [loadUnread]);

  useEffect(() => {
    const close = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const submitSearch = (event) => {
    event.preventDefault();
    const q = query.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const name = displayName(profile, user, role);
  const image = profile?.profilePicture;
  const isAdmin = role === 'ADMIN';

  // Admins have no personal photo/initials to show — same generic shield
  // badge used on the admin sidebar card, just sized for the navbar.
  const identityBadge = (badgeSize) =>
    isAdmin ? (
      <span className="admin-avatar-badge" style={{ width: badgeSize, height: badgeSize, fontSize: badgeSize * 0.5, marginTop: 0 }}>
        <i className="bi bi-shield-lock-fill" />
      </span>
    ) : (
      <Avatar name={name} image={image} size={badgeSize} />
    );

  return (
    <nav className="li-navbar d-flex align-items-center px-3 px-md-4">
      <button
        className="btn btn-light btn-sm d-md-none me-2"
        onClick={onToggleSidebar}
        aria-label="Toggle menu"
      >
        <i className="bi bi-list" />
      </button>

      <Link className="navbar-brand brand-logo text-brand mb-0" to="/">
        <OppzyMark className="brand-mark-img" />
        <span className="d-none d-sm-inline">Oppzy</span>
      </Link>

      <form className="nav-search-wrap" onSubmit={submitSearch}>
        <div className="position-relative">
          <i className="bi bi-search nav-search-icon" />
          <input
            className="nav-search"
            placeholder="Search people, companies and posts"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </form>

      <div className="ms-auto d-flex align-items-center gap-1 gap-md-2">
        {/* <Link className="navbar-icon-link" to="/network" title="My Network">
          <i className="bi bi-people" />
        </Link>
        <Link className="navbar-icon-link" to="/messages" title="Messages">
          <i className="bi bi-chat-dots" />
        </Link> */}
        <Link className="navbar-icon-link position-relative" to="/notifications" title="Notifications">
          <i className="bi bi-bell" />
          {unread > 0 && (
            <span className="nav-count">{unread > 99 ? '99+' : unread}</span>
          )}
        </Link>

        <button
          type="button"
          className="theme-toggle-switch"
          role="switch"
          aria-checked={isDark}
          onClick={toggleTheme}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <i className="bi bi-sun-fill theme-toggle-icon theme-toggle-icon-sun" />
          <i className="bi bi-moon-stars-fill theme-toggle-icon theme-toggle-icon-moon" />
          <span className="theme-toggle-thumb" />
        </button>

        <div className="position-relative" ref={menuRef}>
          <button
            className="navbar-profile-button"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            {identityBadge(34)}
              <span className="d-none d-lg-block text-start">
                <span className="navbar-profile-name">{name}</span>
              <span className="navbar-profile-role">{role === 'ADMIN' ? 'Administrator' : role}</span>
              </span>
            <i className="bi bi-chevron-down small" />
          </button>

          {menuOpen && (
            <div className="profile-menu">
              <div className="px-3 py-3 border-bottom d-flex align-items-center gap-2">
                {identityBadge(46)}
                <div className="overflow-hidden">
                  <div className="fw-semibold text-truncate">{name}</div>
                  <div className="text-muted small text-truncate">{user?.email}</div>
                </div>
              </div>
              <Link to={isAdmin ? (PROFILE_PATH[role] || '/feed') : `/profile/${user?.userId}`} onClick={() => setMenuOpen(false)}>
                <i className="bi bi-person" /> My profile
              </Link>
              {!isAdmin && (
                <>
                  <Link to="/change-password" onClick={() => setMenuOpen(false)}>
                    <i className="bi bi-key" /> Change password
                  </Link>
                  <Link to="/change-email" onClick={() => setMenuOpen(false)}>
                    <i className="bi bi-envelope" /> Change email
                  </Link>
                </>
              )}
              <button onClick={handleLogout}>
                <i className="bi bi-box-arrow-right text-danger" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
