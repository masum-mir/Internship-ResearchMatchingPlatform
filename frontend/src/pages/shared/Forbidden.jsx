import { Link } from 'react-router-dom';

export default function Forbidden() {
  return (
    <div className="text-center py-5">
      <h1 className="display-4 fw-bold text-danger">403</h1>
      <p className="text-muted">You don’t have permission to view this page.</p>
      <Link to="/" className="btn btn-brand">Back to home</Link>
    </div>
  );
}
