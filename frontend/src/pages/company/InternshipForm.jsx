import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { internshipApi } from '../../api/internshipApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import { enumLabel } from '../../utils/format.js';
import PageTitle from '../../components/PageTitle.jsx';
import Loader from '../../components/Loader.jsx';
import SkillRequestEditor from '../../components/SkillRequestEditor.jsx';
import DepartmentEditor from '../../components/DepartmentEditor.jsx';

const EMPTY = {
  title: '',
  description: '',
  responsibilities: '',
  requirements: '',
  benefits: '',
  requiredSkills: [],
  requiredCgpa: '',
  location: '',
  workMode: 'ONSITE',
  employmentType: 'INTERNSHIP',
  salaryMin: '',
  salaryMax: '',
  salaryCurrency: 'BDT',
  experienceLevel: '',
  deadline: '',
  vacancies: '',
  targetDepartments: []
};

function toForm(item) {
  return {
    ...EMPTY,
    ...item,
    requiredCgpa: item.requiredCgpa ?? '',
    salaryMin: item.salaryMin ?? '',
    salaryMax: item.salaryMax ?? '',
    vacancies: item.vacancies ?? '',
    requiredSkills: (item.requiredSkills || []).map((s) => ({
      name: s.name,
      category: s.category || 'TOOL'
    })),
    targetDepartments: [...(item.targetDepartments || [])]
  };
}

function toRequest(form) {
  return {
    ...form,
    requiredSkills: form.requiredSkills.filter((s) => s.name?.trim()).map((s) => ({
      name: s.name.trim(),
      category: s.category
    })),
    requiredCgpa: form.requiredCgpa === '' ? null : Number(form.requiredCgpa),
    salaryMin: form.salaryMin === '' ? null : Number(form.salaryMin),
    salaryMax: form.salaryMax === '' ? null : Number(form.salaryMax),
    deadline: form.deadline || null,
    vacancies: form.vacancies === '' ? null : Number(form.vacancies),
    targetDepartments: form.targetDepartments
  };
}

export default function InternshipForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!editing) return;
    internshipApi.getById(id)
      .then((data) => setForm(toForm(data)))
      .catch((e) => setError(apiMessage(e)))
      .finally(() => setLoading(false));
  }, [editing, id]);

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.salaryMin !== '' && form.salaryMax !== '' &&
        Number(form.salaryMax) < Number(form.salaryMin)) {
      setError('Maximum salary cannot be lower than minimum salary.');
      return;
    }

    setSaving(true);
    try {
      const body = toRequest(form);
      if (editing) await internshipApi.update(id, body);
      else await internshipApi.create(body);
      navigate('/company/internships');
    } catch (e) {
      setError(apiMessage(e));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="opportunity-form-page">
      <PageTitle
        title={editing ? 'Edit internship' : 'Post an internship'}
       />

      {error && <div className="alert alert-danger">{error}</div>}

      <form className="social-card opportunity-form" onSubmit={submit}>
        <div className="form-section">
          <h5>Basic information</h5>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label">Internship title *</label>
              <input
                className="form-control form-control-lg"
                required
                placeholder="e.g. Software Engineering Intern"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Location</label>
              <input
                className="form-control"
                placeholder="Dhaka, Bangladesh"
                value={form.location || ''}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Work mode</label>
              <select className="form-select" value={form.workMode || 'ONSITE'} onChange={(e) => setForm({ ...form, workMode: e.target.value })}>
                {['ONSITE', 'HYBRID', 'REMOTE'].map((x) => <option key={x} value={x}>{enumLabel(x)}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Employment type</label>
              <select className="form-select" value={form.employmentType || 'INTERNSHIP'} onChange={(e) => setForm({ ...form, employmentType: e.target.value })}>
                {['INTERNSHIP', 'FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY', 'VOLUNTEER', 'FREELANCE'].map((x) => (
                  <option key={x} value={x}>{enumLabel(x)}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Experience level</label>
              <input
                className="form-control"
                placeholder="Entry level / Fresh graduate"
                value={form.experienceLevel || ''}
                onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Application deadline</label>
              <input type="date" className="form-control" value={form.deadline || ''} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Vacancies</label>
              <input type="number" min="1" className="form-control" value={form.vacancies} onChange={(e) => setForm({ ...form, vacancies: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h5>Opportunity description</h5>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows={7}
              placeholder="Describe the team, project and what the intern will learn."
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Responsibilities</label>
            <textarea
              className="form-control"
              rows={5}
              placeholder={"• Build features\n• Collaborate with engineers\n• Write tests"}
              value={form.responsibilities || ''}
              onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Requirements</label>
            <textarea
              className="form-control"
              rows={5}
              placeholder={"• Strong programming fundamentals\n• Git/GitHub\n• Communication skills"}
              value={form.requirements || ''}
              onChange={(e) => setForm({ ...form, requirements: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">Benefits</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Mentorship, certificate, lunch, flexible schedule…"
              value={form.benefits || ''}
              onChange={(e) => setForm({ ...form, benefits: e.target.value })}
            />
          </div>
        </div>

        <div className="form-section">
          <h5>Eligibility & matching</h5>
          <SkillRequestEditor
            value={form.requiredSkills}
            onChange={(requiredSkills) => setForm({ ...form, requiredSkills })}
          />
          <div className="row g-3 mt-1">
            <div className="col-md-4">
              <label className="form-label">Minimum CGPA</label>
              <input
                type="number"
                min="0"
                max="4"
                step="0.01"
                className="form-control"
                value={form.requiredCgpa}
                onChange={(e) => setForm({ ...form, requiredCgpa: e.target.value })}
              />
            </div>
            <div className="col-md-8">
              <DepartmentEditor
                value={form.targetDepartments}
                onChange={(targetDepartments) => setForm({ ...form, targetDepartments })}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h5>Compensation</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Minimum</label>
              <input type="number" min="0" className="form-control" value={form.salaryMin} onChange={(e) => setForm({ ...form, salaryMin: e.target.value })} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Maximum</label>
              <input type="number" min="0" className="form-control" value={form.salaryMax} onChange={(e) => setForm({ ...form, salaryMax: e.target.value })} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Currency</label>
              <input className="form-control" value={form.salaryCurrency || ''} onChange={(e) => setForm({ ...form, salaryCurrency: e.target.value.toUpperCase() })} />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/company/internships')}>
            Cancel
          </button>
          <button className="btn btn-brand" disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Save changes' : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  );
}
