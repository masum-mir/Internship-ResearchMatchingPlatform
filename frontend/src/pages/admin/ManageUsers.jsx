import { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import Loader from '../../components/Loader.jsx';
import Notice from '../../components/Toast.jsx';
import EmptyState from '../../components/EmptyState.jsx';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState({ type: '', message: '' });

  const load = () => {
    setLoading(true);
    adminApi.listUsers().then(setUsers)
      .catch((e) => setNotice({ type: 'danger', message: apiMessage(e) }))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const toggle = async (u) => {
    try {
      if (u.blocked) await adminApi.unblockUser(u.id);
      else await adminApi.blockUser(u.id);
      load();
    } catch (e) { setNotice({ type: 'danger', message: apiMessage(e) }); }
  };

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
                <tr><th>Email</th><th>Roles</th><th>Status</th><th>Joined</th><th className="text-end">Action</th></tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.email}</td>
                    <td>{u.roles?.map((r) => <span key={r} className="badge bg-light text-dark border me-1">{r}</span>)}</td>
                    <td>{u.blocked
                      ? <span className="badge bg-danger">Blocked</span>
                      : <span className="badge bg-success">Active</span>}</td>
                    <td className="small text-muted">{u.createdAt?.slice(0, 10)}</td>
                    <td className="text-end">
                      <button className={`btn btn-sm ${u.blocked ? 'btn-outline-success' : 'btn-outline-danger'}`}
                        onClick={() => toggle(u)} disabled={u.roles?.includes('ADMIN')}>
                        {u.blocked ? 'Unblock' : 'Block'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
