import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';
import { apiMessage } from '../../api/axiosClient.js';
import Notice from '../../components/Toast.jsx';

const FEATURES = [
  { icon: 'bi-magic', text: 'Smart matching ranks every opportunity to your skills, CGPA, and department' },
  { icon: 'bi-people', text: 'Companies and faculty find the right candidates faster' },
  { icon: 'bi-shield-check', text: 'One secure platform built for your university' }
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try { await login(form); navigate('/'); }
    catch (err) { setError(apiMessage(err)); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-brand">
        <div className="auth-brand-inner">
          <div className="brand-logo mb-4" style={{ fontSize: '2.1rem' }}>
            <span className="brand-mark"><i className="bi bi-mortarboard-fill" /></span> EWU Match
          </div>
          <h1>Where talent meets opportunity.</h1>
          <p className="lead opacity-75 mt-3">
            The university platform connecting students with internships and research — matched to who they really are.
          </p>
          {FEATURES.map((f, i) => (
            <div className="auth-feature" key={i}>
              <i className={`bi ${f.icon}`} />
              <span className="opacity-90">{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-form">
        <div className="auth-card">
          <div className="d-lg-none brand-logo text-brand mb-4">
            <span className="brand-mark"><i className="bi bi-mortarboard-fill" /></span> EWU Match
          </div>
          <h3 className="fw-bold mb-1">Sign in</h3>
          <p className="text-muted mb-4">Welcome back — let’s find your next opportunity.</p>
          <Notice type="danger" message={error} onClose={() => setError('')} />
          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" required
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" required
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <button className="btn btn-brand w-100 py-2" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p className="text-center text-muted mt-4 mb-0">
            New here? <Link to="/register" className="fw-semibold">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
