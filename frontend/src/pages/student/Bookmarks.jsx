import { useEffect, useState } from 'react';
import { bookmarkApi } from '../../api/bookmarkApi.js';
import { applicationApi } from '../../api/applicationApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import Loader from '../../components/Loader.jsx';
import Notice from '../../components/Toast.jsx';
import EmptyState from '../../components/EmptyState.jsx';

export default function Bookmarks() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState({ type: '', message: '' });

  const load = () => {
    setLoading(true);
    bookmarkApi.mine().then(setItems)
      .catch((e) => setNotice({ type: 'danger', message: apiMessage(e) }))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const remove = async (id) => { try { await bookmarkApi.remove(id); load(); } catch (e) { setNotice({ type: 'danger', message: apiMessage(e) }); } };
  const apply = async (b) => {
    try { await applicationApi.apply({ targetType: b.targetType, targetId: b.opportunityId });
      setNotice({ type: 'success', message: 'Application submitted.' }); }
    catch (e) { setNotice({ type: 'danger', message: apiMessage(e) }); }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h4 className="mb-3">Saved for later</h4>
      <Notice type={notice.type} message={notice.message} onClose={() => setNotice({ type: '', message: '' })} />
      {items.length === 0 ? (
        <EmptyState icon="bi-bookmark-heart" title="No bookmarks yet" message="Save opportunities to revisit them here." />
      ) : (
        <div className="row g-3">
          {items.map((b) => (
            <div className="col-md-6" key={b.id}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <span className="badge bg-light text-dark border mb-1">{b.targetType}</span>
                    <h6 className="mb-0">{b.opportunityTitle}</h6>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-brand" onClick={() => apply(b)}>Apply</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => remove(b.id)}><i className="bi bi-trash" /></button>
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
