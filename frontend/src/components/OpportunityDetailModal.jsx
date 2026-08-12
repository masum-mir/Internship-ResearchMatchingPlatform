import { enumLabel, formatDate, formatMoney, isOpportunityClosed, joinNonEmpty } from '../utils/format.js';
import Modal from './Modal.jsx';
import SkillChips from './SkillChips.jsx';

function TextSection({ title, value }) {
  if (!value) return null;
  return (
    <section className="opportunity-detail-section">
      <h6>{title}</h6>
      <div className="pre-line">{value}</div>
    </section>
  );
}

export default function OpportunityDetailModal({ show, type, opportunity, match, onClose, onApply, applied = false }) {
  if (!opportunity) return null;
  const isResearch = type === 'RESEARCH';
  const closed = isOpportunityClosed(opportunity);
  const title = isResearch ? opportunity.topic : opportunity.title;
  const owner = isResearch ? opportunity.facultyName : opportunity.companyName;
  const salary = isResearch
    ? opportunity.funded && opportunity.stipendAmount != null
      ? `${opportunity.stipendCurrency || 'BDT'} ${Number(opportunity.stipendAmount).toLocaleString()} stipend`
      : opportunity.funded ? 'Funded' : 'Unfunded / not specified'
    : formatMoney(opportunity.salaryMin, opportunity.salaryMax, opportunity.salaryCurrency);

  return (
    <Modal show={show} title={title} subtitle={owner} onClose={onClose} size="xl">
      <div className="opportunity-detail-hero">
        <div className="opportunity-facts">
          {opportunity.location && <span><i className="bi bi-geo-alt" /> {opportunity.location}</span>}
          {opportunity.workMode && <span><i className="bi bi-laptop" /> {enumLabel(opportunity.workMode)}</span>}
          {!isResearch && opportunity.employmentType && <span><i className="bi bi-clock" /> {enumLabel(opportunity.employmentType)}</span>}
          {salary && <span><i className="bi bi-cash-stack" /> {salary}</span>}
          {(opportunity.deadline || opportunity.applicationDeadline) && (
            <span><i className="bi bi-calendar-event" /> Deadline {formatDate(opportunity.deadline || opportunity.applicationDeadline)}</span>
          )}
        </div>

        {match && (
          <div className="detail-match-score">
            <strong>{Math.round(match.finalScore || 0)}%</strong>
            <span>profile match</span>
          </div>
        )}
      </div>

      <TextSection title="About the opportunity" value={opportunity.description} />
      <TextSection title={isResearch ? 'Responsibilities' : 'What you will do'} value={opportunity.responsibilities} />
      <TextSection title={isResearch ? 'Eligibility' : 'Requirements'} value={isResearch ? opportunity.eligibility : opportunity.requirements} />
      {!isResearch && <TextSection title="Benefits" value={opportunity.benefits} />}

      <section className="opportunity-detail-section">
        <h6>Eligibility & matching</h6>
        <div className="detail-grid">
          <div><span>Minimum CGPA</span><strong>{opportunity.requiredCgpa ?? opportunity.minCgpa ?? 'Not specified'}</strong></div>
          <div><span>Positions</span><strong>{opportunity.vacancies ?? opportunity.availablePositions ?? 'Not specified'}</strong></div>
          <div><span>Departments</span><strong>{[...(opportunity.targetDepartments || [])].join(', ') || 'Any'}</strong></div>
          {isResearch && <div><span>Duration</span><strong>{opportunity.duration || 'Not specified'}</strong></div>}
        </div>
        {opportunity.requiredSkills?.length > 0 && (
          <div className="mt-3"><SkillChips skills={opportunity.requiredSkills} /></div>
        )}
      </section>

      {match && (
        <section className="opportunity-detail-section">
          <h6>Why this matches you</h6>
          <div className="match-bars">
            {[
              ['Skills', match.skillMatch],
              ['CGPA', match.cgpaMatch],
              ['Department', match.departmentMatch]
            ].map(([label, value]) => (
              <div key={label}>
                <div className="d-flex justify-content-between small mb-1">
                  <span>{label}</span><strong>{Math.round((value || 0) * 100)}%</strong>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{ width: `${Math.round((value || 0) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {onApply && (
        <div className="d-flex justify-content-end mt-4">
          {applied ? (
            <button className="btn btn-outline-success" disabled>
              <i className="bi bi-check2-circle me-1" /> Applied
            </button>
          ) : closed ? (
            <button className="btn btn-outline-secondary" disabled title="This opportunity is no longer accepting applications">
              Closed
            </button>
          ) : (
            <button className="btn btn-brand" onClick={onApply}>
              Apply now
            </button>
          )}
        </div>
      )}
    </Modal>
  );
}
