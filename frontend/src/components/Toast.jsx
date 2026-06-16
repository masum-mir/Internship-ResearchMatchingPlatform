// Lightweight inline alert used for success/error feedback.
export default function Notice({ type = 'info', message, onClose }) {
  if (!message) return null;
  return (
    <div className={`alert alert-${type} alert-dismissible d-flex align-items-center`} role="alert">
      <div className="flex-grow-1">{message}</div>
      {onClose && <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />}
    </div>
  );
}
