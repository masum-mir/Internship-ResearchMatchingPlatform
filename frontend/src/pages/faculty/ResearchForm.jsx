import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { researchApi } from '../../api/researchApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import { enumLabel } from '../../utils/format.js';
import PageTitle from '../../components/PageTitle.jsx';
import Loader from '../../components/Loader.jsx';
import SkillRequestEditor from '../../components/SkillRequestEditor.jsx';
import DepartmentEditor from '../../components/DepartmentEditor.jsx';

const EMPTY = {
  topic: '',
  researchArea: '',
  description: '',
  eligibility: '',
  responsibilities: '',
  requiredSkills: [],
  minCgpa: '',
  duration: '',
  availablePositions: '',
  applicationDeadline: '',
  location: '',
  workMode: 'ONSITE',
  funded: false,
  stipendAmount: '',
  stipendCurrency: 'BDT',
  targetDepartments: []
};

function localDateTime(value) {
  if (!value) return '';
  return String(value).slice(0, 16);
}

function toForm(item) {
  return {
    ...EMPTY,
    ...item,
    minCgpa: item.minCgpa ?? '',
    availablePositions: item.availablePositions ?? '',
    applicationDeadline: localDateTime(item.applicationDeadline),
    stipendAmount: item.stipendAmount ?? '',
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
    minCgpa: form.minCgpa === '' ? null : Number(form.minCgpa),
    availablePositions: form.availablePositions === '' ? null : Number(form.availablePositions),
    applicationDeadline: form.applicationDeadline || null,
    funded: Boolean(form.funded),
    stipendAmount: form.funded && form.stipendAmount !== '' ? Number(form.stipendAmount) : null,
    stipendCurrency: form.funded ? form.stipendCurrency : null,
    targetDepartments: form.targetDepartments
  };
}

export default function ResearchForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!editing) return;
    researchApi.getById(id)
      .then((data) => setForm(toForm(data)))
      .catch((e) => setError(apiMessage(e)))
      .finally(() => setLoading(false));
  }, [editing, id]);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const body = toRequest(form);
      if (editing) await researchApi.update(id, body);
      else await researchApi.create(body);
      navigate('/faculty/research');
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
        title={editing ? 'Edit research opportunity' : 'Post research opportunity'} 
      />
      {error && <div className="alert alert-danger">{error}</div>}

      <form className="social-card opportunity-form" onSubmit={submit}>
        <div className="form-section">
          <h5>Research overview</h5>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label">Research topic *</label>
              <input
                className="form-control form-control-lg"
                required
                placeholder="e.g. Privacy-Preserving Edge AI for Smart Healthcare"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Research area</label>
              <input className="form-control" value={form.researchArea || ''} onChange={(e) => setForm({ ...form, researchArea: e.target.value })} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Location</label>
              <input className="form-control" value={form.location || ''} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Work mode</label>
              <select className="form-select" value={form.workMode || 'ONSITE'} onChange={(e) => setForm({ ...form, workMode: e.target.value })}>
                {['ONSITE', 'HYBRID', 'REMOTE'].map((x) => <option key={x} value={x}>{enumLabel(x)}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Duration</label>
              <input className="form-control" placeholder="e.g. 6 months" value={form.duration || ''} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Available positions</label>
              <input type="number" min="1" className="form-control" value={form.availablePositions} onChange={(e) => setForm({ ...form, availablePositions: e.target.value })} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Application deadline</label>
              <input type="datetime-local" className="form-control" value={form.applicationDeadline} onChange={(e) => setForm({ ...form, applicationDeadline: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h5>Project details</h5>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows={8} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="form-label">Student responsibilities</label>
            <textarea className="form-control" rows={5} value={form.responsibilities || ''} onChange={(e) => setForm({ ...form, responsibilities: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Eligibility</label>
            <textarea className="form-control" rows={5} value={form.eligibility || ''} onChange={(e) => setForm({ ...form, eligibility: e.target.value })} />
          </div>
        </div>

        <div className="form-section">
          <h5>Eligibility & matching</h5>
          <SkillRequestEditor value={form.requiredSkills} onChange={(requiredSkills) => setForm({ ...form, requiredSkills })} />
          <div className="row g-3 mt-1">
            <div className="col-md-4">
              <label className="form-label">Minimum CGPA</label>
              <input type="number" min="0" max="4" step="0.01" className="form-control" value={form.minCgpa} onChange={(e) => setForm({ ...form, minCgpa: e.target.value })} />
            </div>
            <div className="col-md-8">
              <DepartmentEditor value={form.targetDepartments} onChange={(targetDepartments) => setForm({ ...form, targetDepartments })} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="d-flex align-items-center justify-content-between gap-3">
            <div>
              <h5 className="mb-1">Funding</h5>
              <p className="text-muted small mb-0">Specify stipend details if this position is funded.</p>
            </div>
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="funded" checked={Boolean(form.funded)} onChange={(e) => setForm({ ...form, funded: e.target.checked })} />
              <label className="form-check-label" htmlFor="funded">Funded position</label>
            </div>
          </div>

          {form.funded && (
            <div className="row g-3 mt-1">
              <div className="col-md-6">
                <label className="form-label">Stipend amount</label>
                <input type="number" min="0" className="form-control" value={form.stipendAmount} onChange={(e) => setForm({ ...form, stipendAmount: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Currency</label>
                <input className="form-control" value={form.stipendCurrency || ''} onChange={(e) => setForm({ ...form, stipendCurrency: e.target.value.toUpperCase() })} />
              </div>
            </div>
          )}
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/faculty/research')}>Cancel</button>
          <button className="btn btn-brand" disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Save changes' : 'Publish research post'}
          </button>
        </div>
      </form>
    </div>
  );
}
