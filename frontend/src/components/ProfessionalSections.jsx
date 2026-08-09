// import { useCallback, useEffect, useState } from 'react';
// import { professionalProfileApi } from '../api/professionalProfileApi.js';
// import { apiMessage } from '../api/axiosClient.js';
// import { enumLabel, formatDate } from '../utils/format.js';
// import EmptyState from './EmptyState.jsx';
// import Modal from './Modal.jsx';

// const EMPTY_EDUCATION = {
//   institution: '',
//   degree: '',
//   fieldOfStudy: '',
//   startDate: '',
//   endDate: '',
//   description: ''
// };

// const EMPTY_EXPERIENCE = {
//   title: '',
//   organizationName: '',
//   employmentType: 'FULL_TIME',
//   location: '',
//   startDate: '',
//   endDate: '',
//   currentlyWorking: false,
//   description: ''
// };

// function SectionHeader({ title, subtitle, onAdd }) {
//   return (
//     <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
//       <div>
//         <h5 className="mb-1">{title}</h5>
//         {subtitle && <div className="text-muted small">{subtitle}</div>}
//       </div>
//       {onAdd && (
//         <button className="btn btn-outline-primary btn-sm" type="button" onClick={onAdd}>
//           <i className="bi bi-plus-lg me-1" /> Add
//         </button>
//       )}
//     </div>
//   );
// }

// export default function ProfessionalSections({ userId = null, editable = false }) {
//   const [profile, setProfile] = useState(null);
//   const [educationForm, setEducationForm] = useState(null);
//   const [experienceForm, setExperienceForm] = useState(null);
//   const [editingEducationId, setEditingEducationId] = useState(null);
//   const [editingExperienceId, setEditingExperienceId] = useState(null);
//   const [notice, setNotice] = useState('');
//   const [busy, setBusy] = useState(false);

//   const load = useCallback(async () => {
//     try {
//       const data = editable
//         ? await professionalProfileApi.me()
//         : await professionalProfileApi.get(userId);
//       setProfile(data);
//     } catch (e) {
//       setNotice(apiMessage(e));
//     }
//   }, [editable, userId]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const education = profile?.education || [];
//   const experience = profile?.experience || [];

//   const saveEducation = async (event) => {
//     event.preventDefault();
//     setBusy(true);
//     setNotice('');
//     try {
//       if (editingEducationId) {
//         await professionalProfileApi.updateEducation(editingEducationId, educationForm);
//       } else {
//         await professionalProfileApi.addEducation(educationForm);
//       }
//       setEducationForm(null);
//       setEditingEducationId(null);
//       await load();
//     } catch (e) {
//       setNotice(apiMessage(e));
//     } finally {
//       setBusy(false);
//     }
//   };

//   const saveExperience = async (event) => {
//     event.preventDefault();
//     setBusy(true);
//     setNotice('');
//     try {
//       const body = {
//         ...experienceForm,
//         endDate: experienceForm.currentlyWorking ? null : experienceForm.endDate || null
//       };
//       if (editingExperienceId) {
//         await professionalProfileApi.updateExperience(editingExperienceId, body);
//       } else {
//         await professionalProfileApi.addExperience(body);
//       }
//       setExperienceForm(null);
//       setEditingExperienceId(null);
//       await load();
//     } catch (e) {
//       setNotice(apiMessage(e));
//     } finally {
//       setBusy(false);
//     }
//   };

//   const deleteEducation = async (id) => {
//     if (!window.confirm('Remove this education entry?')) return;
//     try {
//       await professionalProfileApi.deleteEducation(id);
//       await load();
//     } catch (e) {
//       setNotice(apiMessage(e));
//     }
//   };

//   const deleteExperience = async (id) => {
//     if (!window.confirm('Remove this experience entry?')) return;
//     try {
//       await professionalProfileApi.deleteExperience(id);
//       await load();
//     } catch (e) {
//       setNotice(apiMessage(e));
//     }
//   };

//   return (
//     <>
//       {notice && <div className="alert alert-danger py-2">{notice}</div>}

//       <section className="social-card profile-section">
//         <SectionHeader
//           title="Experience"
//           subtitle="Professional, research, volunteer and freelance experience"
//           onAdd={editable ? () => {
//             setEditingExperienceId(null);
//             setExperienceForm(EMPTY_EXPERIENCE);
//           } : null}
//         />

//         {experience.length === 0 ? (
//           <EmptyState
//             icon="bi-briefcase"
//             title="No experience added"
//             message={editable ? 'Add experience to make your professional profile stronger.' : null}
//           />
//         ) : (
//           <div className="timeline-list">
//             {experience.map((item) => (
//               <div className="timeline-item" key={item.id}>
//                 <div className="timeline-icon"><i className="bi bi-briefcase-fill" /></div>
//                 <div className="flex-grow-1">
//                   <div className="d-flex justify-content-between gap-2">
//                     <div>
//                       <h6 className="mb-1">{item.title}</h6>
//                       <div className="fw-semibold">{item.organizationName}</div>
//                       <div className="text-muted small">
//                         {enumLabel(item.employmentType)}
//                         {item.location ? ` · ${item.location}` : ''}
//                       </div>
//                       <div className="text-muted small">
//                         {formatDate(item.startDate, { day: false })} –{' '}
//                         {item.currentlyWorking ? 'Present' : formatDate(item.endDate, { day: false })}
//                       </div>
//                     </div>
//                     {editable && (
//                       <div className="d-flex gap-1">
//                         <button
//                           type="button"
//                           className="icon-button"
//                           onClick={() => {
//                             setEditingExperienceId(item.id);
//                             setExperienceForm({
//                               ...item,
//                               startDate: item.startDate || '',
//                               endDate: item.endDate || ''
//                             });
//                           }}
//                         >
//                           <i className="bi bi-pencil" />
//                         </button>
//                         <button
//                           type="button"
//                           className="icon-button text-danger"
//                           onClick={() => deleteExperience(item.id)}
//                         >
//                           <i className="bi bi-trash" />
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                   {item.description && <p className="mt-2 mb-0 pre-line">{item.description}</p>}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       <section className="social-card profile-section">
//         <SectionHeader
//           title="Education"
//           subtitle="Academic background and qualifications"
//           onAdd={editable ? () => {
//             setEditingEducationId(null);
//             setEducationForm(EMPTY_EDUCATION);
//           } : null}
//         />

//         {education.length === 0 ? (
//           <EmptyState
//             icon="bi-mortarboard"
//             title="No education added"
//             message={editable ? 'Add your academic history.' : null}
//           />
//         ) : (
//           <div className="timeline-list">
//             {education.map((item) => (
//               <div className="timeline-item" key={item.id}>
//                 <div className="timeline-icon"><i className="bi bi-mortarboard-fill" /></div>
//                 <div className="flex-grow-1">
//                   <div className="d-flex justify-content-between gap-2">
//                     <div>
//                       <h6 className="mb-1">{item.institution}</h6>
//                       <div className="fw-semibold">
//                         {[item.degree, item.fieldOfStudy].filter(Boolean).join(', ')}
//                       </div>
//                       <div className="text-muted small">
//                         {formatDate(item.startDate, { day: false })} – {formatDate(item.endDate, { day: false })}
//                       </div>
//                     </div>
//                     {editable && (
//                       <div className="d-flex gap-1">
//                         <button
//                           type="button"
//                           className="icon-button"
//                           onClick={() => {
//                             setEditingEducationId(item.id);
//                             setEducationForm({
//                               ...item,
//                               startDate: item.startDate || '',
//                               endDate: item.endDate || ''
//                             });
//                           }}
//                         >
//                           <i className="bi bi-pencil" />
//                         </button>
//                         <button
//                           type="button"
//                           className="icon-button text-danger"
//                           onClick={() => deleteEducation(item.id)}
//                         >
//                           <i className="bi bi-trash" />
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                   {item.description && <p className="mt-2 mb-0 pre-line">{item.description}</p>}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       <Modal
//         show={Boolean(educationForm)}
//         title={editingEducationId ? 'Edit education' : 'Add education'}
//         onClose={() => setEducationForm(null)}
//       >
//         {educationForm && (
//           <form onSubmit={saveEducation}>
//             <div className="mb-3">
//               <label className="form-label">Institution</label>
//               <input
//                 className="form-control"
//                 required
//                 value={educationForm.institution}
//                 onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })}
//               />
//             </div>
//             <div className="row g-3 mb-3">
//               <div className="col-md-6">
//                 <label className="form-label">Degree</label>
//                 <input
//                   className="form-control"
//                   value={educationForm.degree || ''}
//                   onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
//                 />
//               </div>
//               <div className="col-md-6">
//                 <label className="form-label">Field of study</label>
//                 <input
//                   className="form-control"
//                   value={educationForm.fieldOfStudy || ''}
//                   onChange={(e) => setEducationForm({ ...educationForm, fieldOfStudy: e.target.value })}
//                 />
//               </div>
//               <div className="col-md-6">
//                 <label className="form-label">Start date</label>
//                 <input
//                   type="date"
//                   className="form-control"
//                   value={educationForm.startDate || ''}
//                   onChange={(e) => setEducationForm({ ...educationForm, startDate: e.target.value })}
//                 />
//               </div>
//               <div className="col-md-6">
//                 <label className="form-label">End date</label>
//                 <input
//                   type="date"
//                   className="form-control"
//                   value={educationForm.endDate || ''}
//                   onChange={(e) => setEducationForm({ ...educationForm, endDate: e.target.value })}
//                 />
//               </div>
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Description</label>
//               <textarea
//                 className="form-control"
//                 rows={4}
//                 value={educationForm.description || ''}
//                 onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })}
//               />
//             </div>
//             <div className="d-flex justify-content-end gap-2">
//               <button type="button" className="btn btn-outline-secondary" onClick={() => setEducationForm(null)}>
//                 Cancel
//               </button>
//               <button className="btn btn-brand" disabled={busy}>Save</button>
//             </div>
//           </form>
//         )}
//       </Modal>

//       <Modal
//         show={Boolean(experienceForm)}
//         title={editingExperienceId ? 'Edit experience' : 'Add experience'}
//         onClose={() => setExperienceForm(null)}
//         size="lg"
//       >
//         {experienceForm && (
//           <form onSubmit={saveExperience}>
//             <div className="row g-3">
//               <div className="col-md-6">
//                 <label className="form-label">Title</label>
//                 <input
//                   className="form-control"
//                   required
//                   value={experienceForm.title}
//                   onChange={(e) => setExperienceForm({ ...experienceForm, title: e.target.value })}
//                 />
//               </div>
//               <div className="col-md-6">
//                 <label className="form-label">Organization</label>
//                 <input
//                   className="form-control"
//                   required
//                   value={experienceForm.organizationName}
//                   onChange={(e) => setExperienceForm({ ...experienceForm, organizationName: e.target.value })}
//                 />
//               </div>
//               <div className="col-md-6">
//                 <label className="form-label">Employment type</label>
//                 <select
//                   className="form-select"
//                   value={experienceForm.employmentType || 'FULL_TIME'}
//                   onChange={(e) => setExperienceForm({ ...experienceForm, employmentType: e.target.value })}
//                 >
//                   {['INTERNSHIP', 'FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY', 'VOLUNTEER', 'FREELANCE'].map((x) => (
//                     <option key={x} value={x}>{enumLabel(x)}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="col-md-6">
//                 <label className="form-label">Location</label>
//                 <input
//                   className="form-control"
//                   value={experienceForm.location || ''}
//                   onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })}
//                 />
//               </div>
//               <div className="col-md-6">
//                 <label className="form-label">Start date</label>
//                 <input
//                   type="date"
//                   className="form-control"
//                   value={experienceForm.startDate || ''}
//                   onChange={(e) => setExperienceForm({ ...experienceForm, startDate: e.target.value })}
//                 />
//               </div>
//               <div className="col-md-6">
//                 <label className="form-label">End date</label>
//                 <input
//                   type="date"
//                   className="form-control"
//                   disabled={experienceForm.currentlyWorking}
//                   value={experienceForm.endDate || ''}
//                   onChange={(e) => setExperienceForm({ ...experienceForm, endDate: e.target.value })}
//                 />
//               </div>
//               <div className="col-12">
//                 <div className="form-check">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     id="currentlyWorking"
//                     checked={Boolean(experienceForm.currentlyWorking)}
//                     onChange={(e) => setExperienceForm({
//                       ...experienceForm,
//                       currentlyWorking: e.target.checked,
//                       endDate: e.target.checked ? '' : experienceForm.endDate
//                     })}
//                   />
//                   <label className="form-check-label" htmlFor="currentlyWorking">
//                     I currently work here
//                   </label>
//                 </div>
//               </div>
//               <div className="col-12">
//                 <label className="form-label">Description</label>
//                 <textarea
//                   className="form-control"
//                   rows={4}
//                   value={experienceForm.description || ''}
//                   onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
//                 />
//               </div>
//             </div>
//             <div className="d-flex justify-content-end gap-2 mt-4">
//               <button type="button" className="btn btn-outline-secondary" onClick={() => setExperienceForm(null)}>
//                 Cancel
//               </button>
//               <button className="btn btn-brand" disabled={busy}>Save</button>
//             </div>
//           </form>
//         )}
//       </Modal>
//     </>
//   );
// }


import { useCallback, useEffect, useState } from 'react';
import { professionalProfileApi } from '../api/professionalProfileApi.js';
import { apiMessage } from '../api/axiosClient.js';
import { useAuth } from '../auth/AuthContext.jsx';
import { formatDate } from '../utils/format.js';
import Modal from './Modal.jsx';
import EmptyState from './EmptyState.jsx';
import Notice from './Toast.jsx';

const EMPTY_EDUCATION = {
  institution: '',
  degree: '',
  fieldOfStudy: '',
  startDate: '',
  endDate: '',
  description: ''
};

const EMPTY_EXPERIENCE = {
  title: '',
  organizationName: '',
  employmentType: 'INTERNSHIP',
  location: '',
  startDate: '',
  endDate: '',
  currentlyWorking: false,
  description: ''
};

const EMPLOYMENT_TYPES = [
  'FULL_TIME',
  'PART_TIME',
  'INTERNSHIP',
  'CONTRACT',
  'FREELANCE',
  'VOLUNTEER'
];

function unwrapArray(value) {
  const data = value?.data ?? value;
  return Array.isArray(data) ? data : [];
}

function toFormDate(value) {
  if (!value) return '';
  return String(value).slice(0, 10);
}

export default function ProfessionalSections({
  userId = null,
  editable = false
}) {
  const { user } = useAuth();

  const resolvedUserId =
    userId ?? user?.userId ?? user?.id ?? null;

  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [notice, setNotice] = useState({
    type: '',
    message: ''
  });

  const [educationForm, setEducationForm] = useState(null);
  const [educationId, setEducationId] = useState(null);

  const [experienceForm, setExperienceForm] = useState(null);
  const [experienceId, setExperienceId] = useState(null);

  const load = useCallback(async () => {
    if (!resolvedUserId) {
      setEducation([]);
      setExperience([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const [educationResponse, experienceResponse] =
        await Promise.all([
          professionalProfileApi.getEducation(resolvedUserId),
          professionalProfileApi.getExperience(resolvedUserId)
        ]);

      setEducation(unwrapArray(educationResponse));
      setExperience(unwrapArray(experienceResponse));
    } catch (error) {
      setNotice({
        type: 'danger',
        message: apiMessage(error)
      });
    } finally {
      setLoading(false);
    }
  }, [resolvedUserId]);

  useEffect(() => {
    load();
  }, [load]);

  const flash = (type, message) => {
    setNotice({ type, message });
  };

  /* ======================================================
     EDUCATION
  ====================================================== */

  const openAddEducation = () => {
    setEducationId(null);
    setEducationForm({ ...EMPTY_EDUCATION });
  };

  const openEditEducation = (item) => {
    setEducationId(item.id);

    setEducationForm({
      institution: item.institution || '',
      degree: item.degree || '',
      fieldOfStudy: item.fieldOfStudy || '',
      startDate: toFormDate(item.startDate),
      endDate: toFormDate(item.endDate),
      description: item.description || ''
    });
  };

  const saveEducation = async (event) => {
    event.preventDefault();

    if (!educationForm.institution.trim()) {
      flash('danger', 'Institution is required.');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        institution: educationForm.institution.trim(),
        degree: educationForm.degree.trim() || null,
        fieldOfStudy:
          educationForm.fieldOfStudy.trim() || null,
        startDate: educationForm.startDate || null,
        endDate: educationForm.endDate || null,
        description:
          educationForm.description.trim() || null
      };

      if (educationId) {
        await professionalProfileApi.updateEducation(
          educationId,
          payload
        );
      } else {
        await professionalProfileApi.addEducation(payload);
      }

      setEducationForm(null);
      setEducationId(null);

      await load();

      flash(
        'success',
        educationId
          ? 'Education updated successfully.'
          : 'Education added successfully.'
      );
    } catch (error) {
      flash('danger', apiMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const deleteEducation = async (id) => {
    if (!window.confirm('Delete this education record?')) {
      return;
    }

    try {
      await professionalProfileApi.deleteEducation(id);

      setEducation((current) =>
        current.filter((item) => item.id !== id)
      );

      flash('success', 'Education deleted.');
    } catch (error) {
      flash('danger', apiMessage(error));
    }
  };

  /* ======================================================
     EXPERIENCE
  ====================================================== */

  const openAddExperience = () => {
    setExperienceId(null);
    setExperienceForm({ ...EMPTY_EXPERIENCE });
  };

  const openEditExperience = (item) => {
    setExperienceId(item.id);

    setExperienceForm({
      title: item.title || '',
      organizationName: item.organizationName || '',
      employmentType:
        item.employmentType || 'INTERNSHIP',
      location: item.location || '',
      startDate: toFormDate(item.startDate),
      endDate: toFormDate(item.endDate),
      currentlyWorking:
        Boolean(item.currentlyWorking),
      description: item.description || ''
    });
  };

  const saveExperience = async (event) => {
    event.preventDefault();

    if (!experienceForm.title.trim()) {
      flash('danger', 'Job title is required.');
      return;
    }

    if (!experienceForm.organizationName.trim()) {
      flash('danger', 'Organization name is required.');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: experienceForm.title.trim(),
        organizationName:
          experienceForm.organizationName.trim(),
        employmentType:
          experienceForm.employmentType || null,
        location:
          experienceForm.location.trim() || null,
        startDate:
          experienceForm.startDate || null,
        endDate:
          experienceForm.currentlyWorking
            ? null
            : experienceForm.endDate || null,
        currentlyWorking:
          Boolean(experienceForm.currentlyWorking),
        description:
          experienceForm.description.trim() || null
      };

      if (experienceId) {
        await professionalProfileApi.updateExperience(
          experienceId,
          payload
        );
      } else {
        await professionalProfileApi.addExperience(payload);
      }

      setExperienceForm(null);
      setExperienceId(null);

      await load();

      flash(
        'success',
        experienceId
          ? 'Experience updated successfully.'
          : 'Experience added successfully.'
      );
    } catch (error) {
      flash('danger', apiMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const deleteExperience = async (id) => {
    if (!window.confirm('Delete this experience record?')) {
      return;
    }

    try {
      await professionalProfileApi.deleteExperience(id);

      setExperience((current) =>
        current.filter((item) => item.id !== id)
      );

      flash('success', 'Experience deleted.');
    } catch (error) {
      flash('danger', apiMessage(error));
    }
  };

  if (loading) {
    return (
      <section className="social-card profile-section">
        <div className="text-muted">
          Loading education and experience...
        </div>
      </section>
    );
  }

  return (
    <>
      <Notice
        type={notice.type}
        message={notice.message}
        onClose={() =>
          setNotice({ type: '', message: '' })
        }
      />

      {/* ================= EDUCATION ================= */}

      <section className="social-card profile-section">
        <div className="section-heading">
          <div>
            <h5>Education</h5> 
          </div>

          {editable && (
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={openAddEducation}
            >
              <i className="bi bi-plus-lg me-1" />
              Add education
            </button>
          )}
        </div>

        {education.length > 0 ? (
          <div className="profile-entry-list">
            {education.map((item) => (
              <div
                className="profile-entry"
                key={item.id}
              >
                <div className="profile-entry-icon">
                  <i className="bi bi-mortarboard-fill" />
                </div>

                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between gap-3">
                    <div>
                      <h6 className="mb-1">
                        {item.institution}
                      </h6>

                      {(item.degree ||
                        item.fieldOfStudy) && (
                        <div>
                          {[
                            item.degree,
                            item.fieldOfStudy
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                        </div>
                      )}

                      {(item.startDate ||
                        item.endDate) && (
                        <div className="text-muted small mt-1">
                          {item.startDate
                            ? formatDate(item.startDate)
                            : ''}
                          {' – '}
                          {item.endDate
                            ? formatDate(item.endDate)
                            : 'Present'}
                        </div>
                      )}
                    </div>

                    {editable && (
                      <div className="d-flex gap-1">
                        <button
                          type="button"
                          className="icon-button"
                          onClick={() =>
                            openEditEducation(item)
                          }
                          title="Edit"
                        >
                          <i className="bi bi-pencil" />
                        </button>

                        <button
                          type="button"
                          className="icon-button text-danger"
                          onClick={() =>
                            deleteEducation(item.id)
                          }
                          title="Delete"
                        >
                          <i className="bi bi-trash" />
                        </button>
                      </div>
                    )}
                  </div>

                  {item.description && (
                    <p className="pre-line mt-2 mb-0">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="bi-mortarboard"
            title="No education added"
            message={
              editable
                ? 'Add your academic qualifications.'
                : undefined
            }
          />
        )}
      </section>

      {/* ================= EXPERIENCE ================= */}

      <section className="social-card profile-section">
        <div className="section-heading">
          <div>
            <h5>Experience</h5> 
          </div>

          {editable && (
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={openAddExperience}
            >
              <i className="bi bi-plus-lg me-1" />
              Add experience
            </button>
          )}
        </div>

        {experience.length > 0 ? (
          <div className="profile-entry-list">
            {experience.map((item) => (
              <div
                className="profile-entry"
                key={item.id}
              >
                <div className="profile-entry-icon">
                  <i className="bi bi-briefcase-fill" />
                </div>

                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between gap-3">
                    <div>
                      <h6 className="mb-1">
                        {item.title}
                      </h6>

                      <div>
                        {item.organizationName}
                      </div>

                      <div className="text-muted small">
                        {item.employmentType
                          ? item.employmentType.replaceAll(
                              '_',
                              ' '
                            )
                          : ''}
                        {item.location
                          ? ` · ${item.location}`
                          : ''}
                      </div>

                      {(item.startDate ||
                        item.currentlyWorking ||
                        item.endDate) && (
                        <div className="text-muted small mt-1">
                          {item.startDate
                            ? formatDate(item.startDate)
                            : ''}
                          {' – '}
                          {item.currentlyWorking
                            ? 'Present'
                            : item.endDate
                            ? formatDate(item.endDate)
                            : ''}
                        </div>
                      )}
                    </div>

                    {editable && (
                      <div className="d-flex gap-1">
                        <button
                          type="button"
                          className="icon-button"
                          onClick={() =>
                            openEditExperience(item)
                          }
                          title="Edit"
                        >
                          <i className="bi bi-pencil" />
                        </button>

                        <button
                          type="button"
                          className="icon-button text-danger"
                          onClick={() =>
                            deleteExperience(item.id)
                          }
                          title="Delete"
                        >
                          <i className="bi bi-trash" />
                        </button>
                      </div>
                    )}
                  </div>

                  {item.description && (
                    <p className="pre-line mt-2 mb-0">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="bi-briefcase"
            title="No experience added"
            message={
              editable
                ? 'Add internship, employment or professional experience.'
                : undefined
            }
          />
        )}
      </section>

      {/* ================= EDUCATION MODAL ================= */}

      <Modal
        show={Boolean(educationForm)}
        title={
          educationId
            ? 'Edit education'
            : 'Add education'
        }
        onClose={() => {
          if (!saving) {
            setEducationForm(null);
            setEducationId(null);
          }
        }}
      >
        {educationForm && (
          <form onSubmit={saveEducation}>
            <div className="mb-3">
              <label className="form-label">
                Institution
              </label>
              <input
                className="form-control"
                required
                value={educationForm.institution}
                onChange={(e) =>
                  setEducationForm({
                    ...educationForm,
                    institution: e.target.value
                  })
                }
              />
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">
                  Degree
                </label>
                <input
                  className="form-control"
                  placeholder="e.g. B.Sc."
                  value={educationForm.degree}
                  onChange={(e) =>
                    setEducationForm({
                      ...educationForm,
                      degree: e.target.value
                    })
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Field of study
                </label>
                <input
                  className="form-control"
                  placeholder="Computer Science and Engineering"
                  value={educationForm.fieldOfStudy}
                  onChange={(e) =>
                    setEducationForm({
                      ...educationForm,
                      fieldOfStudy: e.target.value
                    })
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Start date
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={educationForm.startDate}
                  onChange={(e) =>
                    setEducationForm({
                      ...educationForm,
                      startDate: e.target.value
                    })
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  End date
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={educationForm.endDate}
                  onChange={(e) =>
                    setEducationForm({
                      ...educationForm,
                      endDate: e.target.value
                    })
                  }
                />
              </div>

              <div className="col-12">
                <label className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={educationForm.description}
                  onChange={(e) =>
                    setEducationForm({
                      ...educationForm,
                      description: e.target.value
                    })
                  }
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary"
                disabled={saving}
                onClick={() => {
                  setEducationForm(null);
                  setEducationId(null);
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-brand"
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ================= EXPERIENCE MODAL ================= */}

      <Modal
        show={Boolean(experienceForm)}
        title={
          experienceId
            ? 'Edit experience'
            : 'Add experience'
        }
        onClose={() => {
          if (!saving) {
            setExperienceForm(null);
            setExperienceId(null);
          }
        }}
        size="lg"
      >
        {experienceForm && (
          <form onSubmit={saveExperience}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">
                  Job title
                </label>
                <input
                  className="form-control"
                  required
                  value={experienceForm.title}
                  onChange={(e) =>
                    setExperienceForm({
                      ...experienceForm,
                      title: e.target.value
                    })
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Organization
                </label>
                <input
                  className="form-control"
                  required
                  value={
                    experienceForm.organizationName
                  }
                  onChange={(e) =>
                    setExperienceForm({
                      ...experienceForm,
                      organizationName:
                        e.target.value
                    })
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Employment type
                </label>

                <select
                  className="form-select"
                  value={
                    experienceForm.employmentType
                  }
                  onChange={(e) =>
                    setExperienceForm({
                      ...experienceForm,
                      employmentType:
                        e.target.value
                    })
                  }
                >
                  {EMPLOYMENT_TYPES.map((type) => (
                    <option
                      value={type}
                      key={type}
                    >
                      {type.replaceAll('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Location
                </label>
                <input
                  className="form-control"
                  value={experienceForm.location}
                  onChange={(e) =>
                    setExperienceForm({
                      ...experienceForm,
                      location: e.target.value
                    })
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Start date
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={experienceForm.startDate}
                  onChange={(e) =>
                    setExperienceForm({
                      ...experienceForm,
                      startDate: e.target.value
                    })
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  End date
                </label>
                <input
                  type="date"
                  className="form-control"
                  disabled={
                    experienceForm.currentlyWorking
                  }
                  value={
                    experienceForm.currentlyWorking
                      ? ''
                      : experienceForm.endDate
                  }
                  onChange={(e) =>
                    setExperienceForm({
                      ...experienceForm,
                      endDate: e.target.value
                    })
                  }
                />
              </div>

              <div className="col-12">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="currentlyWorking"
                    checked={
                      experienceForm.currentlyWorking
                    }
                    onChange={(e) =>
                      setExperienceForm({
                        ...experienceForm,
                        currentlyWorking:
                          e.target.checked,
                        endDate:
                          e.target.checked
                            ? ''
                            : experienceForm.endDate
                      })
                    }
                  />

                  <label
                    className="form-check-label"
                    htmlFor="currentlyWorking"
                  >
                    I currently work here
                  </label>
                </div>
              </div>

              <div className="col-12">
                <label className="form-label">
                  Description
                </label>

                <textarea
                  className="form-control"
                  rows={4}
                  value={
                    experienceForm.description
                  }
                  onChange={(e) =>
                    setExperienceForm({
                      ...experienceForm,
                      description: e.target.value
                    })
                  }
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary"
                disabled={saving}
                onClick={() => {
                  setExperienceForm(null);
                  setExperienceId(null);
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-brand"
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}