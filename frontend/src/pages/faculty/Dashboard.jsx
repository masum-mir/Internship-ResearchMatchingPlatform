import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboardApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import StatCard from '../../components/StatCard.jsx';
import Loader from '../../components/Loader.jsx';
import Notice from '../../components/Toast.jsx';

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { dashboardApi.faculty().then(setData).catch((e) => setError(apiMessage(e))); }, []);
  if (error) return <Notice type="danger" message={error} />;
  if (!data) return <Loader />;
  return (
    <div>
      <h4 className="mb-3">Faculty Dashboard</h4>
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-4"><StatCard label="Research posts" value={data.totalResearchPosts} icon="bi-journal-text" onClick={() => navigate('/faculty/research')} /></div>
        <div className="col-12 col-sm-6 col-lg-4"><StatCard label="Total applicants" value={data.totalApplicants} icon="bi-people" onClick={() => navigate('/faculty/research')} /></div>
      </div>
      <div className="dashboard-actions d-flex gap-2 flex-wrap">
        <Link to="/faculty/research" className="dashboard-action btn">My research</Link>
      </div>
    </div>
  );
}
