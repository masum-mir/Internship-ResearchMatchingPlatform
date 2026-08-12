import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Layout() {
  const { role } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="app-shell">
      <Navbar onToggleSidebar={() => setOpen((value) => !value)} />
      <div className="app-body d-flex">
        {open && <div className="sidebar-mobile-backdrop d-md-none" onClick={() => setOpen(false)} />}
        <Sidebar role={role} open={open} onNavigate={() => setOpen(false)} />
        <main className="app-content">
          {/* Keyed by path so navigating away from a page that crashed clears
              the error and remounts a fresh screen, instead of the whole app
              staying blank until a manual refresh. */}
          <ErrorBoundary key={location.pathname}>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
