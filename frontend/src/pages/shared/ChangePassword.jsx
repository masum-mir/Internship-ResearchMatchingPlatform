import { useState } from 'react';
import { authApi } from '../../api/authApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import Notice from '../../components/Toast.jsx';

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [notice, setNotice] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setNotice({ type: '', message: '' });
    setLoading(true);
    try {
      await authApi.changePassword(form);
      setForm({ currentPassword: '', newPassword: '' });
      setNotice({ type: 'success', message: 'Password changed. You may need to sign in again on other devices.' });
    } catch (err) {
      setNotice({ type: 'danger', message: apiMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480 }}>
      <h4 className="mb-3">Change password</h4>
      <Notice type={notice.type} message={notice.message} onClose={() => setNotice({ type: '', message: '' })} />
      <form onSubmit={submit} className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Current password</label>
            <input type="password" className="form-control" required
              value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="form-label">New password</label>
            <input type="password" className="form-control" required minLength={6}
              value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
          </div>
          <button className="btn btn-brand" disabled={loading}>{loading ? 'Saving...' : 'Update password'}</button>
        </div>
      </form>
    </div>
  );
}
