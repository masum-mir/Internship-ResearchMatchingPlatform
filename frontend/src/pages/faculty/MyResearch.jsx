// import { useCallback, useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { researchApi } from '../../api/researchApi.js';
// import { apiMessage } from '../../api/axiosClient.js';
// import OpportunityCard from '../../components/OpportunityCard.jsx';
// import OpportunityDetailModal from '../../components/OpportunityDetailModal.jsx';
// import EmptyState from '../../components/EmptyState.jsx';
// import Loader from '../../components/Loader.jsx';
// import PageTitle from '../../components/PageTitle.jsx';

// export default function MyResearch() {
//   const navigate = useNavigate();
//   const [items, setItems] = useState([]);
//   const [detail, setDetail] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const load = useCallback(async () => {
//     try {
//       setItems(await researchApi.mine());
//     } catch (e) {
//       setError(apiMessage(e));
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { load(); }, [load]);

//   const remove = async (id) => {
//     if (!window.confirm('Delete this research opportunity?')) return;
//     try {
//       await researchApi.remove(id);
//       setItems((old) => old.filter((x) => x.id !== id));
//     } catch (e) {
//       setError(apiMessage(e));
//     }
//   };

//   return (
//     <div>
//       <PageTitle
//         title="My Research Posts"
//         subtitle="Manage research opportunities and review student applicants."
//         action={
//           <Link className="btn btn-brand" to="/faculty/research/new">
//             <i className="bi bi-plus-lg me-1" /> Post research
//           </Link>
//         }
//       />

//       {error && <div className="alert alert-danger">{error}</div>}

//       {loading ? <Loader /> : items.length === 0 ? (
//         <div className="social-card">
//           <EmptyState icon="bi-journal-richtext" title="No research posts yet">
//             <Link className="btn btn-brand btn-sm" to="/faculty/research/new">Post opportunity</Link>
//           </EmptyState>
//         </div>
//       ) : (
//         <div className="opportunity-list">
//           {items.map((item) => (
//             <OpportunityCard
//               key={item.id}
//               type="RESEARCH"
//               opportunity={item}
//               onView={() => setDetail(item)}
//               ownerActions={
//                 <>
//                   <button className="btn btn-outline-primary btn-sm" onClick={() => navigate(`/faculty/research/${item.id}/applicants`)}>
//                     <i className="bi bi-people me-1" /> Applicants
//                   </button>
//                   <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(`/faculty/research/${item.id}/edit`)}>
//                     <i className="bi bi-pencil me-1" /> Edit
//                   </button>
//                   <button className="btn btn-outline-danger btn-sm" onClick={() => remove(item.id)}>
//                     <i className="bi bi-trash" />
//                   </button>
//                 </>
//               }
//             />
//           ))}
//         </div>
//       )}

//       <OpportunityDetailModal
//         show={Boolean(detail)}
//         type="RESEARCH"
//         opportunity={detail}
//         onClose={() => setDetail(null)}
//       />
//     </div>
//   );
// }

import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { researchApi } from '../../api/researchApi.js';
import { apiMessage } from '../../api/axiosClient.js';

import OpportunityCard from '../../components/OpportunityCard.jsx';
import OpportunityDetailModal from '../../components/OpportunityDetailModal.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Loader from '../../components/Loader.jsx';
import PageTitle from '../../components/PageTitle.jsx';

export default function MyResearch() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [detail, setDetail] = useState(null);

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await researchApi.mine();

      console.log('MY RESEARCH RESPONSE:', response);

      const rows = Array.isArray(response)
        ? response
        : Array.isArray(response?.content)
        ? response.content
        : Array.isArray(response?.data)
        ? response.data
        : [];

      setItems(rows);
    } catch (e) {
      console.error(
        'MY RESEARCH LOAD ERROR:',
        e?.response?.status,
        e?.response?.data,
        e
      );

      setItems([]);
      setError(
        e?.response?.data?.message ||
          apiMessage(e) ||
          'Unable to load research posts.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id) => {
    const confirmed = window.confirm(
      'Delete this research opportunity?'
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError('');

    try {
      await researchApi.remove(id);

      setItems((current) =>
        current.filter((item) => item.id !== id)
      );

      if (detail?.id === id) {
        setDetail(null);
      }
    } catch (e) {
      console.error(
        'RESEARCH DELETE ERROR:',
        e?.response?.status,
        e?.response?.data,
        e
      );

      setError(
        e?.response?.data?.message ||
          apiMessage(e) ||
          'Unable to delete research post.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="page-shell">
      <PageTitle
        title="My Research Posts" 
        action={
          <Link
            className="btn btn-brand btn-sm"
            to="/faculty/research/new"
          > 
            Post research
          </Link>
        }
      />

      {error && (
        <div
          className="alert alert-danger d-flex justify-content-between align-items-center gap-3"
          role="alert"
        >
          <span>{error}</span>

          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={load}
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <div className="social-card">
          <EmptyState
            icon="bi-journal-richtext"
            title="No research posts yet"
            message="Create your first research opportunity and start receiving student applications."
          >
            <Link
              className="btn btn-brand btn-sm"
              to="/faculty/research/new"
            >
              <i className="bi bi-plus-lg me-1" />
              Post opportunity
            </Link>
          </EmptyState>
        </div>
      ) : (
        <div className="opportunity-list">
          {items.map((item) => (
            <OpportunityCard
              key={item.id}
              type="RESEARCH"
              opportunity={item}
              onView={() => setDetail(item)}
              ownerActions={
                <>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() =>
                      navigate(
                        `/faculty/research/${item.id}/applicants`
                      )
                    }
                  >
                    <i className="bi bi-people me-1" />
                    Applicants
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() =>
                      navigate(
                        `/faculty/research/${item.id}/edit`
                      )
                    }
                  >
                    <i className="bi bi-pencil me-1" />
                    Edit
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    disabled={deletingId === item.id}
                    onClick={() => remove(item.id)}
                  >
                    {deletingId === item.id ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-1"
                          aria-hidden="true"
                        />
                        Deleting
                      </>
                    ) : (
                      <i className="bi bi-trash" />
                    )}
                  </button>
                </>
              }
            />
          ))}
        </div>
      )}

      <OpportunityDetailModal
        show={Boolean(detail)}
        type="RESEARCH"
        opportunity={detail}
        onClose={() => setDetail(null)}
      />
    </div>
  );
}
