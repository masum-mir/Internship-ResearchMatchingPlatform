import { useCallback, useEffect, useState } from 'react';
import { companyApi } from '../../api/profileApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import { notifyProfileUpdated } from '../../utils/profileEvents.js';
import Loader from '../../components/Loader.jsx';
import Notice from '../../components/Toast.jsx';
import ProfileHeader from '../../components/ProfileHeader.jsx';
function payload(p) {
  return {
    companyName: p?.companyName || '',
    description: p?.description || '',
    website: p?.website || '',
    location: p?.location || '',
    industry: p?.industry || '',
    companySize: p?.companySize || '',
    foundedDate: p?.foundedDate || null,
    contactNumber: p?.contactNumber || '',
    companyEmail: p?.companyEmail || '',
    profilePicture: p?.profilePicture || null,
    coverPicture: p?.coverPicture || null
  };
}

export default function CompanyProfile() {
  const [p, setP] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState({ type: '', message: '' });

  const load = useCallback(async () => {
    try {
      const data = await companyApi.getMyProfile();
      setP(data);
      setForm(payload(data));
    } catch (e) {
      setNotice({ type: 'danger', message: apiMessage(e) });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const updated = await companyApi.updateMyProfile(form);
      setP(updated);
      setForm(payload(updated));
      notifyProfileUpdated();
      setNotice({ type: 'success', message: 'Company profile updated.' });
    } catch (e) {
      setNotice({ type: 'danger', message: apiMessage(e) });
    } finally {
      setSaving(false);
    }
  };

  const upload = async (key, file) => {
    if (!file) return;
    setSaving(true);
    try {
      const updated = await companyApi.updateMyProfile(payload(p), { [key]: file });
      setP(updated);
      setForm(payload(updated));
      notifyProfileUpdated();
      setNotice({ type: 'success', message: 'Company photo updated.' });
    } catch (e) {
      setNotice({ type: 'danger', message: apiMessage(e) });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;
  if (!p || !form) return <Notice type="danger" message={notice.message || 'Profile unavailable'} />;

  return (
    <div className="profile-edit-page">
      <Notice type={notice.type} message={notice.message} onClose={() => setNotice({ type: '', message: '' })} />

      <ProfileHeader
        name={p.companyName || 'Company'}
        subtitle={p.industry || 'Company profile'}
        meta={[p.location, p.website, p.verified ? 'Verified company' : null]}
        profilePicture={p.profilePicture}
        coverPicture={p.coverPicture}
        onProfileImageUpload={(e) => upload('profilePicture', e.target.files?.[0])}
        onCoverImageUpload={(e) => upload('coverPicture', e.target.files?.[0])}
        actions={
          <a className="btn btn-outline-primary btn-sm" href={`/profile/${p.userId}`}>
            <i className="bi bi-arrow-left me-1" />
            Back to profile
          </a>
        }
      />

      <form className="social-card profile-section" onSubmit={save}>
        <div className="section-heading">
          <div>
            <h5>Company information</h5>
            <p>This information is shown to students and on your opportunity posts.</p>
          </div>
          {p.verified && <span className="verified-badge"><i className="bi bi-patch-check-fill" /> Verified</span>}
        </div>

        <div className="row g-3">
          <div className="col-md-7">
            <label className="form-label">Company name</label>
            <input className="form-control" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
          </div>
          <div className="col-md-5">
            <label className="form-label">Industry</label>
            <input className="form-control" placeholder="Software, FinTech, Telecommunications…" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
          </div>

          <div className="col-md-6">
            <label className="form-label">Website</label>
            <input type="url" className="form-control" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Location</label>
            <input className="form-control" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>

          <div className="col-md-4">
            <label className="form-label">Company size</label>
            <input className="form-control" placeholder="e.g. 51-200 employees" value={form.companySize} onChange={(e) => setForm({ ...form, companySize: e.target.value })} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Founded date</label>
            <input type="date" className="form-control" value={form.foundedDate || ''} onChange={(e) => setForm({ ...form, foundedDate: e.target.value || null })} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Contact number</label>
            <input className="form-control" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
          </div>

          <div className="col-md-6">
            <label className="form-label">Public contact email</label>
            <input type="email" className="form-control" value={form.companyEmail} onChange={(e) => setForm({ ...form, companyEmail: e.target.value })} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Login email</label>
            <input className="form-control" value={p.email || ''} disabled />
          </div>

          <div className="col-12">
            <label className="form-label">About the company</label>
            <textarea className="form-control" rows={7} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
        </div>

        <button className="btn btn-brand mt-4" disabled={saving}>
          {saving ? 'Saving…' : 'Save company profile'}
        </button>
      </form>
    </div>
  );
}
