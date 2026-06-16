const MAP = {
  PENDING: 'bg-secondary',
  SHORTLISTED: 'bg-info text-dark',
  ACCEPTED: 'bg-success',
  REJECTED: 'bg-danger'
};

export default function StatusBadge({ status }) {
  return <span className={`badge ${MAP[status] || 'bg-secondary'}`}>{status}</span>;
}
