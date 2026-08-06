import { useCallback, useEffect, useState } from 'react';
import { studentApi } from '../../api/studentApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import Loader from '../../components/Loader.jsx';
import Notice from '../../components/Toast.jsx';
import ProfileHeader from '../../components/ProfileHeader.jsx';
import '../../css/StudentProfile.css';

const CATEGORIES = ['LANGUAGE', 'FRAMEWORK', 'TOOL', 'DATABASE'];

const EMPTY_SKILL = {
  name: '',
  category: 'LANGUAGE'
};

const EMPTY_PROJECT = {
  title: '',
  description: '',
  link: '',
  techStack: ''
};

const EMPTY_CERTIFICATION = {
  name: '',
  issuer: '',
  issueDate: '',
  link: ''
};

function ProfileModal({
  show,
  title,
  subtitle,
  children,
  onClose,
  size = 'large'
}) {
  useEffect(() => {
    if (!show) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className="profile-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`profile-modal-dialog profile-modal-${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="profile-modal-header">
          <div>
            <h2>{title}</h2>

            {subtitle && (
              <p>{subtitle}</p>
            )}
          </div>

          <button
            type="button"
            className="profile-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="profile-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value, fullWidth = false }) {
  return (
    <div className={`profile-detail-item ${fullWidth ? 'full-width' : ''}`}>
      <div className="profile-detail-icon">
        <i className={`bi ${icon}`} />
      </div>

      <div className="profile-detail-content">
        <span>{label}</span>
        <strong className={!value ? 'empty-value' : ''}>
          {value || 'Not added yet'}
        </strong>
      </div>
    </div>
  );
}

function EmptySection({ icon, title, message, buttonText, onClick }) {
  return (
    <div className="profile-empty-state">
      <div className="profile-empty-icon">
        <i className={`bi ${icon}`} />
      </div>

      <h3>{title}</h3>
      <p>{message}</p>

      <button
        type="button"
        className="btn btn-outline-primary rounded-pill"
        onClick={onClick}
      >
        <i className="bi bi-plus-lg me-2" />
        {buttonText}
      </button>
    </div>
  );
}

function formatDate(date) {
  if (!date) return '';

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric'
  }).format(parsedDate);
}

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [editProfile, setEditProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [activeModal, setActiveModal] = useState(null);

  const [notice, setNotice] = useState({
    type: '',
    message: ''
  });

  const [skill, setSkill] = useState(EMPTY_SKILL);
  const [project, setProject] = useState(EMPTY_PROJECT);
  const [certification, setCertification] = useState(
    EMPTY_CERTIFICATION
  );

  const flash = useCallback((type, message) => {
    setNotice({ type, message });

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const response = await studentApi.getMyProfile();

      // Supports an Axios response or a directly returned profile.
      const profileData = response?.data ?? response;

      setProfile(profileData);
      return profileData;
    } catch (error) {
      flash('danger', apiMessage(error));
      throw error;
    }
  }, [flash]);

  useEffect(() => {
    loadProfile()
      .finally(() => setLoading(false));
  }, [loadProfile]);

  const closeModal = useCallback(() => {
    if (saving) return;
    setActiveModal(null);
  }, [saving]);

  const createProfilePayload = (source, additionalValues = {}) => ({
    name: source?.name || '',
    studentId: source?.studentId || '',
    department: source?.department || '',
    cgpa:
      source?.cgpa === '' ||
      source?.cgpa === undefined ||
      source?.cgpa === null
        ? null
        : Number(source.cgpa),
    contactNumber: source?.contactNumber || '',
    address: source?.address || '',
    profilePicture: source?.profilePicture || null,
    coverPicture: source?.coverPicture || null,
    ...additionalValues
  });

  const openDetailsModal = () => {
    setEditProfile({
      name: profile?.name || '',
      studentId: profile?.studentId || '',
      department: profile?.department || '',
     
      cgpa: profile?.cgpa ?? '',
      contactNumber: profile?.contactNumber || '',
      address: profile?.address || ''
    });

    setActiveModal('details');
  };

  const updateEditField = (field, value) => {
    setEditProfile((current) => ({
      ...current,
      [field]: value
    }));
  };

  const saveProfileDetails = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await studentApi.updateMyProfile(
        createProfilePayload(
          {
            ...profile,
            ...editProfile
          }
        )
      );

      await loadProfile();

      setActiveModal(null);
      flash('success', 'Profile information updated successfully.');
    } catch (error) {
      flash('danger', apiMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleProfileImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const uploadResponse =
        await studentApi.uploadProfileImage(file);

      const uploadData = uploadResponse?.data ?? uploadResponse;

      await studentApi.updateMyProfile(
        createProfilePayload(profile, {
          profilePicture: uploadData.filename
        })
      );

      await loadProfile();
      flash('success', 'Profile picture updated successfully.');
    } catch (error) {
      console.error(error);
      flash('danger', apiMessage(error));
    } finally {
      event.target.value = '';
    }
  };

  const handleCoverImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const uploadResponse =
        await studentApi.uploadCoverImage(file);

      const uploadData = uploadResponse?.data ?? uploadResponse;

      await studentApi.updateMyProfile(
        createProfilePayload(profile, {
          coverPicture: uploadData.filename
        })
      );

      await loadProfile();
      flash('success', 'Cover picture updated successfully.');
    } catch (error) {
      console.error(error);
      flash('danger', apiMessage(error));
    } finally {
      event.target.value = '';
    }
  };

  const addSkill = async (event) => {
    event.preventDefault();

    if (!skill.name.trim()) return;

    setSaving(true);

    try {
      await studentApi.addSkill({
        name: skill.name.trim(),
        category: skill.category
      });

      setSkill(EMPTY_SKILL);
      await loadProfile();

      flash('success', 'Skill added successfully.');
    } catch (error) {
      flash('danger', apiMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const removeSkill = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to remove this skill?'
    );

    if (!confirmed) return;

    setSaving(true);

    try {
      await studentApi.removeSkill(id);
      await loadProfile();

      flash('success', 'Skill removed successfully.');
    } catch (error) {
      flash('danger', apiMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const addProject = async (event) => {
    event.preventDefault();

    setSaving(true);

    try {
      await studentApi.addProject({
        ...project,
        title: project.title.trim(),
        description: project.description.trim(),
        techStack: project.techStack.trim(),
        link: project.link.trim()
      });

      setProject(EMPTY_PROJECT);
      await loadProfile();

      setActiveModal(null);
      flash('success', 'Project added successfully.');
    } catch (error) {
      flash('danger', apiMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this project?'
    );

    if (!confirmed) return;

    setSaving(true);

    try {
      await studentApi.deleteProject(id);
      await loadProfile();

      flash('success', 'Project deleted successfully.');
    } catch (error) {
      flash('danger', apiMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const addCertification = async (event) => {
    event.preventDefault();

    setSaving(true);

    try {
      await studentApi.addCertification({
        ...certification,
        name: certification.name.trim(),
        issuer: certification.issuer.trim(),
        link: certification.link.trim(),
        issueDate: certification.issueDate || null
      });

      setCertification(EMPTY_CERTIFICATION);
      await loadProfile();

      setActiveModal(null);
      flash('success', 'Certification added successfully.');
    } catch (error) {
      flash('danger', apiMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const deleteCertification = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this certification?'
    );

    if (!confirmed) return;

    setSaving(true);

    try {
      await studentApi.deleteCertification(id);
      await loadProfile();

      flash('success', 'Certification deleted successfully.');
    } catch (error) {
      flash('danger', apiMessage(error));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!profile) {
    return (
      <Notice
        type="danger"
        message={
          notice.message ||
          'Could not load your student profile.'
        }
      />
    );
  }

  return (
    <div className="student-profile-page">
      <Notice
        type={notice.type}
        message={notice.message}
        onClose={() =>
          setNotice({
            type: '',
            message: ''
          })
        }
      />

      {/* Profile introduction */}
      <div className="student-profile-header">
        <ProfileHeader
          name={profile.name}
          subtitle={
            profile.studentId
              ? `Student ID ${profile.studentId}`
              : 'Complete your profile'
          }
          meta={[
            profile.department,
            profile.cgpa != null && `CGPA ${profile.cgpa}`,
            profile.email
          ].filter(Boolean)}
          profilePicture={profile.profilePicture}
          coverPicture={profile.coverPicture}
          onProfileImageUpload={handleProfileImageUpload}
          onCoverImageUpload={handleCoverImageUpload}
        />

        <button
          type="button"
          className="profile-main-edit-button"
          onClick={openDetailsModal}
        >
          <i className="bi bi-pencil-fill" />
          <span>Edit profile</span>
        </button>
      </div>

      <div className="profile-content-layout">
        <main className="profile-main-column">
          {/* About / Details */}
          <section className="profile-section-card">
            <div className="profile-section-header">
              <div>
                <h2>About</h2>
                <p>Your academic and personal information</p>
              </div>

              <button
                type="button"
                className="profile-section-edit"
                onClick={openDetailsModal}
                title="Edit profile details"
              >
                <i className="bi bi-pencil" />
              </button>
            </div>

            <div className="profile-details-grid">
              <DetailItem
                icon="bi-person"
                label="Full name"
                value={profile.name}
              />

              <DetailItem
                icon="bi-person-vcard"
                label="Student ID"
                value={profile.studentId}
              />

              <DetailItem
                icon="bi-building"
                label="Department"
                value={profile.department}
              />

              <DetailItem
                icon="bi-mortarboard"
                label="CGPA"
                value={
                  profile.cgpa !== null &&
                  profile.cgpa !== undefined
                    ? `${profile.cgpa} / 4.00`
                    : ''
                }
              />

              <DetailItem
                icon="bi-envelope"
                label="Email"
                value={profile.email}
              />

              <DetailItem
                icon="bi-telephone"
                label="Contact number"
                value={profile.contactNumber}
              />

              <DetailItem
                icon="bi-geo-alt"
                label="Address"
                value={profile.address}
              />
            </div>
          </section>

          {/* Projects */}
          <section className="profile-section-card">
            <div className="profile-section-header">
              <div>
                <h2>Projects</h2>
                <p>Showcase your practical experience</p>
              </div>

              <button
                type="button"
                className="profile-section-action"
                onClick={() => setActiveModal('project')}
              >
                <i className="bi bi-plus-lg" />
                Add project
              </button>
            </div>

            {profile.projects?.length ? (
              <div className="profile-project-list">
                {profile.projects.map((item) => (
                  <article
                    key={item.id}
                    className="profile-project-item"
                  >
                    <div className="project-logo">
                      <i className="bi bi-folder2-open" />
                    </div>

                    <div className="project-information">
                      <div className="project-title-row">
                        <div>
                          <h3>{item.title}</h3>

                          {item.techStack && (
                            <div className="project-tech-stack">
                              {item.techStack}
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          className="profile-delete-button"
                          onClick={() =>
                            deleteProject(item.id)
                          }
                          aria-label={`Delete ${item.title}`}
                          title="Delete project"
                        >
                          <i className="bi bi-trash3" />
                        </button>
                      </div>

                      {item.description && (
                        <p>{item.description}</p>
                      )}

                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="profile-external-link"
                        >
                          View project
                          <i className="bi bi-box-arrow-up-right" />
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptySection
                icon="bi-folder-plus"
                title="No projects added"
                message="Add academic or personal projects to demonstrate your skills."
                buttonText="Add your first project"
                onClick={() => setActiveModal('project')}
              />
            )}
          </section>

          {/* Certifications */}
          <section className="profile-section-card">
            <div className="profile-section-header">
              <div>
                <h2>Licences & certifications</h2>
                <p>Add courses, training and achievements</p>
              </div>

              <button
                type="button"
                className="profile-section-action"
                onClick={() => setActiveModal('certification')}
              >
                <i className="bi bi-plus-lg" />
                Add certification
              </button>
            </div>

            {profile.certifications?.length ? (
              <div className="profile-certification-list">
                {profile.certifications.map((item) => (
                  <article
                    key={item.id}
                    className="profile-certification-item"
                  >
                    <div className="certification-logo">
                      <i className="bi bi-patch-check-fill" />
                    </div>

                    <div className="certification-information">
                      <div className="certification-title-row">
                        <div>
                          <h3>{item.name}</h3>

                          {item.issuer && (
                            <p className="certification-issuer">
                              {item.issuer}
                            </p>
                          )}

                          {item.issueDate && (
                            <p className="certification-date">
                              Issued {formatDate(item.issueDate)}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          className="profile-delete-button"
                          onClick={() =>
                            deleteCertification(item.id)
                          }
                          aria-label={`Delete ${item.name}`}
                          title="Delete certification"
                        >
                          <i className="bi bi-trash3" />
                        </button>
                      </div>

                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="credential-button"
                        >
                          Show credential
                          <i className="bi bi-box-arrow-up-right" />
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptySection
                icon="bi-award"
                title="No certifications added"
                message="Add professional certifications and completed training."
                buttonText="Add certification"
                onClick={() =>
                  setActiveModal('certification')
                }
              />
            )}
          </section>
        </main>

        <aside className="profile-side-column">
          {/* Skills */}
          <section className="profile-section-card profile-sticky-card">
            <div className="profile-section-header">
              <div>
                <h2>Skills</h2>
                <p>Technologies you know</p>
              </div>

              <button
                type="button"
                className="profile-section-edit"
                onClick={() => setActiveModal('skills')}
                title="Manage skills"
              >
                <i className="bi bi-pencil" />
              </button>
            </div>

            {profile.skills?.length ? (
              <div className="profile-skill-list">
                {profile.skills.map((item) => (
                  <div
                    key={item.id}
                    className="profile-skill-chip"
                  >
                    <span>{item.name}</span>

                    {item.category && (
                      <small>{item.category}</small>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="skills-empty">
                <i className="bi bi-lightbulb" />
                <p>No skills added yet.</p>

                <button
                  type="button"
                  onClick={() => setActiveModal('skills')}
                >
                  Add skills
                </button>
              </div>
            )}
          </section>

          {/* Profile strength */}
          <section className="profile-section-card profile-strength-card">
            <div className="profile-strength-heading">
              <div>
                <h2>Profile strength</h2>
                <p>Complete your profile to get better matches.</p>
              </div>

              <i className="bi bi-graph-up-arrow" />
            </div>

            <div className="profile-strength-progress">
              <div
                className="profile-strength-value"
                style={{
                  width: `${
                    [
                      profile.name,
                      profile.studentId,
                      profile.department,
                      profile.cgpa,
                      profile.contactNumber,
                      profile.address,
                      profile.skills?.length,
                      profile.projects?.length,
                      profile.certifications?.length
                    ].filter(Boolean).length * 10
                  }%`
                }}
              />
            </div>

            <small>
              {
                [
                  profile.name,
                  profile.studentId,
                  profile.department,
                  profile.cgpa,
                  profile.contactNumber,
                  profile.address,
                  profile.skills?.length,
                  profile.projects?.length,
                  profile.certifications?.length
                ].filter(Boolean).length * 10
              }
              % complete
            </small>
          </section>
        </aside>
      </div>

      {/* Details modal */}
      <ProfileModal
        show={activeModal === 'details'}
        title="Edit profile information"
        subtitle="Update the information shown on your profile."
        onClose={closeModal}
      >
        {editProfile && (
          <form onSubmit={saveProfileDetails}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">
                  Full name
                </label>

                <input
                  type="text"
                  className="form-control"
                  required
                  value={editProfile.name}
                  onChange={(event) =>
                    updateEditField(
                      'name',
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Student ID
                </label>

                <input
                  type="text"
                  className="form-control"
                  required
                  value={editProfile.studentId}
                  onChange={(event) =>
                    updateEditField(
                      'studentId',
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">
                  Department
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={editProfile.department}
                  onChange={(event) =>
                    updateEditField(
                      'department',
                      event.target.value
                    )
                  }
                />
              </div>
  
              <div className="col-md-4">
                <label className="form-label">
                  CGPA
                </label>

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  className="form-control"
                  value={editProfile.cgpa}
                  onChange={(event) =>
                    updateEditField(
                      'cgpa',
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Contact number
                </label>

                <input
                  type="tel"
                  className="form-control"
                  value={editProfile.contactNumber}
                  onChange={(event) =>
                    updateEditField(
                      'contactNumber',
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Address
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={editProfile.address}
                  onChange={(event) =>
                    updateEditField(
                      'address',
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="profile-modal-footer">
              <button
                type="button"
                className="btn btn-light rounded-pill px-4"
                onClick={closeModal}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary rounded-pill px-4"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Saving
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-2" />
                    Update
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </ProfileModal>

      {/* Skills modal */}
      <ProfileModal
        show={activeModal === 'skills'}
        title="Manage skills"
        subtitle="Add or remove skills from your profile."
        onClose={closeModal}
      >
        <div className="modal-existing-items">
          <h3>Current skills</h3>

          {profile.skills?.length ? (
            <div className="modal-skill-list">
              {profile.skills.map((item) => (
                <div
                  key={item.id}
                  className="modal-skill-item"
                >
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.category}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeSkill(item.id)}
                    disabled={saving}
                    aria-label={`Remove ${item.name}`}
                  >
                    <i className="bi bi-x-lg" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted small">
              You have not added any skills.
            </p>
          )}
        </div>

        <div className="modal-divider" />

        <form onSubmit={addSkill}>
          <h3 className="modal-form-title">Add a new skill</h3>

          <div className="row g-3">
            <div className="col-md-7">
              <label className="form-label">
                Skill name
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="For example: React"
                required
                value={skill.name}
                onChange={(event) =>
                  setSkill((current) => ({
                    ...current,
                    name: event.target.value
                  }))
                }
              />
            </div>

            <div className="col-md-5">
              <label className="form-label">
                Category
              </label>

              <select
                className="form-select"
                value={skill.category}
                onChange={(event) =>
                  setSkill((current) => ({
                    ...current,
                    category: event.target.value
                  }))
                }
              >
                {CATEGORIES.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="profile-modal-footer">
            <button
              type="button"
              className="btn btn-light rounded-pill px-4"
              onClick={closeModal}
              disabled={saving}
            >
              Done
            </button>

            <button
              type="submit"
              className="btn btn-primary rounded-pill px-4"
              disabled={saving}
            >
              <i className="bi bi-plus-lg me-2" />
              Add skill
            </button>
          </div>
        </form>
      </ProfileModal>

      {/* Project modal */}
      <ProfileModal
        show={activeModal === 'project'}
        title="Add project"
        subtitle="Showcase a project that demonstrates your experience."
        onClose={closeModal}
      >
        <form onSubmit={addProject}>
          <div className="row g-3">
            <div className="col-md-7">
              <label className="form-label">
                Project title
              </label>

              <input
                type="text"
                className="form-control"
                required
                placeholder="For example: Internship Matching Platform"
                value={project.title}
                onChange={(event) =>
                  setProject((current) => ({
                    ...current,
                    title: event.target.value
                  }))
                }
              />
            </div>

            <div className="col-md-5">
              <label className="form-label">
                Technology stack
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="React, Spring Boot, MySQL"
                value={project.techStack}
                onChange={(event) =>
                  setProject((current) => ({
                    ...current,
                    techStack: event.target.value
                  }))
                }
              />
            </div>

            <div className="col-12">
              <label className="form-label">
                Project link
              </label>

              <input
                type="url"
                className="form-control"
                placeholder="https://github.com/username/project"
                value={project.link}
                onChange={(event) =>
                  setProject((current) => ({
                    ...current,
                    link: event.target.value
                  }))
                }
              />
            </div>

            <div className="col-12">
              <label className="form-label">
                Description
              </label>

              <textarea
                className="form-control"
                rows="5"
                placeholder="Explain the project, your role and its main features."
                value={project.description}
                onChange={(event) =>
                  setProject((current) => ({
                    ...current,
                    description: event.target.value
                  }))
                }
              />
            </div>
          </div>

          <div className="profile-modal-footer">
            <button
              type="button"
              className="btn btn-light rounded-pill px-4"
              onClick={closeModal}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary rounded-pill px-4"
              disabled={saving}
            >
              {saving ? 'Adding...' : 'Add project'}
            </button>
          </div>
        </form>
      </ProfileModal>

      {/* Certification modal */}
      <ProfileModal
        show={activeModal === 'certification'}
        title="Add certification"
        subtitle="Add a professional certification or completed course."
        onClose={closeModal}
      >
        <form onSubmit={addCertification}>
          <div className="row g-3">
            <div className="col-md-7">
              <label className="form-label">
                Certification name
              </label>

              <input
                type="text"
                className="form-control"
                required
                placeholder="For example: AWS Cloud Practitioner"
                value={certification.name}
                onChange={(event) =>
                  setCertification((current) => ({
                    ...current,
                    name: event.target.value
                  }))
                }
              />
            </div>

            <div className="col-md-5">
              <label className="form-label">
                Issuing organization
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="For example: Amazon Web Services"
                value={certification.issuer}
                onChange={(event) =>
                  setCertification((current) => ({
                    ...current,
                    issuer: event.target.value
                  }))
                }
              />
            </div>

            <div className="col-md-5">
              <label className="form-label">
                Issue date
              </label>

              <input
                type="date"
                className="form-control"
                value={certification.issueDate}
                onChange={(event) =>
                  setCertification((current) => ({
                    ...current,
                    issueDate: event.target.value
                  }))
                }
              />
            </div>

            <div className="col-md-7">
              <label className="form-label">
                Credential link
              </label>

              <input
                type="url"
                className="form-control"
                placeholder="https://..."
                value={certification.link}
                onChange={(event) =>
                  setCertification((current) => ({
                    ...current,
                    link: event.target.value
                  }))
                }
              />
            </div>
          </div>

          <div className="profile-modal-footer">
            <button
              type="button"
              className="btn btn-light rounded-pill px-4"
              onClick={closeModal}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary rounded-pill px-4"
              disabled={saving}
            >
              {saving ? 'Adding...' : 'Add certification'}
            </button>
          </div>
        </form>
      </ProfileModal>
    </div>
  );
}