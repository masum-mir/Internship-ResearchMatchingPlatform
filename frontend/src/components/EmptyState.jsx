export default function EmptyState({ icon = 'bi-inbox', title, message, children }) {
  return (
    <div className="text-center text-muted py-5">
      <i className={`bi ${icon} fs-1 d-block mb-2`} />
      <h6 className="mb-1">{title}</h6>
      {message && <p className="small mb-3">{message}</p>}
      {children}
    </div>
  );
}
