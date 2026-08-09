import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { internshipApi } from '../../api/internshipApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import OpportunityCard from '../../components/OpportunityCard.jsx';
import OpportunityDetailModal from '../../components/OpportunityDetailModal.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Loader from '../../components/Loader.jsx';
import PageTitle from '../../components/PageTitle.jsx';

export default function MyInternships() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setItems(await internshipApi.mine());
    } catch (e) {
      setError(apiMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const remove = async (id) => {
    if (!window.confirm('Delete this internship? Existing applications may also be affected.')) return;
    try {
      await internshipApi.remove(id);
      setItems((old) => old.filter((x) => x.id !== id));
    } catch (e) {
      setError(apiMessage(e));
    }
  };

  return (
    <div>
      <PageTitle
        title="My Internships"
        subtitle="Manage internship posts and review applicants."
        action={
          <Link className="btn btn-brand" to="/company/internships/new">
            <i className="bi bi-plus-lg me-1" /> Post internship
          </Link>
        }
      />

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? <Loader /> : items.length === 0 ? (
        <div className="social-card">
          <EmptyState icon="bi-briefcase" title="No internships posted" message="Create your first internship opportunity.">
            <Link className="btn btn-brand btn-sm" to="/company/internships/new">Post internship</Link>
          </EmptyState>
        </div>
      ) : (
        <div className="opportunity-list">
          {items.map((item) => (
            <OpportunityCard
              key={item.id}
              type="INTERNSHIP"
              opportunity={item}
              onView={() => setDetail(item)}
              ownerActions={
                <>
                  <button className="btn btn-outline-primary btn-sm" onClick={() => navigate(`/company/internships/${item.id}/applicants`)}>
                    <i className="bi bi-people me-1" /> Applicants
                  </button>
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(`/company/internships/${item.id}/edit`)}>
                    <i className="bi bi-pencil me-1" /> Edit
                  </button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => remove(item.id)}>
                    <i className="bi bi-trash" />
                  </button>
                </>
              }
            />
          ))}
        </div>
      )}

      <OpportunityDetailModal
        show={Boolean(detail)}
        type="INTERNSHIP"
        opportunity={detail}
        onClose={() => setDetail(null)}
      />
    </div>
  );
}
