import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboardApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import StatCard from '../../components/StatCard.jsx';
import Loader from '../../components/Loader.jsx';
import Notice from '../../components/Toast.jsx';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { dashboardApi.admin().then(setData).catch((e) => setError(apiMessage(e))); }, []);
  if (error) return <Notice type="danger" message={error} />;
  if (!data) return <Loader />;
  return (
    <div>
      <h4 className="mb-3">Admin Dashboard</h4>
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-4"><StatCard label="Total users" value={data.totalUsers} icon="bi-people" /></div>
        <div className="col-12 col-sm-6 col-lg-4"><StatCard label="Total posts" value={data.totalPosts} icon="bi-collection" /></div>
        <div className="col-12 col-sm-6 col-lg-4"><StatCard label="Total applications" value={data.totalApplications} icon="bi-file-earmark-text" /></div>
      </div>
      <div className="dashboard-actions d-flex gap-2 flex-wrap">
        <Link to="/admin/users" className="dashboard-action btn"><i className="bi bi-people me-1" /> Manage users</Link>
        <Link to="/admin/reports" className="dashboard-action btn"><i className="bi bi-bar-chart me-1" /> Statistics</Link>
        <Link to="/admin/content-reports" className="dashboard-action btn"><i className="bi bi-flag me-1" /> Reported content</Link>
      </div>
    </div>
  );
}
