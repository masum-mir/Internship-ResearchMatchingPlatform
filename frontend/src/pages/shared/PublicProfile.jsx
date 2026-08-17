// import { useEffect, useMemo, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { professionalProfileApi } from '../../api/professionalProfileApi.js';
// import { networkApi } from '../../api/networkApi.js';
// import { messageApi } from '../../api/messageApi.js';
// import { apiMessage } from '../../api/axiosClient.js';
// import { useAuth } from '../../auth/AuthContext.jsx';
// import { enumLabel } from '../../utils/format.js';
// import ProfileHeader from '../../components/ProfileHeader.jsx';
// import ProfessionalSections from '../../components/ProfessionalSections.jsx';
// import SkillChips from '../../components/SkillChips.jsx';
// import Loader from '../../components/Loader.jsx';
// import EmptyState from '../../components/EmptyState.jsx';

// export default function PublicProfile() {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const { user, role: viewerRole } = useAuth();
//   const [data, setData] = useState(null);
//   const [notice, setNotice] = useState({ type: '', message: '' });
//   const [busy, setBusy] = useState(false);

//   useEffect(() => {
//     professionalProfileApi.get(userId)
//       .then(setData)
//       .catch((e) => setNotice({ type: 'danger', message: apiMessage(e) }));
//   }, [userId]);

//   const mine = Number(userId) === Number(user?.userId);
//   const p = data?.profile;

//   const actions = useMemo(() => {
//     if (mine || !p) return null;
//     return (
//       <div className="d-flex flex-wrap gap-2">
//         <button
//           className="btn btn-brand btn-sm"
//           disabled={busy}
//           onClick={async () => {
//             setBusy(true);
//             try {
//               await networkApi.connect(p.userId);
//               setNotice({ type: 'success', message: 'Connection request sent.' });
//             } catch (e) {
//               setNotice({ type: 'danger', message: apiMessage(e) });
//             } finally { setBusy(false); }
//           }}
//         >
//           <i className="bi bi-person-plus me-1" /> Connect
//         </button>
//         <button
//           className="btn btn-outline-primary btn-sm"
//           disabled={busy}
//           onClick={async () => {
//             setBusy(true);
//             try {
//               await networkApi.follow(p.userId);
//               setNotice({ type: 'success', message: `Following ${p.name}.` });
//             } catch (e) {
//               setNotice({ type: 'danger', message: apiMessage(e) });
//             } finally { setBusy(false); }
//           }}
//         >
//           <i className="bi bi-plus-lg me-1" /> Follow
//         </button>
//         <button
//           className="btn btn-outline-secondary btn-sm"
//           onClick={async () => {
//             try {
//               const c = await messageApi.start(p.userId);
//               navigate(`/messages?conversation=${c.id}`);
//             } catch (e) {
//               setNotice({ type: 'danger', message: apiMessage(e) });
//             }
//           }}
//         >
//           <i className="bi bi-chat-dots me-1" /> Message
//         </button>
//         <button
//           className="btn btn-light btn-sm"
//           onClick={async () => {
//             if (!window.confirm(`Block ${p.name}?`)) return;
//             try {
//               await networkApi.block(p.userId);
//               setNotice({ type: 'success', message: `${p.name} was blocked.` });
//             } catch (e) {
//               setNotice({ type: 'danger', message: apiMessage(e) });
//             }
//           }}
//         >
//           <i className="bi bi-slash-circle" />
//         </button>
//       </div>
//     );
//   }, [mine, p, busy, navigate]);

//   if (!data && !notice.message) return <Loader />;
//   if (!data) return <div className="alert alert-danger">{notice.message}</div>;

//   return (
//     <div className="public-profile-page">
//       {notice.message && (
//         <div className={`alert alert-${notice.type}`}>{notice.message}</div>
//       )}

//       <ProfileHeader
//         name={p?.name}
//         subtitle={p?.headline || enumLabel(p?.role)}
//         meta={[p?.organization, p?.location, enumLabel(p?.role)]}
//         profilePicture={p?.profilePicture}
//         coverPicture={data.coverPicture}
//         actions={actions}
//       />

//       {/* <div className="profile-metrics social-card">
//         <div><strong>{data.followerCount}</strong><span>FollowConnectionsers</span></div>
//         <div><strong>{data.connectionCount}</strong><span></span></div>
//         {data.openToWork && (
//           <div className="profile-status">
//             <i className="bi bi-briefcase-fill" /> Open to work
//           </div>
//         )}
//         {data.availableForSupervision && (
//           <div className="profile-status">
//             <i className="bi bi-mortarboard-fill" /> Available for supervision
//           </div>
//         )}
//         {data.verifiedCompany && (
//           <div className="profile-status">
//             <i className="bi bi-patch-check-fill" /> Verified company
//           </div>
//         )}
//       </div> */}

//       <section className="social-card profile-section">
//         <h5>About</h5>
//         {data.bio ? (
//           <p className="pre-line mb-0">{data.bio}</p>
//         ) : (
//           <EmptyState icon="bi-person-lines-fill" title="No bio added" />
//         )}
//         {data.website && (
//           <a href={data.website} target="_blank" rel="noreferrer" className="d-inline-block mt-3">
//             <i className="bi bi-link-45deg me-1" /> {data.website}
//           </a>
//         )}
//       </section>

//       {data.skills?.length > 0 && (
//         <section className="social-card profile-section">
//           <h5>Skills</h5>
//           <SkillChips skills={data.skills} />
//         </section>
//       )}

//       <ProfessionalSections userId={userId} editable={false} />
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { professionalProfileApi } from '../../api/professionalProfileApi.js';
import { networkApi } from '../../api/networkApi.js';
import { messageApi } from '../../api/messageApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import { useAuth } from '../../auth/AuthContext.jsx';
import { enumLabel, formatDate } from '../../utils/format.js';
import { resolveUploadUrl } from '../../utils/imageUrl.js';

import ProfileHeader from '../../components/ProfileHeader.jsx';
import ProfessionalSections from '../../components/ProfessionalSections.jsx';
import SkillChips from '../../components/SkillChips.jsx';
import Loader from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import ReportModal from '../../components/ReportModal.jsx';
import Modal from '../../components/Modal.jsx';
import { reportCategoriesFor } from '../../utils/reportCategories.js';

export default function PublicProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, role: viewerRole } = useAuth();

  const [data, setData] = useState(null);
  const [notice, setNotice] = useState({ type: '', message: '' });
  const [busy, setBusy] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connectionId, setConnectionId] = useState(null);
  const [pendingSent, setPendingSent] = useState(false);
  const [incomingRequestId, setIncomingRequestId] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [responding, setResponding] = useState(false);

  useEffect(() => {
    setData(null);
    setNotice({ type: '', message: '' });

    professionalProfileApi
      .get(userId)
      .then(setData)
      .catch((e) =>
        setNotice({
          type: 'danger',
          message: apiMessage(e)
        })
      );

    const uid = Number(userId);

    networkApi.connections()
      .then((list) => {
        const match = (list || []).find(
          (c) => Number(c.requesterId) === uid || Number(c.addresseeId) === uid
        );
        setConnected(Boolean(match));
        setConnectionId(match ? match.id : null);
      })
      .catch(() => { setConnected(false); setConnectionId(null); });

    networkApi.pendingSent()
      .then((list) => setPendingSent((list || []).some((r) => Number(r.addresseeId) === uid)))
      .catch(() => setPendingSent(false));

    networkApi.pending()
      .then((list) => {
        const match = (list || []).find((r) => Number(r.requesterId) === uid);
        setIncomingRequestId(match ? match.id : null);
      })
      .catch(() => setIncomingRequestId(null));

    networkApi.following()
      .then((list) => setIsFollowing((list || []).some((f) => Number(f.followingId) === uid)))
      .catch(() => setIsFollowing(false));
  }, [userId]);

  const p = data?.profile || data || {};
  const role = String(p?.role || data?.role || '').toUpperCase();
  const mine = Number(userId) === Number(user?.userId);

  const value = (...keys) => {
    for (const key of keys) {
      const v = p?.[key] ?? data?.[key];
      if (v !== undefined && v !== null && v !== '') return v;
    }
    return null;
  };

  const skills = data?.skills ?? p?.skills ?? [];
  const projects = data?.projects ?? p?.projects ?? [];
  const certifications = data?.certifications ?? p?.certifications ?? [];

  const reload = async () => {
    const uid = Number(userId);
    try {
      const list = await networkApi.connections();
      const match = (list || []).find((c) => Number(c.requesterId) === uid || Number(c.addresseeId) === uid);
      setConnected(Boolean(match));
      setConnectionId(match ? match.id : null);
    } catch { /* ignore */ }
    try {
      const sent = await networkApi.pendingSent();
      setPendingSent((sent || []).some((r) => Number(r.addresseeId) === uid));
    } catch { /* ignore */ }
    try {
      const received = await networkApi.pending();
      const match = (received || []).find((r) => Number(r.requesterId) === uid);
      setIncomingRequestId(match ? match.id : null);
    } catch { /* ignore */ }
    try {
      const list = await networkApi.following();
      setIsFollowing((list || []).some((f) => Number(f.followingId) === uid));
    } catch { /* ignore */ }
  };

  const confirmPending = async () => {
    if (!confirmAction) return;
    const { kind } = confirmAction;
    setConfirmAction(null);
    setBusy(true);
    try {
      if (kind === 'disconnect') {
        await networkApi.removeConnection(connectionId);
        setNotice({ type: 'success', message: `Removed connection with ${p.name || 'this user'}.` });
      } else if (kind === 'unfollow') {
        await networkApi.unfollow(p.userId);
        setNotice({ type: 'success', message: `Unfollowed ${p.name || 'this user'}.` });
      }
      await reload();
    } catch (e) {
      setNotice({ type: 'danger', message: apiMessage(e) });
    } finally {
      setBusy(false);
    }
  };

  const respondToRequest = async (accept) => {
    if (!incomingRequestId) return;
    setResponding(true);
    try {
      if (accept) {
        await networkApi.accept(incomingRequestId);
        setNotice({ type: 'success', message: `You're now connected with ${p.name || 'this user'}.` });
      } else {
        await networkApi.reject(incomingRequestId);
        setNotice({ type: 'success', message: 'Request declined.' });
      }
      setConfirmAction(null);
      await reload();
    } catch (e) {
      setNotice({ type: 'danger', message: apiMessage(e) });
    } finally {
      setResponding(false);
    }
  };

  const EDIT_PROFILE_PATH = {
    STUDENT: '/student/profile',
    COMPANY: '/company/profile',
    FACULTY: '/faculty/profile',
    ADMIN: '/admin/profile'
  };

  const actions = useMemo(() => {
    // Viewing your own profile: offer a way to edit it instead of the
    // social actions (Connect/Follow/Message/Block) meant for other users.
    if (mine) {
      return (
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={() => navigate(EDIT_PROFILE_PATH[viewerRole] || '/feed')}
        >
          <i className="bi bi-pencil me-1" />
          Edit profile
        </button>
      );
    }

    // Admins land here only to review a reported user, not to socialize with
    // them — no Connect/Follow/Message/Block actions for that account.
    if (!p?.userId || viewerRole === 'ADMIN') return null;

    return (
      <div className="d-flex flex-wrap gap-2">
        {connected ? (
          <button
            type="button"
            className="btn btn-outline-success btn-sm"
            disabled={busy}
            onClick={() => setConfirmAction({ kind: 'disconnect' })}
          >
            <i className="bi bi-check2 me-1" />
            Connected
          </button>
        ) : incomingRequestId ? (
          <button
            type="button"
            className="btn btn-brand btn-sm"
            disabled={busy}
            onClick={() => setConfirmAction({ kind: 'respond' })}
          >
            <i className="bi bi-person-plus me-1" />
            Respond to request
          </button>
        ) : pendingSent ? (
          <button type="button" className="btn btn-outline-secondary btn-sm" disabled>
            <i className="bi bi-hourglass-split me-1" />
            Pending
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-brand btn-sm"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await networkApi.connect(p.userId);
                setNotice({
                  type: 'success',
                  message: 'Connection request sent.'
                });
                await reload();
              } catch (e) {
                setNotice({
                  type: 'danger',
                  message: apiMessage(e)
                });
              } finally {
                setBusy(false);
              }
            }}
          >
            <i className="bi bi-person-plus me-1" />
            Connect
          </button>
        )}

        {isFollowing ? (
          <button
            type="button"
            className="btn btn-outline-success btn-sm"
            disabled={busy}
            onClick={() => setConfirmAction({ kind: 'unfollow' })}
          >
            <i className="bi bi-check2 me-1" />
            Following
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await networkApi.follow(p.userId);
                setNotice({
                  type: 'success',
                  message: `Following ${p.name || 'user'}.`
                });
                await reload();
              } catch (e) {
                setNotice({
                  type: 'danger',
                  message: apiMessage(e)
                });
              } finally {
                setBusy(false);
              }
            }}
          >
            <i className="bi bi-person-check me-1" />
            Follow
          </button>
        )}

        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          disabled={!connected}
          title={connected ? undefined : 'Connect with this person to send a direct message'}
          onClick={async () => {
            if (!connected) return;
            try {
              const conversation = await messageApi.start(p.userId);
              navigate(`/messages?conversation=${conversation.id}`);
            } catch (e) {
              setNotice({
                type: 'danger',
                message: apiMessage(e)
              });
            }
          }}
        >
          <i className="bi bi-chat-dots me-1" />
          Message
        </button>

        <button
          type="button"
          className="btn btn-light btn-sm text-danger"
          onClick={async () => {
            if (!window.confirm(`Block ${p.name || 'this user'}?`)) return;

            try {
              await networkApi.block(p.userId);
              setNotice({
                type: 'success',
                message: `${p.name || 'User'} was blocked.`
              });
            } catch (e) {
              setNotice({
                type: 'danger',
                message: apiMessage(e)
              });
            }
          }}
        >
          <i className="bi bi-slash-circle me-1" />
          Block
        </button>

        <button
          type="button"
          className="btn btn-light btn-sm text-danger"
          onClick={() => setShowReport(true)}
        >
          <i className="bi bi-flag me-1" />
          Report
        </button>
      </div>
    );
  }, [mine, p?.userId, p?.name, busy, navigate, viewerRole, connected, pendingSent, incomingRequestId, isFollowing, connectionId]);

  if (!data && !notice.message) return <Loader />;

  if (!data) {
    return (
      <div className="alert alert-danger">
        {notice.message || 'Profile unavailable'}
      </div>
    );
  }

  const headerMeta =
    role === 'STUDENT'
      ? [
          value('email'), 
        ]
      : role === 'FACULTY'
      ? [
          value('email'), 
        ]
      : role === 'COMPANY'
      ? [
          value('email'), 
        ]
      : [enumLabel(role)];

  return (
    <div className="profile-edit-page">
      {notice.message && (
        <div className={`alert alert-${notice.type || 'info'} alert-dismissible fade show`}>
          {notice.message}
          <button
            type="button"
            className="btn-close"
            onClick={() => setNotice({ type: '', message: '' })}
          />
        </div>
      )}

      <ProfileHeader
        name={value('name', 'companyName') || 'Profile'}
        subtitle={
          value('headline') ||
          value('designation') ||
          value('industry') ||
          enumLabel(role)
        }
        meta={headerMeta}
        profilePicture={value('profilePicture')}
        coverPicture={value('coverPicture')}
        actions={actions}
      />

      {role === 'STUDENT' && (
        <StudentProfileSections
          value={value}
          skills={skills}
          projects={projects}
          certifications={certifications}
          userId={userId}
        />
      )}

      {role === 'FACULTY' && (
        <FacultyProfileSections
          value={value}
          userId={userId}
        />
      )}

      {role === 'COMPANY' && (
        <CompanyProfileSections
          value={value}
          userId={userId}
        />
      )}

      {!['STUDENT', 'FACULTY', 'COMPANY'].includes(role) && (
        <section className="social-card profile-section">
          <h5>About</h5>
          <p className="mb-0">
            {value('bio', 'description') || 'No information available.'}
          </p>
        </section>
      )}

      <ReportModal
        show={showReport}
        title="Report profile"
        categories={reportCategoriesFor('PROFILE')}
        onClose={() => setShowReport(false)}
        onSubmit={(category, details) => professionalProfileApi.report(p.userId, category, details)}
      />

      <Modal
        show={Boolean(confirmAction)}
        title={
          confirmAction?.kind === 'disconnect'
            ? 'Remove connection'
            : confirmAction?.kind === 'respond'
            ? 'Connection request'
            : 'Unfollow'
        }
        onClose={() => setConfirmAction(null)}
      >
        {confirmAction && confirmAction.kind === 'respond' ? (
          <div>
            <p>
              {(p.name || 'This user')} wants to connect with you. Would you like to accept or decline this request?
            </p>
            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary" disabled={responding} onClick={() => respondToRequest(false)}>
                Decline
              </button>
              <button type="button" className="btn btn-brand" disabled={responding} onClick={() => respondToRequest(true)}>
                Accept
              </button>
            </div>
          </div>
        ) : confirmAction && (
          <div>
            <p>
              {confirmAction.kind === 'disconnect'
                ? `Remove your connection with ${p.name || 'this user'}? You'll need to send a new request to reconnect.`
                : `Unfollow ${p.name || 'this user'}? You'll stop seeing their posts in your feed.`}
            </p>
            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary" onClick={() => setConfirmAction(null)}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger" onClick={confirmPending}>
                {confirmAction.kind === 'disconnect' ? 'Remove connection' : 'Unfollow'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* =========================================================
   STUDENT
========================================================= */

function StudentProfileSections({
  value,
  skills,
  projects,
  certifications,
  userId
}) {
  const cgpa = value('cgpa');

  return (
    <>
      <section className="social-card profile-section">
        <SectionHeading
          title="Academic information" 
        />

        <div className="row g-3">
          <InfoItem   label="University" value={value('university')} />
          <InfoItem   label="Department" value={value('department')} />
          <InfoItem   label="Student ID" value={value('studentId')} />
           
          <InfoItem 
            label="CGPA"
            value={
              cgpa !== null && cgpa !== undefined
                ? Number(cgpa).toFixed(2)
                : null
            }
          />

          <InfoItem   label="Contact" value={value('contactNumber')} />
          <InfoItem
             
            label="Address"
            value={value('address')}
            wide
          />
        </div>

        {Boolean(value('openToWork')) && (
          <div className="mt-3">
            <span className="badge rounded-pill text-bg-success">
              <i className="bi bi-briefcase-fill me-1" />
              Open to work
            </span>
          </div>
        )}
      </section>

      <AboutSection text={value('bio')} />

      <StudentLinks
        resumeUrl={value('resumeUrl')}
        portfolioUrl={value('portfolioUrl')}
        githubUrl={value('githubUrl')}
        linkedinUrl={value('linkedinUrl')}
      />

      <SkillsSection skills={skills} />

      <ProjectsSection projects={projects} />

      <CertificationsSection certifications={certifications} />

      <ProfessionalSections userId={userId} editable={false} />
    </>
  );
}

/* =========================================================
   FACULTY
========================================================= */

function FacultyProfileSections({ value, userId }) {
  return (
    <>
      <section className="social-card profile-section">
        <SectionHeading
          title="Faculty information"
          subtitle="Academic, research and supervision information."
        />

        <div className="row g-3">
          <InfoItem 
            label="University"
            value={value('university')}
          />

          <InfoItem 
            label="Department"
            value={value('department')}
          />

          {/* <InfoItem 
            label="Email"
            value={value('email')}Manage research opportunities and review student applicants.
          /> */}

          <InfoItem 
            label="Designation"
            value={value('designation')}
          />

          <InfoItem 
            label="Specialization"
            value={value('specialization')}
          />

          <InfoItem 
            label="Contact"
            value={value('contactNumber')}
          />

          <InfoItem 
            label="Location"
            value={value('location')}
          />
        </div>

        {Boolean(value('availableForSupervision')) && (
          <div className="mt-3">
            <span className="badge rounded-pill text-bg-primary">
              <i className="bi bi-mortarboard-fill me-1" />
              Available for supervision
            </span>
          </div>
        )}
      </section>

      <AboutSection text={value('bio')} />

      <section className="social-card profile-section">
        <h5>Research interests</h5>
        {value('researchInterests') ? (
          <p className="pre-line mb-0">{value('researchInterests')}</p>
        ) : (
          <EmptyState
            icon="bi-journal-richtext"
            title="No research interests added"
          />
        )}
      </section>

      <section className="social-card profile-section">
        <h5>Academic links</h5>

        <div className="d-flex flex-wrap gap-2 mt-3">
          <ProfileLink
            url={value('googleScholarUrl')}
            icon="bi-mortarboard"
            label="Google Scholar"
          />

          <ProfileLink
            url={value('researchgateUrl')}
            icon="bi-journal-text"
            label="ResearchGate"
          />

          <ProfileLink
            url={value('orcidId') ? `https://orcid.org/${value('orcidId')}` : null}
            icon="bi-person-badge"
            label="ORCID"
          />

          <ProfileLink
            url={value('linkedinUrl')}
            icon="bi-linkedin"
            label="LinkedIn"
          />

          <ProfileLink
            url={value('universityProfileUrl')}
            icon="bi-building"
            label="University profile"
          />
        </div>
      </section>

      <ProfessionalSections userId={userId} editable={false} />
    </>
  );
}

/* =========================================================
   COMPANY
========================================================= */

function CompanyProfileSections({ value, userId }) {
  return (
    <>
      <section className="social-card profile-section">
        <SectionHeading
          title="Company information"
          subtitle="Organization and contact information."
        />

        <div className="row g-3">
          <InfoItem
            icon="bi-building"
            label="Company"
            value={value('companyName', 'name')}
          />

          <InfoItem
            icon="bi-briefcase"
            label="Industry"
            value={value('industry')}
          />

          <InfoItem
            icon="bi-people"
            label="Company size"
            value={value('companySize')}
          />

          <InfoItem
            icon="bi-calendar-check"
            label="Founded"
            value={
              value('foundedDate')
                ? formatDate(value('foundedDate'))
                : null
            }
          />

          <InfoItem
            icon="bi-geo-alt"
            label="Location"
            value={value('location')}
          />

          <InfoItem
            icon="bi-telephone"
            label="Contact"
            value={value('contactNumber')}
          />

          <InfoItem
            icon="bi-envelope"
            label="Company email"
            value={value('companyEmail')}
            wide
          />
        </div>

        {Boolean(value('verified')) && (
          <div className="mt-3">
            <span className="badge rounded-pill text-bg-primary">
              <i className="bi bi-patch-check-fill me-1" />
              Verified company
            </span>
          </div>
        )}
      </section>

      <AboutSection text={value('description', 'bio')} />

      <section className="social-card profile-section">
        <h5>Company links</h5>

        {value('website') ? (
          <a
            href={value('website')}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline-primary btn-sm mt-2"
          >
            <i className="bi bi-globe me-1" />
            Visit website
          </a>
        ) : (
          <div className="text-muted">No website added.</div>
        )}
      </section>
    </>
  );
}

/* =========================================================
   SHARED SECTIONS
========================================================= */

function AboutSection({ text }) {
  return (
    <section className="social-card profile-section">
      <h5>About</h5>

      {text ? (
        <p className="pre-line mb-0">{text}</p>
      ) : (
        <EmptyState
          icon="bi-person-lines-fill"
          title="No information added"
        />
      )}
    </section>
  );
}

function StudentLinks({
  resumeUrl,
  portfolioUrl,
  githubUrl,
  linkedinUrl
}) {
  const hasLink =
    resumeUrl ||
    portfolioUrl ||
    githubUrl ||
    linkedinUrl;

  return (
    <section className="social-card profile-section">
      <h5>Professional links</h5>

      {hasLink ? (
        <div className="d-flex flex-wrap gap-2 mt-3">
          {resumeUrl && (
            <a
              href={resolveUploadUrl(resumeUrl)}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline-primary btn-sm"
            >
              <i className="bi bi-file-earmark-person me-1" />
              Resume
            </a>
          )}

          <ProfileLink
            url={portfolioUrl}
            icon="bi-globe"
            label="Portfolio"
          />

          <ProfileLink
            url={githubUrl}
            icon="bi-github"
            label="GitHub"
          />

          <ProfileLink
            url={linkedinUrl}
            icon="bi-linkedin"
            label="LinkedIn"
          />
        </div>
      ) : (
        <div className="text-muted mt-2">
          No professional links added.
        </div>
      )}
    </section>
  );
}

function SkillsSection({ skills }) {
  return (
    <section className="social-card profile-section">
      <h5>Skills</h5>

      {skills?.length ? (
        <SkillChips skills={skills} />
      ) : (
        <EmptyState
          icon="bi-lightning-charge"
          title="No skills added"
        />
      )}
    </section>
  );
}

function ProjectsSection({ projects }) {
  return (
    <section className="social-card profile-section">
      <h5>Projects</h5>

      {projects?.length ? (
        <div className="profile-entry-list">
          {projects.map((project) => (
            <div className="profile-entry" key={project.id}>
              <div className="profile-entry-icon">
                <i className="bi bi-kanban-fill" />
              </div>

              <div className="flex-grow-1">
                <h6 className="mb-1">{project.title}</h6>

                {project.techStack && (
                  <div className="text-muted small">
                    {project.techStack}
                  </div>
                )}

                {(project.startDate || project.endDate) && (
                  <div className="text-muted small mt-1">
                    {project.startDate
                      ? formatDate(project.startDate)
                      : ''}
                    {' – '}
                    {project.endDate
                      ? formatDate(project.endDate)
                      : 'Present'}
                  </div>
                )}

                {project.description && (
                  <p className="pre-line mt-2 mb-2">
                    {project.description}
                  </p>
                )}

                <div className="d-flex flex-wrap gap-3 small">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Project link
                    </a>
                  )}

                  {project.repositoryUrl && (
                    <a
                      href={project.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Repository
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="bi-kanban"
          title="No projects added"
        />
      )}
    </section>
  );
}

function CertificationsSection({ certifications }) {
  return (
    <section className="social-card profile-section">
      <h5>Licenses & certifications</h5>

      {certifications?.length ? (
        <div className="profile-entry-list">
          {certifications.map((cert) => (
            <div className="profile-entry" key={cert.id}>
              <div className="profile-entry-icon">
                <i className="bi bi-patch-check-fill" />
              </div>

              <div className="flex-grow-1">
                <h6 className="mb-1">{cert.name}</h6>

                {cert.issuer && <div>{cert.issuer}</div>}

                {cert.issueDate && (
                  <div className="text-muted small">
                    Issued {formatDate(cert.issueDate)}
                    {cert.expiryDate
                      ? ` · Expires ${formatDate(cert.expiryDate)}`
                      : ''}
                  </div>
                )}

                {cert.credentialId && (
                  <div className="text-muted small">
                    Credential ID {cert.credentialId}
                  </div>
                )}

                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noreferrer"
                    className="small"
                  >
                    Show credential
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="bi-patch-check"
          title="No certifications added"
        />
      )}
    </section>
  );
}

function SectionHeading({ title, subtitle }) {
  return (
    <div className="section-heading">
      <div>
        <h5 className="mb-1">{title}</h5>
        {/* <p className="mb-0">{subtitle}</p> */}
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
  wide = false
}) {
  return (
    <div className={wide ? 'col-12' : 'col-md-6 col-xl-4'}>
      <div className="public-profile-info-item">
        <div className="public-profile-info-icon">
          <i className={`bi ${icon}`} />
        </div>

        <div>
          <div className="text-muted small">
            {label}
          </div>

          <div className="fw-semibold">
            {value ?? 'Not provided'}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileLink({ url, icon, label }) {
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="btn btn-outline-secondary btn-sm"
    >
      <i className={`bi ${icon} me-1`} />
      {label}
    </a>
  );
}