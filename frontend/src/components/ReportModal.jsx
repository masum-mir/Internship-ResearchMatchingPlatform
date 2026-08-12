import { useState } from 'react';
import Modal from './Modal.jsx';
import { REPORT_CATEGORIES } from '../utils/reportCategories.js';

export default function ReportModal({ show, title = 'Report', categories, onClose, onSubmit }) {
  const options = categories || REPORT_CATEGORIES;
  const [category, setCategory] = useState('');
  const [details, setDetails] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const reset = () => {
    setCategory('');
    setDetails('');
    setError('');
    setDone(false);
  };

  const close = () => {
    reset();
    onClose?.();
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!category) {
      setError('Please choose a reason.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await onSubmit(category, details.trim());
      setDone(true);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Could not submit report.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal show={show} title={title} subtitle="Help us understand what's wrong" onClose={close}>
      {done ? (
        <div className="text-center py-3">
          <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '2.5rem' }} />
          <p className="mt-3 mb-1 fw-semibold">Thanks for letting us know.</p>
          <p className="text-muted small mb-3">
            Our admin team will review this report. We won't notify the person you reported.
          </p>
          <button className="btn btn-brand" type="button" onClick={close}>
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={submit}>
          <div className="report-category-list mb-3">
            {options.map((c) => (
              <label key={c.value} className={`report-category-option ${category === c.value ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="reportCategory"
                  value={c.value}
                  checked={category === c.value}
                  onChange={() => setCategory(c.value)}
                />
                <div>
                  <div className="fw-semibold">{c.label}</div>
                  {c.hint && <div className="text-muted small">{c.hint}</div>}
                </div>
              </label>
            ))}
          </div>

          <div className="mb-3">
            <label className="form-label">Additional details (optional)</label>
            <textarea
              className="form-control"
              rows={3}
              maxLength={2000}
              placeholder="Anything else that would help us review this?"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-outline-secondary" type="button" onClick={close}>
              Cancel
            </button>
            <button className="btn btn-danger" disabled={busy || !category}>
              {busy ? 'Submitting…' : 'Submit report'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
