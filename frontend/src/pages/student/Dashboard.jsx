import { Component, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboardApi.js';
import { applicationApi } from '../../api/applicationApi.js';
import { internshipApi } from '../../api/internshipApi.js';
import { researchApi } from '../../api/researchApi.js';
import { bookmarkApi } from '../../api/bookmarkApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import StatCard from '../../components/StatCard.jsx';
import Loader from '../../components/Loader.jsx';
import Notice from '../../components/Toast.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import MatchScoreBadge from '../../components/MatchScoreBadge.jsx';
import BrowseInternships from '../student/BrowseInternships.jsx';
import BrowseResearch from '../student/BrowseResearch.jsx';

 
class ViewErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Dashboard inline view crashed:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <Notice
          type="danger"
          message={`Something went wrong loading this section: ${this.state.error.message}`}
        />
      );
    }
    return this.props.children;
  }
}

const STATUS_TONE = {
  PENDING: 'warning',
  ACCEPTED: 'success',
  REJECTED: 'danger'
};

function ApplicationStatusBadge({ status }) {
  const tone = STATUS_TONE[status] || 'secondary';
  return <span className={`badge text-bg-${tone}`}>{status || 'PENDING'}</span>;
}

function getApplicationTitle(app) {
  return (
    app.targetTitle ||
    app.title ||
    app.internship?.title ||
    app.research?.topic ||
    'Untitled opportunity'
  );
}

function getApplicationSubtitle(app) {
  return (
    app.companyName ||
    app.internship?.companyName ||
    app.facultyName ||
    app.research?.facultyName ||
    (app.targetType === 'RESEARCH' ? 'Research' : 'Internship')
  );
}

function getApplicationDate(app) {
  const raw = app.appliedAt || app.createdAt || app.appliedOn;
  if (!raw) return null;
  try {
    return new Date(raw).toLocaleDateString();
  } catch {
    return null;
  }
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  if (Number.isNaN(target.getTime())) return null;
  const now = new Date();
  const diffMs = target.setHours(23, 59, 59, 999) - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function deadlineTone(days) {
  if (days <= 2) return 'danger';
  if (days <= 7) return 'warning';
  return 'secondary';
}

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [view, setView] = useState('overview'); // overview | internships | research

  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(true);
  const [appsError, setAppsError] = useState('');

  const [matchedInternships, setMatchedInternships] = useState([]);
  const [matchedResearch, setMatchedResearch] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [matchesError, setMatchesError] = useState('');

  const [notice, setNotice] = useState({ type: '', message: '' });

  useEffect(() => {
    dashboardApi.student().then(setData).catch((e) => setError(apiMessage(e)));
  }, []);

  useEffect(() => {
    setAppsLoading(true);
    applicationApi
      .mine()
      .then((list) => setApplications(Array.isArray(list) ? list : list?.data || []))
      .catch((e) => setAppsError(apiMessage(e)))
      .finally(() => setAppsLoading(false));
  }, []);

  useEffect(() => {
    setMatchesLoading(true);
    Promise.all([internshipApi.matched(), researchApi.matched()])
      .then(([internships, research]) => {
        setMatchedInternships(Array.isArray(internships) ? internships : []);
        setMatchedResearch(Array.isArray(research) ? research : []);
      })
      .catch((e) => setMatchesError(apiMessage(e)))
      .finally(() => setMatchesLoading(false));
  }, []);

  // Top 3 best-fit posts across both internships and research, by match score.
  const recommended = useMemo(() => {
    const internshipItems = matchedInternships.map((d) => ({
      id: d.internship?.id,
      type: 'INTERNSHIP',
      title: d.internship?.title,
      subtitle: d.internship?.companyName,
      score: d.match?.finalScore ?? 0
    }));

    const researchItems = matchedResearch.map((d) => ({
      id: d.research?.id,
      type: 'RESEARCH',
      title: d.research?.topic,
      subtitle: d.research?.facultyName,
      score: d.match?.finalScore ?? 0
    }));

    return [...internshipItems, ...researchItems]
      .filter((item) => item.id)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [matchedInternships, matchedResearch]);

  // Internships with a deadline coming up soon, soonest first.
  const upcomingDeadlines = useMemo(() => {
    return matchedInternships
      .map((d) => ({
        id: d.internship?.id,
        title: d.internship?.title,
        companyName: d.internship?.companyName,
        deadline: d.internship?.deadline,
        daysLeft: daysUntil(d.internship?.deadline)
      }))
      .filter((item) => item.id && item.daysLeft !== null && item.daysLeft >= 0)
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 5);
  }, [matchedInternships]);

  const apply = async (type, id) => {
    try {
      await applicationApi.apply({ targetType: type, targetId: id });
      setNotice({ type: 'success', message: 'Application submitted.' });
    } catch (e) {
      setNotice({ type: 'danger', message: apiMessage(e) });
    }
  };

  const bookmark = async (type, id) => {
    try {
      await bookmarkApi.add({ targetType: type, targetId: id });
      setNotice({ type: 'success', message: 'Bookmarked.' });
    } catch (e) {
      setNotice({ type: 'danger', message: apiMessage(e) });
    }
  };

  if (error) return <Notice type="danger" message={error} />;
  if (!data) return <Loader />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
         

        {view !== 'overview' && (
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setView('overview')}
          >
            <i className="bi bi-arrow-left me-1" /> Back to overview
          </button>
        )}
      </div>

      {view === 'overview' && (
        <>
          <Notice
            type={notice.type}
            message={notice.message}
            onClose={() => setNotice({ type: '', message: '' })}
          />

          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-lg-3"><StatCard label="Applications" value={data.totalApplications} icon="bi-file-earmark-text" /></div>
            <div className="col-sm-6 col-lg-3"><StatCard label="Accepted" value={data.acceptedApplications} icon="bi-check-circle" tone="success" /></div>
            <div className="col-sm-6 col-lg-3"><StatCard label="Rejected" value={data.rejectedApplications} icon="bi-x-circle" tone="danger" /></div>
            <div className="col-sm-6 col-lg-3"><StatCard label="Open Opportunities" value={data.activeOpportunities} icon="bi-stars" /></div>
          </div>

          <div className="d-flex gap-2 flex-wrap mb-4">
            <button className="btn btn-brand" onClick={() => setView('internships')}>
              <i className="bi bi-briefcase me-1" /> Find internships
            </button>
            <button className="btn btn-outline-secondary" onClick={() => setView('research')}>
              <i className="bi bi-journal-text me-1" /> Find research
            </button> 
          </div>

          <div className="row g-3 mb-4">
            {/* Recommended matches */}
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title mb-3">
                    <i className="bi bi-stars me-1 text-warning" /> Recommended for you
                  </h5>

                  {matchesError && <Notice type="danger" message={matchesError} />}

                  {matchesLoading ? (
                    <Loader />
                  ) : recommended.length === 0 ? (
                    <EmptyState
                      icon="bi-stars"
                      title="No recommendations yet"
                      message="Complete your profile to get better matches."
                    />
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {recommended.map((item) => (
                        <div
                          key={`${item.type}-${item.id}`}
                          className="d-flex justify-content-between align-items-start border rounded p-2"
                        >
                          <div className="me-2">
                            <div className="d-flex align-items-center gap-2">
                              <span className="fw-semibold">{item.title || 'Untitled'}</span>
                              <MatchScoreBadge score={item.score} />
                            </div>
                            <div className="text-muted small">
                              <i className={`bi ${item.type === 'RESEARCH' ? 'bi-journal-text' : 'bi-building'} me-1`} />
                              {item.subtitle || '—'}
                            </div>
                          </div>
                          <div className="d-flex gap-2 flex-shrink-0">
                            <button
                              className="btn btn-sm btn-brand"
                              onClick={() => apply(item.type, item.id)}
                            >
                              Apply
                            </button>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => bookmark(item.type, item.id)}
                            >
                              <i className="bi bi-bookmark" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Upcoming deadlines */}
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title mb-3">
                    <i className="bi bi-calendar-event me-1 text-danger" /> Upcoming deadlines
                  </h5>

                  {matchesLoading ? (
                    <Loader />
                  ) : upcomingDeadlines.length === 0 ? (
                    <EmptyState
                      icon="bi-calendar-check"
                      title="Nothing due soon"
                      message="Matched internships with a deadline will show up here."
                    />
                  ) : (
                    <div className="list-group list-group-flush">
                      {upcomingDeadlines.map((item) => (
                        <div
                          key={item.id}
                          className="list-group-item d-flex justify-content-between align-items-center px-0"
                        >
                          <div>
                            <div className="fw-semibold">{item.title}</div>
                            <div className="text-muted small">{item.companyName || '—'}</div>
                          </div>
                          <span className={`badge text-bg-${deadlineTone(item.daysLeft)}`}>
                            {item.daysLeft === 0 ? 'Today' : `${item.daysLeft}d left`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">My Applications</h5>

              {appsError && <Notice type="danger" message={appsError} />}

              {appsLoading ? (
                <Loader />
              ) : applications.length === 0 ? (
                <EmptyState
                  icon="bi-file-earmark-text"
                  title="No applications yet"
                  message="Apply to internships or research posts to see them here."
                />
              ) : (
                <div className="list-group list-group-flush">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="list-group-item d-flex justify-content-between align-items-center px-0"
                    >
                      <div>
                        <div className="fw-semibold">{getApplicationTitle(app)}</div>
                        <div className="text-muted small">
                          {getApplicationSubtitle(app)}
                          {getApplicationDate(app) && ` · Applied ${getApplicationDate(app)}`}
                        </div>
                      </div>
                      <ApplicationStatusBadge status={app.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {view === 'internships' && (
        <ViewErrorBoundary key="internships">
          <BrowseInternships />
        </ViewErrorBoundary>
      )}

      {view === 'research' && (
        <ViewErrorBoundary key="research">
          <BrowseResearch />
        </ViewErrorBoundary>
      )}
    </div>
  );
}