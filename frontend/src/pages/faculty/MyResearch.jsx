import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { researchApi } from '../../api/researchApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import Loader from '../../components/Loader.jsx';
import Notice from '../../components/Toast.jsx';
import EmptyState from '../../components/EmptyState.jsx';

export default function MyResearch() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState({ type: '', message: '' });

  const load = () => {
    setLoading(true);
    researchApi.mine().then(setItems)
      .catch((e) => setNotice({ type: 'danger', message: apiMessage(e) }))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm('Delete this research post?')) return;
    try { await researchApi.remove(id); load(); } catch (e) { setNotice({ type: 'danger', message: apiMessage(e) }); }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">My Research</h4>
        <Link to="/faculty/research/new" className="btn btn-brand btn-sm"><i className="bi bi-plus-lg me-1" /> New</Link>
      </div>
      <Notice type={notice.type} message={notice.message} onClose={() => setNotice({ type: '', message: '' })} />
      {items.length === 0 ? (
        <EmptyState icon="bi-journal-text" title="No research posts yet" />
      ) : (
        <div className="row g-3">
          {items.map((it) => (
            <div className="col-md-6" key={it.id}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h5 className="mb-1">{it.topic}</h5>
                    <span className="badge bg-light text-dark border">{it.status}</span>
                  </div>
                  <p className="text-muted small mb-2">{it.researchArea || '—'} · {it.duration || '—'}</p>
                  <div className="d-flex gap-2">
                    <Link to={`/faculty/research/${it.id}/applicants`} className="btn btn-sm btn-brand">
                      <i className="bi bi-people me-1" /> Applicants
                    </Link>
                    <Link to={`/faculty/research/${it.id}/edit`} className="btn btn-sm btn-outline-secondary">Edit</Link>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => remove(it.id)}><i className="bi bi-trash" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
