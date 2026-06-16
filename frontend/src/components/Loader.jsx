export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="d-flex align-items-center justify-content-center py-5 text-muted">
      <div className="spinner-border text-primary me-2" role="status" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
