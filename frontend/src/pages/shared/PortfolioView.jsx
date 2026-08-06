import {
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  useNavigate,
  useParams
} from 'react-router-dom';
import { studentApi } from '../../api/studentApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import Loader from '../../components/Loader.jsx';
import Notice from '../../components/Toast.jsx';
import '../../css/PortfolioView.css';

function unwrap(response) {
  return response?.data ?? response;
}

function getInitials(name) {
  if (!name) {
    return 'ST';
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
}

function formatDate(value) {
  if (!value) {
    return 'Not specified';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium'
  }).format(date);
}

function normalizeUrl(value) {
  if (!value) {
    return '';
  }

  return /^https?:\/\//i.test(value)
    ? value
    : `https://${value}`;
}

function InfoItem({
  icon,
  label,
  value
}) {
  return (
    <div className="portfolio-info-item">
      <div className="portfolio-info-icon">
        <i className={`bi ${icon}`} />
      </div>

      <div>
        <span>{label}</span>
        <strong>{value || 'Not provided'}</strong>
      </div>
    </div>
  );
}

export default function PortfolioView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let active = true;

    const loadPortfolio = async () => {
      setLoading(true);
      setError('');

      try {
        const response =
          await studentApi.getPortfolio(id);

        if (active) {
          setData(unwrap(response));
        }
      } catch (requestError) {
        if (active) {
          setError(apiMessage(requestError));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadPortfolio();

    return () => {
      active = false;
    };
  }, [id]);

  const groupedSkills = useMemo(() => {
    const skills = Array.isArray(data?.skills)
      ? data.skills
      : [];

    return skills.reduce(
      (groups, skill) => {
        const category =
          skill.category || 'OTHER';

        if (!groups[category]) {
          groups[category] = [];
        }

        groups[category].push(skill);
        return groups;
      },
      {}
    );
  }, [data]);

  const profileCompletion = useMemo(() => {
    if (!data) return 0;

    const fields = [
      data.name,
      data.studentId,
      data.department,
      data.cgpa,
      data.contactNumber,
      data.skills?.length,
      data.projects?.length,
      data.certifications?.length
    ];

    const completed = fields.filter(
      (value) =>
        value !== null &&
        value !== undefined &&
        value !== ''
    ).length;

    return Math.round(
      (completed / fields.length) * 100
    );
  }, [data]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Notice
        type="danger"
        message={error}
      />
    );
  }

  if (!data) {
    return null;
  }

  const projects = Array.isArray(data.projects)
    ? data.projects
    : [];

  const certifications = Array.isArray(
    data.certifications
  )
    ? data.certifications
    : [];

  const skillCount = Array.isArray(data.skills)
    ? data.skills.length
    : 0;

  return (
    <div className="portfolio-view-page">
      <div className="portfolio-top-actions">
        <button
          type="button"
          className="btn btn-sm btn-light portfolio-back-btn"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left me-2" />
          Back
        </button>
 
      </div>
 <br></br> 
      <div className="portfolio-layout">
        <main className="portfolio-main-column">
          <section className="portfolio-section-card">
            <div className="portfolio-section-header">
              <div>
                <span className="portfolio-section-icon">
                  <i className="bi bi-lightning-charge" />
                </span>

                <div>
                  <h2>Skills</h2> 
                </div>
              </div>

              <span className="portfolio-count-badge">
                {skillCount}
              </span>
            </div>

            {Object.keys(groupedSkills).length >
            0 ? (
              <div className="portfolio-skill-groups">
                {Object.entries(
                  groupedSkills
                ).map(
                  ([
                    category,
                    skills
                  ]) => (
                    <div
                      className="portfolio-skill-group"
                      key={category}
                    >
                      <h3>
                        {category.replaceAll(
                          '_',
                          ' '
                        )}
                      </h3>

                      <div className="portfolio-skill-list">
                        {skills.map((skill) => (
                          <span key={skill.id}>
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="portfolio-empty">
                <i className="bi bi-lightning-charge" />
                <p>No skills listed.</p>
              </div>
            )}
          </section>

          <section className="portfolio-section-card">
            <div className="portfolio-section-header">
              <div>
                <span className="portfolio-section-icon">
                  <i className="bi bi-kanban" />
                </span>

                <div>
                  <h2>Projects</h2> 
                </div>
              </div>

              <span className="portfolio-count-badge">
                {projects.length}
              </span>
            </div>

            {projects.length > 0 ? (
              <div className="portfolio-project-list">
                {projects.map(
                  (project, index) => (
                    <article
                      className="portfolio-project-card"
                      key={project.id}
                    >
                      <div className="portfolio-project-number">
                        {String(
                          index + 1
                        ).padStart(2, '0')}
                      </div>

                      <div className="portfolio-project-content">
                        <div className="portfolio-project-title-row">
                          <h3>
                            {project.title ||
                              'Untitled project'}
                          </h3>

                          {project.link && (
                            <a
                              href={normalizeUrl(
                                project.link
                              )}
                              target="_blank"
                              rel="noreferrer"
                              className="portfolio-external-link"
                              title="Open project"
                            >
                              <i className="bi bi-box-arrow-up-right" />
                            </a>
                          )}
                        </div>

                        <p>
                          {project.description ||
                            'No description provided.'}
                        </p>

                        {project.techStack && (
                          <div className="portfolio-tech-stack">
                            {project.techStack
                              .split(',')
                              .map((item) =>
                                item.trim()
                              )
                              .filter(Boolean)
                              .map((item) => (
                                <span key={item}>
                                  {item}
                                </span>
                              ))}
                          </div>
                        )}
                      </div>
                    </article>
                  )
                )}
              </div>
            ) : (
              <div className="portfolio-empty">
                <i className="bi bi-kanban" />
                <p>No projects listed.</p>
              </div>
            )}
          </section>

          <section className="portfolio-section-card">
            <div className="portfolio-section-header">
              <div>
                <span className="portfolio-section-icon">
                  <i className="bi bi-patch-check" />
                </span>

                <div>
                  <h2>Certifications</h2> 
                </div>
              </div>

              <span className="portfolio-count-badge">
                {certifications.length}
              </span>
            </div>

            {certifications.length > 0 ? (
              <div className="portfolio-certification-list">
                {certifications.map(
                  (certification) => (
                    <article
                      className="portfolio-certification-card"
                      key={certification.id}
                    >
                      <div className="portfolio-certificate-icon">
                        <i className="bi bi-award" />
                      </div>

                      <div className="portfolio-certificate-content">
                        <div className="portfolio-certificate-title-row">
                          <div>
                            <h3>
                              {certification.name ||
                                'Unnamed certification'}
                            </h3>

                            <p>
                              Issued by{' '}
                              <strong>
                                {certification.issuer ||
                                  'Unknown issuer'}
                              </strong>
                            </p>
                          </div>

                          {certification.link && (
                            <a
                              href={normalizeUrl(
                                certification.link
                              )}
                              target="_blank"
                              rel="noreferrer"
                              className="portfolio-view-certificate"
                            >
                              View credential
                              <i className="bi bi-box-arrow-up-right" />
                            </a>
                          )}
                        </div>

                        <span className="portfolio-certificate-date">
                          <i className="bi bi-calendar-event" />
                          Issued{' '}
                          {formatDate(
                            certification.issueDate
                          )}
                        </span>
                      </div>
                    </article>
                  )
                )}
              </div>
            ) : (
              <div className="portfolio-empty">
                <i className="bi bi-patch-check" />
                <p>
                  No certifications listed.
                </p>
              </div>
            )}
          </section>
        </main>

        <aside className="portfolio-side-column">
          <section className="portfolio-side-card">
            <h2>Student information</h2>

            <div className="portfolio-info-list">
              <InfoItem
                icon="bi-person-vcard"
                label="Student Name"
                value={data.name}
              />

              <InfoItem
                icon="bi-building"
                label="Department"
                value={data.department}
              />

              <InfoItem
                icon="bi-award"
                label="CGPA"
                value={
                  data.cgpa != null
                    ? String(data.cgpa)
                    : ''
                }
              />

              <InfoItem
                icon="bi-telephone"
                label="Contact number"
                value={data.contactNumber}
              />

              {data.email && (
                <InfoItem
                  icon="bi-envelope"
                  label="Email"
                  value={data.email}
                />
              )}

              {data.address && (
                <InfoItem
                  icon="bi-geo-alt"
                  label="Address"
                  value={data.address}
                />
              )}
            </div>
          </section>
 
        </aside>
      </div>
    </div>
  );
}