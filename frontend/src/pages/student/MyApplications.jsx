import { useEffect, useState } from 'react';
import { applicationApi } from '../../api/applicationApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import Loader from '../../components/Loader.jsx';
import Notice from '../../components/Toast.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import MatchScoreBadge from '../../components/MatchScoreBadge.jsx';

export default function MyApplications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState({ type: '', message: '' });

  const load = () => {
    setLoading(true);
    applicationApi.mine().then(setItems)
      .catch((e) => setNotice({ type: 'danger', message: apiMessage(e) }))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const withdraw = async (id) => {
    try { await applicationApi.withdraw(id); load(); }
    catch (e) { setNotice({ type: 'danger', message: apiMessage(e) }); }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h4 className="mb-3">My Applications</h4>
      <Notice type={notice.type} message={notice.message} onClose={() => setNotice({ type: '', message: '' })} />
      {items.length === 0 ? (
        <EmptyState icon="bi-file-earmark-text" title="No applications yet" message="Apply from the Internships or Research pages." />
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr><th>Opportunity</th><th>Type</th><th>Match</th><th>Status</th><th>Applied</th><th></th></tr>
              </thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a.id}>
                    <td>{a.opportunityTitle}</td>
                    <td><span className="badge bg-light text-dark border">{a.targetType}</span></td>
                    <td><MatchScoreBadge score={a.matchScore} /></td>
                    <td><StatusBadge status={a.status} /></td>
                    <td className="small text-muted">{a.appliedAt?.slice(0, 10)}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-danger" onClick={() => withdraw(a.id)}>Withdraw</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
