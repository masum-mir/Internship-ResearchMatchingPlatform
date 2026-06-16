import { useEffect, useState } from 'react';
import { companyApi } from '../../api/profileApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import Loader from '../../components/Loader.jsx';
import Notice from '../../components/Toast.jsx';
import ProfileHeader from '../../components/ProfileHeader.jsx';

export default function CompanyProfile() {
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState({ type: '', message: '' });

  useEffect(() => {
    companyApi.getMyProfile().then(setP)
      .catch((e) => setNotice({ type: 'danger', message: apiMessage(e) }))
      .finally(() => setLoading(false));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      const { companyName, description, website, location, contactNumber } = p;
      const updated = await companyApi.updateMyProfile({ companyName, description, website, location, contactNumber });
      setP(updated);
      setNotice({ type: 'success', message: 'Profile saved.' });
    } catch (err) { setNotice({ type: 'danger', message: apiMessage(err) }); }
  };

  if (loading) return <Loader />;
  if (!p) return <Notice type="danger" message={notice.message} />;
  const set = (k, v) => setP({ ...p, [k]: v });

  return (
    <div style={{ maxWidth: 720 }}>
      <ProfileHeader
        name={p.companyName || "Your company"}
        subtitle="Company profile"
        meta={[p.location, p.website, p.email]}
      />
      <Notice type={notice.type} message={notice.message} onClose={() => setNotice({ type: '', message: '' })} />
      <form onSubmit={save} className="card border-0 shadow-sm">
        <div className="card-body row g-3">
          <div className="col-md-6"><label className="form-label">Company name</label>
            <input className="form-control" value={p.companyName || ''} onChange={(e) => set('companyName', e.target.value)} /></div>
          <div className="col-md-6"><label className="form-label">Website</label>
            <input className="form-control" value={p.website || ''} onChange={(e) => set('website', e.target.value)} /></div>
          <div className="col-md-6"><label className="form-label">Location</label>
            <input className="form-control" value={p.location || ''} onChange={(e) => set('location', e.target.value)} /></div>
          <div className="col-md-6"><label className="form-label">Contact</label>
            <input className="form-control" value={p.contactNumber || ''} onChange={(e) => set('contactNumber', e.target.value)} /></div>
          <div className="col-12"><label className="form-label">Description</label>
            <textarea className="form-control" rows={3} value={p.description || ''} onChange={(e) => set('description', e.target.value)} /></div>
          <div className="col-12"><button className="btn btn-brand">Save</button></div>
        </div>
      </form>
    </div>
  );
}
