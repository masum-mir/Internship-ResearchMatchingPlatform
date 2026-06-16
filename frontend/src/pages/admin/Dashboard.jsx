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
        <div className="col-sm-6 col-lg-4"><StatCard label="Total users" value={data.totalUsers} icon="bi-people" /></div>
        <div className="col-sm-6 col-lg-4"><StatCard label="Total posts" value={data.totalPosts} icon="bi-collection" /></div>
        <div className="col-sm-6 col-lg-4"><StatCard label="Total applications" value={data.totalApplications} icon="bi-file-earmark-text" /></div>
      </div>
      <div className="d-flex gap-2 flex-wrap">
        <Link to="/admin/users" className="btn btn-brand"><i className="bi bi-people me-1" /> Manage users</Link>
        <Link to="/admin/reports" className="btn btn-outline-secondary"><i className="bi bi-bar-chart me-1" /> Reports</Link>
      </div>
    </div>
  );
}
