import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentApi } from '../../api/studentApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import Loader from '../../components/Loader.jsx';
import Notice from '../../components/Toast.jsx';
import { SkillChips } from '../../components/SkillChips.jsx';
import ProfileHeader from '../../components/ProfileHeader.jsx';

export default function PortfolioView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentApi.getPortfolio(id)
      .then(setData)
      .catch((e) => setError(apiMessage(e)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <Notice type="danger" message={error} />;
  if (!data) return null;

  return (
    <div style={{ maxWidth: 720 }}>
      <button className="btn btn-sm btn-light mb-3" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left me-1" /> Back
      </button>
      <ProfileHeader
        name={data.name}
        subtitle={data.department}
        meta={[data.batch && `Batch ${data.batch}`, data.cgpa != null && `CGPA ${data.cgpa}`, data.contactNumber]}
      />

      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <h6 className="text-uppercase text-muted small">Skills</h6>
          <SkillChips skills={data.skills} />
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <h6 className="text-uppercase text-muted small">Projects</h6>
          {data.projects?.length ? data.projects.map((p) => (
            <div key={p.id} className="border-bottom py-2">
              <strong>{p.title}</strong>
              {p.techStack && <span className="text-muted small ms-2">{p.techStack}</span>}
              <div className="small text-muted">{p.description}</div>
            </div>
          )) : <span className="text-muted small">No projects listed.</span>}
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h6 className="text-uppercase text-muted small">Certifications</h6>
          {data.certifications?.length ? data.certifications.map((c) => (
            <div key={c.id} className="border-bottom py-2">
              <strong>{c.name}</strong>
              <span className="text-muted small ms-2">{c.issuer}</span>
            </div>
          )) : <span className="text-muted small">No certifications listed.</span>}
        </div>
      </div>
    </div>
  );
}
