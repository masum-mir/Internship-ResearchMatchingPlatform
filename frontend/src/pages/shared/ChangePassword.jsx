import { useCallback, useEffect, useState } from 'react';
import { authApi } from '../../api/authApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import { timeAgo } from '../../utils/format.js';
import { useAuth } from '../../auth/AuthContext.jsx';
import Notice from '../../components/Toast.jsx';

const emptyPasswordForm = { currentPassword: '', newPassword: '' };
const emptyEmailForm = { currentPassword: '', newEmail: '' };

// Shown for both /change-password and /change-email — `section` picks which
// single form renders, so each has its own page reached from its own navbar
// link instead of a combined "Change credentials" screen.
export default function ChangePassword({ section = 'password' }) {
  const { user } = useAuth();
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [emailForm, setEmailForm] = useState(emptyEmailForm);
  const [passwordNotice, setPasswordNotice] = useState({ type: '', message: '' });
  const [emailNotice, setEmailNotice] = useState({ type: '', message: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [pending, setPending] = useState(null);
  const [selfEditBannerDismissed, setSelfEditBannerDismissed] = useState(false);

  // Known upfront from login, so we can warn before the user even tries
  // rather than only after they submit and it gets queued for approval.
  const selfEditDisabled = user && user.credentialsSelfEditEnabled === false;
  const selfEditNoticeMessage = "Direct changes are disabled for your account. Submitting below creates a " +
    "change request — an admin needs to approve it, unless they've already granted you self-edit permission.";

  const loadPending = useCallback(() => {
    authApi.myCredentialChangeRequests()
      .then((requests) => setPending((requests || []).find((r) => r.status === 'PENDING') || null))
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadPending();
  }, [loadPending]);

  // The backend only allows one pending credential-change request at a time
  // per account (regardless of whether it's for the email, the password, or
  // both), so both forms share the same pending state and are disabled
  // together until it's resolved.
  const pendingDescribes = (() => {
    if (!pending) return '';
    if (pending.requestedEmail && pending.passwordChangeRequested) return 'email and password change';
    if (pending.requestedEmail) return 'email change';
    return 'password change';
  })();

  const submitPassword = async (e) => {
    e.preventDefault();
    setPasswordNotice({ type: '', message: '' });
    setPasswordLoading(true);
    try {
      const result = await authApi.requestCredentialChange({
        currentPassword: passwordForm.currentPassword,
        password: passwordForm.newPassword
      });
      setPasswordForm(emptyPasswordForm);
      if (result.status === 'APPROVED') {
        setPasswordNotice({ type: 'success', message: 'Password changed. You may need to sign in again on other devices.' });
      } else {
        setPasswordNotice({
          type: 'info',
          message: "Your password change has been submitted and is awaiting admin approval. You'll be notified once it's reviewed."
        });
        loadPending();
      }
    } catch (err) {
      setPasswordNotice({ type: 'danger', message: apiMessage(err) });
    } finally {
      setPasswordLoading(false);
    }
  };

  const submitEmail = async (e) => {
    e.preventDefault();
    setEmailNotice({ type: '', message: '' });
    setEmailLoading(true);
    try {
      const result = await authApi.requestCredentialChange({
        currentPassword: emailForm.currentPassword,
        email: emailForm.newEmail
      });
      setEmailForm(emptyEmailForm);
      if (result.status === 'APPROVED') {
        setEmailNotice({ type: 'success', message: 'Email changed. Use your new email address next time you sign in.' });
      } else {
        setEmailNotice({
          type: 'info',
          message: "Your email change has been submitted and is awaiting admin approval. You'll be notified once it's reviewed."
        });
        loadPending();
      }
    } catch (err) {
      setEmailNotice({ type: 'danger', message: apiMessage(err) });
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480 }}>
      <h4 className="mb-3">{section === 'email' ? 'Change email' : 'Change password'}</h4>

      {pending && (
        <div className="alert alert-info">
          You already have a {pendingDescribes} request pending admin review (submitted {timeAgo(pending.createdAt)}).
          Submitting another isn't needed until that's resolved.
        </div>
      )}

      {section === 'password' && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <Notice type={passwordNotice.type} message={passwordNotice.message} onClose={() => setPasswordNotice({ type: '', message: '' })} />
            <form onSubmit={submitPassword}>
              {selfEditDisabled && !selfEditBannerDismissed && (
                <Notice type="danger" message={selfEditNoticeMessage} onClose={() => setSelfEditBannerDismissed(true)} />
              )}
              <div className="mb-3">
                <label className="form-label">Current password</label>
                <input type="password" className="form-control" value="••••••••" disabled readOnly />
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm current password</label>
                <input type="password" className="form-control" required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} />
                <div className="form-text">Required to confirm it's really you before changing your password.</div>
              </div>
              <div className="mb-3">
                <label className="form-label">New password</label>
                <input type="password" className="form-control" required minLength={6}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
              </div>
              <button className="btn btn-brand" disabled={passwordLoading || Boolean(pending)}>
                {passwordLoading ? 'Saving...' : 'Update password'}
              </button>
            </form>
          </div>
        </div>
      )}

      {section === 'email' && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <Notice type={emailNotice.type} message={emailNotice.message} onClose={() => setEmailNotice({ type: '', message: '' })} />
            <form onSubmit={submitEmail}>
              {selfEditDisabled && !selfEditBannerDismissed && (
                <Notice type="danger" message={selfEditNoticeMessage} onClose={() => setSelfEditBannerDismissed(true)} />
              )}
              <div className="mb-3">
                <label className="form-label">Current email</label>
                <input type="email" className="form-control" value={user?.email || ''} disabled readOnly />
              </div>
              <div className="mb-3">
                <label className="form-label">New email</label>
                <input type="email" className="form-control" required
                  value={emailForm.newEmail}
                  onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label">Current password</label>
                <input type="password" className="form-control" required
                  value={emailForm.currentPassword}
                  onChange={(e) => setEmailForm({ ...emailForm, currentPassword: e.target.value })} />
                <div className="form-text">Required to confirm it's really you before changing your login email.</div>
              </div>
              <button className="btn btn-brand" disabled={emailLoading || Boolean(pending)}>
                {emailLoading ? 'Saving...' : 'Update email'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="text-muted small">
        If your account doesn't have self-edit permission enabled, this submits a request for an admin to approve
        instead of applying immediately.
      </div>
    </div>
  );
}
