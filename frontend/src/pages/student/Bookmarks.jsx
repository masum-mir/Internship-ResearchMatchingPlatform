import { useCallback, useEffect, useState } from 'react';
import { bookmarkApi } from '../../api/bookmarkApi.js';
import { internshipApi } from '../../api/internshipApi.js';
import { researchApi } from '../../api/researchApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import { enumLabel, formatDate } from '../../utils/format.js';
import PageTitle from '../../components/PageTitle.jsx';
import Loader from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import OpportunityDetailModal from '../../components/OpportunityDetailModal.jsx';
import ApplyModal from '../../components/ApplyModal.jsx';

export default function Bookmarks() {
  const [items, setItems] = useState([]);
  const [detail, setDetail] = useState(null);
  const [apply, setApply] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    try {
      setItems(await bookmarkApi.mine());
    } catch (e) {
      setNotice(apiMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const open = async (item) => {
    try {
      const opportunity = item.targetType === 'INTERNSHIP'
        ? await internshipApi.getById(item.opportunityId)
        : await researchApi.getById(item.opportunityId);
      setDetail({ type: item.targetType, opportunity });
    } catch (e) {
      setNotice(apiMessage(e));
    }
  };

  const remove = async (id) => {
    try {
      await bookmarkApi.remove(id);
      setItems((old) => old.filter((x) => x.id !== id));
    } catch (e) {
      setNotice(apiMessage(e));
    }
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <PageTitle title="Saved Opportunities" subtitle="Internships and research posts you saved for later." />
      {notice && <div className="alert alert-danger">{notice}</div>}

      {loading ? <Loader /> : items.length === 0 ? (
        <div className="social-card"><EmptyState icon="bi-bookmark-heart" title="No saved opportunities" /></div>
      ) : (
        <div className="saved-opportunity-list">
          {items.map((item) => (
            <div className="social-card saved-opportunity-row" key={item.id}>
              <span className="saved-opportunity-icon">
                <i className={`bi ${item.targetType === 'RESEARCH' ? 'bi-journal-text' : 'bi-briefcase-fill'}`} />
              </span>
              <div className="flex-grow-1">
                <div className="small text-muted">{enumLabel(item.targetType)}</div>
                <h6 className="mb-1">{item.opportunityTitle}</h6>
                <div className="small text-muted">Saved {formatDate(item.createdAt)}</div>
              </div>
              <button className="btn btn-outline-primary btn-sm" onClick={() => open(item)}>View</button>
              <button className="icon-button text-danger" onClick={() => remove(item.id)}><i className="bi bi-trash" /></button>
            </div>
          ))}
        </div>
      )}

      <OpportunityDetailModal
        show={Boolean(detail)}
        type={detail?.type}
        opportunity={detail?.opportunity}
        onClose={() => setDetail(null)}
        onApply={() => {
          setApply(detail);
          setDetail(null);
        }}
      />

      <ApplyModal
        show={Boolean(apply)}
        type={apply?.type}
        opportunity={apply?.opportunity}
        onClose={() => setApply(null)}
        onApplied={() => setNotice('Application submitted successfully.')}
      />
    </div>
  );
}
