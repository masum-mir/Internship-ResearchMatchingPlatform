import { useCallback, useEffect, useMemo, useState } from 'react';
import { applicationApi } from '../../api/applicationApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import { resolveUploadUrl } from '../../utils/imageUrl.js';
import { enumLabel, formatDate } from '../../utils/format.js';
import Loader from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import MatchScoreBadge from '../../components/MatchScoreBadge.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import PageTitle from '../../components/PageTitle.jsx';
import Modal from '../../components/Modal.jsx';

const FILTERS = ['ALL', 'PENDING', 'SHORTLISTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'];

export default function MyApplications() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState({ type: '', message: '' });

  const load = useCallback(async () => {
    try {
      setItems(await applicationApi.mine());
    } catch (e) {
      setNotice({ type: 'danger', message: apiMessage(e) });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(
    () => filter === 'ALL' ? items : items.filter((x) => x.status === filter),
    [items, filter]
  );

  const withdraw = async (item) => {
    if (!window.confirm(`Withdraw your application for “${item.opportunityTitle}”?`)) return;
    try {
      await applicationApi.withdraw(item.id);
      await load();
      setNotice({ type: 'success', message: 'Application withdrawn.' });
    } catch (e) {
      setNotice({ type: 'danger', message: apiMessage(e) });
    }
  };

  return (
    <div>
      <PageTitle
        title="My Applications"
        subtitle="Track every internship and research application from one place."
      />

      {notice.message && <div className={`alert alert-${notice.type}`}>{notice.message}</div>}

      <div className="application-filter social-card mb-3">
        {FILTERS.map((x) => (
          <button key={x} type="button" className={filter === x ? 'active' : ''} onClick={() => setFilter(x)}>
            {enumLabel(x)}
            {x !== 'ALL' && (
              <span>{items.filter((a) => a.status === x).length}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? <Loader /> : filtered.length === 0 ? (
        <div className="social-card">
          <EmptyState
            icon="bi-file-earmark-text"
            title="No applications here"
            message={filter === 'ALL' ? 'Apply to an internship or research opportunity to get started.' : null}
          />
        </div>
      ) : (
        <div className="application-list">
          {filtered.map((item) => (
            <article className="social-card application-card" key={item.id}>
              <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                <div>
                  <div className="application-type">{enumLabel(item.targetType)}</div>
                  <h5 className="mb-2">{item.opportunityTitle}</h5>
                  <div className="d-flex gap-2 flex-wrap">
                    <StatusBadge status={item.status} />
                    <MatchScoreBadge score={item.matchScore} />
                  </div>
                </div>
                <div className="text-muted small">Applied {formatDate(item.appliedAt)}</div>
              </div>

              {item.reviewerNote && (
                <div className="reviewer-note mt-3">
                  <strong>Reviewer update:</strong> {item.reviewerNote}
                </div>
              )}

              <div className="application-actions">
                <button className="btn btn-outline-primary btn-sm" onClick={() => setDetail(item)}>
                  View application
                </button>
                {!['ACCEPTED', 'WITHDRAWN'].includes(item.status) && (
                  <button className="btn btn-outline-danger btn-sm ms-auto" onClick={() => withdraw(item)}>
                    Withdraw
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal show={Boolean(detail)} title={detail?.opportunityTitle || 'Application'} onClose={() => setDetail(null)} size="lg">
        {detail && (
          <div>
            <div className="d-flex gap-2 flex-wrap mb-4">
              <StatusBadge status={detail.status} />
              <MatchScoreBadge score={detail.matchScore} />
              <span className="badge bg-light text-dark border">{enumLabel(detail.targetType)}</span>
            </div>

            <div className="detail-grid mb-4">
              <div><span>Applied</span><strong>{formatDate(detail.appliedAt)}</strong></div>
              <div><span>Last updated</span><strong>{formatDate(detail.updatedAt)}</strong></div>
              {detail.reviewedAt && <div><span>Reviewed</span><strong>{formatDate(detail.reviewedAt)}</strong></div>}
              {detail.withdrawnAt && <div><span>Withdrawn</span><strong>{formatDate(detail.withdrawnAt)}</strong></div>}
            </div>

            {detail.coverLetter && (
              <section className="opportunity-detail-section">
                <h6>Cover letter</h6>
                <div className="pre-line">{detail.coverLetter}</div>
              </section>
            )}
            {detail.applicantNote && (
              <section className="opportunity-detail-section">
                <h6>Your note</h6>
                <div className="pre-line">{detail.applicantNote}</div>
              </section>
            )}
            {detail.reviewerNote && (
              <section className="opportunity-detail-section">
                <h6>Reviewer note</h6>
                <div className="pre-line">{detail.reviewerNote}</div>
              </section>
            )}
            {detail.resumeUrl && (
              <a className="btn btn-outline-primary" href={resolveUploadUrl(detail.resumeUrl)} target="_blank" rel="noreferrer">
                <i className="bi bi-file-earmark-pdf me-1" /> Open submitted resume
              </a>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
