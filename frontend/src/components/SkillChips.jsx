export function SkillChips({ skills = [], missing = false }) {
  if (!skills.length) return <span className="text-muted small">—</span>;
  return (
    <span>
      {skills.map((s, i) => (
        <span key={i} className={`skill-chip ${missing ? 'missing' : ''}`}>
          {typeof s === 'string' ? s : s.name}
        </span>
      ))}
    </span>
  );
}
