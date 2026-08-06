import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboardApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import StatCard from '../../components/StatCard.jsx';
import Loader from '../../components/Loader.jsx';
import Notice from '../../components/Toast.jsx';

export default function FacultyDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { dashboardApi.faculty().then(setData).catch((e) => setError(apiMessage(e))); }, []);
  if (error) return <Notice type="danger" message={error} />;
  if (!data) return <Loader />;
  return (
    <div>
      <h4 className="mb-3">Faculty Dashboard</h4>
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-4"><StatCard label="Research posts" value={data.totalResearchPosts} icon="bi-journal-text" /></div>
        <div className="col-sm-6 col-lg-4"><StatCard label="Total applicants" value={data.totalApplicants} icon="bi-people" /></div>
      </div>
      <div className="d-flex gap-2 flex-wrap">
        <Link to="/faculty/research" className="btn btn-outline-secondary">My research</Link>
      </div>
    </div>
  );
}
