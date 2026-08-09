import { enumLabel } from '../utils/format.js';

const MAP = {
  PENDING: 'bg-secondary',
  SHORTLISTED: 'bg-info text-dark',
  ACCEPTED: 'bg-success',
  REJECTED: 'bg-danger',
  WITHDRAWN: 'bg-light text-muted border'
};

export default function StatusBadge({ status }) {
  return <span className={`badge ${MAP[status] || 'bg-secondary'}`}>{enumLabel(status)}</span>;
}
