import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboardApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import StatCard from '../../components/StatCard.jsx';
import Loader from '../../components/Loader.jsx';
import Notice from '../../components/Toast.jsx';

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { dashboardApi.company().then(setData).catch((e) => setError(apiMessage(e))); }, []);
  if (error) return <Notice type="danger" message={error} />;
  if (!data) return <Loader />;
  return (
    <div>
      <h4 className="mb-3">Company Dashboard</h4>
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-4"><StatCard label="Internships posted" value={data.totalInternships} icon="bi-briefcase" onClick={() => navigate('/company/internships')} /></div>
        <div className="col-12 col-sm-6 col-lg-4"><StatCard label="Total applicants" value={data.totalApplicants} icon="bi-people" onClick={() => navigate('/company/internships')} /></div>
      </div>
      <div className="dashboard-actions d-flex gap-2 flex-wrap">
        <Link to="/company/internships/new" className="dashboard-action btn"><i className="bi bi-plus-square me-1" /> Post internship</Link>
        <Link to="/company/internships" className="dashboard-action btn">My internships</Link>
      </div>
    </div>
  );
}
 
