// import { useCallback, useEffect, useState } from 'react';
// import { studentApi } from '../../api/studentApi.js';
// import { apiMessage } from '../../api/axiosClient.js';
// import { notifyProfileUpdated } from '../../utils/profileEvents.js';
// import { resolveUploadUrl } from '../../utils/imageUrl.js';
// import { formatDate } from '../../utils/format.js';
// import Loader from '../../components/Loader.jsx';
// import Notice from '../../components/Toast.jsx';
// import ProfileHeader from '../../components/ProfileHeader.jsx';
// import Modal from '../../components/Modal.jsx';
// import EmptyState from '../../components/EmptyState.jsx';
// import SkillChips from '../../components/SkillChips.jsx';
// import ProfessionalSections from '../../components/ProfessionalSections.jsx';

// const SKILL_CATEGORIES = ['LANGUAGE', 'FRAMEWORK', 'TOOL', 'DATABASE'];

// const EMPTY_PROJECT = {
//   title: '',
//   description: '',
//   link: '',
//   repositoryUrl: '',
//   techStack: '',
//   startDate: '',
//   endDate: ''
// };

// const EMPTY_CERT = {
//   name: '',
//   issuer: '',
//   issueDate: '',
//   expiryDate: '',
//   credentialId: '',
//   link: ''
// };

// function profilePayload(p) {
//   return {
//     name: p?.name || '',
//     studentId: p?.studentId || '',
//     department: p?.department || '', 
//     cgpa: p?.cgpa === '' || p?.cgpa == null ? null : Number(p.cgpa),
//     headline: p?.headline || '',
//     bio: p?.bio || '',
//     contactNumber: p?.contactNumber || '',
//     university: p?.university || '',
//     address: p?.address || '',
//     profilePicture: p?.profilePicture || null,
//     coverPicture: p?.coverPicture || null,
//     resumeUrl: p?.resumeUrl || null,
//     portfolioUrl: p?.portfolioUrl || '',
//     githubUrl: p?.githubUrl || '',
//     linkedinUrl: p?.linkedinUrl || '',
//     openToWork: Boolean(p?.openToWork)
//   };
// }

// export default function StudentProfile() {
//   const [p, setP] = useState(null);
//   const [form, setForm] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [notice, setNotice] = useState({ type: '', message: '' });

//   const [skillForm, setSkillForm] = useState(null);
//   const [projectForm, setProjectForm] = useState(null);
//   const [projectId, setProjectId] = useState(null);
//   const [certForm, setCertForm] = useState(null);
//   const [certId, setCertId] = useState(null);

//   const load = useCallback(async () => {
//     try {
//       const data = await studentApi.getMyProfile();
//       setP(data);
//       setForm(profilePayload(data));
//     } catch (e) {
//       setNotice({ type: 'danger', message: apiMessage(e) });
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const flash = (type, message) => setNotice({ type, message });

//   const saveProfile = async (event) => {
//     event.preventDefault();
//     setSaving(true);
//     try {
//       const updated = await studentApi.updateMyProfile(form);
//       setP(updated);
//       setForm(profilePayload(updated));
//       notifyProfileUpdated();
//       flash('success', 'Profile updated.');
//     } catch (e) {
//       flash('danger', apiMessage(e));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const updateFile = async (field, file) => {
//     if (!file) return;
//     setSaving(true);
//     try {
//       const files = {};
//       files[field] = file;
//       const updated = await studentApi.updateMyProfile(profilePayload(p), files);
//       setP(updated);
//       setForm(profilePayload(updated));
//       notifyProfileUpdated();
//       flash('success', field === 'resume' ? 'Resume updated.' : 'Photo updated.');
//     } catch (e) {
//       flash('danger', apiMessage(e));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const addSkill = async (event) => {
//     event.preventDefault();
//     setSaving(true);
//     try {
//       const skills = await studentApi.addSkill(skillForm);
//       setP({ ...p, skills });
//       setSkillForm(null);
//     } catch (e) {
//       flash('danger', apiMessage(e));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const removeSkill = async (id) => {
//     try {
//       const skills = await studentApi.removeSkill(id);
//       setP({ ...p, skills });
//     } catch (e) {
//       flash('danger', apiMessage(e));
//     }
//   };

//   const saveProject = async (event) => {
//     event.preventDefault();
//     setSaving(true);
//     try {
//       if (projectId) await studentApi.updateProject(projectId, projectForm);
//       else await studentApi.addProject(projectForm);
//       setProjectForm(null);
//       setProjectId(null);
//       await load();
//     } catch (e) {
//       flash('danger', apiMessage(e));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const saveCert = async (event) => {
//     event.preventDefault();
//     setSaving(true);
//     try {
//       if (certId) await studentApi.updateCertification(certId, certForm);
//       else await studentApi.addCertification(certForm);
//       setCertForm(null);
//       setCertId(null);
//       await load();
//     } catch (e) {
//       flash('danger', apiMessage(e));
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <Loader />;
//   if (!p || !form) return <Notice type="danger" message={notice.message || 'Profile unavailable'} />;

//   return (
//     <div className="profile-edit-page">
//       <Notice
//         type={notice.type}
//         message={notice.message}
//         onClose={() => setNotice({ type: '', message: '' })}
//       />

//       <ProfileHeader
//         name={p.name || 'Your profile'}
//         subtitle={p.headline || 'Student'}
//         meta={[
//   p.university,
//   p.department,
//   p.batch ? `Batch ${p.batch}` : null
// ]}
//         profilePicture={p.profilePicture}
//         coverPicture={p.coverPicture}
//         onProfileImageUpload={(e) => updateFile('profilePicture', e.target.files?.[0])}
//         onCoverImageUpload={(e) => updateFile('coverPicture', e.target.files?.[0])}
//         actions={
//           <a className="btn btn-outline-primary btn-sm" href={`/profile/${p.userId}`}>
//             View public profile
//           </a>
//         }
//       />

//       <form className="social-card profile-section" onSubmit={saveProfile}>
//         <div className="section-heading">
//           <div>
//             <h5>Profile details</h5>
//             <p>Keep your professional identity and matching information current.</p>
//           </div>
//           <div className="form-check form-switch">
//             <input
//               className="form-check-input"
//               type="checkbox"
//               id="openToWork"
//               checked={Boolean(form.openToWork)}
//               onChange={(e) => setForm({ ...form, openToWork: e.target.checked })}
//             />
//             <label className="form-check-label" htmlFor="openToWork">Open to work</label>
//           </div>
//         </div>

//         <div className="row g-3">
//           <div className="col-md-6">
//             <label className="form-label">Full name</label>
//             <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
//           </div>
//           <div className="col-md-3">
//             <label className="form-label">Student ID</label>
//             <input className="form-control" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} />
//           </div>
//           <div className="col-md-3">
//             <label className="form-label">University</label>
//             <input className="form-control" value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} />
//           </div>

//           <div className="col-md-6">
//             <label className="form-label">Department</label>
//             <input className="form-control" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
//           </div>
//           <div className="col-md-3">
//             <label className="form-label">CGPA</label>
//             <input type="number" min="0" max="4" step="0.01" className="form-control" value={form.cgpa ?? ''} onChange={(e) => setForm({ ...form, cgpa: e.target.value })} />
//           </div>
//           <div className="col-md-3">
//             <label className="form-label">Contact number</label>
//             <input className="form-control" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
//           </div>

//           <div className="col-12">
//             <label className="form-label">Professional headline</label>
//             <input
//               className="form-control"
//               placeholder="e.g. CSE Student | Java & React Developer | Open to Software Internships"
//               value={form.headline}
//               onChange={(e) => setForm({ ...form, headline: e.target.value })}
//             />
//           </div>

//           <div className="col-12">
//             <label className="form-label">About</label>
//             <textarea className="form-control" rows={5} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
//           </div>

//           <div className="col-12">
//             <label className="form-label">Address</label>
//             <input className="form-control" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
//           </div>

//           <div className="col-md-4">
//             <label className="form-label">Portfolio URL</label>
//             <input type="url" className="form-control" value={form.portfolioUrl} onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })} />
//           </div>
//           <div className="col-md-4">
//             <label className="form-label">GitHub URL</label>
//             <input type="url" className="form-control" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
//           </div>
//           <div className="col-md-4">
//             <label className="form-label">LinkedIn URL</label>
//             <input type="url" className="form-control" value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} />
//           </div>
//         </div>

//         <div className="profile-file-row mt-4">
//           <div>
//             <strong>Resume</strong>
//             <div className="text-muted small">
//               {p.resumeUrl ? (
//                 <a href={resolveUploadUrl(p.resumeUrl)} target="_blank" rel="noreferrer">Open current resume</a>
//               ) : 'No resume uploaded'}
//             </div>
//           </div>
//           <label className="btn btn-outline-primary btn-sm mb-0">
//             <i className="bi bi-file-earmark-arrow-up me-1" /> {p.resumeUrl ? 'Replace resume' : 'Upload resume'}
//             <input
//               type="file"
//               hidden
//               accept=".pdf,.doc,.docx"
//               onChange={(e) => updateFile('resume', e.target.files?.[0])}
//             />
//           </label>
//         </div>

//         <div className="mt-4">
//           <button className="btn btn-brand" disabled={saving}>
//             {saving ? 'Saving…' : 'Save profile'}
//           </button>
//         </div>
//       </form>

//       <section className="social-card profile-section">
//         <div className="section-heading">
//           <div>
//             <h5>Skills</h5>
//             <p>Skills are used directly in opportunity matching.</p>
//           </div>
//           <button
//             type="button"
//             className="btn btn-outline-primary btn-sm"
//             onClick={() => setSkillForm({ name: '', category: 'TOOL' })}
//           >
//             <i className="bi bi-plus-lg me-1" /> Add skill
//           </button>
//         </div>

//         {p.skills?.length ? (
//           <div className="editable-skill-list">
//             {p.skills.map((skill) => (
//               <span className="skill-chip" key={skill.id}>
//                 {skill.name}
//                 <button type="button" onClick={() => removeSkill(skill.id)} aria-label={`Remove ${skill.name}`}>
//                   <i className="bi bi-x" />
//                 </button>
//               </span>
//             ))}
//           </div>
//         ) : (
//           <EmptyState icon="bi-lightning-charge" title="No skills added" message="Add your strongest technical skills first." />
//         )}
//       </section>

//       <section className="social-card profile-section">
//         <div className="section-heading">
//           <div>
//             <h5>Projects</h5>
//             <p>Show practical work, repositories and technology stacks.</p>
//           </div>
//           <button
//             type="button"
//             className="btn btn-outline-primary btn-sm"
//             onClick={() => { setProjectId(null); setProjectForm(EMPTY_PROJECT); }}
//           >
//             <i className="bi bi-plus-lg me-1" /> Add project
//           </button>
//         </div>

//         {p.projects?.length ? (
//           <div className="profile-entry-list">
//             {p.projects.map((project) => (
//               <div className="profile-entry" key={project.id}>
//                 <div className="profile-entry-icon"><i className="bi bi-kanban-fill" /></div>
//                 <div className="flex-grow-1">
//                   <div className="d-flex justify-content-between gap-2">
//                     <div>
//                       <h6 className="mb-1">{project.title}</h6>
//                       {project.techStack && <div className="text-muted small">{project.techStack}</div>}
//                       {(project.startDate || project.endDate) && (
//                         <div className="text-muted small">{formatDate(project.startDate)} – {formatDate(project.endDate)}</div>
//                       )}
//                     </div>
//                     <div className="d-flex gap-1">
//                       <button className="icon-button" type="button" onClick={() => {
//                         setProjectId(project.id);
//                         setProjectForm({ ...EMPTY_PROJECT, ...project });
//                       }}><i className="bi bi-pencil" /></button>
//                       <button className="icon-button text-danger" type="button" onClick={async () => {
//                         if (!window.confirm('Delete this project?')) return;
//                         try { await studentApi.deleteProject(project.id); await load(); } catch (e) { flash('danger', apiMessage(e)); }
//                       }}><i className="bi bi-trash" /></button>
//                     </div>
//                   </div>
//                   {project.description && <p className="pre-line mt-2 mb-2">{project.description}</p>}
//                   <div className="d-flex gap-3 small">
//                     {project.link && <a href={project.link} target="_blank" rel="noreferrer">Project link</a>}
//                     {project.repositoryUrl && <a href={project.repositoryUrl} target="_blank" rel="noreferrer">Repository</a>}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <EmptyState icon="bi-kanban" title="No projects added" />
//         )}
//       </section>

//       <section className="social-card profile-section">
//         <div className="section-heading">
//           <div>
//             <h5>Licenses & certifications</h5>
//             <p>Add verifiable professional certificates.</p>
//           </div>
//           <button
//             type="button"
//             className="btn btn-outline-primary btn-sm"
//             onClick={() => { setCertId(null); setCertForm(EMPTY_CERT); }}
//           >
//             <i className="bi bi-plus-lg me-1" /> Add certification
//           </button>
//         </div>

//         {p.certifications?.length ? (
//           <div className="profile-entry-list">
//             {p.certifications.map((cert) => (
//               <div className="profile-entry" key={cert.id}>
//                 <div className="profile-entry-icon"><i className="bi bi-patch-check-fill" /></div>
//                 <div className="flex-grow-1">
//                   <div className="d-flex justify-content-between gap-2">
//                     <div>
//                       <h6 className="mb-1">{cert.name}</h6>
//                       <div>{cert.issuer}</div>
//                       <div className="text-muted small">
//                         Issued {formatDate(cert.issueDate)}
//                         {cert.expiryDate ? ` · Expires ${formatDate(cert.expiryDate)}` : ''}
//                       </div>
//                       {cert.credentialId && <div className="text-muted small">Credential ID {cert.credentialId}</div>}
//                     </div>
//                     <div className="d-flex gap-1">
//                       <button className="icon-button" type="button" onClick={() => {
//                         setCertId(cert.id);
//                         setCertForm({ ...EMPTY_CERT, ...cert });
//                       }}><i className="bi bi-pencil" /></button>
//                       <button className="icon-button text-danger" type="button" onClick={async () => {
//                         if (!window.confirm('Delete this certification?')) return;
//                         try { await studentApi.deleteCertification(cert.id); await load(); } catch (e) { flash('danger', apiMessage(e)); }
//                       }}><i className="bi bi-trash" /></button>
//                     </div>
//                   </div>
//                   {cert.link && <a href={cert.link} target="_blank" rel="noreferrer" className="small">Show credential</a>}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <EmptyState icon="bi-patch-check" title="No certifications added" />
//         )}
//       </section>

//       <ProfessionalSections editable />

//       <Modal show={Boolean(skillForm)} title="Add skill" onClose={() => setSkillForm(null)}>
//         {skillForm && (
//           <form onSubmit={addSkill}>
//             <div className="mb-3">
//               <label className="form-label">Skill name</label>
//               <input className="form-control" required value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Category</label>
//               <select className="form-select" value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}>
//                 {SKILL_CATEGORIES.map((x) => <option value={x} key={x}>{x}</option>)}
//               </select>
//             </div>
//             <div className="d-flex justify-content-end gap-2">
//               <button type="button" className="btn btn-outline-secondary" onClick={() => setSkillForm(null)}>Cancel</button>
//               <button className="btn btn-brand" disabled={saving}>Add skill</button>
//             </div>
//           </form>
//         )}
//       </Modal>

//       <Modal show={Boolean(projectForm)} title={projectId ? 'Edit project' : 'Add project'} onClose={() => setProjectForm(null)} size="lg">
//         {projectForm && (
//           <form onSubmit={saveProject}>
//             <div className="row g-3">
//               <div className="col-12">
//                 <label className="form-label">Title</label>
//                 <input className="form-control" required value={projectForm.title || ''} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} />
//               </div>
//               <div className="col-12">
//                 <label className="form-label">Description</label>
//                 <textarea className="form-control" rows={4} value={projectForm.description || ''} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} />
//               </div>
//               <div className="col-12">
//                 <label className="form-label">Tech stack</label>
//                 <input className="form-control" placeholder="Java, Spring Boot, React, MySQL" value={projectForm.techStack || ''} onChange={(e) => setProjectForm({ ...projectForm, techStack: e.target.value })} />
//               </div>
//               <div className="col-md-6">
//                 <label className="form-label">Project link</label>
//                 <input type="url" className="form-control" value={projectForm.link || ''} onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })} />
//               </div>
//               <div className="col-md-6">
//                 <label className="form-label">Repository URL</label>
//                 <input type="url" className="form-control" value={projectForm.repositoryUrl || ''} onChange={(e) => setProjectForm({ ...projectForm, repositoryUrl: e.target.value })} />
//               </div>
//               <div className="col-md-6">
//                 <label className="form-label">Start date</label>
//                 <input type="date" className="form-control" value={projectForm.startDate || ''} onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })} />
//               </div>
//               <div className="col-md-6">
//                 <label className="form-label">End date</label>
//                 <input type="date" className="form-control" value={projectForm.endDate || ''} onChange={(e) => setProjectForm({ ...projectForm, endDate: e.target.value })} />
//               </div>
//             </div>
//             <div className="d-flex justify-content-end gap-2 mt-4">
//               <button type="button" className="btn btn-outline-secondary" onClick={() => setProjectForm(null)}>Cancel</button>
//               <button className="btn btn-brand" disabled={saving}>Save</button>
//             </div>
//           </form>
//         )}
//       </Modal>

//       <Modal show={Boolean(certForm)} title={certId ? 'Edit certification' : 'Add certification'} onClose={() => setCertForm(null)}>
//         {certForm && (
//           <form onSubmit={saveCert}>
//             <div className="mb-3">
//               <label className="form-label">Certification name</label>
//               <input className="form-control" required value={certForm.name || ''} onChange={(e) => setCertForm({ ...certForm, name: e.target.value })} />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Issuer</label>
//               <input className="form-control" value={certForm.issuer || ''} onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })} />
//             </div>
//             <div className="row g-3 mb-3">
//               <div className="col-md-6">
//                 <label className="form-label">Issue date</label>
//                 <input type="date" className="form-control" value={certForm.issueDate || ''} onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })} />
//               </div>
//               <div className="col-md-6">
//                 <label className="form-label">Expiry date</label>
//                 <input type="date" className="form-control" value={certForm.expiryDate || ''} onChange={(e) => setCertForm({ ...certForm, expiryDate: e.target.value })} />
//               </div>
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Credential ID</label>
//               <input className="form-control" value={certForm.credentialId || ''} onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })} />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Credential URL</label>
//               <input type="url" className="form-control" value={certForm.link || ''} onChange={(e) => setCertForm({ ...certForm, link: e.target.value })} />
//             </div>
//             <div className="d-flex justify-content-end gap-2">
//               <button type="button" className="btn btn-outline-secondary" onClick={() => setCertForm(null)}>Cancel</button>
//               <button className="btn btn-brand" disabled={saving}>Save</button>
//             </div>
//           </form>
//         )}
//       </Modal>
//     </div>
//   );
// }


import { useCallback, useEffect, useState } from 'react';
import { studentApi } from '../../api/studentApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import { notifyProfileUpdated } from '../../utils/profileEvents.js';
import { resolveUploadUrl } from '../../utils/imageUrl.js';
import { formatDate } from '../../utils/format.js';
import Loader from '../../components/Loader.jsx';
import Notice from '../../components/Toast.jsx';
import ProfileHeader from '../../components/ProfileHeader.jsx';
import Modal from '../../components/Modal.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import SkillChips from '../../components/SkillChips.jsx';
import ProfessionalSections from '../../components/ProfessionalSections.jsx';

const SKILL_CATEGORIES = ['LANGUAGE', 'FRAMEWORK', 'TOOL', 'DATABASE'];

const EMPTY_PROJECT = {
  title: '',
  description: '',
  link: '',
  repositoryUrl: '',
  techStack: '',
  startDate: '',
  endDate: ''
};

const EMPTY_CERT = {
  name: '',
  issuer: '',
  issueDate: '',
  expiryDate: '',
  credentialId: '',
  link: ''
};

function profilePayload(p) {
  return {
    name: p?.name || '',
    studentId: p?.studentId || '',
    department: p?.department || '',
    university: p?.university || '', 
    cgpa: p?.cgpa === '' || p?.cgpa == null ? null : Number(p.cgpa),
    headline: p?.headline || '',
    bio: p?.bio || '',
    contactNumber: p?.contactNumber || '',
    address: p?.address || '',
    profilePicture: p?.profilePicture || null,
    coverPicture: p?.coverPicture || null,
    resumeUrl: p?.resumeUrl || null,
    portfolioUrl: p?.portfolioUrl || '',
    githubUrl: p?.githubUrl || '',
    linkedinUrl: p?.linkedinUrl || '',
    openToWork: Boolean(p?.openToWork)
  };
}

export default function StudentProfile() {
  const [p, setP] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState({ type: '', message: '' });

  const [skillForm, setSkillForm] = useState(null);
  const [projectForm, setProjectForm] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [certForm, setCertForm] = useState(null);
  const [certId, setCertId] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await studentApi.getMyProfile();
      setP(data);
      setForm(profilePayload(data));
    } catch (e) {
      setNotice({ type: 'danger', message: apiMessage(e) });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const flash = (type, message) => setNotice({ type, message });

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const updated = await studentApi.updateMyProfile(form);
      setP(updated);
      setForm(profilePayload(updated));
      notifyProfileUpdated();
      flash('success', 'Profile updated.');
    } catch (e) {
      flash('danger', apiMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const updateFile = async (field, file) => {
    if (!file) return;
    setSaving(true);
    try {
      const files = {};
      files[field] = file;
      const updated = await studentApi.updateMyProfile(profilePayload(p), files);
      setP(updated);
      setForm(profilePayload(updated));
      notifyProfileUpdated();
      flash('success', field === 'resume' ? 'Resume updated.' : 'Photo updated.');
    } catch (e) {
      flash('danger', apiMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const addSkill = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const skills = await studentApi.addSkill(skillForm);
      setP({ ...p, skills });
      setSkillForm(null);
    } catch (e) {
      flash('danger', apiMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const removeSkill = async (id) => {
    try {
      const skills = await studentApi.removeSkill(id);
      setP({ ...p, skills });
    } catch (e) {
      flash('danger', apiMessage(e));
    }
  };

  const saveProject = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (projectId) await studentApi.updateProject(projectId, projectForm);
      else await studentApi.addProject(projectForm);
      setProjectForm(null);
      setProjectId(null);
      await load();
    } catch (e) {
      flash('danger', apiMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const saveCert = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (certId) await studentApi.updateCertification(certId, certForm);
      else await studentApi.addCertification(certForm);
      setCertForm(null);
      setCertId(null);
      await load();
    } catch (e) {
      flash('danger', apiMessage(e));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;
  if (!p || !form) return <Notice type="danger" message={notice.message || 'Profile unavailable'} />;

  return (
    <div className="profile-edit-page">
      <Notice
        type={notice.type}
        message={notice.message}
        onClose={() => setNotice({ type: '', message: '' })}
      />

      <ProfileHeader
        name={p.name || 'Your profile'}
        // subtitle={p.headline || 'Student'}
        meta={[p.email]}
        profilePicture={p.profilePicture}
        coverPicture={p.coverPicture}
        onProfileImageUpload={(e) => updateFile('profilePicture', e.target.files?.[0])}
        onCoverImageUpload={(e) => updateFile('coverPicture', e.target.files?.[0])}
        actions={
          <a className="btn btn-outline-primary btn-sm" href={`/profile/${p.userId}`}>
            View public profile
          </a>
        }
      />

      <form className="social-card profile-section" onSubmit={saveProfile}>
        <div className="section-heading">
          <div>
            <h5>Profile details</h5>
          </div>
          {/* <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="openToWork"
              checked={Boolean(form.openToWork)}
              onChange={(e) => setForm({ ...form, openToWork: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="openToWork">Open to work</label>
          </div> */}
        </div>

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Full name</label>
            <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Student ID</label>
            <input className="form-control" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} />
          </div> 
          <div className="col-md-2">
            <label className="form-label">CGPA</label>
            <input type="number" min="0" max="4" step="0.01" className="form-control" value={form.cgpa ?? ''} onChange={(e) => setForm({ ...form, cgpa: e.target.value })} />
          </div>
 

          <div className="col-md-4">
            <label className="form-label">University</label>
            <input
              className="form-control" 
              value={form.university}
              onChange={(e) => setForm({ ...form, university: e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Email</label>
            <input
              className="form-control" 
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Department</label>
            <input className="form-control" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          </div>
          
          <div className="col-md-2">
            <label className="form-label">Contact number</label>
            <input className="form-control" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
          </div>

          <div className="col-12">
            <label className="form-label">Professional headline</label>
            <input
              className="form-control"
              placeholder="e.g. CSE Student | Java & React Developer | Open to Software Internships"
              value={form.headline}
              onChange={(e) => setForm({ ...form, headline: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label className="form-label">About</label>
            <textarea className="form-control" rows={5} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>

          <div className="col-12">
            <label className="form-label">Address</label>
            <input className="form-control" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>

          <div className="col-md-4">
            <label className="form-label">Portfolio URL</label>
            <input type="url" className="form-control" value={form.portfolioUrl} onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })} />
          </div>
          <div className="col-md-4">
            <label className="form-label">GitHub URL</label>
            <input type="url" className="form-control" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
          </div>
          <div className="col-md-4">
            <label className="form-label">LinkedIn URL</label>
            <input type="url" className="form-control" value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} />
          </div>
        </div>

        <div className="profile-file-row mt-4">
          <div>
            <strong>Resume</strong>
            <div className="text-muted small">
              {p.resumeUrl ? (
                <a href={resolveUploadUrl(p.resumeUrl)} target="_blank" rel="noreferrer">Open current resume</a>
              ) : 'No resume uploaded'}
            </div>
          </div>
          <label className="btn btn-outline-primary btn-sm mb-0">
            <i className="bi bi-file-earmark-arrow-up me-1" /> {p.resumeUrl ? 'Replace resume' : 'Upload resume'}
            <input
              type="file"
              hidden
              accept=".pdf,.doc,.docx"
              onChange={(e) => updateFile('resume', e.target.files?.[0])}
            />
          </label>
        </div>

        <div className="mt-4">
          <button className="btn btn-brand" disabled={saving}>
            {saving ? 'Saving…' : 'Save profile'}
          </button>
        </div>
      </form>

      <section className="social-card profile-section">
        <div className="section-heading">
          <div>
            <h5>Skills</h5> 
          </div>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => setSkillForm({ name: '', category: 'TOOL' })}
          >
            <i className="bi bi-plus-lg me-1" /> Add skill
          </button>
        </div>

        {p.skills?.length ? (
          <div className="editable-skill-list">
            {p.skills.map((skill) => (
              <span className="skill-chip" key={skill.id}>
                {skill.name}
                <button type="button" onClick={() => removeSkill(skill.id)} aria-label={`Remove ${skill.name}`}>
                  <i className="bi bi-x" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <EmptyState icon="bi-lightning-charge" title="No skills added" message="Add your strongest technical skills first." />
        )}
      </section>

      <section className="social-card profile-section">
        <div className="section-heading">
          <div>
            <h5>Projects</h5>
          </div>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => { setProjectId(null); setProjectForm(EMPTY_PROJECT); }}
          >
            <i className="bi bi-plus-lg me-1" /> Add project
          </button>
        </div>

        {p.projects?.length ? (
          <div className="profile-entry-list">
            {p.projects.map((project) => (
              <div className="profile-entry" key={project.id}>
                <div className="profile-entry-icon"><i className="bi bi-kanban-fill" /></div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between gap-2">
                    <div>
                      <h6 className="mb-1">{project.title}</h6>
                      {project.techStack && <div className="text-muted small">{project.techStack}</div>}
                      {(project.startDate || project.endDate) && (
                        <div className="text-muted small">{formatDate(project.startDate)} – {formatDate(project.endDate)}</div>
                      )}
                    </div>
                    <div className="d-flex gap-1">
                      <button className="icon-button" type="button" onClick={() => {
                        setProjectId(project.id);
                        setProjectForm({ ...EMPTY_PROJECT, ...project });
                      }}><i className="bi bi-pencil" /></button>
                      <button className="icon-button text-danger" type="button" onClick={async () => {
                        if (!window.confirm('Delete this project?')) return;
                        try { await studentApi.deleteProject(project.id); await load(); } catch (e) { flash('danger', apiMessage(e)); }
                      }}><i className="bi bi-trash" /></button>
                    </div>
                  </div>
                  {project.description && <p className="pre-line mt-2 mb-2">{project.description}</p>}
                  <div className="d-flex gap-3 small">
                    {project.link && <a href={project.link} target="_blank" rel="noreferrer">Project link</a>}
                    {project.repositoryUrl && <a href={project.repositoryUrl} target="_blank" rel="noreferrer">Repository</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon="bi-kanban" title="No projects added" />
        )}
      </section>

      <section className="social-card profile-section">
        <div className="section-heading">
          <div>
            <h5>Licenses & certifications</h5> 
          </div>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => { setCertId(null); setCertForm(EMPTY_CERT); }}
          >
            <i className="bi bi-plus-lg me-1" /> Add certification
          </button>
        </div>

        {p.certifications?.length ? (
          <div className="profile-entry-list">
            {p.certifications.map((cert) => (
              <div className="profile-entry" key={cert.id}>
                <div className="profile-entry-icon"><i className="bi bi-patch-check-fill" /></div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between gap-2">
                    <div>
                      <h6 className="mb-1">{cert.name}</h6>
                      <div>{cert.issuer}</div>
                      <div className="text-muted small">
                        Issued {formatDate(cert.issueDate)}
                        {cert.expiryDate ? ` · Expires ${formatDate(cert.expiryDate)}` : ''}
                      </div>
                      {cert.credentialId && <div className="text-muted small">Credential ID {cert.credentialId}</div>}
                    </div>
                    <div className="d-flex gap-1">
                      <button className="icon-button" type="button" onClick={() => {
                        setCertId(cert.id);
                        setCertForm({ ...EMPTY_CERT, ...cert });
                      }}><i className="bi bi-pencil" /></button>
                      <button className="icon-button text-danger" type="button" onClick={async () => {
                        if (!window.confirm('Delete this certification?')) return;
                        try { await studentApi.deleteCertification(cert.id); await load(); } catch (e) { flash('danger', apiMessage(e)); }
                      }}><i className="bi bi-trash" /></button>
                    </div>
                  </div>
                  {cert.link && <a href={cert.link} target="_blank" rel="noreferrer" className="small">Show credential</a>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon="bi-patch-check" title="No certifications added" />
        )}
      </section>

      <ProfessionalSections editable />

      <Modal show={Boolean(skillForm)} title="Add skill" onClose={() => setSkillForm(null)}>
        {skillForm && (
          <form onSubmit={addSkill}>
            <div className="mb-3">
              <label className="form-label">Skill name</label>
              <input className="form-control" required value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select className="form-select" value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}>
                {SKILL_CATEGORIES.map((x) => <option value={x} key={x}>{x}</option>)}
              </select>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary" onClick={() => setSkillForm(null)}>Cancel</button>
              <button className="btn btn-brand" disabled={saving}>Add skill</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal show={Boolean(projectForm)} title={projectId ? 'Edit project' : 'Add project'} onClose={() => setProjectForm(null)} size="lg">
        {projectForm && (
          <form onSubmit={saveProject}>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">Title</label>
                <input className="form-control" required value={projectForm.title || ''} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} />
              </div>
              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={4} value={projectForm.description || ''} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} />
              </div>
              <div className="col-12">
                <label className="form-label">Tech stack</label>
                <input className="form-control" placeholder="Java, Spring Boot, React, MySQL" value={projectForm.techStack || ''} onChange={(e) => setProjectForm({ ...projectForm, techStack: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Project link</label>
                <input type="url" className="form-control" value={projectForm.link || ''} onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Repository URL</label>
                <input type="url" className="form-control" value={projectForm.repositoryUrl || ''} onChange={(e) => setProjectForm({ ...projectForm, repositoryUrl: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Start date</label>
                <input type="date" className="form-control" value={projectForm.startDate || ''} onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label">End date</label>
                <input type="date" className="form-control" value={projectForm.endDate || ''} onChange={(e) => setProjectForm({ ...projectForm, endDate: e.target.value })} />
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button type="button" className="btn btn-outline-secondary" onClick={() => setProjectForm(null)}>Cancel</button>
              <button className="btn btn-brand" disabled={saving}>Save</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal show={Boolean(certForm)} title={certId ? 'Edit certification' : 'Add certification'} onClose={() => setCertForm(null)}>
        {certForm && (
          <form onSubmit={saveCert}>
            <div className="mb-3">
              <label className="form-label">Certification name</label>
              <input className="form-control" required value={certForm.name || ''} onChange={(e) => setCertForm({ ...certForm, name: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Issuer</label>
              <input className="form-control" value={certForm.issuer || ''} onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })} />
            </div>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">Issue date</label>
                <input type="date" className="form-control" value={certForm.issueDate || ''} onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Expiry date</label>
                <input type="date" className="form-control" value={certForm.expiryDate || ''} onChange={(e) => setCertForm({ ...certForm, expiryDate: e.target.value })} />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Credential ID</label>
              <input className="form-control" value={certForm.credentialId || ''} onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Credential URL</label>
              <input type="url" className="form-control" value={certForm.link || ''} onChange={(e) => setCertForm({ ...certForm, link: e.target.value })} />
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary" onClick={() => setCertForm(null)}>Cancel</button>
              <button className="btn btn-brand" disabled={saving}>Save</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}