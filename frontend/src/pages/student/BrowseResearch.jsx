import { useCallback, useEffect, useMemo, useState } from 'react';
import { researchApi } from '../../api/researchApi.js';
import { bookmarkApi } from '../../api/bookmarkApi.js';
import { applicationApi } from '../../api/applicationApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import OpportunityCard from '../../components/OpportunityCard.jsx';
import OpportunityDetailModal from '../../components/OpportunityDetailModal.jsx';
import ApplyModal from '../../components/ApplyModal.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Loader from '../../components/Loader.jsx';
import PageTitle from '../../components/PageTitle.jsx';

export default function BrowseResearch() {
  const [mode, setMode] = useState('matched');
  const [items, setItems] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [applications, setApplications] = useState([]);
  const [filters, setFilters] = useState({ topic: '', area: '', faculty: '' });
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
      setItems(await researchApi.matched());
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

  const search = async (event) => {
    event?.preventDefault();
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value.trim())
      );
      const data = await researchApi.search(params);
      setItems((data || []).map((research) => ({ research, match: null })));
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
      .filter((b) => b.targetType === 'RESEARCH')
      .forEach((b) => map.set(Number(b.opportunityId), b));
    return map;
  }, [bookmarks]);

  const appliedIds = useMemo(() => {
    const ids = new Set();
    applications
      .filter((a) => a.targetType === 'RESEARCH' && a.status !== 'WITHDRAWN')
      .forEach((a) => ids.add(Number(a.opportunityId)));
    return ids;
  }, [applications]);

  const toggleBookmark = async (research) => {
    try {
      const existing = bookmarked.get(Number(research.id));
      if (existing) await bookmarkApi.remove(existing.id);
      else await bookmarkApi.add({ targetType: 'RESEARCH', targetId: research.id });
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
        title="Research opportunities"
      />

      {notice.message && <div className={`alert alert-${notice.type}`}>{notice.message}</div>}

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
          <div className="col-md-4">
            <input className="form-control" placeholder="Research topic" value={filters.topic} onChange={(e) => setFilters({ ...filters, topic: e.target.value })} />
          </div>
          <div className="col-md-3">
            <input className="form-control" placeholder="Research area" value={filters.area} onChange={(e) => setFilters({ ...filters, area: e.target.value })} />
          </div>
          <div className="col-md-3">
            <input className="form-control" placeholder="Faculty name" value={filters.faculty} onChange={(e) => setFilters({ ...filters, faculty: e.target.value })} />
          </div>
          <div className="col-md-2 d-grid">
            <button className="btn btn-brand"><i className="bi bi-search me-1" /> Search</button>
          </div>
        </form>
      </div>

      {loading ? (
        <Loader label="Finding research opportunities…" />
      ) : items.length === 0 ? (
        <div className="social-card">
          <EmptyState icon="bi-journal-text" title="No research opportunities found" />
        </div>
      ) : (
        <div className="opportunity-list">
          {items.map(({ research, match }) => (
            <OpportunityCard
              key={research.id}
              type="RESEARCH"
              opportunity={research}
              match={match}
              bookmarked={bookmarked.has(Number(research.id))}
              applied={appliedIds.has(Number(research.id))}
              onBookmark={() => toggleBookmark(research)}
              onView={() => setDetail({ research, match })}
              onApply={() => setApplyItem(research)}
            />
          ))}
        </div>
      )}

      <OpportunityDetailModal
        show={Boolean(detail)}
        type="RESEARCH"
        opportunity={detail?.research}
        match={detail?.match}
        applied={detail ? appliedIds.has(Number(detail.research.id)) : false}
        onClose={() => setDetail(null)}
        onApply={() => {
          setApplyItem(detail.research);
          setDetail(null);
        }}
      />

      <ApplyModal
        show={Boolean(applyItem)}
        opportunity={applyItem}
        type="RESEARCH"
        onClose={() => setApplyItem(null)}
        onApplied={() => {
          setNotice({ type: 'success', message: 'Research application submitted successfully.' });
          loadApplications();
        }}
      />
    </div>
  );
}
