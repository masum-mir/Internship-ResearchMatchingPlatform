import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../auth/ProtectedRoute.jsx';
import RoleRoute from '../auth/RoleRoute.jsx';
import Layout from '../components/Layout.jsx';
import { useAuth } from '../auth/AuthContext.jsx';

import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';
import ChangePassword from '../pages/shared/ChangePassword.jsx';
import NotFound from '../pages/shared/NotFound.jsx';
import Forbidden from '../pages/shared/Forbidden.jsx';
import PortfolioView from '../pages/shared/PortfolioView.jsx';

import StudentDashboard from '../pages/student/Dashboard.jsx';
import StudentProfile from '../pages/student/Profile.jsx';
import BrowseInternships from '../pages/student/BrowseInternships.jsx';
import BrowseResearch from '../pages/student/BrowseResearch.jsx';
import MyApplications from '../pages/student/MyApplications.jsx';
import Bookmarks from '../pages/student/Bookmarks.jsx';

import CompanyDashboard from '../pages/company/Dashboard.jsx';
import CompanyProfile from '../pages/company/Profile.jsx';
import MyInternships from '../pages/company/MyInternships.jsx';
import InternshipForm from '../pages/company/InternshipForm.jsx';
import InternshipApplicants from '../pages/company/Applicants.jsx';

import FacultyDashboard from '../pages/faculty/Dashboard.jsx';
import FacultyProfile from '../pages/faculty/Profile.jsx';
import MyResearch from '../pages/faculty/MyResearch.jsx';
import ResearchForm from '../pages/faculty/ResearchForm.jsx';
import ResearchApplicants from '../pages/faculty/Applicants.jsx';

import AdminDashboard from '../pages/admin/Dashboard.jsx';
import ManageUsers from '../pages/admin/ManageUsers.jsx';
import Reports from '../pages/admin/Reports.jsx';

function HomeRedirect() {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const home = {
    STUDENT: '/student/dashboard',
    COMPANY: '/company/dashboard',
    FACULTY: '/faculty/dashboard',
    ADMIN: '/admin/dashboard'
  }[role] || '/login';
  return <Navigate to={home} replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forbidden" element={<Forbidden />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Student */}
          <Route element={<RoleRoute allow={['STUDENT']} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/internships" element={<BrowseInternships />} />
            <Route path="/student/research" element={<BrowseResearch />} />
            <Route path="/student/applications" element={<MyApplications />} />
            <Route path="/student/bookmarks" element={<Bookmarks />} />
          </Route>

          {/* Company */}
          <Route element={<RoleRoute allow={['COMPANY']} />}>
            <Route path="/company/dashboard" element={<CompanyDashboard />} />
            <Route path="/company/profile" element={<CompanyProfile />} />
            <Route path="/company/internships" element={<MyInternships />} />
            <Route path="/company/internships/new" element={<InternshipForm />} />
            <Route path="/company/internships/:id/edit" element={<InternshipForm />} />
            <Route path="/company/internships/:id/applicants" element={<InternshipApplicants />} />
          </Route>

          {/* Faculty */}
          <Route element={<RoleRoute allow={['FACULTY']} />}>
            <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
            <Route path="/faculty/profile" element={<FacultyProfile />} />
            <Route path="/faculty/research" element={<MyResearch />} />
            <Route path="/faculty/research/new" element={<ResearchForm />} />
            <Route path="/faculty/research/:id/edit" element={<ResearchForm />} />
            <Route path="/faculty/research/:id/applicants" element={<ResearchApplicants />} />
          </Route>

          {/* Shared portfolio view (company/faculty/admin) */}
          <Route element={<RoleRoute allow={['COMPANY', 'FACULTY', 'ADMIN']} />}>
            <Route path="/portfolio/:id" element={<PortfolioView />} />
          </Route>

          {/* Admin */}
          <Route element={<RoleRoute allow={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/reports" element={<Reports />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
