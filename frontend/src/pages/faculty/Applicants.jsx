// import { useEffect, useState } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import { applicationApi } from '../../api/applicationApi.js';
// import { apiMessage } from '../../api/axiosClient.js';
// import Loader from '../../components/Loader.jsx';
// import Notice from '../../components/Toast.jsx';
// import EmptyState from '../../components/EmptyState.jsx';
// import StatusBadge from '../../components/StatusBadge.jsx';
// import MatchScoreBadge from '../../components/MatchScoreBadge.jsx';

// const STATUSES = ['PENDING', 'SHORTLISTED', 'ACCEPTED', 'REJECTED'];

// export default function ResearchApplicants() {
//   const { id } = useParams();
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [notice, setNotice] = useState({ type: '', message: '' });

//   const load = () => {
//     setLoading(true);
//     applicationApi.researchApplicants(id).then(setItems)
//       .catch((e) => setNotice({ type: 'danger', message: apiMessage(e) }))
//       .finally(() => setLoading(false));
//   };
//   useEffect(() => { load(); }, [id]);

//   const change = async (applicationId, status) => {
//     try { await applicationApi.updateStatus(applicationId, status); load(); }
//     catch (e) { setNotice({ type: 'danger', message: apiMessage(e) }); }
//   };

//   if (loading) return <Loader />;

//   return (
//     <div>
//       <Link to="/faculty/research" className="btn btn-sm btn-light mb-3"><i className="bi bi-arrow-left me-1" /> Back</Link>
//       <h4 className="mb-3">Applicants</h4>
//       <Notice type={notice.type} message={notice.message} onClose={() => setNotice({ type: '', message: '' })} />
//       {items.length === 0 ? (
//         <EmptyState icon="bi-people" title="No applicants yet" />
//       ) : (
//         <div className="card border-0 shadow-sm">
//           <div className="table-responsive">
//             <table className="table table-hover align-middle mb-0">
//               <thead className="table-light">
//                 <tr><th>Applicant</th><th>Dept</th><th>CGPA</th><th>Match</th><th>Status</th><th>Decision</th><th></th></tr>
//               </thead>
//               <tbody>
//                 {items.map((a) => (
//                   <tr key={a.applicationId}>
//                     <td>{a.studentName}<div className="small text-muted">{a.studentIdNumber}</div></td>
//                     <td>{a.department || '—'}</td>
//                     <td>{a.cgpa ?? '—'}</td>
//                     <td><MatchScoreBadge score={a.matchScore} /></td>
//                     <td><StatusBadge status={a.status} /></td>
//                     <td>
//                       <select className="form-select form-select-sm" value={a.status} onChange={(e) => change(a.applicationId, e.target.value)}>
//                         {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
//                       </select>
//                     </td>
//                     <td className="text-end">
//                       <Link to={`/portfolio/${a.studentId}`} className="btn btn-sm btn-outline-secondary">Portfolio</Link>
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
  useMemo,
  useState
} from 'react';
import { Link, useParams } from 'react-router-dom';
import { applicationApi } from '../../api/applicationApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import Loader from '../../components/Loader.jsx';
import Notice from '../../components/Toast.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import MatchScoreBadge from '../../components/MatchScoreBadge.jsx';
import '../../css/ResearchApplicants.css';

const STATUSES = [
  'PENDING',
  'SHORTLISTED',
  'ACCEPTED',
  'REJECTED'
];

function unwrap(response) {
  return response?.data ?? response;
}

function getInitials(name) {
  if (!name) return 'ST';

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
}

export default function ResearchApplicants() {
  const { id } = useParams();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] =
    useState(null);
  const [searchText, setSearchText] =
    useState('');
  const [statusFilter, setStatusFilter] =
    useState('ALL');
  const [notice, setNotice] = useState({
    type: '',
    message: ''
  });

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const response =
        await applicationApi.researchApplicants(id);

      const data = unwrap(response);

      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      setItems([]);
      setNotice({
        type: 'danger',
        message: apiMessage(error)
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const changeStatus = async (
    applicationId,
    status
  ) => {
    setUpdatingId(applicationId);

    try {
      await applicationApi.updateStatus(
        applicationId,
        status
      );

      setItems((current) =>
        current.map((item) =>
          item.applicationId === applicationId
            ? { ...item, status }
            : item
        )
      );

      setNotice({
        type: 'success',
        message:
          'Applicant status updated successfully.'
      });
    } catch (error) {
      setNotice({
        type: 'danger',
        message: apiMessage(error)
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredItems = useMemo(() => {
    const query =
      searchText.trim().toLowerCase();

    return items.filter((applicant) => {
      const matchesStatus =
        statusFilter === 'ALL' ||
        applicant.status === statusFilter;

      const matchesSearch =
        !query ||
        applicant.studentName
          ?.toLowerCase()
          .includes(query) ||
        applicant.studentIdNumber
          ?.toLowerCase()
          .includes(query) ||
        applicant.department
          ?.toLowerCase()
          .includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [items, searchText, statusFilter]);

  const summary = useMemo(
    () =>
      STATUSES.reduce((result, status) => {
        result[status] = items.filter(
          (item) => item.status === status
        ).length;

        return result;
      }, {}),
    [items]
  );

  return (
    <div className="research-applicants-page">
      <div className="research-applicants-header">
        <div>
          <Link
            to="/faculty/research"
            className="research-back-link"
          >
            <i className="bi bi-arrow-left" />
            Back to research
          </Link>

          <div className="research-title-row">
            <div className="research-title-icon">
              <i className="bi bi-people" />
            </div>

            <div>
              <h1>Research Applicants</h1>
              <p>
                Review applicants and update their
                application status.
              </p>
            </div>
          </div>
        </div>

        <div className="research-total-box">
          <span>Total applicants</span>
          <strong>{items.length}</strong>
        </div>
      </div>

      <Notice
        type={notice.type}
        message={notice.message}
        onClose={() =>
          setNotice({ type: '', message: '' })
        }
      />

      {!loading && items.length > 0 && (
        <div className="research-status-summary">
          {STATUSES.map((status) => (
            <button
              type="button"
              key={status}
              className={`research-summary-item ${
                statusFilter === status
                  ? 'active'
                  : ''
              }`}
              onClick={() =>
                setStatusFilter(
                  statusFilter === status
                    ? 'ALL'
                    : status
                )
              }
            >
              <span>{status}</span>
              <strong>{summary[status] ?? 0}</strong>
            </button>
          ))}
        </div>
      )}

      <div className="research-applicants-card">
        {!loading && items.length > 0 && (
          <div className="research-applicants-toolbar">
            <div className="research-search-box">
              <i className="bi bi-search" />
              <input
                type="search"
                className="form-control"
                placeholder="Search applicant, ID or department"
                value={searchText}
                onChange={(event) =>
                  setSearchText(event.target.value)
                }
              />
            </div>

            <select
              className="form-select research-status-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option value="ALL">
                All statuses
              </option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        )}

        {loading ? (
          <div className="research-loader-wrap">
            <Loader />
          </div>
        ) : items.length === 0 ? (
          <div className="research-empty-wrap">
            <EmptyState
              icon="bi-people"
              title="No applicants yet"
            />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="research-empty-wrap">
            <EmptyState
              icon="bi-search"
              title="No matching applicants"
            />
          </div>
        ) : (
          <>
            <div className="table-responsive d-none d-lg-block">
              <table className="table align-middle mb-0 research-applicants-table">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Department</th>
                    <th>CGPA</th>
                    <th>Match</th>
                    <th>Status</th>
                    <th>Decision</th>
                    <th className="text-end">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredItems.map((applicant) => {
                    const isUpdating =
                      updatingId ===
                      applicant.applicationId;

                    return (
                      <tr key={applicant.applicationId}>
                        <td>
                          <div className="research-applicant-info">
                            <div className="research-applicant-avatar">
                              {getInitials(
                                applicant.studentName
                              )}
                            </div>

                            <div>
                              <strong>
                                {applicant.studentName ||
                                  'Unnamed student'}
                              </strong>
                              <span>
                                {applicant.studentIdNumber ||
                                  'No student ID'}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="research-table-text">
                            {applicant.department ||
                              '—'}
                          </span>
                        </td>

                        <td>
                          <span className="research-cgpa">
                            {applicant.cgpa ?? '—'}
                          </span>
                        </td>

                        <td>
                          <MatchScoreBadge
                            score={applicant.matchScore}
                          />
                        </td>

                        <td>
                          <StatusBadge
                            status={applicant.status}
                          />
                        </td>

                        <td>
                          <div className="research-decision-wrap">
                            <select
                              className="form-select form-select-sm"
                              value={applicant.status}
                              disabled={isUpdating}
                              onChange={(event) =>
                                changeStatus(
                                  applicant.applicationId,
                                  event.target.value
                                )
                              }
                            >
                              {STATUSES.map((status) => (
                                <option
                                  key={status}
                                  value={status}
                                >
                                  {status}
                                </option>
                              ))}
                            </select>

                            {isUpdating && (
                              <span className="spinner-border spinner-border-sm" />
                            )}
                          </div>
                        </td>

                        <td className="text-end">
                          <Link
                            to={`/portfolio/${applicant.studentId}`}
                            className="btn btn-sm btn-outline-secondary research-portfolio-btn"
                          >
                            <i className="bi bi-person-vcard me-1" />
                            Portfolio
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="research-mobile-list d-lg-none">
              {filteredItems.map((applicant) => {
                const isUpdating =
                  updatingId ===
                  applicant.applicationId;

                return (
                  <article
                    className="research-mobile-card"
                    key={applicant.applicationId}
                  >
                    <div className="research-mobile-card-header">
                      <div className="research-applicant-info">
                        <div className="research-applicant-avatar">
                          {getInitials(
                            applicant.studentName
                          )}
                        </div>

                        <div>
                          <strong>
                            {applicant.studentName ||
                              'Unnamed student'}
                          </strong>
                          <span>
                            {applicant.studentIdNumber ||
                              'No student ID'}
                          </span>
                        </div>
                      </div>

                      <StatusBadge
                        status={applicant.status}
                      />
                    </div>

                    <div className="research-mobile-details">
                      <div>
                        <span>Department</span>
                        <strong>
                          {applicant.department || '—'}
                        </strong>
                      </div>
                      <div>
                        <span>CGPA</span>
                        <strong>
                          {applicant.cgpa ?? '—'}
                        </strong>
                      </div>
                      <div>
                        <span>Match</span>
                        <MatchScoreBadge
                          score={applicant.matchScore}
                        />
                      </div>
                    </div>

                    <div className="research-mobile-actions">
                      <div className="research-decision-wrap">
                        <select
                          className="form-select form-select-sm"
                          value={applicant.status}
                          disabled={isUpdating}
                          onChange={(event) =>
                            changeStatus(
                              applicant.applicationId,
                              event.target.value
                            )
                          }
                        >
                          {STATUSES.map((status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          ))}
                        </select>

                        {isUpdating && (
                          <span className="spinner-border spinner-border-sm" />
                        )}
                      </div>

                      <Link
                        to={`/portfolio/${applicant.studentId}`}
                        className="btn btn-sm btn-outline-secondary"
                      >
                        <i className="bi bi-person-vcard me-1" />
                        Portfolio
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}