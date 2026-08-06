import { useEffect, useRef, useState } from 'react';
import { adminApi } from '../../api/adminApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import Loader from '../../components/Loader.jsx';
import Notice from '../../components/Toast.jsx';
import EmptyState from '../../components/EmptyState.jsx';

const ROLES = ['STUDENT', 'FACULTY', 'COMPANY', 'ADMIN'];

const FIELD_META = {
  name: { label: 'Name', icon: 'bi-person' },
  role: { label: 'Role', icon: 'bi-person-badge' },
  email: { label: 'Email', icon: 'bi-envelope' },
  password: { label: 'Password', icon: 'bi-key' }
};

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState({ type: '', message: '' });

  // Which row's "Edit" dropdown is open.
  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuRefs = useRef(new Map());

  // The active edit modal: { user, field } | null
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const closeOnOutsideClick = (e) => {
      if (menuOpenId == null) return;
      const node = menuRefs.current.get(menuOpenId);
      if (node && !node.contains(e.target)) setMenuOpenId(null);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, [menuOpenId]);

  const load = () => {
    setLoading(true);
    adminApi.listUsers().then(setUsers)
      .catch((e) => setNotice({ type: 'danger', message: apiMessage(e) }))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const toggleBlock = async (u) => {
    try {
      if (u.blocked) await adminApi.unblockUser(u.id);
      else await adminApi.blockUser(u.id);
      load();
    } catch (e) { setNotice({ type: 'danger', message: apiMessage(e) }); }
  };

  const openEdit = (u, field) => {
    setMenuOpenId(null);
    setNotice({ type: '', message: '' });
    setModal({ user: u, field });
  };

  const onSaved = (message) => {
    setModal(null);
    setNotice({ type: 'success', message });
    load();
  };

  const onError = (e) => setNotice({ type: 'danger', message: apiMessage(e) });

  if (loading) return <Loader />;

  return (
    <div>
      <h4 className="mb-3">Manage Users</h4>
      <Notice type={notice.type} message={notice.message} onClose={() => setNotice({ type: '', message: '' })} />
      {users.length === 0 ? <EmptyState icon="bi-people" title="No users" /> : (
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Roles</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td style={{ minWidth: 160 }}>{u.name || <span className="text-muted">&mdash;</span>}</td>
                    <td style={{ minWidth: 200 }}>{u.email}</td>
                    <td>{u.roles?.map((r) => <span key={r} className="badge bg-light text-dark border me-1">{r}</span>)}</td>
                    <td>{u.blocked
                      ? <span className="badge bg-danger">Blocked</span>
                      : <span className="badge bg-success">Active</span>}</td>
                    <td className="small text-muted">{u.createdAt?.slice(0, 10)}</td>
                    <td className="text-end">
                      <div className="d-inline-flex align-items-center gap-2">
                        <button
                          className={`btn btn-sm ${u.blocked ? 'btn-outline-success' : 'btn-outline-danger'}`}
                          onClick={() => toggleBlock(u)}
                          disabled={u.roles?.includes('ADMIN')}
                        >
                          {u.blocked ? 'Unblock' : 'Block'}
                        </button>

                        <div
                          className="position-relative d-inline-block"
                          ref={(node) => {
                            if (node) menuRefs.current.set(u.id, node);
                            else menuRefs.current.delete(u.id);
                          }}
                        >
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            title="Edit user"
                            onClick={() => setMenuOpenId(menuOpenId === u.id ? null : u.id)}
                          >
                            <i className="bi bi-pencil-square me-1" /> Edit
                          </button>
                          {menuOpenId === u.id && (
                            <div className="user-edit-dropdown">
                              {Object.entries(FIELD_META).map(([field, meta]) => (
                                <button key={field} onClick={() => openEdit(u, field)}>
                                  <i className={`bi ${meta.icon}`} /> Edit {meta.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal && (
        <EditUserModal
          user={modal.user}
          field={modal.field}
          onClose={() => setModal(null)}
          onSaved={onSaved}
          onError={onError}
        />
      )}
    </div>
  );
}

function EditUserModal({ user, field, onClose, onSaved, onError }) {
  const meta = FIELD_META[field];
  const [name, setName] = useState(user.name || '');
  const [role, setRole] = useState(user.roles?.[0] || 'STUDENT');
  const [email, setEmail] = useState(user.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLocalError('');

    try {
      if (field === 'name') {
        const next = name.trim();
        if (!next) { setLocalError('Name is required.'); return; }
        setSaving(true);
        await adminApi.changeUserName(user.id, next);
        onSaved(`Name updated to "${next}".`);
      } else if (field === 'role') {
        if (role === (user.roles?.[0] || '')) { onClose(); return; }
        setSaving(true);
        await adminApi.changeUserRole(user.id, role);
        onSaved(`Role updated to ${role}.`);
      } else if (field === 'email') {
        const next = email.trim();
        if (!next) { setLocalError('Email is required.'); return; }
        if (next === user.email) { onClose(); return; }
        setSaving(true);
        await adminApi.changeUserEmail(user.id, next);
        onSaved(`Email updated to ${next}.`);
      } else if (field === 'password') {
        if (newPassword.length < 6) { setLocalError('Password must be at least 6 characters.'); return; }
        if (newPassword !== confirmPassword) { setLocalError('Passwords do not match.'); return; }
        setSaving(true);
        await adminApi.changeUserPassword(user.id, newPassword);
        onSaved(`Password updated for ${user.email}.`);
      }
    } catch (err) {
      setSaving(false);
      onError(err);
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-glass-card">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="mb-0"><i className={`bi ${meta.icon} me-2`} />Edit {meta.label}</h5>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
        </div>
        <p className="text-muted small mb-3">
          {user.name ? `${user.name} — ` : ''}{user.email}
        </p>

        <Notice type="danger" message={localError} onClose={() => setLocalError('')} />

        <form onSubmit={submit}>
          {field === 'name' && (
            <div className="mb-3">
              <label className="form-label">Full name</label>
              <input
                className="form-control" autoFocus
                value={name} onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          {field === 'role' && (
            <div className="mb-3">
              <label className="form-label">Role</label>
              <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <div className="form-text">
                Switching roles moves this user to a different dashboard. Their existing profile data for the new role (if any) is kept as-is.
              </div>
            </div>
          )}

          {field === 'email' && (
            <div className="mb-3">
              <label className="form-label">Login email</label>
              <input
                type="email" className="form-control" autoFocus
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

          {field === 'password' && (
            <>
              <div className="mb-3">
                <label className="form-label">New password</label>
                <input
                  type="password" className="form-control" autoFocus minLength={6}
                  value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                />
                <div className="form-text">At least 6 characters. The user will be signed out everywhere.</div>
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm password</label>
                <input
                  type="password" className="form-control" minLength={6}
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-brand" disabled={saving}>
              {saving ? 'Saving…' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
