// import { useEffect, useState } from 'react';
// import { applicationApi } from '../../api/applicationApi.js';
// import { apiMessage } from '../../api/axiosClient.js';
// import Loader from '../../components/Loader.jsx';
// import Notice from '../../components/Toast.jsx';
// import EmptyState from '../../components/EmptyState.jsx';
// import StatusBadge from '../../components/StatusBadge.jsx';
// import MatchScoreBadge from '../../components/MatchScoreBadge.jsx';

// export default function MyApplications() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [notice, setNotice] = useState({ type: '', message: '' });

//   const load = () => {
//     setLoading(true);
//     applicationApi.mine().then(setItems)
//       .catch((e) => setNotice({ type: 'danger', message: apiMessage(e) }))
//       .finally(() => setLoading(false));
//   };
//   useEffect(() => { load(); }, []);

//   const withdraw = async (id) => {
//     try { await applicationApi.withdraw(id); load(); }
//     catch (e) { setNotice({ type: 'danger', message: apiMessage(e) }); }
//   };

//   if (loading) return <Loader />;

//   return (
//     <div>
//       <h4 className="mb-3">My Applications</h4>
//       <Notice type={notice.type} message={notice.message} onClose={() => setNotice({ type: '', message: '' })} />
//       {items.length === 0 ? (
//         <EmptyState icon="bi-file-earmark-text" title="No applications yet" message="Apply from the Internships or Research pages." />
//       ) : (
//         <div className="card border-0 shadow-sm">
//           <div className="table-responsive">
//             <table className="table table-hover align-middle mb-0">
//               <thead className="table-light">
//                 <tr><th>Opportunity</th><th>Type</th><th>Match</th><th>Status</th><th>Applied</th><th></th></tr>
//               </thead>
//               <tbody>
//                 {items.map((a) => (
//                   <tr key={a.id}>
//                     <td>{a.opportunityTitle}</td>
//                     <td><span className="badge bg-light text-dark border">{a.targetType}</span></td>
//                     <td><MatchScoreBadge score={a.matchScore} /></td>
//                     <td><StatusBadge status={a.status} /></td>
//                     <td className="small text-muted">{a.appliedAt?.slice(0, 10)}</td>
//                     <td className="text-end">
//                       <button className="btn btn-sm btn-outline-danger" onClick={() => withdraw(a.id)}>Withdraw</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import {
  useCallback,
  useEffect,
  useState
} from 'react';
import { applicationApi } from '../../api/applicationApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import Loader from '../../components/Loader.jsx';
import Notice from '../../components/Toast.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import MatchScoreBadge from '../../components/MatchScoreBadge.jsx';
import '../../css/MyApplications.css';

function unwrap(response) {
  return response?.data ?? response;
}

function formatDate(value) {
  if (!value) return 'Not specified';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

function ApplicationDetailsModal({
  application,
  withdrawing,
  onClose,
  onWithdraw
}) {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!application) return null;

  const optionalDetails = [
    {
      label: 'Company',
      value:
        application.companyName ||
        application.company
    },
    {
      label: 'Faculty',
      value:
        application.facultyName ||
        application.faculty
    },
    {
      label: 'Department',
      value: application.department
    },
    {
      label: 'Location',
      value: application.location
    },
    {
      label: 'Deadline',
      value: application.deadline
        ? formatDate(application.deadline)
        : null
    },
    {
      label: 'Last updated',
      value: application.updatedAt
        ? formatDate(application.updatedAt)
        : null
    }
  ].filter((item) => item.value);

  return (
    <div
      className="application-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="application-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="application-details-title"
      >
        <div className="application-modal-header">
          <div>
            <span className="application-modal-label">
              Application Details
            </span>

            <h2 id="application-details-title">
              {application.opportunityTitle ||
                'Untitled opportunity'}
            </h2>
          </div>

          <button
            type="button"
            className="application-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="application-modal-body">
          <div className="application-modal-status-row">
            <div>
              <span>Application status</span>
              <StatusBadge status={application.status} />
            </div>

            <div>
              <span>Match score</span>
              <MatchScoreBadge
                score={application.matchScore}
              />
            </div>
          </div>

          <div className="application-detail-grid">
            <div className="application-detail-item">
              <span>Opportunity type</span>
              <strong>
                {application.targetType ||
                  'Not specified'}
              </strong>
            </div>

            <div className="application-detail-item">
              <span>Applied on</span>
              <strong>
                {formatDate(application.appliedAt)}
              </strong>
            </div>

            <div className="application-detail-item">
              <span>Application ID</span>
              <strong>#{application.id}</strong>
            </div>

            {optionalDetails.map((item) => (
              <div
                className="application-detail-item"
                key={item.label}
              >
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>

          {application.description && (
            <div className="application-description">
              <span>Description</span>
              <p>{application.description}</p>
            </div>
          )}
        </div>

        <div className="application-modal-footer">
          <button
            type="button"
            className="btn btn-sm btn-light"
            onClick={onClose}
          >
            Close
          </button>

          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            disabled={withdrawing}
            onClick={() => onWithdraw(application.id)}
          >
            {withdrawing ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Withdrawing...
              </>
            ) : (
              <>
                <i className="bi bi-x-circle me-2" />
                Withdraw Application
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyApplications() {
  const [items, setItems] = useState([]);
  const [selectedApplication, setSelectedApplication] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] =
    useState(null);
  const [notice, setNotice] = useState({
    type: '',
    message: ''
  });

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const response = await applicationApi.mine();
      const data = unwrap(response);

      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      setNotice({
        type: 'danger',
        message: apiMessage(error)
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const withdraw = async (applicationId) => {
    const confirmed = window.confirm(
      'Are you sure you want to withdraw this application?'
    );

    if (!confirmed) return;

    setWithdrawingId(applicationId);

    try {
      await applicationApi.withdraw(applicationId);

      setItems((current) =>
        current.filter(
          (item) => item.id !== applicationId
        )
      );

      setSelectedApplication(null);

      setNotice({
        type: 'success',
        message: 'Application withdrawn successfully.'
      });
    } catch (error) {
      setNotice({
        type: 'danger',
        message: apiMessage(error)
      });
    } finally {
      setWithdrawingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="my-applications-page">
      <div className="my-applications-header">
        <div>
          <h1>My Applications</h1>
          <p>
            View and manage your submitted applications.
          </p>
        </div>

        <span className="my-applications-count">
          {items.length}{' '}
          {items.length === 1
            ? 'Application'
            : 'Applications'}
        </span>
      </div>

      <Notice
        type={notice.type}
        message={notice.message}
        onClose={() =>
          setNotice({ type: '', message: '' })
        }
      />

      {items.length === 0 ? (
        <EmptyState
          icon="bi-file-earmark-text"
          title="No applications yet"
          message="Apply from the Internships or Research pages."
        />
      ) : (
        <div className="my-applications-card">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 my-applications-table">
              <thead>
                <tr>
                  <th>Opportunity</th>
                  <th>Type</th>
                  <th>Match</th>
                  <th>Status</th>
                  <th>Applied</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>

              <tbody>
                {items.map((application) => {
                  const isWithdrawing =
                    withdrawingId === application.id;

                  return (
                    <tr
                      key={application.id}
                      className="application-clickable-row"
                      onClick={() =>
                        setSelectedApplication(application)
                      }
                    >
                      <td>
                        <button
                          type="button"
                          className="application-title-button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedApplication(application);
                          }}
                        >
                          {application.opportunityTitle ||
                            'Untitled opportunity'}
                        </button>

                        <span className="application-view-hint">
                          Click to view details
                        </span>
                      </td>

                      <td>
                        <span className="application-type-badge">
                          {application.targetType || '—'}
                        </span>
                      </td>

                      <td>
                        <MatchScoreBadge
                          score={application.matchScore}
                        />
                      </td>

                      <td>
                        <StatusBadge
                          status={application.status}
                        />
                      </td>

                      <td className="application-date">
                        {formatDate(application.appliedAt)}
                      </td>

                      <td className="text-end">
                        <div className="application-actions">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedApplication(application);
                            }}
                          >
                            <i className="bi bi-eye me-1" />
                            View
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            disabled={isWithdrawing}
                            onClick={(event) => {
                              event.stopPropagation();
                              withdraw(application.id);
                            }}
                          >
                            {isWithdrawing ? (
                              <span className="spinner-border spinner-border-sm" />
                            ) : (
                              'Withdraw'
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          withdrawing={
            withdrawingId === selectedApplication.id
          }
          onClose={() => setSelectedApplication(null)}
          onWithdraw={withdraw}
        />
      )}
    </div>
  );
}