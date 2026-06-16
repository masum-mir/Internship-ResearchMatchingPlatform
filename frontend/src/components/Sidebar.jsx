import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import Avatar from './Avatar.jsx';

const MENUS = {
  STUDENT: [
    { to: '/student/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { to: '/student/profile', label: 'My Profile', icon: 'bi-person-vcard' },
    { to: '/student/internships', label: 'Internships', icon: 'bi-briefcase' },
    { to: '/student/research', label: 'Research', icon: 'bi-journal-text' },
    { to: '/student/applications', label: 'My Applications', icon: 'bi-file-earmark-text' },
    { to: '/student/bookmarks', label: 'Bookmarks', icon: 'bi-bookmark-heart' }
  ],
  COMPANY: [
    { to: '/company/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { to: '/company/profile', label: 'Company Profile', icon: 'bi-building' },
    { to: '/company/internships', label: 'My Internships', icon: 'bi-briefcase' },
    { to: '/company/internships/new', label: 'Post Internship', icon: 'bi-plus-square' }
  ],
  FACULTY: [
    { to: '/faculty/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { to: '/faculty/profile', label: 'Faculty Profile', icon: 'bi-person-badge' },
    { to: '/faculty/research', label: 'My Research', icon: 'bi-journal-text' },
    { to: '/faculty/research/new', label: 'Post Research', icon: 'bi-plus-square' }
  ],
  ADMIN: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { to: '/admin/users', label: 'Manage Users', icon: 'bi-people' },
    { to: '/admin/reports', label: 'Reports', icon: 'bi-bar-chart' }
  ]
};

const ROLE_LABEL = { STUDENT: 'Student', COMPANY: 'Company', FACULTY: 'Faculty', ADMIN: 'Administrator' };

export default function Sidebar({ role, open }) {
  const { user } = useAuth();
  const items = MENUS[role] || [];
  return (
    <aside className={`app-sidebar ${open ? 'd-block' : 'd-none'} d-md-block`}>
      <div className="sidebar-card">
        <div className="cover" />
        <div className="body">
          <Avatar name={user?.email} size={56} className="ring mx-auto d-block" />
          <div className="fw-semibold text-truncate mt-2">{user?.email}</div>
          <div className="text-muted small">{ROLE_LABEL[role]}</div>
        </div>
      </div>
      <nav className="nav flex-column">
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className={`bi ${item.icon} me-2`} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
