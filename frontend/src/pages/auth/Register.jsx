import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';
import { apiMessage } from '../../api/axiosClient.js';
import Notice from '../../components/Toast.jsx';

const ROLES = [
  { value: 'STUDENT', label: 'Student', icon: 'bi-mortarboard', hint: 'Find internships & research' },
  { value: 'FACULTY', label: 'Faculty', icon: 'bi-person-badge', hint: 'Post research, find assistants' },
  { value: 'COMPANY', label: 'Company', icon: 'bi-building', hint: 'Hire student interns' }
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'STUDENT' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try { await register(form); navigate('/'); }
    catch (err) { setError(apiMessage(err)); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-brand">
        <div className="auth-brand-inner">
          <div className="brand-logo mb-4" style={{ fontSize: '1.5rem' }}>
            <span className="brand-mark"><i className="bi bi-mortarboard-fill" /></span> EWU Match
          </div>
          <h1>Join your campus network.</h1>
          <p className="lead opacity-75 mt-3">
            Build a profile, get matched, and move forward — whether you’re looking, hiring, or researching.
          </p>
        </div>
      </div>

      <div className="auth-form">
        <div className="auth-card">
          <div className="d-lg-none brand-logo text-brand mb-4">
            <span className="brand-mark"><i className="bi bi-mortarboard-fill" /></span> EWU Match
          </div>
          <h3 className="fw-bold mb-1">Create your account</h3>
          <p className="text-muted mb-4">It takes less than a minute.</p>
          <Notice type="danger" message={error} onClose={() => setError('')} />
          <form onSubmit={submit}>
            <label className="form-label">I am a</label>
            <div className="row g-2 mb-3">
              {ROLES.map((r) => (
                <div className="col-4" key={r.value}>
                  <button type="button"
                    onClick={() => setForm({ ...form, role: r.value })}
                    className={`btn w-100 h-100 py-2 ${form.role === r.value ? 'btn-brand' : 'btn-outline-secondary'}`}
                    style={{ borderRadius: 12 }}>
                    <i className={`bi ${r.icon} d-block fs-5 mb-1`} />
                    <span className="small fw-semibold">{r.label}</span>
                  </button>
                </div>
              ))}
            </div>
            <div className="mb-3">
              <label className="form-label">{form.role === 'COMPANY' ? 'Company name' : 'Full name'}</label>
              <input className="form-control" required
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" required
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" required minLength={6}
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <div className="form-text">At least 6 characters.</div>
            </div>
            <button className="btn btn-brand w-100 py-2" disabled={loading}>
              {loading ? 'Creating…' : 'Create account'}
            </button>
          </form>
          <p className="text-center text-muted mt-4 mb-0">
            Already a member? <Link to="/login" className="fw-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
