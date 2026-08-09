import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { studentApi } from '../../api/studentApi.js';
import { endorsementApi } from '../../api/endorsementApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import { resolveUploadUrl } from '../../utils/imageUrl.js';
import { formatDate } from '../../utils/format.js';
import Loader from '../../components/Loader.jsx';
import ProfileHeader from '../../components/ProfileHeader.jsx';
import EmptyState from '../../components/EmptyState.jsx';

export default function PortfolioView() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [endorsementCounts, setEndorsementCounts] = useState({});
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    try {
      const data = await studentApi.getPortfolio(id);
      setP(data);

      const pairs = await Promise.all(
        (data.skills || []).map(async (skill) => {
          try {
            const list = await endorsementApi.list(data.studentId, skill.id);
            return [skill.id, list.length];
          } catch (_) {
            return [skill.id, 0];
          }
        })
      );
      setEndorsementCounts(Object.fromEntries(pairs));
    } catch (e) {
      setNotice(apiMessage(e));
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const endorse = async (skill) => {
    try {
      await endorsementApi.endorse(p.studentId, skill.id);
      await load();
      setNotice(`Endorsed ${skill.name}.`);
    } catch (e) {
      setNotice(apiMessage(e));
    }
  };

  if (!p && !notice) return <Loader />;
  if (!p) return <div className="alert alert-danger">{notice}</div>;

  return (
    <div className="portfolio-page">
      {notice && <div className="alert alert-info">{notice}</div>}

      <ProfileHeader
        name={p.name}
        subtitle={p.headline || 'Student portfolio'}
        meta={[p.email]}
        profilePicture={p.profilePicture}
        actions={
          <Link className="btn btn-outline-primary btn-sm" to={`/profile/${p.userId}`}>
            Public profile
          </Link>
        }
      />

      <section className="social-card profile-section">
        <h5>About</h5>
        <p className="pre-line">{p.bio || 'No bio added.'}</p>
        <div className="profile-contact-grid">
          {p.contactNumber && <span><i className="bi bi-telephone" /> {p.contactNumber}</span>}
          {p.address && <span><i className="bi bi-geo-alt" /> {p.address}</span>}
          {p.resumeUrl && <a href={resolveUploadUrl(p.resumeUrl)} target="_blank" rel="noreferrer"><i className="bi bi-file-earmark-pdf" /> Resume</a>}
          {p.portfolioUrl && <a href={p.portfolioUrl} target="_blank" rel="noreferrer"><i className="bi bi-globe" /> Portfolio</a>}
          {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer"><i className="bi bi-github" /> GitHub</a>}
          {p.linkedinUrl && <a href={p.linkedinUrl} target="_blank" rel="noreferrer"><i className="bi bi-linkedin" /> LinkedIn</a>}
        </div>
      </section>

      <section className="social-card profile-section">
        <h5>Skills & endorsements</h5>
        {p.skills?.length ? (
          <div className="portfolio-skills">
            {p.skills.map((skill) => (
              <div className="portfolio-skill" key={skill.id}>
                <div>
                  <strong>{skill.name}</strong>
                  <div className="small text-muted">{skill.category} · {endorsementCounts[skill.id] || 0} endorsements</div>
                </div>
                <button className="btn btn-outline-primary btn-sm" onClick={() => endorse(skill)}>
                  <i className="bi bi-patch-check me-1" /> Endorse
                </button>
              </div>
            ))}
          </div>
        ) : <EmptyState icon="bi-lightning" title="No skills added" />}
      </section>

      <section className="social-card profile-section">
        <h5>Projects</h5>
        {p.projects?.length ? (
          <div className="profile-entry-list">
            {p.projects.map((project) => (
              <div className="profile-entry" key={project.id}>
                <div className="profile-entry-icon"><i className="bi bi-kanban-fill" /></div>
                <div>
                  <h6>{project.title}</h6>
                  {project.techStack && <div className="text-muted small">{project.techStack}</div>}
                  {project.description && <p className="pre-line mt-2">{project.description}</p>}
                  <div className="d-flex gap-3 small">
                    {project.link && <a href={project.link} target="_blank" rel="noreferrer">Project</a>}
                    {project.repositoryUrl && <a href={project.repositoryUrl} target="_blank" rel="noreferrer">Repository</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : <EmptyState icon="bi-kanban" title="No projects" />}
      </section>

      <section className="social-card profile-section">
        <h5>Certifications</h5>
        {p.certifications?.length ? (
          <div className="profile-entry-list">
            {p.certifications.map((cert) => (
              <div className="profile-entry" key={cert.id}>
                <div className="profile-entry-icon"><i className="bi bi-patch-check-fill" /></div>
                <div>
                  <h6>{cert.name}</h6>
                  <div>{cert.issuer}</div>
                  <div className="text-muted small">
                    {formatDate(cert.issueDate)} {cert.credentialId ? ` · ID ${cert.credentialId}` : ''}
                  </div>
                  {cert.link && <a href={cert.link} target="_blank" rel="noreferrer" className="small">Show credential</a>}
                </div>
              </div>
            ))}
          </div>
        ) : <EmptyState icon="bi-patch-check" title="No certifications" />}
      </section>
    </div>
  );
}
