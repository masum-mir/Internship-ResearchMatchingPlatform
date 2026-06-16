import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import Avatar from './Avatar.jsx';

const PROFILE_PATH = {
  STUDENT: '/student/profile',
  COMPANY: '/company/profile',
  FACULTY: '/faculty/profile',
  ADMIN: '/admin/dashboard'
};

export default function Navbar({ onToggleSidebar }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const menuRef = useRef(null);

  useEffect(() => {
    const close = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleLogout = async () => { await logout(); navigate('/login'); };

  const submitSearch = (e) => {
    e.preventDefault();
    if (role === 'STUDENT') navigate('/student/internships');
  };

  return (
    <nav className="li-navbar d-flex align-items-center px-3 px-md-4">
      <button className="btn btn-light btn-sm d-md-none me-2" onClick={onToggleSidebar} aria-label="Toggle menu">
        <i className="bi bi-list" />
      </button>

      <Link className="navbar-brand brand-logo text-brand mb-0" to="/">
        <span className="brand-mark"><i className="bi bi-mortarboard-fill" /></span>
        EWU Match
      </Link>

      {role === 'STUDENT' && (
        <form className="ms-3 d-none d-sm-block" onSubmit={submitSearch}>
          <div className="position-relative">
            <i className="bi bi-search position-absolute text-muted" style={{ left: 14, top: 9 }} />
            <input
              className="nav-search ps-4"
              placeholder="Search opportunities"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </form>
      )}

      <div className="ms-auto position-relative" ref={menuRef}>
        <button className="btn btn-light d-flex align-items-center gap-2 py-1" onClick={() => setOpen((o) => !o)}>
          <Avatar name={user?.email} size={32} />
          <span className="d-none d-md-inline small fw-semibold">{user?.email}</span>
          <i className="bi bi-chevron-down small text-muted" />
        </button>
        {open && (
          <div className="profile-menu">
            <div className="px-3 py-3 border-bottom d-flex align-items-center gap-2">
              <Avatar name={user?.email} size={40} />
              <div className="overflow-hidden">
                <div className="fw-semibold text-truncate" style={{ maxWidth: 150 }}>{user?.email}</div>
                <span className="badge bg-light text-dark border">{role}</span>
              </div>
            </div>
            <Link to={PROFILE_PATH[role] || '/'} onClick={() => setOpen(false)}>
              <i className="bi bi-person" /> View profile
            </Link>
            <Link to="/change-password" onClick={() => setOpen(false)}>
              <i className="bi bi-key" /> Change password
            </Link>
            <button onClick={handleLogout}>
              <i className="bi bi-box-arrow-right text-danger" /> Sign out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
