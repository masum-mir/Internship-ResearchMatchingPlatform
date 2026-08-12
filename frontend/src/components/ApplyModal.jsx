import { useEffect, useState } from 'react';
import { applicationApi } from '../api/applicationApi.js';
import { apiMessage } from '../api/axiosClient.js';
import { isOpportunityClosed } from '../utils/format.js';
import Modal from './Modal.jsx';

export default function ApplyModal({ show, opportunity, type, onClose, onApplied }) {
  const [coverLetter, setCoverLetter] = useState('');
  const [applicantNote, setApplicantNote] = useState('');
  const [resume, setResume] = useState(null);
  const [useSavedResume, setUseSavedResume] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!show) return;
    setCoverLetter('');
    setApplicantNote('');
    setResume(null);
    setUseSavedResume(true);
    setError('');
  }, [show, opportunity?.id]);

  if (!opportunity) return null;

  const title = type === 'RESEARCH' ? opportunity.topic : opportunity.title;
  const closed = isOpportunityClosed(opportunity);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      const result = await applicationApi.apply(
        {
          targetType: type,
          targetId: opportunity.id,
          resumeUrl: useSavedResume ? null : null,
          coverLetter: coverLetter.trim() || null,
          applicantNote: applicantNote.trim() || null
        },
        useSavedResume ? null : resume
      );
      onApplied?.(result);
      onClose?.();
    } catch (e) {
      setError(apiMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      show={show}
      title={`Apply to ${title}`}
      subtitle="Your current profile will be used for matching."
      onClose={onClose}
      size="lg"
    >
      <form onSubmit={submit}>
        <div className="application-note mb-3">
          <i className="bi bi-info-circle-fill" />
          <div>
            <strong>Resume</strong>
            <div className="small">
              Use the resume saved on your profile, or upload a different one for this application.
            </div>
          </div>
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="savedResume"
            checked={useSavedResume}
            onChange={(e) => setUseSavedResume(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="savedResume">
            Use my saved profile resume
          </label>
        </div>

        {!useSavedResume && (
          <div className="mb-3">
            <label className="form-label">Upload resume</label>
            <input
              type="file"
              className="form-control"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              required
              onChange={(e) => setResume(e.target.files?.[0] || null)}
            />
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Cover letter</label>
          <textarea
            className="form-control"
            rows={7}
            maxLength={10000}
            placeholder="Introduce yourself and explain why this opportunity is a good fit."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
          <div className="form-text text-end">{coverLetter.length}/10000</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Additional note</label>
          <textarea
            className="form-control"
            rows={3}
            maxLength={5000}
            placeholder="Optional note for the reviewer"
            value={applicantNote}
            onChange={(e) => setApplicantNote(e.target.value)}
          />
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}
        {closed && !error && (
          <div className="alert alert-warning py-2">This opportunity is no longer accepting applications.</div>
        )}

        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-brand"
            disabled={busy || closed || (!useSavedResume && !resume)}
          >
            {busy ? 'Submitting…' : 'Submit application'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
