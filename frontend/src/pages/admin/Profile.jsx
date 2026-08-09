import { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import Loader from '../../components/Loader.jsx';
import PageTitle from '../../components/PageTitle.jsx';

export default function AdminProfile() {
  const [p, setP] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.getMyProfile().then(setP).catch((e) => setError(apiMessage(e)));
  }, []);

  if (!p && !error) return <Loader />;

  return (
    <div style={{ maxWidth: 760 }}>
      <PageTitle title="Administrator account" subtitle="Platform access and account information" />
      {error && <div className="alert alert-danger">{error}</div>}

      {p && (
        <div className="social-card profile-section">
          <div className="admin-account-icon"><i className="bi bi-shield-lock-fill" /></div>
          <h5 className="mt-3">{p.name || 'Administrator'}</h5>
          <div className="text-muted">{p.email}</div>
          <div className="d-flex flex-wrap gap-2 mt-3">
            {(p.roles || []).map((role) => <span className="badge bg-primary" key={role}>{role}</span>)}
            <span className={`badge ${p.blocked ? 'bg-danger' : 'bg-success'}`}>
              {p.blocked ? 'Blocked' : 'Active'}
            </span>
          </div>
          <hr />
          <p className="text-muted mb-0">
            Admin accounts do not have a dedicated profile-picture row in the current backend.
            Use the public feed, network, user management and reporting tools from the sidebar.
          </p>
        </div>
      )}
    </div>
  );
}
