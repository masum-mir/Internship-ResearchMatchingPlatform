import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboardApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import StatCard from '../../components/StatCard.jsx';
import Loader from '../../components/Loader.jsx';
import Notice from '../../components/Toast.jsx';

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardApi.student().then(setData).catch((e) => setError(apiMessage(e)));
  }, []);

  if (error) return <Notice type="danger" message={error} />;
  if (!data) return <Loader />;

  return (
    <div>
      <h4 className="mb-3">Student Dashboard</h4>
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3"><StatCard label="Applications" value={data.totalApplications} icon="bi-file-earmark-text" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard label="Accepted" value={data.acceptedApplications} icon="bi-check-circle" tone="success" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard label="Rejected" value={data.rejectedApplications} icon="bi-x-circle" tone="danger" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard label="Open Opportunities" value={data.activeOpportunities} icon="bi-stars" /></div>
      </div>
      <div className="d-flex gap-2 flex-wrap">
        <Link to="/student/internships" className="btn btn-brand"><i className="bi bi-briefcase me-1" /> Find internships</Link>
        <Link to="/student/research" className="btn btn-outline-secondary"><i className="bi bi-journal-text me-1" /> Find research</Link>
        <Link to="/student/profile" className="btn btn-outline-secondary"><i className="bi bi-person-vcard me-1" /> Complete profile</Link>
      </div>
    </div>
  );
}
