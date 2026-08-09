import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Layout() {
  const { role } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="app-shell">
      <Navbar onToggleSidebar={() => setOpen((value) => !value)} />
      <div className="app-body d-flex">
        {open && <div className="sidebar-mobile-backdrop d-md-none" onClick={() => setOpen(false)} />}
        <Sidebar role={role} open={open} onNavigate={() => setOpen(false)} />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
