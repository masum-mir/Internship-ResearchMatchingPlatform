import { useEffect, useState } from 'react';
import { internshipApi } from '../../api/internshipApi.js';
import { applicationApi } from '../../api/applicationApi.js';
import { bookmarkApi } from '../../api/bookmarkApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import Loader from '../../components/Loader.jsx';
import Notice from '../../components/Toast.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import MatchScoreBadge from '../../components/MatchScoreBadge.jsx';
import { SkillChips } from '../../components/SkillChips.jsx';

export default function BrowseInternships() {
  const [mode, setMode] = useState('matched'); // matched | search
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState({ type: '', message: '' });
  const [filters, setFilters] = useState({ title: '', company: '', skill: '', location: '' });

  const loadMatched = () => {
    setLoading(true);
    internshipApi.matched()
      .then((data) => setItems(data.map((d) => ({ ...d.internship, match: d.match }))))
      .catch((e) => setNotice({ type: 'danger', message: apiMessage(e) }))
      .finally(() => setLoading(false));
  };

  const runSearch = (e) => {
    e?.preventDefault();
    setMode('search');
    setLoading(true);
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    internshipApi.search(params)
      .then((data) => setItems(data.map((d) => ({ ...d, match: null }))))
      .catch((er) => setNotice({ type: 'danger', message: apiMessage(er) }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadMatched(); }, []);

  const apply = async (id) => {
    try { await applicationApi.apply({ targetType: 'INTERNSHIP', targetId: id });
      setNotice({ type: 'success', message: 'Application submitted.' }); }
    catch (e) { setNotice({ type: 'danger', message: apiMessage(e) }); }
  };
  const bookmark = async (id) => {
    try { await bookmarkApi.add({ targetType: 'INTERNSHIP', targetId: id });
      setNotice({ type: 'success', message: 'Bookmarked.' }); }
    catch (e) { setNotice({ type: 'danger', message: apiMessage(e) }); }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h4 className="mb-0">Internships</h4>
        <div className="btn-group">
          <button className={`btn btn-sm ${mode === 'matched' ? 'btn-brand' : 'btn-outline-secondary'}`}
            onClick={() => { setMode('matched'); loadMatched(); }}>Best matches</button>
          <button className={`btn btn-sm ${mode === 'search' ? 'btn-brand' : 'btn-outline-secondary'}`}
            onClick={() => setMode('search')}>Search</button>
        </div>
      </div>

      <Notice type={notice.type} message={notice.message} onClose={() => setNotice({ type: '', message: '' })} />

      {mode === 'search' && (
        <form onSubmit={runSearch} className="row g-2 mb-3">
          <div className="col-md-3"><input className="form-control" placeholder="Title"
            value={filters.title} onChange={(e) => setFilters({ ...filters, title: e.target.value })} /></div>
          <div className="col-md-3"><input className="form-control" placeholder="Company"
            value={filters.company} onChange={(e) => setFilters({ ...filters, company: e.target.value })} /></div>
          <div className="col-md-3"><input className="form-control" placeholder="Skill"
            value={filters.skill} onChange={(e) => setFilters({ ...filters, skill: e.target.value })} /></div>
          <div className="col-md-2"><input className="form-control" placeholder="Location"
            value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} /></div>
          <div className="col-md-1"><button className="btn btn-brand w-100"><i className="bi bi-search" /></button></div>
        </form>
      )}

      {loading ? <Loader /> : items.length === 0 ? (
        <EmptyState icon="bi-briefcase" title="No internships found" message="Try a different search or check back later." />
      ) : (
        <div className="row g-3">
          {items.map((it) => (
            <div className="col-md-6" key={it.id}>
              <div className="card opportunity-card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <h5 className="card-title mb-1">{it.title}</h5>
                    {it.match && <MatchScoreBadge score={it.match.finalScore} />}
                  </div>
                  <p className="text-muted small mb-2">
                    <i className="bi bi-building me-1" />{it.companyName} · <i className="bi bi-geo-alt me-1" />{it.location || '—'}
                  </p>
                  <p className="small">{it.description}</p>
                  <div className="mb-2"><span className="text-muted small me-1">Skills:</span><SkillChips skills={it.requiredSkills} /></div>
                  {it.match?.missingSkills?.length > 0 && (
                    <div className="mb-2"><span className="text-muted small me-1">You’re missing:</span>
                      <SkillChips skills={it.match.missingSkills} missing /></div>
                  )}
                  <p className="small text-muted mb-3">
                    Min CGPA {it.requiredCgpa ?? '—'} · {it.vacancies ?? '—'} vacancies · deadline {it.deadline || '—'}
                  </p>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-brand" onClick={() => apply(it.id)}>Apply</button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => bookmark(it.id)}>
                      <i className="bi bi-bookmark" /> Save
                    </button>
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
