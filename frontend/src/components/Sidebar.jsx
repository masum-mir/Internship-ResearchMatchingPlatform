// import { NavLink } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { studentApi } from '../api/studentApi.js';
// import { facultyApi, companyApi } from "../api/profileApi.js";
// import { adminApi } from '../api/adminApi.js';
// import { useAuth } from '../auth/AuthContext.jsx';
// import Avatar from './Avatar.jsx';
// import { resolveImageUrl } from '../utils/imageUrl.js';

// const MENUS = {
//   STUDENT: [
//     { to: '/student/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
//     { to: '/student/profile', label: 'My Profile', icon: 'bi-person-vcard' },
//     { to: '/student/internships', label: 'Internships', icon: 'bi-briefcase' },
//     { to: '/student/research', label: 'Research', icon: 'bi-journal-text' },
//     { to: '/student/applications', label: 'My Applications', icon: 'bi-file-earmark-text' },
//     { to: '/student/bookmarks', label: 'Bookmarks', icon: 'bi-bookmark-heart' }
//   ],
//   COMPANY: [
//     { to: '/company/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
//     { to: '/company/profile', label: 'My Profile', icon: 'bi-building' },
//     { to: '/company/internships', label: 'My Internships', icon: 'bi-briefcase' },
//     { to: '/company/internships/new', label: 'Post Internship', icon: 'bi-plus-square' }
//   ],
//   FACULTY: [
//     { to: '/faculty/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
//     { to: '/faculty/profile', label: 'My Profile', icon: 'bi-person-badge' },
//     { to: '/faculty/research', label: 'My Research', icon: 'bi-journal-text' },
//     { to: '/faculty/research/new', label: 'Post Research', icon: 'bi-plus-square' }
//   ],
//   ADMIN: [
//     { to: '/admin/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
//     { to: '/admin/profile', label: 'My Profile', icon: 'bi-person-badge' },
//     { to: '/admin/users', label: 'Manage Users', icon: 'bi-people' },
//     { to: '/admin/reports', label: 'Reports', icon: 'bi-bar-chart' }
//   ]
// };

// const ROLE_LABEL = { STUDENT: 'Student', COMPANY: 'Company', FACULTY: 'Faculty', ADMIN: 'Administrator' };

// export default function Sidebar({ role, open }) {
//   const { user } = useAuth();
//   const [profile, setProfile] = useState(null);

// useEffect(() => {
//   const loadProfile = async () => {
//     try {
//       if (role === "STUDENT") {
//         setProfile(await studentApi.getMyProfile());
//       } else if (role === "FACULTY") {
//         setProfile(await facultyApi.getMyProfile());
//       } else if (role === "COMPANY") {
//         setProfile(await companyApi.getMyProfile());
//       } else if (role === "ADMIN") {
//         setProfile(await adminApi.getMyProfile());
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   loadProfile();
// }, [role]);

//   const items = MENUS[role] || [];
//   const coverUrl = resolveImageUrl(profile?.coverPicture);
//   return (
//     <aside className={`app-sidebar ${open ? 'd-block' : 'd-none'} d-md-block`}>
//       <div
//         className="sidebar-card"
//         style={{
//           // Quoted url() so filenames with parentheses/spaces don't break the CSS value.
//           backgroundImage: coverUrl ? `url("${coverUrl}")` : undefined
//         }}
//       >
//         <div className="cover" />
//         <div className="body">
//           <div className="sidebar-avatar-wrap">
//             <Avatar
//               name={user?.email}
//               image={profile?.profilePicture}
//               size={92}
//               className="mx-auto d-block"
//               ring
//             />
//           </div>
//           <div className="fw-semibold text-truncate mt-2">{user?.email}</div>
//           <div className="text-muted small">{ROLE_LABEL[role]}</div>
//         </div>
//       </div>
//       <nav className="nav flex-column">
//         {items.map((item) => (
//           <NavLink key={item.to} to={item.to} end
//             className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
//             <i className={`bi ${item.icon} me-2`} />
//             {item.label}
//           </NavLink>
//         ))}
//       </nav>
//     </aside>
//   );
// }

import { NavLink } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { studentApi } from "../api/studentApi.js";
import { facultyApi, companyApi } from "../api/profileApi.js";
import { adminApi } from "../api/adminApi.js";
import { useAuth } from "../auth/AuthContext.jsx";
import Avatar from "./Avatar.jsx";
import { resolveImageUrl } from "../utils/imageUrl.js";
import PostResearchModal from "../components/modals/PostResearchModal.jsx";
import "../css/Sidebar.css";

const MENUS = {
  STUDENT: [
    {
      to: "/student/dashboard",
      label: "Dashboard",
      icon: "bi-speedometer2",
    },
    {
      to: "/student/profile",
      label: "My Profile",
      icon: "bi-person-vcard",
    },
    {
      to: "/student/internships",
      label: "Internships",
      icon: "bi-briefcase",
    },
    {
      to: "/student/research",
      label: "Research",
      icon: "bi-journal-text",
    },
    {
      to: "/student/applications",
      label: "My Applications",
      icon: "bi-file-earmark-text",
    },
    {
      to: "/student/bookmarks",
      label: "Bookmarks",
      icon: "bi-bookmark-heart",
    },
  ],

  COMPANY: [
    {
      to: "/company/dashboard",
      label: "Dashboard",
      icon: "bi-speedometer2",
    },
    {
      to: "/company/profile",
      label: "My Profile",
      icon: "bi-building",
    },
    {
      to: "/company/internships",
      label: "My Internships",
      icon: "bi-briefcase",
    },
    {
      to: "/company/internships/new",
      label: "Post Internship",
      icon: "bi-plus-square",
    },
  ],

  FACULTY: [
    {
      to: "/faculty/dashboard",
      label: "Dashboard",
      icon: "bi-speedometer2",
    },
    {
      to: "/faculty/profile",
      label: "My Profile",
      icon: "bi-person-badge",
    },
    {
      to: "/faculty/research",
      label: "My Research",
      icon: "bi-journal-text",
    },
    // {
    //   to: '/faculty/research/new',
    //   label: 'Post Research',
    //   icon: 'bi-plus-square'
    // }
  ],

  ADMIN: [
    {
      to: "/admin/dashboard",
      label: "Dashboard",
      icon: "bi-speedometer2",
    },
    {
      to: "/admin/profile",
      label: "My Profile",
      icon: "bi-person-badge",
    },
    {
      to: "/admin/users",
      label: "Manage Users",
      icon: "bi-people",
    },
    {
      to: "/admin/reports",
      label: "Reports",
      icon: "bi-bar-chart",
    },
  ],
};

const ROLE_CONFIG = {
  STUDENT: {
    label: "Student",
    profileRoute: "/student/profile",
    quickActionRoute: "/student/internships",
    // quickActionLabel: "Find internships",
    quickActionIcon: "bi-search",
    fallbackHeadline: "Student seeking academic and career opportunities",
  },

  COMPANY: {
    label: "Company",
    profileRoute: "/company/profile",
    // quickActionRoute: "/company/internships/new",
    quickActionLabel: "Post an internship",
    quickActionIcon: "bi-plus-circle",
    fallbackHeadline: "Organization providing internship opportunities",
  },

  FACULTY: {
    label: "Faculty Member",
    profileRoute: "/faculty/profile",
    // quickActionRoute: "/faculty/research/new",
    quickActionLabel: "Post research",
    quickActionIcon: "bi-plus-circle",
    fallbackHeadline: "Faculty researcher and academic mentor",
  },

  ADMIN: {
    label: "Administrator",
    profileRoute: "/admin/profile",
    quickActionRoute: "/admin/users",
    quickActionLabel: "Manage users",
    quickActionIcon: "bi-people",
    fallbackHeadline: "Platform administrator",
  },
};

function getProfileName(profile, user, role) {
  if (role === "COMPANY") {
    return (
      profile?.companyName ||
      profile?.organizationName ||
      profile?.name ||
      user?.name ||
      user?.email ||
      "Company"
    );
  }

  return (
    profile?.fullName ||
    profile?.name ||
    profile?.displayName ||
    user?.name ||
    user?.email ||
    "User"
  );
}

function getProfileHeadline(profile, role) {
  const fallback = ROLE_CONFIG[role]?.fallbackHeadline;

  if (role === "STUDENT") {
    const parts = [
      profile?.department,
      profile?.university,
      profile?.currentSemester ? `Semester ${profile.currentSemester}` : null,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(" • ") : fallback;
  }

  if (role === "FACULTY") {
    const parts = [
      profile?.designation,
      profile?.department,
      profile?.specialization,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(" • ") : fallback;
  }

  if (role === "COMPANY") {
    const parts = [
      profile?.industry,
      profile?.location,
      profile?.companySize,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(" • ") : fallback;
  }

  return profile?.headline || fallback;
}

export default function Sidebar({ role, open }) {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState(false);

  const [showResearchModal, setShowResearchModal] = useState(false);

  const roleConfig = ROLE_CONFIG[role] || ROLE_CONFIG.STUDENT;
  const items = MENUS[role] || [];

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      setLoading(true);
      setProfileError(false);

      try {
        let response = null;

        if (role === "STUDENT") {
          response = await studentApi.getMyProfile();
        } else if (role === "FACULTY") {
          response = await facultyApi.getMyProfile();
        } else if (role === "COMPANY") {
          response = await companyApi.getMyProfile();
        } else if (role === "ADMIN") {
          response = await adminApi.getMyProfile();
        }

        /*
         * Supports both:
         * 1. API returning profile directly
         * 2. Axios response returning { data: profile }
         */
        const profileData = response?.data ?? response;

        if (isMounted) {
          setProfile(profileData || null);
        }
      } catch (error) {
        console.error("Failed to load sidebar profile:", error);

        if (isMounted) {
          setProfileError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [role]);

  const displayName = useMemo(
    () => getProfileName(profile, user, role),
    [profile, user, role],
  );

  const headline = useMemo(
    () => getProfileHeadline(profile, role),
    [profile, role],
  );

  const coverUrl = resolveImageUrl(profile?.coverPicture);

  /*
   * These statistics are shown only when the backend provides them.
   * You can rename the fields according to your backend response.
   */
  const statistics = useMemo(() => {
    const possibleStats = [
      {
        label: "Profile views",
        value: profile?.profileViews,
        icon: "bi-eye",
      },
      {
        label: "Applications",
        value:
          profile?.applicationCount ??
          profile?.applicationsCount ??
          profile?.totalApplications,
        icon: "bi-file-earmark-check",
      },
      {
        label: "Bookmarks",
        value:
          profile?.bookmarkCount ??
          profile?.bookmarksCount ??
          profile?.totalBookmarks,
        icon: "bi-bookmark",
      },
      {
        label: "Internships",
        value:
          profile?.internshipCount ??
          profile?.internshipsCount ??
          profile?.totalInternships,
        icon: "bi-briefcase",
      },
      {
        label: "Research posts",
        value:
          profile?.researchCount ??
          profile?.researchPostsCount ??
          profile?.totalResearch,
        icon: "bi-journal-text",
      },
    ];

    return possibleStats
      .filter(
        (stat) =>
          stat.value !== undefined && stat.value !== null && stat.value !== "",
      )
      .slice(0, 2);
  }, [profile]);

  const closeResearchModal = () => {
  setShowResearchModal(false);
};

  return (
    <>
      <aside
        className={`app-sidebar ${
          open ? "sidebar-open d-block" : "d-none"
        } d-md-block`}
      >
        <div className="sidebar-scroll-area">
          {/* Profile card */}
          <section className="linkedin-profile-card">
            <div
              className={`sidebar-cover ${
                coverUrl ? "has-cover-image" : "default-cover"
              }`}
              style={
                coverUrl
                  ? {
                      backgroundImage: `linear-gradient(
                      180deg,
                      rgba(0, 0, 0, 0.05),
                      rgba(0, 0, 0, 0.35)
                    ), url("${coverUrl}")`,
                    }
                  : undefined
              }
            >
              <div className="cover-shine" />

              <NavLink
                to={roleConfig.profileRoute}
                className="cover-edit-button"
                aria-label="Open profile"
                title="View profile"
              >
                <i className="bi bi-pencil-square" />
              </NavLink>
            </div>

            <div className="profile-card-body">
              <div className="sidebar-avatar-container">
                {loading ? (
                  <div className="avatar-skeleton" />
                ) : (
                  <Avatar
                    name={displayName}
                    image={profile?.profilePicture}
                    size={94}
                    className="sidebar-profile-avatar"
                    ring
                  />
                )}

                {!loading && (
                  <span
                    className="online-indicator"
                    title="Active account"
                    aria-label="Active account"
                  />
                )}
              </div>

              {loading ? (
                <div className="profile-loading">
                  <div className="skeleton-line skeleton-name" />
                  <div className="skeleton-line skeleton-headline" />
                  <div className="skeleton-line skeleton-role" />
                </div>
              ) : (
                <>
                  <NavLink
                    to={roleConfig.profileRoute}
                    className="profile-name-link"
                  >
                    <h2 className="sidebar-profile-name" title={displayName}>
                      {displayName}
                    </h2>
                  </NavLink>

                  <p className="sidebar-profile-headline" title={headline}>
                    {headline}
                  </p>

                  <div className="sidebar-role-badge">
                    <i className="bi bi-patch-check-fill" />
                    <span>{roleConfig.label}</span>
                  </div>
                </>
              )}

              {profileError && (
                <div className="profile-error-message">
                  <i className="bi bi-exclamation-circle me-1" />
                  Profile information is unavailable
                </div>
              )}
            </div>

            {/* Optional LinkedIn-style statistics */}
            {statistics.length > 0 && (
              <div className="profile-statistics">
                {statistics.map((stat) => (
                  <div className="profile-stat-item" key={stat.label}>
                    <div className="stat-left">
                      <i className={`bi ${stat.icon}`} />
                      <span>{stat.label}</span>
                    </div>

                    <strong>{stat.value}</strong>
                  </div>
                ))}
              </div>
            )}

            {/* <div className="profile-card-actions">
            <NavLink
              to={roleConfig.quickActionRoute}
              className="sidebar-primary-action"
            >
              <i className={`bi ${roleConfig.quickActionIcon}`} />
              <span>{roleConfig.quickActionLabel}</span>
            </NavLink>

            <NavLink
              to={roleConfig.profileRoute}
              className="sidebar-secondary-action"
            >
              View profile
            </NavLink>
          </div> */}

            <div className="profile-card-actions">
              {(role === "FACULTY" ||
  role === "COMPANY") && (
  <div className="profile-card-actions">
    {role === "FACULTY" && (
      <button
        type="button"
        className="sidebar-primary-action border-0"
        onClick={() =>
          setShowResearchModal(true)
        }
      >
        <i
          className={`bi ${roleConfig.quickActionIcon}`}
        />

        <span>
          {roleConfig.quickActionLabel}
        </span>
      </button>
    )}

    {role === "COMPANY" && (
      <NavLink
        to={roleConfig.quickActionRoute}
        className="sidebar-primary-action"
      >
        <i
          className={`bi ${roleConfig.quickActionIcon}`}
        />

        <span>
          {roleConfig.quickActionLabel}
        </span>
      </NavLink>
    )}
  </div>
)}

              <NavLink
                to={roleConfig.profileRoute}
                className="sidebar-secondary-action"
              >
                View profile
              </NavLink>
            </div>
          </section>

          {/* Navigation */}
          <section className="sidebar-navigation-card">
            <div className="sidebar-section-title">
              <span>Navigation</span>
              <i className="bi bi-grid" />
            </div>

            <nav
              className="nav flex-column sidebar-nav"
              aria-label={`${roleConfig.label} navigation`}
            >
              {items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  className={({ isActive }) =>
                    `sidebar-nav-link ${isActive ? "active" : ""}`
                  }
                >
                  <span className="sidebar-nav-icon">
                    <i className={`bi ${item.icon}`} />
                  </span>

                  <span className="sidebar-nav-label">{item.label}</span>

                  <i className="bi bi-chevron-right sidebar-nav-arrow" />
                </NavLink>
              ))}
            </nav>
          </section>

          {/* Footer */}
          <div className="sidebar-footer">
            <span>Internship & Research Matching</span>
            <small>Connect • Learn • Grow</small>
          </div>
        </div>
      </aside>
      <PostResearchModal
        show={showResearchModal}
        onClose={closeResearchModal}
        onCreated={(research) => {
          console.log("Research created:", research);
        }}
      />
    </>
  );
}
