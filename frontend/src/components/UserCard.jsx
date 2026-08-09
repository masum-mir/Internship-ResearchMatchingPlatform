import { Link } from 'react-router-dom';
import Avatar from './Avatar.jsx';

export default function UserCard({
  person,
  actions,
  compact = false
}) {
  if (!person) return null;

  return (
    <div className={`people-card ${compact ? 'people-card-compact' : ''}`}>
      <Link to={`/profile/${person.userId}`} className="people-avatar-link">
        <Avatar name={person.name} image={person.profilePicture} size={compact ? 48 : 64} />
      </Link>
      <div className="min-w-0 flex-grow-1">
        <Link to={`/profile/${person.userId}`} className="people-name">
          {person.name || 'User'}
        </Link>
        {person.headline && <div className="people-headline">{person.headline}</div>}
        <div className="people-meta">
          {[person.role, person.organization, person.location].filter(Boolean).join(' • ')}
        </div>
        {actions && <div className="d-flex flex-wrap gap-2 mt-2">{actions}</div>}
      </div>
    </div>
  );
}
