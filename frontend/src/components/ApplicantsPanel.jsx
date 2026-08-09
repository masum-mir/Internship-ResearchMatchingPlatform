import { useState } from 'react';
import { Link } from 'react-router-dom';
import { applicationApi } from '../api/applicationApi.js';
import { apiMessage } from '../api/axiosClient.js';
import { enumLabel, formatDate } from '../utils/format.js';
import { resolveUploadUrl } from '../utils/imageUrl.js';
import MatchScoreBadge from './MatchScoreBadge.jsx';
import StatusBadge from './StatusBadge.jsx';
import EmptyState from './EmptyState.jsx';
import Modal from './Modal.jsx';

const REVIEW_STATUSES = ['PENDING', 'SHORTLISTED', 'ACCEPTED', 'REJECTED'];

export default function ApplicantsPanel({ applicants, onReload }) {
  const [reviewing, setReviewing] = useState(null);
  const [status, setStatus] = useState('SHORTLISTED');
  const [reviewerNote, setReviewerNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const openReview = (applicant) => {
    setReviewing(applicant);
    setStatus(applicant.status || 'SHORTLISTED');
    setReviewerNote(applicant.reviewerNote || '');
    setError('');
  };

  const saveReview = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      await applicationApi.updateStatus(reviewing.applicationId, status, reviewerNote);
      setReviewing(null);
      await onReload?.();
    } catch (e) {
      setError(apiMessage(e));
    } finally {
      setBusy(false);
    }
  };

  if (!applicants?.length) {
    return (
      <div className="social-card">
        <EmptyState icon="bi-people" title="No applicants yet" />
      </div>
    );
  }

  return (
    <>
      <div className="applicant-list">
        {applicants.map((a) => (
          <article className="social-card applicant-card" key={a.applicationId}>
            <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap">
              <div>
                <h5 className="mb-1">{a.studentName}</h5>
                <div className="text-muted">
                  {[a.headline, a.department, a.studentIdNumber].filter(Boolean).join(' • ')}
                </div>
                <div className="d-flex gap-2 flex-wrap mt-2">
                  <MatchScoreBadge score={a.matchScore} />
                  <StatusBadge status={a.status} />
                  {a.cgpa != null && <span className="badge bg-light text-dark border">CGPA {a.cgpa}</span>}
                </div>
              </div>
              <div className="text-muted small">Applied {formatDate(a.appliedAt)}</div>
            </div>

            {(a.coverLetter || a.applicantNote) && (
              <div className="applicant-notes">
                {a.coverLetter && (
                  <div>
                    <strong>Cover letter</strong>
                    <p className="pre-line">{a.coverLetter}</p>
                  </div>
                )}
                {a.applicantNote && (
                  <div>
                    <strong>Applicant note</strong>
                    <p className="pre-line">{a.applicantNote}</p>
                  </div>
                )}
              </div>
            )}

            {a.reviewerNote && (
              <div className="reviewer-note">
                <strong>Your review note:</strong> {a.reviewerNote}
              </div>
            )}

            <div className="applicant-actions">
              {/* <Link className="btn btn-outline-primary btn-sm" to={`/portfolio/${a.studentId}`}>
                <i className="bi bi-person-vcard me-1" /> View portfolio
              </Link> */}
              {a.studentUserId && (
                <Link className="btn btn-light btn-sm" to={`/profile/${a.studentUserId}`}>
                  Public profile
                </Link>
              )}
              {a.resumeUrl && (
                <a className="btn btn-light btn-sm" href={resolveUploadUrl(a.resumeUrl)} target="_blank" rel="noreferrer">
                  <i className="bi bi-file-earmark-pdf me-1" /> Resume
                </a>
              )}
              <button className="btn btn-brand btn-sm ms-auto" onClick={() => openReview(a)}>
                Review application
              </button>
            </div>
          </article>
        ))}
      </div>

      <Modal show={Boolean(reviewing)} title={`Review ${reviewing?.studentName || 'application'}`} onClose={() => setReviewing(null)}>
        {reviewing && (
          <form onSubmit={saveReview}>
            <div className="mb-3">
              <label className="form-label">Application status</label>
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                {REVIEW_STATUSES.map((x) => <option key={x} value={x}>{enumLabel(x)}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Reviewer note</label>
              <textarea
                className="form-control"
                rows={5}
                maxLength={5000}
                placeholder="Optional internal/applicant-facing note"
                value={reviewerNote}
                onChange={(e) => setReviewerNote(e.target.value)}
              />
            </div>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary" onClick={() => setReviewing(null)}>Cancel</button>
              <button className="btn btn-brand" disabled={busy}>{busy ? 'Saving…' : 'Save review'}</button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
