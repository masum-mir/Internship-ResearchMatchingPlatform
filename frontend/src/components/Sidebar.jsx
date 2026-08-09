import { useCallback, useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { studentApi } from '../api/studentApi.js';
import { facultyApi, companyApi } from '../api/profileApi.js';
import { adminApi } from '../api/adminApi.js';
import { resolveImageUrl } from '../utils/imageUrl.js';
import { PROFILE_UPDATED_EVENT } from '../utils/profileEvents.js';
import Avatar from './Avatar.jsx';

const SHARED = [
  { to: '/feed', label: 'Home', icon: 'bi-house-door-fill' },
  { to: '/network', label: 'My Network', icon: 'bi-people-fill' },
  { to: '/messages', label: 'Messages', icon: 'bi-chat-dots-fill' },
  { to: '/notifications', label: 'Notifications', icon: 'bi-bell-fill' }
];

const ROLE_MENUS = {
  STUDENT: [
    { section: 'Career' },
    { to: '/student/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { to: '/student/internships', label: 'Internships', icon: 'bi-briefcase-fill' },
    { to: '/student/research', label: 'Research', icon: 'bi-journal-text' },
    { to: '/student/applications', label: 'My Applications', icon: 'bi-file-earmark-check-fill' },
    { to: '/student/bookmarks', label: 'Saved Opportunities', icon: 'bi-bookmark-heart-fill' },
    { section: 'Profile' },
    { to: '/student/profile', label: 'Edit Profile', icon: 'bi-person-vcard-fill' }
  ],
  COMPANY: [
    { section: 'Recruiting' },
    { to: '/company/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { to: '/company/internships', label: 'My Internships', icon: 'bi-briefcase-fill' },
    { to: '/company/internships/new', label: 'Post Internship', icon: 'bi-plus-square-fill' },
    { section: 'Profile' },
    { to: '/company/profile', label: 'Company Profile', icon: 'bi-building-fill' }
  ],
  FACULTY: [
    { section: 'Research' },
    { to: '/faculty/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { to: '/faculty/research', label: 'My Research Posts', icon: 'bi-journal-richtext' },
    { to: '/faculty/research/new', label: 'Post Research', icon: 'bi-plus-square-fill' },
    { section: 'Profile' },
    { to: '/faculty/profile', label: 'Faculty Profile', icon: 'bi-person-badge-fill' }
  ],
  ADMIN: [
    { section: 'Administration' },
    { to: '/admin/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { to: '/admin/users', label: 'Manage Users', icon: 'bi-people-fill' },
    { to: '/admin/reports', label: 'Reports', icon: 'bi-bar-chart-fill' },
    { to: '/admin/profile', label: 'Account', icon: 'bi-person-fill-gear' }
  ]
};

async function loadRoleProfile(role) {
  if (role === 'STUDENT') return studentApi.getMyProfile();
  if (role === 'FACULTY') return facultyApi.getMyProfile();
  if (role === 'COMPANY') return companyApi.getMyProfile();
  if (role === 'ADMIN') return adminApi.getMyProfile();
  return null;
}

function getName(profile, user, role) {
  if (role === 'COMPANY') return profile?.companyName || user?.email;
  return profile?.name || user?.email;
}

function getHeadline(profile, role) {
  if (role === 'STUDENT') return profile?.headline || profile?.department || 'Student';
  if (role === 'FACULTY') {
    return [profile?.designation, profile?.department].filter(Boolean).join(' • ') || 'Faculty member';
  }
  if (role === 'COMPANY') {
    return [profile?.industry, profile?.location].filter(Boolean).join(' • ') || 'Company';
  }
  return 'Administrator';
}

export default function Sidebar({ role, open, onNavigate }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  const load = useCallback(() => {
    loadRoleProfile(role).then(setProfile).catch(() => setProfile(null));
  }, [role]);

  useEffect(() => {
    load();
    window.addEventListener(PROFILE_UPDATED_EVENT, load);
    return () => window.removeEventListener(PROFILE_UPDATED_EVENT, load);
  }, [load]);

  const name = useMemo(() => getName(profile, user, role), [profile, user, role]);
  const headline = useMemo(() => getHeadline(profile, role), [profile, role]);
  const coverUrl = resolveImageUrl(profile?.coverPicture);

  return (
    <aside className={`app-sidebar ${open ? 'sidebar-mobile-open' : ''}`}>
      <NavLink
        to={`/profile/${user?.userId}`}
        className="sidebar-profile-card"
        onClick={onNavigate}
      >
        <div
          className="sidebar-cover"
          style={{ backgroundImage: coverUrl ? `url("${coverUrl}")` : undefined }}
        />
        <div className="sidebar-profile-body">
          <Avatar name={name} image={profile?.profilePicture} size={76} ring />
          <strong>{name}</strong>
          <span>{headline}</span>
        </div>
      </NavLink>

      <nav className="sidebar-nav">
        {SHARED.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <i className={`bi ${item.icon}`} />
            <span>{item.label}</span>
          </NavLink>
        ))}

        {(ROLE_MENUS[role] || []).map((item, index) =>
          item.section ? (
            <div className="sidebar-section-label" key={`${item.section}-${index}`}>
              {item.section}
            </div>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <i className={`bi ${item.icon}`} />
              <span>{item.label}</span>
            </NavLink>
          )
        )}
      </nav>
    </aside>
  );
}
