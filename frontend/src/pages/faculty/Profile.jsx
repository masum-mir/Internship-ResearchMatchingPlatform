import { useCallback, useEffect, useState } from 'react';
import { facultyApi } from '../../api/profileApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import { notifyProfileUpdated } from '../../utils/profileEvents.js';
import Loader from '../../components/Loader.jsx';
import Notice from '../../components/Toast.jsx';
import ProfileHeader from '../../components/ProfileHeader.jsx';
import ProfessionalSections from '../../components/ProfessionalSections.jsx';

function payload(p) {
  return {
    name: p?.name || '',
    department: p?.department || '',
    designation: p?.designation || '',
    bio: p?.bio || '',
    specialization: p?.specialization || '',
    researchInterests: p?.researchInterests || '',
    contactNumber: p?.contactNumber || '',
    university: p?.university || '',
    location: p?.location || '',
    profilePicture: p?.profilePicture || null,
    coverPicture: p?.coverPicture || null,
    googleScholarUrl: p?.googleScholarUrl || '',
    orcidId: p?.orcidId || '',
    researchgateUrl: p?.researchgateUrl || '',
    linkedinUrl: p?.linkedinUrl || '',
    universityProfileUrl: p?.universityProfileUrl || '',
    availableForSupervision: Boolean(p?.availableForSupervision)
  };
}

export default function FacultyProfile() {
  const [p, setP] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState({ type: '', message: '' });

  const load = useCallback(async () => {
    try {
      const data = await facultyApi.getMyProfile();
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
      const updated = await facultyApi.updateMyProfile(form);
      setP(updated);
      setForm(payload(updated));
      notifyProfileUpdated();
      setNotice({ type: 'success', message: 'Faculty profile updated.' });
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
      const updated = await facultyApi.updateMyProfile(payload(p), { [key]: file });
      setP(updated);
      setForm(payload(updated));
      notifyProfileUpdated();
      setNotice({ type: 'success', message: 'Photo updated.' });
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
        name={p.name || 'Faculty member'}
        subtitle={[p.designation, p.specialization].filter(Boolean).join(' • ') || 'Faculty profile'}
        meta={[p.email]}
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
            <h5>Academic profile</h5>
           </div>
          {/* <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="availableSupervision"
              checked={form.availableForSupervision}
              onChange={(e) => setForm({ ...form, availableForSupervision: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="availableSupervision">Available for supervision</label>
          </div> */}
        </div>

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Name</label>
            <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Designation</label>
            <input className="form-control" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
          </div>

          <div className="col-md-6">
            <label className="form-label">Department</label>
            <input className="form-control" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          </div>
          <div className="col-md-6">
            <label className="form-label">University</label>
            <input className="form-control" value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} />
          </div>
          

          <div className="col-md-6">
            <label className="form-label">Specialization</label>
            <input className="form-control" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Location</label>
            <input className="form-control" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>

          <div className="col-md-6">
            <label className="form-label">Contact number</label>
            <input className="form-control" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input className="form-control" value={p.email || ''} disabled />
          </div>

          <div className="col-12">
            <label className="form-label">Bio</label>
            <textarea className="form-control" rows={5} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>

          <div className="col-12">
            <label className="form-label">Research interests</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="AI, IoT, Cybersecurity, Networks…"
              value={form.researchInterests}
              onChange={(e) => setForm({ ...form, researchInterests: e.target.value })}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Google Scholar URL</label>
            <input type="url" className="form-control" value={form.googleScholarUrl} onChange={(e) => setForm({ ...form, googleScholarUrl: e.target.value })} />
          </div>
          <div className="col-md-6">
            <label className="form-label">ORCID</label>
            <input className="form-control" value={form.orcidId} onChange={(e) => setForm({ ...form, orcidId: e.target.value })} />
          </div>
          <div className="col-md-4">
            <label className="form-label">ResearchGate URL</label>
            <input type="url" className="form-control" value={form.researchgateUrl} onChange={(e) => setForm({ ...form, researchgateUrl: e.target.value })} />
          </div>
          <div className="col-md-4">
            <label className="form-label">LinkedIn URL</label>
            <input type="url" className="form-control" value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} />
          </div>
          <div className="col-md-4">
            <label className="form-label">University profile URL</label>
            <input type="url" className="form-control" value={form.universityProfileUrl} onChange={(e) => setForm({ ...form, universityProfileUrl: e.target.value })} />
          </div>
        </div>

        <button className="btn btn-brand mt-4" disabled={saving}>
          {saving ? 'Saving…' : 'Save faculty profile'}
        </button>
      </form>

      <ProfessionalSections editable />
    </div>
  );
}
