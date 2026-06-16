import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-5">
      <h1 className="display-4 fw-bold text-brand">404</h1>
      <p className="text-muted">That page doesn’t exist.</p>
      <Link to="/" className="btn btn-brand">Back to home</Link>
    </div>
  );
}
