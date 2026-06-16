// Color-coded by score band: strong / fair / weak.
export default function MatchScoreBadge({ score }) {
  const value = Math.round(score ?? 0);
  let cls = 'bg-secondary';
  if (value >= 75) cls = 'bg-success';
  else if (value >= 50) cls = 'bg-warning text-dark';
  else if (value > 0) cls = 'bg-danger';
  return <span className={`badge match-badge ${cls}`}>{value}% match</span>;
}
