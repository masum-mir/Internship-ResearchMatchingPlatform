import { Link } from 'react-router-dom';
import { enumLabel, formatDate, formatMoney, isOpportunityClosed, joinNonEmpty } from '../utils/format.js';
import MatchScoreBadge from './MatchScoreBadge.jsx';
import SkillChips from './SkillChips.jsx';

function matchData(item) {
  return item?.match || null;
}

export default function OpportunityCard({
  type,
  opportunity,
  match,
  onView,
  onApply,
  onBookmark,
  bookmarked = false,
  applied = false,
  ownerActions
}) {
  const isResearch = type === 'RESEARCH';
  const closed = isOpportunityClosed(opportunity);
  const title = isResearch ? opportunity.topic : opportunity.title;
  const owner = isResearch ? opportunity.facultyName : opportunity.companyName;
  const ownerUserId = isResearch ? opportunity.facultyUserId : opportunity.companyUserId;
  const skills = opportunity.requiredSkills || [];
  const salary = !isResearch
    ? formatMoney(opportunity.salaryMin, opportunity.salaryMax, opportunity.salaryCurrency)
    : opportunity.funded && opportunity.stipendAmount != null
      ? `${opportunity.stipendCurrency || 'BDT'} ${Number(opportunity.stipendAmount).toLocaleString()} stipend`
      : null;

  return (
    <article className="opportunity-card social-card">
      <div className="d-flex justify-content-between align-items-start gap-3">
        <div className="min-w-0">
          <div className="opportunity-type-label">
            <i className={`bi ${isResearch ? 'bi-journal-richtext' : 'bi-briefcase-fill'}`} />
            {isResearch ? 'Research opportunity' : 'Internship'}
          </div>
          <h5 className="opportunity-title">{title}</h5>
          {ownerUserId ? (
            <Link to={`/profile/${ownerUserId}`} className="opportunity-owner">{owner}</Link>
          ) : (
            <div className="opportunity-owner">{owner}</div>
          )}
          <div className="opportunity-meta">
            {joinNonEmpty([
              opportunity.location,
              enumLabel(opportunity.workMode),
              !isResearch ? enumLabel(opportunity.employmentType) : opportunity.duration
            ])}
          </div>
        </div>

        {match && <MatchScoreBadge score={match.finalScore} />}
      </div>

      <div className="opportunity-facts">
        {opportunity.requiredCgpa != null || opportunity.minCgpa != null ? (
          <span><i className="bi bi-mortarboard" /> CGPA ≥ {opportunity.requiredCgpa ?? opportunity.minCgpa}</span>
        ) : null}
        {salary && <span><i className="bi bi-cash-stack" /> {salary}</span>}
        {(opportunity.vacancies || opportunity.availablePositions) && (
          <span><i className="bi bi-people" /> {opportunity.vacancies ?? opportunity.availablePositions} positions</span>
        )}
        {(opportunity.deadline || opportunity.applicationDeadline) && (
          <span><i className="bi bi-calendar-event" /> Deadline {formatDate(opportunity.deadline || opportunity.applicationDeadline)}</span>
        )}
      </div>

      {opportunity.description && (
        <p className="opportunity-description">
          {opportunity.description.length > 260
            ? `${opportunity.description.slice(0, 260)}…`
            : opportunity.description}
        </p>
      )}

      {skills.length > 0 && <SkillChips skills={skills.slice(0, 8)} />}

      {match && (
        <div className="match-explanation">
          <div>
            <strong>Skills</strong>
            <span>{Math.round((match.skillMatch || 0) * 100)}%</span>
          </div>
          <div>
            <strong>CGPA</strong>
            <span>{Math.round((match.cgpaMatch || 0) * 100)}%</span>
          </div>
          <div>
            <strong>Department</strong>
            <span>{Math.round((match.departmentMatch || 0) * 100)}%</span>
          </div>
          {match.matchedSkills?.length > 0 && (
            <p><i className="bi bi-check-circle-fill text-success" /> Matched: {match.matchedSkills.join(', ')}</p>
          )}
          {match.missingSkills?.length > 0 && (
            <p><i className="bi bi-exclamation-circle text-warning" /> Consider learning: {match.missingSkills.join(', ')}</p>
          )}
        </div>
      )}

      <div className="opportunity-actions">
        {onView && (
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={onView}>
            View details
          </button>
        )}
        {onApply && (
          applied ? (
            <button type="button" className="btn btn-outline-success btn-sm" disabled>
              <i className="bi bi-check2-circle me-1" /> Applied
            </button>
          ) : closed ? (
            <button type="button" className="btn btn-outline-secondary btn-sm" disabled title="This opportunity is no longer accepting applications">
              Closed
            </button>
          ) : (
            <button type="button" className="btn btn-brand btn-sm" onClick={onApply}>
              Apply
            </button>
          )
        )}
        {onBookmark && (
          <button
            type="button"
            className={`btn btn-sm ${bookmarked ? 'btn-outline-secondary' : 'btn-light'}`}
            onClick={onBookmark}
            title="Save opportunity"
          >
            <i className={`bi ${bookmarked ? 'bi-bookmark-fill' : 'bi-bookmark'}`} />
          </button>
        )}
        {ownerActions && <div className="ms-auto d-flex gap-2">{ownerActions}</div>}
      </div>
    </article>
  );
}
