export default function PageTitle({ title, subtitle, action }) {
  return (
    <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4">
      <div>
        <h3 className="mb-1">{title}</h3>
        {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
