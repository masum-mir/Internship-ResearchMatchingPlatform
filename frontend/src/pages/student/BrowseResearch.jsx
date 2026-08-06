// import { useEffect, useState } from 'react';
// import { researchApi } from '../../api/researchApi.js';
// import { applicationApi } from '../../api/applicationApi.js';
// import { bookmarkApi } from '../../api/bookmarkApi.js';
// import { apiMessage } from '../../api/axiosClient.js';
// import Loader from '../../components/Loader.jsx';
// import Notice from '../../components/Toast.jsx';
// import EmptyState from '../../components/EmptyState.jsx';
// import MatchScoreBadge from '../../components/MatchScoreBadge.jsx';
// import { SkillChips } from '../../components/SkillChips.jsx';

// export default function BrowseResearch() {
//   const [mode, setMode] = useState('matched');
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [notice, setNotice] = useState({ type: '', message: '' });
//   const [filters, setFilters] = useState({ topic: '', area: '', faculty: '' });

//   const loadMatched = () => {
//     setLoading(true);
//     researchApi.matched()
//       .then((data) => setItems(data.map((d) => ({ ...d.research, match: d.match }))))
//       .catch((e) => setNotice({ type: 'danger', message: apiMessage(e) }))
//       .finally(() => setLoading(false));
//   };

//   const runSearch = (e) => {
//     e?.preventDefault();
//     setMode('search');
//     setLoading(true);
//     const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
//     researchApi.search(params)
//       .then((data) => setItems(data.map((d) => ({ ...d, match: null }))))
//       .catch((er) => setNotice({ type: 'danger', message: apiMessage(er) }))
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => { loadMatched(); }, []);

//   const apply = async (id) => {
//     try { await applicationApi.apply({ targetType: 'RESEARCH', targetId: id });
//       setNotice({ type: 'success', message: 'Application submitted.' }); }
//     catch (e) { setNotice({ type: 'danger', message: apiMessage(e) }); }
//   };
//   const bookmark = async (id) => {
//     try { await bookmarkApi.add({ targetType: 'RESEARCH', targetId: id });
//       setNotice({ type: 'success', message: 'Bookmarked.' }); }
//     catch (e) { setNotice({ type: 'danger', message: apiMessage(e) }); }
//   };

//   return (
//     <div>
//       <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
//         <h4 className="mb-0">Research Opportunities</h4>
//         <div className="btn-group">
//           <button className={`btn btn-sm ${mode === 'matched' ? 'btn-brand' : 'btn-outline-secondary'}`}
//             onClick={() => { setMode('matched'); loadMatched(); }}>Best matches</button>
//           <button className={`btn btn-sm ${mode === 'search' ? 'btn-brand' : 'btn-outline-secondary'}`}
//             onClick={() => setMode('search')}>Search</button>
//         </div>
//       </div>

//       <Notice type={notice.type} message={notice.message} onClose={() => setNotice({ type: '', message: '' })} />

//       {mode === 'search' && (
//         <form onSubmit={runSearch} className="row g-2 mb-3">
//           <div className="col-md-4"><input className="form-control" placeholder="Topic"
//             value={filters.topic} onChange={(e) => setFilters({ ...filters, topic: e.target.value })} /></div>
//           <div className="col-md-4"><input className="form-control" placeholder="Research area"
//             value={filters.area} onChange={(e) => setFilters({ ...filters, area: e.target.value })} /></div>
//           <div className="col-md-3"><input className="form-control" placeholder="Faculty"
//             value={filters.faculty} onChange={(e) => setFilters({ ...filters, faculty: e.target.value })} /></div>
//           <div className="col-md-1"><button className="btn btn-brand w-100"><i className="bi bi-search" /></button></div>
//         </form>
//       )}

//       {loading ? <Loader /> : items.length === 0 ? (
//         <EmptyState icon="bi-journal-text" title="No research posts found" />
//       ) : (
//         <div className="row g-3">
//           {items.map((it) => (
//             <div className="col-md-6" key={it.id}>
//               <div className="card opportunity-card border-0 shadow-sm h-100">
//                 <div className="card-body">
//                   <div className="d-flex justify-content-between align-items-start">
//                     <h5 className="card-title mb-1">{it.topic}</h5>
//                     {it.match && <MatchScoreBadge score={it.match.finalScore} />}
//                   </div>
//                   <p className="text-muted small mb-2">
//                     <i className="bi bi-person-badge me-1" />{it.facultyName} · {it.researchArea || '—'}
//                   </p>
//                   <div className="mb-2"><span className="text-muted small me-1">Skills:</span><SkillChips skills={it.requiredSkills} /></div>
//                   {it.match?.missingSkills?.length > 0 && (
//                     <div className="mb-2"><span className="text-muted small me-1">You’re missing:</span>
//                       <SkillChips skills={it.match.missingSkills} missing /></div>
//                   )}
//                   <p className="small text-muted mb-3">Min CGPA {it.minCgpa ?? '—'} · {it.duration || '—'}</p>
//                   <div className="d-flex gap-2">
//                     <button className="btn btn-sm btn-brand" onClick={() => apply(it.id)}>Apply</button>
//                     <button className="btn btn-sm btn-outline-secondary" onClick={() => bookmark(it.id)}>
//                       <i className="bi bi-bookmark" /> Save
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { researchApi } from "../../api/researchApi.js";
import { applicationApi } from "../../api/applicationApi.js";
import { bookmarkApi } from "../../api/bookmarkApi.js";
import { apiMessage } from "../../api/axiosClient.js";
import Loader from "../../components/Loader.jsx";
import Notice from "../../components/Toast.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import MatchScoreBadge from "../../components/MatchScoreBadge.jsx";
import { SkillChips } from "../../components/SkillChips.jsx";
import "../../css/BrowseResearch.css";

const EMPTY_FILTERS = {
  topic: "",
  area: "",
  faculty: "",
};

function unwrap(response) {
  return response?.data ?? response;
}

function normalizeMatched(response) {
  const data = unwrap(response);

  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((entry) => {
      if (entry?.research) {
        return {
          ...entry.research,
          match: entry.match ?? null,
        };
      }

      return {
        ...entry,
        match: entry?.match ?? null,
      };
    })
    .filter((item) => item?.id != null);
}

function normalizeSearch(response) {
  const data = unwrap(response);

  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((item) => ({
      ...item,
      match: item?.match ?? null,
    }))
    .filter((item) => item?.id != null);
}

function formatDate(value) {
  if (!value) return "No deadline";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function normalizeUrl(value) {
  if (!value) {
    return '';
  }

  const url = String(value).trim();

  return /^https?:\/\//i.test(url)
    ? url
    : `https://${url}`;
}

function getStatusClass(status) {
  switch (status) {
    case "ACTIVE":
      return "browse-status-active";

    case "CLOSED":
      return "browse-status-closed";

    case "DRAFT":
      return "browse-status-draft";

    default:
      return "browse-status-default";
  }
}
// modal
function ResearchDetailsModal({
  item,
  onClose,
  onApply,
  onBookmark,
  applying,
  bookmarking,
  applied,
  bookmarked,
}) {
  useEffect(() => {
    if (!item) return undefined;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", handleEscape);
    };
  }, [item, onClose]);

  if (!item) return null;

  return createPortal(
    <div
      className="browse-research-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="browse-research-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="research-details-title"
      >
        <div className="browse-research-modal-header">
          <div>
            <span className="browse-modal-eyebrow">Research opportunity</span>

            <h2 id="research-details-title">{item.topic}</h2>

            <p>
              <i className="bi bi-person-badge me-2" />
              {item.facultyName || "Faculty information unavailable"}
            </p>
          </div>

          <button
            type="button"
            className="browse-modal-close"
            onClick={onClose}
            aria-label="Close details"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="browse-research-modal-body">
          <div className="browse-modal-badges">
            <span
              className={`browse-research-status ${getStatusClass(
                item.status,
              )}`}
            >
              {item.status || "UNKNOWN"}
            </span>

            {item.match && <MatchScoreBadge score={item.match.finalScore} />}
          </div>

          <section className="browse-detail-section">
            <h3>Overview</h3>

            <p>
              {item.description || "No detailed description has been provided."}
            </p>
          </section>

          {item.faculty && (
  <section className="browse-detail-section">
    <h3>Posted by</h3>

    <div className="browse-faculty-card">
      <div className="browse-faculty-heading">
        <div>
          <h4>
            {item.faculty.name ||
              item.facultyName ||
              'Faculty information unavailable'}
          </h4>

          <p>
            {[
              item.faculty.designation,
              item.faculty.department
            ]
              .filter(Boolean)
              .join(' • ') ||
              'Faculty member'}
          </p>
        </div>
      </div>

      <div className="browse-faculty-info-grid">
        {item.faculty.university && (
          <div>
            <small>University</small>
            <strong>
              {item.faculty.university}
            </strong>
          </div>
        )}

        {item.faculty.specialization && (
          <div>
            <small>Specialization</small>
            <strong>
              {item.faculty.specialization}
            </strong>
          </div>
        )}

        {item.faculty.email && (
          <div>
            <small>Email</small>
            <strong>
              <a
                href={`mailto:${item.faculty.email}`}
              >
                {item.faculty.email}
              </a>
            </strong>
          </div>
        )}

        {item.faculty.contactNumber && (
          <div>
            <small>Contact number</small>
            <strong>
              {item.faculty.contactNumber}
            </strong>
          </div>
        )}
      </div>

      {item.faculty.bio && (
        <div className="browse-faculty-text">
          <small>About faculty</small>
          <p>{item.faculty.bio}</p>
        </div>
      )}

      {item.faculty.researchInterests && (
        <div className="browse-faculty-text">
          <small>Research interests</small>
          <p>
            {item.faculty.researchInterests}
          </p>
        </div>
      )}

      <div className="browse-faculty-links">
        {item.faculty.googleScholarUrl && (
          <a
            href={normalizeUrl(
              item.faculty.googleScholarUrl
            )}
            target="_blank"
            rel="noreferrer"
          >
            Google Scholar
            <i className="bi bi-box-arrow-up-right" />
          </a>
        )}

        {item.faculty.orcidId && (
          <a
            href={`https://orcid.org/${
              item.faculty.orcidId
            }`}
            target="_blank"
            rel="noreferrer"
          >
            ORCID
            <i className="bi bi-box-arrow-up-right" />
          </a>
        )}

        {item.faculty.researchgateUrl && (
          <a
            href={normalizeUrl(
              item.faculty.researchgateUrl
            )}
            target="_blank"
            rel="noreferrer"
          >
            ResearchGate
            <i className="bi bi-box-arrow-up-right" />
          </a>
        )}

        {item.faculty.linkedinUrl && (
          <a
            href={normalizeUrl(
              item.faculty.linkedinUrl
            )}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
            <i className="bi bi-box-arrow-up-right" />
          </a>
        )}

        {item.faculty.universityProfileUrl && (
          <a
            href={normalizeUrl(
              item.faculty.universityProfileUrl
            )}
            target="_blank"
            rel="noreferrer"
          >
            University Profile
            <i className="bi bi-box-arrow-up-right" />
          </a>
        )}
      </div>
    </div>
  </section>
)}

          <div className="browse-details-grid">
            <div className="browse-detail-box">
              <i className="bi bi-diagram-3" />

              <div>
                <small>Research area</small>
                <strong>{item.researchArea || "Not specified"}</strong>
              </div>
            </div>

            <div className="browse-detail-box">
              <i className="bi bi-clock-history" />

              <div>
                <small>Duration</small>
                <strong>{item.duration || "Not specified"}</strong>
              </div>
            </div>

            <div className="browse-detail-box">
              <i className="bi bi-mortarboard" />

              <div>
                <small>Minimum CGPA</small>
                <strong>{item.minCgpa ?? "No restriction"}</strong>
              </div>
            </div>

            <div className="browse-detail-box">
              <i className="bi bi-person-plus" />

              <div>
                <small>Available positions</small>
                <strong>{item.availablePositions ?? "Not specified"}</strong>
              </div>
            </div>

            <div className="browse-detail-box browse-detail-wide">
              <i className="bi bi-calendar-event" />

              <div>
                <small>Application deadline</small>
                <strong>{formatDate(item.applicationDeadline)}</strong>
              </div>
            </div>
          </div>

          {item.targetDepartments?.length > 0 && (
            <section className="browse-detail-section">
              <h3>Eligible departments</h3>

              <div className="browse-department-list">
                {item.targetDepartments.map((department) => (
                  <span key={department}>{department}</span>
                ))}
              </div>
            </section>
          )}

          {item.requiredSkills?.length > 0 && (
            <section className="browse-detail-section">
              <h3>Required skills</h3>

              <SkillChips skills={item.requiredSkills} />
            </section>
          )}

          {item.match?.missingSkills?.length > 0 && (
            <section className="browse-detail-section">
              <h3>Your missing skills</h3>

              <SkillChips skills={item.match.missingSkills} missing />
            </section>
          )}
        </div>

        <div className="browse-research-modal-footer">
          <button
            type="button"
            className={`btn rounded-pill px-4 ${
              bookmarked ? "btn-secondary" : "btn-outline-secondary"
            }`}
            onClick={() => onBookmark(item.id)}
            disabled={bookmarking || bookmarked}
          >
            {bookmarking ? (
              <span className="spinner-border spinner-border-sm me-2" />
            ) : (
              <i
                className={`bi ${
                  bookmarked ? "bi-bookmark-check-fill" : "bi-bookmark"
                } me-2`}
              />
            )}

            {bookmarked ? "Saved" : "Save"}
          </button>

          <button
            type="button"
            className={`btn rounded-pill px-4 ${
              applied ? "btn-success" : "btn-brand"
            }`}
            onClick={() => onApply(item.id)}
            disabled={applying || applied || item.status === "CLOSED"}
          >
            {applying ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Applying...
              </>
            ) : applied ? (
              <>
                <i className="bi bi-check-circle-fill me-2" />
                Applied
              </>
            ) : (
              <>
                <i className="bi bi-send me-2" />
                Apply now
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function BrowseResearch() {
  const [mode, setMode] = useState("matched");

  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);

  const [notice, setNotice] = useState({
    type: "",
    message: "",
  });

  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const [selectedItem, setSelectedItem] = useState(null);

  const [applyingId, setApplyingId] = useState(null);

  const [bookmarkingId, setBookmarkingId] = useState(null);

  const [appliedIds, setAppliedIds] = useState(() => new Set());

  const [bookmarkedIds, setBookmarkedIds] = useState(() => new Set());

  const loadMatched = useCallback(async () => {
    setMode("matched");
    setLoading(true);

    try {
      const response = await researchApi.matched();
      console.log("Matched response:", response);

      setItems(normalizeMatched(response));
    } catch (error) {
      setItems([]);

      setNotice({
        type: "danger",
        message: apiMessage(error),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const runSearch = useCallback(
    async (event) => {
      event?.preventDefault();

      setMode("search");
      setLoading(true);

      const params = Object.fromEntries(
        Object.entries(filters)
          .map(([key, value]) => [key, value.trim()])
          .filter(([, value]) => value),
      );

      try {
        const response = await researchApi.search(params);

        setItems(normalizeSearch(response));
      } catch (error) {
        setItems([]);

        setNotice({
          type: "danger",
          message: apiMessage(error),
        });
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    loadMatched();
  }, [loadMatched]);

  /*
   * Refresh matched opportunities if a faculty
   * creates a new post during the same session.
   */
  useEffect(() => {
    const handleResearchCreated = () => {
      if (mode === "matched") {
        loadMatched();
      }
    };

    window.addEventListener("research-created", handleResearchCreated);

    return () => {
      window.removeEventListener("research-created", handleResearchCreated);
    };
  }, [loadMatched, mode]);

  const updateFilter = (field, value) => {
    setFilters((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setItems([]);
    setMode("search");
  };

  const apply = async (id) => {
    if (applyingId || appliedIds.has(id)) {
      return;
    }

    setApplyingId(id);

    try {
      await applicationApi.apply({
        targetType: "RESEARCH",
        targetId: id,
      });

      setAppliedIds((current) => {
        const next = new Set(current);
        next.add(id);
        return next;
      });

      setNotice({
        type: "success",
        message: "Research application submitted successfully.",
      });
    } catch (error) {
      setNotice({
        type: "danger",
        message: apiMessage(error),
      });
    } finally {
      setApplyingId(null);
    }
  };

  const bookmark = async (id) => {
    if (bookmarkingId || bookmarkedIds.has(id)) {
      return;
    }

    setBookmarkingId(id);

    try {
      await bookmarkApi.add({
        targetType: "RESEARCH",
        targetId: id,
      });

      setBookmarkedIds((current) => {
        const next = new Set(current);
        next.add(id);
        return next;
      });

      setNotice({
        type: "success",
        message: "Research opportunity saved to bookmarks.",
      });
    } catch (error) {
      setNotice({
        type: "danger",
        message: apiMessage(error),
      });
    } finally {
      setBookmarkingId(null);
    }
  };

  const resultTitle = useMemo(() => {
    if (mode === "matched") {
      return "Recommended for you";
    }

    return "Search results";
  }, [mode]);

  return (
    <>
      <div className="browse-research-page">
        <header className="browse-research-hero">
          <div className="browse-mode-switch">
            <button
              type="button"
              className={mode === "matched" ? "active" : ""}
              onClick={loadMatched}
            >
              <i className="bi bi-stars" />
              Best matches
            </button>

            <button
              type="button"
              className={mode === "search" ? "active" : ""}
              onClick={() => setMode("search")}
            >
              <i className="bi bi-search" />
              Search
            </button>
          </div>
        </header>

        <Notice
          type={notice.type}
          message={notice.message}
          onClose={() =>
            setNotice({
              type: "",
              message: "",
            })
          }
        />

        {mode === "search" && (
          <form onSubmit={runSearch} className="browse-research-filter-card">
            <div className="browse-filter-heading">
              <div>
                <h2>Find research</h2>

                <p>Search by topic, research area or faculty member.</p>
              </div>

              <button
                type="button"
                className="browse-clear-filter"
                onClick={clearFilters}
              >
                <i className="bi bi-arrow-counterclockwise" />
                Clear
              </button>
            </div>

            <div className="row g-3">
              <div className="col-lg-4">
                <label className="form-label">Topic</label>

                <div className="browse-input-wrap">
                  <i className="bi bi-journal-text" />

                  <input
                    className="form-control"
                    placeholder="AI, cybersecurity..."
                    value={filters.topic}
                    onChange={(event) =>
                      updateFilter("topic", event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="col-lg-4">
                <label className="form-label">Research area</label>

                <div className="browse-input-wrap">
                  <i className="bi bi-diagram-3" />

                  <input
                    className="form-control"
                    placeholder="Machine learning..."
                    value={filters.area}
                    onChange={(event) =>
                      updateFilter("area", event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="col-lg-3">
                <label className="form-label">Faculty</label>

                <div className="browse-input-wrap">
                  <i className="bi bi-person-badge" />

                  <input
                    className="form-control"
                    placeholder="Faculty name"
                    value={filters.faculty}
                    onChange={(event) =>
                      updateFilter("faculty", event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="col-lg-1 d-flex align-items-end">
                <button
                  type="submit"
                  className="btn btn-brand w-100 browse-search-button"
                  aria-label="Search research"
                  title="Search"
                >
                  <i className="bi bi-search" />
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="browse-results-heading">
          <div>
            <h2>{resultTitle}</h2>

            {!loading && (
              <p>
                {items.length}{" "}
                {items.length === 1 ? "opportunity" : "opportunities"} found
              </p>
            )}
          </div>

          {mode === "matched" && (
            <span className="browse-match-note">
              <i className="bi bi-info-circle" />
              Ranked using your profile and skills
            </span>
          )}
        </div>

        {loading ? (
          <Loader />
        ) : items.length === 0 ? (
          <div className="browse-empty-card">
            <EmptyState
              icon="bi-journal-text"
              title="No research posts found"
            />

            {mode === "search" && (
              <button
                type="button"
                className="btn btn-outline-primary rounded-pill px-4"
                onClick={loadMatched}
              >
                <i className="bi bi-stars me-2" />
                View best matches
              </button>
            )}
          </div>
        ) : (
          <div className="browse-research-grid">
            {items.map((item) => {
              const applying = applyingId === item.id;

              const bookmarking = bookmarkingId === item.id;

              const applied = appliedIds.has(item.id);

              const bookmarked = bookmarkedIds.has(item.id);

              return (
                <article className="browse-research-card" key={item.id}>
                  <div className="browse-card-accent" />

                  <div className="browse-card-header">
                    <div className="browse-card-icon">
                      <i className="bi bi-lightbulb" />
                    </div>

                    <div className="browse-card-header-actions">
                      {item.match && (
                        <MatchScoreBadge score={item.match.finalScore} />
                      )}

                      <button
                        type="button"
                        className={`browse-card-bookmark ${
                          bookmarked ? "saved" : ""
                        }`}
                        onClick={() => bookmark(item.id)}
                        disabled={bookmarking || bookmarked}
                        aria-label={
                          bookmarked ? "Research saved" : "Save research"
                        }
                        title={bookmarked ? "Saved" : "Save research"}
                      >
                        {bookmarking ? (
                          <span className="spinner-border spinner-border-sm" />
                        ) : (
                          <i
                            className={`bi ${
                              bookmarked
                                ? "bi-bookmark-check-fill"
                                : "bi-bookmark"
                            }`}
                          />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="browse-card-body">
                    <div className="browse-card-badges">
                      <span className="browse-card-area">
                        {item.researchArea || "General research"}
                      </span>

                      <span
                        className={`browse-research-status ${getStatusClass(
                          item.status,
                        )}`}
                      >
                        {item.status || "UNKNOWN"}
                      </span>
                    </div>

                    <h2>{item.topic}</h2>

                    <p className="browse-card-faculty">
                      <i className="bi bi-person-badge" />
                      {item.facultyName || "Faculty information unavailable"}
                    </p>

                    {item.description && (
                      <p className="browse-card-description">
                        {item.description}
                      </p>
                    )}

                    <div className="browse-card-meta">
                      <span>
                        <i className="bi bi-clock" />

                        {item.duration || "Duration not specified"}
                      </span>

                      <span>
                        <i className="bi bi-mortarboard" />

                        {item.minCgpa != null
                          ? `Minimum CGPA ${item.minCgpa}`
                          : "No CGPA restriction"}
                      </span>

                      <span>
                        <i className="bi bi-person-plus" />

                        {item.availablePositions != null
                          ? `${item.availablePositions} position${
                              Number(item.availablePositions) === 1 ? "" : "s"
                            }`
                          : "Positions not specified"}
                      </span>

                      <span>
                        <i className="bi bi-calendar-event" />

                        {formatDate(item.applicationDeadline)}
                      </span>
                    </div>

                    {item.requiredSkills?.length > 0 && (
                      <div className="browse-card-skill-section">
                        <small>Required skills</small>

                        <SkillChips skills={item.requiredSkills} />
                      </div>
                    )}

                    {item.match?.missingSkills?.length > 0 && (
                      <div className="browse-card-skill-section missing">
                        <small>Skills to improve</small>

                        <SkillChips skills={item.match.missingSkills} missing />
                      </div>
                    )}
                  </div>

                  <div className="browse-card-footer">
                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-pill"
                      onClick={() => setSelectedItem(item)}
                    >
                      <i className="bi bi-eye me-2" />
                      View details
                    </button>

                    <button
                      type="button"
                      className={`btn rounded-pill ${
                        applied ? "btn-success" : "btn-brand"
                      }`}
                      onClick={() => apply(item.id)}
                      disabled={applying || applied || item.status === "CLOSED"}
                    >
                      {applying ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Applying...
                        </>
                      ) : applied ? (
                        <>
                          <i className="bi bi-check-circle-fill me-2" />
                          Applied
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send me-2" />
                          Apply
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <ResearchDetailsModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onApply={apply}
        onBookmark={bookmark}
        applying={selectedItem ? applyingId === selectedItem.id : false}
        bookmarking={selectedItem ? bookmarkingId === selectedItem.id : false}
        applied={selectedItem ? appliedIds.has(selectedItem.id) : false}
        bookmarked={selectedItem ? bookmarkedIds.has(selectedItem.id) : false}
      />
    </>
  );
}
