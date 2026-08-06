import { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import Loader from '../../components/Loader.jsx';
import Notice from '../../components/Toast.jsx';
import ProfileHeader from '../../components/ProfileHeader.jsx';

export default function AdminProfile() {
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState({ type: '', message: '' });

  const load = () =>
    adminApi.getMyProfile().then(setP)
      .catch((e) => setNotice({ type: 'danger', message: apiMessage(e) }));

  useEffect(() => { load().finally(() => setLoading(false)); }, []);

  const handleProfileImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const uploadResponse = await adminApi.uploadProfileImage(file);
      await adminApi.updateMyProfile({ profilePicture: uploadResponse.filename });
      await load();
    } catch (err) {
      setNotice({ type: 'danger', message: apiMessage(err) });
    }
  };

  const handleCoverImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const uploadResponse = await adminApi.uploadCoverImage(file);
      await adminApi.updateMyProfile({ coverPicture: uploadResponse.filename });
      await load();
    } catch (err) {
      setNotice({ type: 'danger', message: apiMessage(err) });
    }
  };

  if (loading) return <Loader />;
  if (!p) return <Notice type="danger" message={notice.message} />;

  return (
    <div style={{ maxWidth: 720 }}>
      <ProfileHeader
        name={p.email}
        subtitle="Administrator"
        meta={[`Roles: ${(p.roles || []).join(', ')}`]}
        profilePicture={p.profilePicture}
        coverPicture={p.coverPicture}
        onProfileImageUpload={handleProfileImageUpload}
        onCoverImageUpload={handleCoverImageUpload}
      />
      <Notice type={notice.type} message={notice.message} onClose={() => setNotice({ type: '', message: '' })} />
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <p className="text-muted mb-0">
            Admin accounts only manage a profile picture and cover photo here — contact
            info is tied to your login email.
          </p>
        </div>
      </div>
    </div>
  );
}
