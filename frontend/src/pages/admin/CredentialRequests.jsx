import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import { enumLabel, timeAgo } from '../../utils/format.js';
import Loader from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import PageTitle from '../../components/PageTitle.jsx';

const TABS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'ALL', label: 'All' }
];

const STATUS_BADGE = {
  PENDING: 'bg-warning text-dark',
  APPROVED: 'bg-success',
  REJECTED: 'bg-secondary'
};

function whatChanged(request) {
  if (request.requestedEmail && request.passwordChangeRequested) return 'Email and password';
  if (request.requestedEmail) return 'Email';
  return 'Password';
}

export default function CredentialRequests() {
  const [status, setStatus] = useState('PENDING');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async (nextStatus) => {
    setLoading(true);
    setError('');
    try {
      setRequests(await adminApi.credentialChangeRequests(nextStatus));
    } catch (e) {
      setError(apiMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(status);
  }, [status, load]);

  const act = async (id, action) => {
    setBusyId(id);
    setError('');
    try {
      const updated = action === 'approve'
        ? await adminApi.approveCredentialChangeRequest(id)
        : await adminApi.rejectCredentialChangeRequest(id);
      setRequests((old) =>
        status === 'ALL' || status === updated.status
          ? old.map((r) => (r.id === id ? updated : r))
          : old.filter((r) => r.id !== id)
      );
    } catch (e) {
      setError(apiMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <PageTitle
        title="Credential Requests"
        subtitle="Email and password changes submitted by accounts without self-edit permission"
      />

      <div className="social-card mb-3 p-2 d-flex gap-2 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={`btn btn-sm ${status === tab.value ? 'btn-brand' : 'btn-outline-secondary'}`}
            onClick={() => setStatus(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <Loader label="Loading requests…" />
      ) : requests.length === 0 ? (
        <div className="social-card">
          <EmptyState
            icon="bi-key"
            title="No requests here"
            message={
              status === 'PENDING'
                ? 'Nothing is currently awaiting review.'
                : 'No requests match this filter yet.'
            }
          />
        </div>
      ) : (
        requests.map((request) => (
          <div key={request.id} className="social-card mb-3 p-3">
            <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
              <div>
                <span className={`badge ${STATUS_BADGE[request.status] || 'bg-secondary'} me-2`}>
                  {enumLabel(request.status)}
                </span>
                <span className="fw-semibold">{whatChanged(request)} change</span>
              </div>
              <span className="text-muted small">{timeAgo(request.createdAt)} ago</span>
            </div>

            <div className="row g-3 mt-1">
              <div className="col-md-6">
                <div className="text-muted small">Requested by</div>
                <div>
                  {request.userId ? (
                    <Link to={`/profile/${request.userId}`}>
                      {request.userName || request.userEmail}
                    </Link>
                  ) : (
                    request.userName || request.userEmail || '—'
                  )}
                </div>
                <div className="text-muted small">{request.userEmail}</div>
              </div>
              {request.requestedEmail && (
                <div className="col-md-6">
                  <div className="text-muted small">New email requested</div>
                  <div>{request.requestedEmail}</div>
                </div>
              )}
              {request.passwordChangeRequested && (
                <div className="col-md-6">
                  <div className="text-muted small">Password</div>
                  <div>A new password was submitted (hidden for security)</div>
                </div>
              )}
            </div>

            {request.status !== 'PENDING' && (
              <div className="text-muted small mt-2">
                {enumLabel(request.status)}{request.resolvedAt ? ` ${timeAgo(request.resolvedAt)} ago` : ''}
              </div>
            )}

            {request.status === 'PENDING' && (
              <div className="d-flex gap-2 mt-3 flex-wrap">
                <button
                  type="button"
                  className="btn btn-sm btn-success"
                  disabled={busyId === request.id}
                  onClick={() => act(request.id, 'approve')}
                >
                  <i className="bi bi-check-lg me-1" /> Approve
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  disabled={busyId === request.id}
                  onClick={() => act(request.id, 'reject')}
                >
                  <i className="bi bi-x-lg me-1" /> Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
