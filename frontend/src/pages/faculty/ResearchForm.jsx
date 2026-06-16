import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { researchApi } from '../../api/researchApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import Loader from '../../components/Loader.jsx';
import Notice from '../../components/Toast.jsx';

const CATEGORIES = ['LANGUAGE', 'FRAMEWORK', 'TOOL', 'DATABASE'];
const empty = { topic: '', researchArea: '', minCgpa: '', duration: '', supervisor: '', departments: '', skills: [{ name: '', category: 'LANGUAGE' }] };

export default function ResearchForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(editing);
  const [notice, setNotice] = useState({ type: '', message: '' });

  useEffect(() => {
    if (!editing) return;
    researchApi.getById(id).then((it) => {
      setForm({
        topic: it.topic || '',
        researchArea: it.researchArea || '',
        minCgpa: it.minCgpa ?? '',
        duration: it.duration || '',
        supervisor: it.supervisor || '',
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
      topic: form.topic,
      researchArea: form.researchArea,
      minCgpa: form.minCgpa === '' ? null : Number(form.minCgpa),
      duration: form.duration,
      supervisor: form.supervisor || null,
      targetDepartments: form.departments.split(',').map((d) => d.trim()).filter(Boolean),
      requiredSkills: form.skills.filter((s) => s.name.trim())
    };
    try {
      if (editing) await researchApi.update(id, body);
      else await researchApi.create(body);
      navigate('/faculty/research');
    } catch (err) { setNotice({ type: 'danger', message: apiMessage(err) }); }
  };

  if (loading) return <Loader />;

  return (
    <div style={{ maxWidth: 760 }}>
      <h4 className="mb-3">{editing ? 'Edit research post' : 'Post research'}</h4>
      <Notice type={notice.type} message={notice.message} onClose={() => setNotice({ type: '', message: '' })} />
      <form onSubmit={submit} className="card border-0 shadow-sm">
        <div className="card-body row g-3">
          <div className="col-12"><label className="form-label">Topic</label>
            <input className="form-control" required value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} /></div>
          <div className="col-md-6"><label className="form-label">Research area</label>
            <input className="form-control" value={form.researchArea} onChange={(e) => setForm({ ...form, researchArea: e.target.value })} /></div>
          <div className="col-md-3"><label className="form-label">Min CGPA</label>
            <input type="number" step="0.01" min="0" max="4" className="form-control" value={form.minCgpa} onChange={(e) => setForm({ ...form, minCgpa: e.target.value })} /></div>
          <div className="col-md-3"><label className="form-label">Duration</label>
            <input className="form-control" placeholder="e.g. 6 months" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /></div>
          <div className="col-md-6"><label className="form-label">Supervisor</label>
            <input className="form-control" value={form.supervisor} onChange={(e) => setForm({ ...form, supervisor: e.target.value })} /></div>
          <div className="col-md-6"><label className="form-label">Target departments <span className="text-muted small">(comma separated)</span></label>
            <input className="form-control" placeholder="CSE" value={form.departments} onChange={(e) => setForm({ ...form, departments: e.target.value })} /></div>

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
            <button className="btn btn-brand">{editing ? 'Save changes' : 'Post research'}</button>
            <button type="button" className="btn btn-light" onClick={() => navigate('/faculty/research')}>Cancel</button>
          </div>
        </div>
      </form>
    </div>
  );
}
