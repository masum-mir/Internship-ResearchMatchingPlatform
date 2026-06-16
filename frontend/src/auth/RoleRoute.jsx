import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

export default function RoleRoute({ allow }) {
  const { role } = useAuth();
  if (!allow.includes(role)) {
    return <Navigate to="/forbidden" replace />;
  }
  return <Outlet />;
}
