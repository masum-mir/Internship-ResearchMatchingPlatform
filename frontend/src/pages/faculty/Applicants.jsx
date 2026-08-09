import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { applicationApi } from '../../api/applicationApi.js';
import { researchApi } from '../../api/researchApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import ApplicantsPanel from '../../components/ApplicantsPanel.jsx';
import Loader from '../../components/Loader.jsx';
import PageTitle from '../../components/PageTitle.jsx';

export default function ResearchApplicants() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [p, a] = await Promise.all([
        researchApi.getById(id),
        applicationApi.researchApplicants(id)
      ]);
      setPost(p);
      setApplicants(a);
    } catch (e) {
      setError(apiMessage(e));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Loader />;

  return (
    <div>
      <PageTitle
        title={`Applicants${post?.topic ? ` — ${post.topic}` : ''}`}
        subtitle={`${applicants.length} applicant${applicants.length === 1 ? '' : 's'} sorted by match score`}
        action={<Link className="btn btn-outline-secondary btn-sm" to="/faculty/research">Back to research</Link>}
      />
      {error && <div className="alert alert-danger">{error}</div>}
      <ApplicantsPanel applicants={applicants} onReload={load} />
    </div>
  );
}
