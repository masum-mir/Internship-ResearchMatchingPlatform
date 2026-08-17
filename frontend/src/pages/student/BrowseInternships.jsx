import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { internshipApi } from '../../api/internshipApi.js';
import { bookmarkApi } from '../../api/bookmarkApi.js';
import { applicationApi } from '../../api/applicationApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import OpportunityCard from '../../components/OpportunityCard.jsx';
import OpportunityDetailModal from '../../components/OpportunityDetailModal.jsx';
import ApplyModal from '../../components/ApplyModal.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Loader from '../../components/Loader.jsx';
import PageTitle from '../../components/PageTitle.jsx';

export default function BrowseInternships() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState('matched');
  const [items, setItems] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [applications, setApplications] = useState([]);
  const [filters, setFilters] = useState({ title: '', company: '', skill: '', location: '' });
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState({ type: '', message: '' });
  const [detail, setDetail] = useState(null);
  const [applyItem, setApplyItem] = useState(null);

  const loadBookmarks = useCallback(() =>
    bookmarkApi.mine().then(setBookmarks).catch(() => setBookmarks([])), []);

  const loadApplications = useCallback(() =>
    applicationApi.mine().then(setApplications).catch(() => setApplications([])), []);

  const loadMatched = useCallback(async () => {
    setLoading(true);
    setNotice({ type: '', message: '' });
    try {
      setItems(await internshipApi.matched());
    } catch (e) {
      setNotice({ type: 'danger', message: apiMessage(e) });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMatched();
    loadBookmarks();
    loadApplications();
  }, [loadMatched, loadBookmarks, loadApplications]);

  // Deep link from a "posted" notification — open that internship's detail
  // modal directly instead of just landing on the list.
  useEffect(() => {
    const opportunityId = searchParams.get('opportunity');
    if (!opportunityId) return;
    internshipApi.getById(opportunityId)
      .then((internship) => setDetail({ internship, match: null }))
      .catch(() => setNotice({ type: 'danger', message: 'That internship could not be found.' }));
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('opportunity');
      return next;
    }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const search = async (event) => {
    event?.preventDefault();
    setLoading(true);
    setNotice({ type: '', message: '' });
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value.trim())
      );
      const data = await internshipApi.search(params);
      setItems((data || []).map((internship) => ({ internship, match: null })));
      setMode('all');
    } catch (e) {
      setNotice({ type: 'danger', message: apiMessage(e) });
    } finally {
      setLoading(false);
    }
  };

  const bookmarked = useMemo(() => {
    const map = new Map();
    bookmarks
      .filter((b) => b.targetType === 'INTERNSHIP')
      .forEach((b) => map.set(Number(b.opportunityId), b));
    return map;
  }, [bookmarks]);

  const appliedIds = useMemo(() => {
    const ids = new Set();
    applications
      .filter((a) => a.targetType === 'INTERNSHIP' && a.status !== 'WITHDRAWN')
      .forEach((a) => ids.add(Number(a.opportunityId)));
    return ids;
  }, [applications]);

  const toggleBookmark = async (internship) => {
    try {
      const existing = bookmarked.get(Number(internship.id));
      if (existing) await bookmarkApi.remove(existing.id);
      else await bookmarkApi.add({ targetType: 'INTERNSHIP', targetId: internship.id });
      await loadBookmarks();
    } catch (e) {
      setNotice({ type: 'danger', message: apiMessage(e) });
    }
  };

  const changeMode = async (next) => {
    setMode(next);
    if (next === 'matched') await loadMatched();
    else await search();
  };

  return (
    <div className="browse-opportunities">
      <PageTitle
        title="Internships"
        subtitle="Discover internships and see transparent match scores based on your profile."
      />

      {notice.message && (
        <div className={`alert alert-${notice.type}`}>{notice.message}</div>
      )}

      <div className="opportunity-toolbar social-card">
        <div className="feed-filter-tabs mb-3">
          <button className={mode === 'matched' ? 'active' : ''} onClick={() => changeMode('matched')}>
              Recommended for you
          </button>
          <button className={mode === 'all' ? 'active' : ''} onClick={() => changeMode('all')}>
            <i className="bi bi-list-ul" /> Browse all
          </button>
        </div>

        <form className="row g-2" onSubmit={search}>
          <div className="col-md-3">
            <input className="form-control" placeholder="Job title" value={filters.title} onChange={(e) => setFilters({ ...filters, title: e.target.value })} />
          </div>
          <div className="col-md-3">
            <input className="form-control" placeholder="Company" value={filters.company} onChange={(e) => setFilters({ ...filters, company: e.target.value })} />
          </div>
          <div className="col-md-2">
            <input className="form-control" placeholder="Skill" value={filters.skill} onChange={(e) => setFilters({ ...filters, skill: e.target.value })} />
          </div>
          <div className="col-md-2">
            <input className="form-control" placeholder="Location" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
          </div>
          <div className="col-md-2 d-grid">
            <button className="btn btn-brand"><i className="bi bi-search me-1" /> Search</button>
          </div>
        </form>
      </div>

      {loading ? (
        <Loader label="Finding internships…" />
      ) : items.length === 0 ? (
        <div className="social-card">
          <EmptyState
            icon="bi-briefcase"
            title="No internships found"
            message="Try different filters or strengthen your profile skills."
          />
        </div>
      ) : (
        <div className="opportunity-list">
          {items.map(({ internship, match }) => (
            <OpportunityCard
              key={internship.id}
              type="INTERNSHIP"
              opportunity={internship}
              match={match}
              bookmarked={bookmarked.has(Number(internship.id))}
              applied={appliedIds.has(Number(internship.id))}
              onBookmark={() => toggleBookmark(internship)}
              onView={() => setDetail({ internship, match })}
              onApply={() => setApplyItem(internship)}
            />
          ))}
        </div>
      )}

      <OpportunityDetailModal
        show={Boolean(detail)}
        type="INTERNSHIP"
        opportunity={detail?.internship}
        match={detail?.match}
        applied={detail ? appliedIds.has(Number(detail.internship.id)) : false}
        onClose={() => setDetail(null)}
        onApply={() => {
          setApplyItem(detail.internship);
          setDetail(null);
        }}
      />

      <ApplyModal
        show={Boolean(applyItem)}
        opportunity={applyItem}
        type="INTERNSHIP"
        onClose={() => setApplyItem(null)}
        onApplied={() => {
          setNotice({ type: 'success', message: 'Application submitted successfully.' });
          loadApplications();
        }}
      />
    </div>
  );
}
