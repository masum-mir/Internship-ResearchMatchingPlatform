import { useEffect, useState } from 'react';
import { studentApi } from '../../api/studentApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import Loader from '../../components/Loader.jsx';
import Notice from '../../components/Toast.jsx';
import ProfileHeader from '../../components/ProfileHeader.jsx';

const CATEGORIES = ['LANGUAGE', 'FRAMEWORK', 'TOOL', 'DATABASE'];

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState({ type: '', message: '' });

  const [skill, setSkill] = useState({ name: '', category: 'LANGUAGE' });
  const [project, setProject] = useState({ title: '', description: '', link: '', techStack: '' });
  const [cert, setCert] = useState({ name: '', issuer: '', issueDate: '', link: '' });

  const load = () => studentApi.getMyProfile().then(setProfile).catch((e) => flash('danger', apiMessage(e)));

  useEffect(() => { load().finally(() => setLoading(false)); }, []);

  const flash = (type, message) => {
    setNotice({ type, message });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const { name, studentId, department, batch, cgpa, contactNumber, address } = profile;
      await studentApi.updateMyProfile({ name, studentId, department, batch, cgpa, contactNumber, address });
      flash('success', 'Profile saved.');
      load();
    } catch (err) { flash('danger', apiMessage(err)); }
  };

  const addSkill = async (e) => {
    e.preventDefault();
    try { await studentApi.addSkill(skill); setSkill({ name: '', category: 'LANGUAGE' }); load(); }
    catch (err) { flash('danger', apiMessage(err)); }
  };
  const removeSkill = async (id) => { try { await studentApi.removeSkill(id); load(); } catch (err) { flash('danger', apiMessage(err)); } };

  const addProject = async (e) => {
    e.preventDefault();
    try { await studentApi.addProject(project); setProject({ title: '', description: '', link: '', techStack: '' }); load(); }
    catch (err) { flash('danger', apiMessage(err)); }
  };
  const deleteProject = async (id) => { try { await studentApi.deleteProject(id); load(); } catch (err) { flash('danger', apiMessage(err)); } };

  const addCert = async (e) => {
    e.preventDefault();
    try {
      await studentApi.addCertification({ ...cert, issueDate: cert.issueDate || null });
      setCert({ name: '', issuer: '', issueDate: '', link: '' });
      load();
    } catch (err) { flash('danger', apiMessage(err)); }
  };
  const deleteCert = async (id) => { try { await studentApi.deleteCertification(id); load(); } catch (err) { flash('danger', apiMessage(err)); } };

  if (loading) return <Loader />;
  if (!profile) return <Notice type="danger" message={notice.message || 'Could not load profile'} />;

  const set = (k, v) => setProfile({ ...profile, [k]: v });

  return (
    <div style={{ maxWidth: 900 }}>
      <ProfileHeader
        name={profile.name}
        subtitle={profile.studentId ? `Student ID ${profile.studentId}` : "Complete your profile"}
        meta={[profile.department, profile.batch && `Batch ${profile.batch}`, profile.cgpa != null && `CGPA ${profile.cgpa}`, profile.email]}
      />
      <Notice type={notice.type} message={notice.message} onClose={() => setNotice({ type: '', message: '' })} />

      {/* Details */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h6 className="text-uppercase text-muted small mb-3">Details</h6>
          <form onSubmit={saveProfile} className="row g-3">
            <div className="col-md-6"><label className="form-label">Name</label>
              <input className="form-control" value={profile.name || ''} onChange={(e) => set('name', e.target.value)} /></div>
            <div className="col-md-6"><label className="form-label">Student ID</label>
              <input className="form-control" value={profile.studentId || ''} onChange={(e) => set('studentId', e.target.value)} /></div>
            <div className="col-md-4"><label className="form-label">Department</label>
              <input className="form-control" value={profile.department || ''} onChange={(e) => set('department', e.target.value)} /></div>
            <div className="col-md-4"><label className="form-label">Batch</label>
              <input className="form-control" value={profile.batch || ''} onChange={(e) => set('batch', e.target.value)} /></div>
            <div className="col-md-4"><label className="form-label">CGPA</label>
              <input type="number" step="0.01" min="0" max="4" className="form-control"
                value={profile.cgpa ?? ''} onChange={(e) => set('cgpa', e.target.value)} /></div>
            <div className="col-md-6"><label className="form-label">Contact</label>
              <input className="form-control" value={profile.contactNumber || ''} onChange={(e) => set('contactNumber', e.target.value)} /></div>
            <div className="col-md-6"><label className="form-label">Address</label>
              <input className="form-control" value={profile.address || ''} onChange={(e) => set('address', e.target.value)} /></div>
            <div className="col-12"><button className="btn btn-brand">Save details</button></div>
          </form>
        </div>
      </div>

      {/* Skills */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h6 className="text-uppercase text-muted small mb-3">Skills</h6>
          <div className="mb-3">
            {profile.skills?.length ? profile.skills.map((s) => (
              <span key={s.id} className="skill-chip">
                {s.name}
                <button className="btn-close btn-close-sm ms-2" style={{ fontSize: '.6rem' }}
                  onClick={() => removeSkill(s.id)} aria-label="Remove" />
              </span>
            )) : <span className="text-muted small">No skills yet.</span>}
          </div>
          <form onSubmit={addSkill} className="row g-2 align-items-end">
            <div className="col-sm-5"><label className="form-label small">Skill</label>
              <input className="form-control" required value={skill.name}
                onChange={(e) => setSkill({ ...skill, name: e.target.value })} /></div>
            <div className="col-sm-4"><label className="form-label small">Category</label>
              <select className="form-select" value={skill.category} onChange={(e) => setSkill({ ...skill, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select></div>
            <div className="col-sm-3"><button className="btn btn-outline-primary w-100">Add skill</button></div>
          </form>
        </div>
      </div>

      {/* Projects */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h6 className="text-uppercase text-muted small mb-3">Projects</h6>
          {profile.projects?.map((p) => (
            <div key={p.id} className="d-flex justify-content-between border-bottom py-2">
              <div>
                <strong>{p.title}</strong> {p.techStack && <span className="text-muted small">· {p.techStack}</span>}
                <div className="small text-muted">{p.description}</div>
              </div>
              <button className="btn btn-sm btn-outline-danger" onClick={() => deleteProject(p.id)}><i className="bi bi-trash" /></button>
            </div>
          ))}
          <form onSubmit={addProject} className="row g-2 mt-2 align-items-end">
            <div className="col-md-4"><input className="form-control" placeholder="Title" required
              value={project.title} onChange={(e) => setProject({ ...project, title: e.target.value })} /></div>
            <div className="col-md-4"><input className="form-control" placeholder="Tech stack"
              value={project.techStack} onChange={(e) => setProject({ ...project, techStack: e.target.value })} /></div>
            <div className="col-md-4"><input className="form-control" placeholder="Link"
              value={project.link} onChange={(e) => setProject({ ...project, link: e.target.value })} /></div>
            <div className="col-12"><input className="form-control" placeholder="Description"
              value={project.description} onChange={(e) => setProject({ ...project, description: e.target.value })} /></div>
            <div className="col-12"><button className="btn btn-outline-primary">Add project</button></div>
          </form>
        </div>
      </div>

      {/* Certifications */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h6 className="text-uppercase text-muted small mb-3">Certifications</h6>
          {profile.certifications?.map((c) => (
            <div key={c.id} className="d-flex justify-content-between border-bottom py-2">
              <div><strong>{c.name}</strong> <span className="text-muted small">· {c.issuer}</span></div>
              <button className="btn btn-sm btn-outline-danger" onClick={() => deleteCert(c.id)}><i className="bi bi-trash" /></button>
            </div>
          ))}
          <form onSubmit={addCert} className="row g-2 mt-2 align-items-end">
            <div className="col-md-4"><input className="form-control" placeholder="Name" required
              value={cert.name} onChange={(e) => setCert({ ...cert, name: e.target.value })} /></div>
            <div className="col-md-3"><input className="form-control" placeholder="Issuer"
              value={cert.issuer} onChange={(e) => setCert({ ...cert, issuer: e.target.value })} /></div>
            <div className="col-md-3"><input type="date" className="form-control"
              value={cert.issueDate} onChange={(e) => setCert({ ...cert, issueDate: e.target.value })} /></div>
            <div className="col-md-2"><button className="btn btn-outline-primary w-100">Add</button></div>
          </form>
        </div>
      </div>
    </div>
  );
}
