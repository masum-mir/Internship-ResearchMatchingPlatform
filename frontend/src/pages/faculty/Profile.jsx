import { useEffect, useState } from 'react';
import { facultyApi } from '../../api/profileApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import Loader from '../../components/Loader.jsx';
import Notice from '../../components/Toast.jsx';
import ProfileHeader from '../../components/ProfileHeader.jsx';

export default function FacultyProfile() {
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState({ type: '', message: '' });

  useEffect(() => {
    facultyApi.getMyProfile().then(setP)
      .catch((e) => setNotice({ type: 'danger', message: apiMessage(e) }))
      .finally(() => setLoading(false));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      const { name, department, designation, contactNumber } = p;
      setP(await facultyApi.updateMyProfile({ name, department, designation, contactNumber }));
      setNotice({ type: 'success', message: 'Profile saved.' });
    } catch (err) { setNotice({ type: 'danger', message: apiMessage(err) }); }
  };

  if (loading) return <Loader />;
  if (!p) return <Notice type="danger" message={notice.message} />;
  const set = (k, v) => setP({ ...p, [k]: v });

  return (
    <div style={{ maxWidth: 640 }}>
      <ProfileHeader
        name={p.name || "Faculty member"}
        subtitle={p.designation || "Faculty profile"}
        meta={[p.department, p.email]}
      />
      <Notice type={notice.type} message={notice.message} onClose={() => setNotice({ type: '', message: '' })} />
      <form onSubmit={save} className="card border-0 shadow-sm">
        <div className="card-body row g-3">
          <div className="col-md-6"><label className="form-label">Name</label>
            <input className="form-control" value={p.name || ''} onChange={(e) => set('name', e.target.value)} /></div>
          <div className="col-md-6"><label className="form-label">Department</label>
            <input className="form-control" value={p.department || ''} onChange={(e) => set('department', e.target.value)} /></div>
          <div className="col-md-6"><label className="form-label">Designation</label>
            <input className="form-control" value={p.designation || ''} onChange={(e) => set('designation', e.target.value)} /></div>
          <div className="col-md-6"><label className="form-label">Contact</label>
            <input className="form-control" value={p.contactNumber || ''} onChange={(e) => set('contactNumber', e.target.value)} /></div>
          <div className="col-12"><button className="btn btn-brand">Save</button></div>
        </div>
      </form>
    </div>
  );
}
