import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { applicationApi } from '../../api/applicationApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import Loader from '../../components/Loader.jsx';
import Notice from '../../components/Toast.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import MatchScoreBadge from '../../components/MatchScoreBadge.jsx';

const STATUSES = ['PENDING', 'SHORTLISTED', 'ACCEPTED', 'REJECTED'];

export default function ResearchApplicants() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState({ type: '', message: '' });

  const load = () => {
    setLoading(true);
    applicationApi.researchApplicants(id).then(setItems)
      .catch((e) => setNotice({ type: 'danger', message: apiMessage(e) }))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [id]);

  const change = async (applicationId, status) => {
    try { await applicationApi.updateStatus(applicationId, status); load(); }
    catch (e) { setNotice({ type: 'danger', message: apiMessage(e) }); }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <Link to="/faculty/research" className="btn btn-sm btn-light mb-3"><i className="bi bi-arrow-left me-1" /> Back</Link>
      <h4 className="mb-3">Applicants</h4>
      <Notice type={notice.type} message={notice.message} onClose={() => setNotice({ type: '', message: '' })} />
      {items.length === 0 ? (
        <EmptyState icon="bi-people" title="No applicants yet" />
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr><th>Applicant</th><th>Dept</th><th>CGPA</th><th>Match</th><th>Status</th><th>Decision</th><th></th></tr>
              </thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a.applicationId}>
                    <td>{a.studentName}<div className="small text-muted">{a.studentIdNumber}</div></td>
                    <td>{a.department || '—'}</td>
                    <td>{a.cgpa ?? '—'}</td>
                    <td><MatchScoreBadge score={a.matchScore} /></td>
                    <td><StatusBadge status={a.status} /></td>
                    <td>
                      <select className="form-select form-select-sm" value={a.status} onChange={(e) => change(a.applicationId, e.target.value)}>
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="text-end">
                      <Link to={`/portfolio/${a.studentId}`} className="btn btn-sm btn-outline-secondary">Portfolio</Link>
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
