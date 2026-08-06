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
      <Navbar onToggleSidebar={() => setOpen((o) => !o)} />
      <div className="app-body d-flex flex-column flex-md-row">
        <Sidebar role={role} open={open} />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
