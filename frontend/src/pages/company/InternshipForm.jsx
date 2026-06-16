import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { internshipApi } from '../../api/internshipApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import Loader from '../../components/Loader.jsx';
import Notice from '../../components/Toast.jsx';

const CATEGORIES = ['LANGUAGE', 'FRAMEWORK', 'TOOL', 'DATABASE'];
const empty = { title: '', description: '', requiredCgpa: '', location: '', deadline: '', vacancies: '', departments: '', skills: [{ name: '', category: 'LANGUAGE' }] };

export default function InternshipForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(editing);
  const [notice, setNotice] = useState({ type: '', message: '' });

  useEffect(() => {
    if (!editing) return;
    internshipApi.getById(id).then((it) => {
      setForm({
        title: it.title || '',
        description: it.description || '',
        requiredCgpa: it.requiredCgpa ?? '',
        location: it.location || '',
        deadline: it.deadline || '',
        vacancies: it.vacancies ?? '',
        departments: (it.targetDepartments || []).join(', '),
        skills: it.requiredSkills?.length ? it.requiredSkills.map((s) => ({ name: s.name, category: s.category })) : [{ name: '', category: 'LANGUAGE' }]
      });
    }).catch((e) => setNotice({ type: 'danger', message: apiMessage(e) }))
      .finally(() => setLoading(false));
  }, [id]);

  const setSkill = (i, key, val) => {
    const skills = [...form.skills];
    skills[i] = { ...skills[i], [key]: val };
    setForm({ ...form, skills });
  };
  const addSkill = () => setForm({ ...form, skills: [...form.skills, { name: '', category: 'LANGUAGE' }] });
  const removeSkill = (i) => setForm({ ...form, skills: form.skills.filter((_, idx) => idx !== i) });

  const submit = async (e) => {
    e.preventDefault();
    const body = {
      title: form.title,
      description: form.description,
      requiredCgpa: form.requiredCgpa === '' ? null : Number(form.requiredCgpa),
      location: form.location,
      deadline: form.deadline || null,
      vacancies: form.vacancies === '' ? null : Number(form.vacancies),
      targetDepartments: form.departments.split(',').map((d) => d.trim()).filter(Boolean),
      requiredSkills: form.skills.filter((s) => s.name.trim())
    };
    try {
      if (editing) await internshipApi.update(id, body);
      else await internshipApi.create(body);
      navigate('/company/internships');
    } catch (err) { setNotice({ type: 'danger', message: apiMessage(err) }); }
  };

  if (loading) return <Loader />;

  return (
    <div style={{ maxWidth: 760 }}>
      <h4 className="mb-3">{editing ? 'Edit internship' : 'Post internship'}</h4>
      <Notice type={notice.type} message={notice.message} onClose={() => setNotice({ type: '', message: '' })} />
      <form onSubmit={submit} className="card border-0 shadow-sm">
        <div className="card-body row g-3">
          <div className="col-12"><label className="form-label">Title</label>
            <input className="form-control" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="col-12"><label className="form-label">Description</label>
            <textarea className="form-control" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="col-md-3"><label className="form-label">Min CGPA</label>
            <input type="number" step="0.01" min="0" max="4" className="form-control" value={form.requiredCgpa} onChange={(e) => setForm({ ...form, requiredCgpa: e.target.value })} /></div>
          <div className="col-md-3"><label className="form-label">Vacancies</label>
            <input type="number" min="1" className="form-control" value={form.vacancies} onChange={(e) => setForm({ ...form, vacancies: e.target.value })} /></div>
          <div className="col-md-3"><label className="form-label">Location</label>
            <input className="form-control" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
          <div className="col-md-3"><label className="form-label">Deadline</label>
            <input type="date" className="form-control" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></div>
          <div className="col-12"><label className="form-label">Target departments <span className="text-muted small">(comma separated, blank = all)</span></label>
            <input className="form-control" placeholder="CSE, EEE" value={form.departments} onChange={(e) => setForm({ ...form, departments: e.target.value })} /></div>

          <div className="col-12">
            <label className="form-label">Required skills</label>
            {form.skills.map((s, i) => (
              <div className="row g-2 mb-2" key={i}>
                <div className="col-6"><input className="form-control" placeholder="Skill" value={s.name} onChange={(e) => setSkill(i, 'name', e.target.value)} /></div>
                <div className="col-4"><select className="form-select" value={s.category} onChange={(e) => setSkill(i, 'category', e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
                <div className="col-2"><button type="button" className="btn btn-outline-danger w-100" onClick={() => removeSkill(i)}><i className="bi bi-x" /></button></div>
              </div>
            ))}
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={addSkill}><i className="bi bi-plus" /> Add skill</button>
          </div>

          <div className="col-12 d-flex gap-2">
            <button className="btn btn-brand">{editing ? 'Save changes' : 'Post internship'}</button>
            <button type="button" className="btn btn-light" onClick={() => navigate('/company/internships')}>Cancel</button>
          </div>
        </div>
      </form>
    </div>
  );
}
