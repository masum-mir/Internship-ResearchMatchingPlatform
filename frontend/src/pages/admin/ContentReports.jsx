import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi.js';
import { professionalProfileApi } from '../../api/professionalProfileApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import { enumLabel, timeAgo } from '../../utils/format.js';
import { resolveUploadUrl } from '../../utils/imageUrl.js';
import { reportCategoryLabel } from '../../utils/reportCategories.js';
import Avatar from '../../components/Avatar.jsx';
import Loader from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Modal from '../../components/Modal.jsx';
import PageTitle from '../../components/PageTitle.jsx';

const TABS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'DISMISSED', label: 'Dismissed' },
  { value: 'ALL', label: 'All' }
];

const STATUS_BADGE = {
  PENDING: 'bg-warning text-dark',
  RESOLVED: 'bg-success',
  DISMISSED: 'bg-secondary'
};

const VIEWER_TITLES = {
  POST: 'Reported post',
  COMMENT: 'Reported comment',
  MESSAGE: 'Reported conversation',
  PROFILE: 'Reported profile'
};

// Read-only viewer for reported content. Admins can look, not interact — no
// reactions, no comments, and no message composer, so there's no way to
// accidentally message the reported user from here. Resolve/Dismiss are
// available right here too, so admins don't have to close the modal to act.
function ContentViewer({ report, onClose, onResolve, onDismiss, busy }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [post, setPost] = useState(null);
  const [messages, setMessages] = useState(null);
  const [comment, setComment] = useState(null);
  const [commentPost, setCommentPost] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Reset on every change, including when the modal closes (report becomes
    // null) — otherwise stale content from the previous report lingers in
    // state, and since JSX children are evaluated even while the Modal itself
    // is hidden, that stale data (paired with a null `report`) is what caused
    // the whole page to crash on close.
    setLoading(true);
    setError('');
    setPost(null);
    setMessages(null);
    setComment(null);
    setCommentPost(null);
    setProfile(null);

    if (!report) return undefined;

    // Guards against a slow, still-in-flight fetch resolving after the admin
    // has already closed this report or opened a different one — without
    // this, a late response could overwrite state for content that's no
    // longer being viewed.
    let cancelled = false;

    let load;
    if (report.targetType === 'POST') {
      load = adminApi.getSocialPost(report.targetId).then((data) => {
        if (!cancelled) setPost(data);
      });
    } else if (report.targetType === 'MESSAGE') {
      load = adminApi.conversationMessages(report.conversationId).then((data) => {
        if (!cancelled) setMessages(data);
      });
    } else if (report.targetType === 'COMMENT') {
      load = adminApi.getComment(report.targetId).then(async (c) => {
        if (cancelled) return;
        setComment(c);
        // Best-effort: show the parent post for context. If it's gone (deleted
        // post, etc.) the comment itself still renders fine on its own.
        const postId = report.postId || c.postId;
        if (postId) {
          await adminApi.getSocialPost(postId).then((data) => {
            if (!cancelled) setCommentPost(data);
          }).catch(() => {});
        }
      });
    } else if (report.targetType === 'PROFILE') {
      load = professionalProfileApi.get(report.targetId).then((data) => {
        if (!cancelled) setProfile(data);
      });
    } else {
      load = Promise.resolve();
    }

    load
      .catch((e) => {
        if (!cancelled) setError(apiMessage(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [report]);

  return (
    <Modal
      show={!!report}
      title={VIEWER_TITLES[report?.targetType] || 'Reported content'}
      subtitle={report?.targetType === 'MESSAGE' ? 'The flagged message is highlighted below' : undefined}
      onClose={onClose}
      size="lg"
      footer={
        !report ? null : report.status === 'PENDING' ? (
          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              disabled={busy}
              onClick={() => onDismiss(report.id)}
            >
              <i className="bi bi-x-lg me-1" /> Dismiss
            </button>
            <button
              type="button"
              className="btn btn-success"
              disabled={busy}
              onClick={() => onResolve(report.id)}
            >
              <i className="bi bi-check-lg me-1" /> Mark resolved
            </button>
          </div>
        ) : (
          <div className="text-muted small">
            This report was already {report.status?.toLowerCase()}.
          </div>
        )
      }
    >
      {!report ? null : loading ? (
        <Loader />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : post ? (
        <div className="social-card p-3">
          <div className="d-flex align-items-center gap-2 mb-2">
            <Avatar name={post.authorName} image={post.authorProfilePicture} size={40} />
            <div>
              <Link to={`/profile/${post.authorId}`} className="fw-semibold text-dark">
                {post.authorName}
              </Link>
              <div className="text-muted small">{timeAgo(post.createdAt)} ago</div>
            </div>
          </div>
          {post.content ? (
            <div className="pre-line">{post.content}</div>
          ) : (
            <div className="text-muted small fst-italic">This post has since been deleted by its author.</div>
          )}
          {post.mediaUrl && (
            <div className="post-media mt-2">
              {String(post.mediaType || '').startsWith('video/') ? (
                <video src={resolveUploadUrl(post.mediaUrl)} controls />
              ) : (
                <img src={resolveUploadUrl(post.mediaUrl)} alt="Post media" />
              )}
            </div>
          )}
        </div>
      ) : messages ? (
        <div className="message-stream" style={{ maxHeight: '55vh', overflowY: 'auto' }}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`social-card p-2 mb-2 ${message.id === report.targetId ? 'border-danger' : ''}`}
              style={message.id === report.targetId ? { borderWidth: 2 } : undefined}
            >
              <div className="d-flex justify-content-between align-items-start gap-2">
                <Link to={`/profile/${message.senderId}`} className="fw-semibold text-dark small">
                  {message.senderName}
                </Link>
                <span className="text-muted small">{timeAgo(message.sentAt)} ago</span>
              </div>
              {message.content && message.content !== '[attachment]' && (
                <div className="pre-line small">{message.content}</div>
              )}
              {message.attachmentUrl && (
                <a
                  className="small"
                  href={resolveUploadUrl(message.attachmentUrl)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="bi bi-paperclip" /> Open attachment
                </a>
              )}
              {message.id === report.targetId && (
                <div className="text-danger small mt-1">
                  <i className="bi bi-flag-fill me-1" /> This is the reported message
                </div>
              )}
            </div>
          ))}
        </div>
      ) : comment ? (
        <div>
          {commentPost && (
            <div className="social-card p-3 mb-2">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Avatar name={commentPost.authorName} image={commentPost.authorProfilePicture} size={36} />
                <div>
                  <Link to={`/profile/${commentPost.authorId}`} className="fw-semibold text-dark">
                    {commentPost.authorName}
                  </Link>
                  <div className="text-muted small">{timeAgo(commentPost.createdAt)} ago</div>
                </div>
              </div>
              {commentPost.content ? (
                <div className="pre-line small">{commentPost.content}</div>
              ) : (
                <div className="text-muted small fst-italic">This post has since been deleted.</div>
              )}
            </div>
          )}
          <div className="social-card p-3 border-danger" style={{ borderWidth: 2 }}>
            <div className="d-flex align-items-center gap-2 mb-2">
              <Avatar name={comment.authorName} image={comment.authorProfilePicture} size={36} />
              <div>
                <Link to={`/profile/${comment.authorId}`} className="fw-semibold text-dark">
                  {comment.authorName}
                </Link>
                <div className="text-muted small">{timeAgo(comment.createdAt)} ago</div>
              </div>
            </div>
            <div className="pre-line small">{comment.content}</div>
            <div className="text-danger small mt-2">
              <i className="bi bi-flag-fill me-1" /> This is the reported comment
            </div>
          </div>
        </div>
      ) : profile ? (
        <div className="social-card p-3">
          <div className="d-flex align-items-center gap-2 mb-3">
            <Avatar name={profile.name} image={profile.profilePicture} size={48} />
            <div>
              <div className="fw-semibold">{profile.name}</div>
              <div className="text-muted small">{enumLabel(profile.role)}</div>
            </div>
          </div>
          {profile.headline && <div className="mb-2">{profile.headline}</div>}
          {profile.bio && <div className="pre-line small text-muted mb-3">{profile.bio}</div>}
          <Link to={`/profile/${report.targetId}`} className="btn btn-sm btn-outline-secondary">
            <i className="bi bi-person me-1" /> Open full profile
          </Link>
        </div>
      ) : null}
    </Modal>
  );
}

function targetLink(report) {
  return `/profile/${report.targetOwnerId}`;
}

export default function ContentReports() {
  const [status, setStatus] = useState('PENDING');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [viewing, setViewing] = useState(null);

  const load = useCallback(async (nextStatus) => {
    setLoading(true);
    setError('');
    try {
      setReports(await adminApi.contentReports(nextStatus));
    } catch (e) {
      setError(apiMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(status);
  }, [status, load]);

  const act = async (id, action) => {
    setBusyId(id);
    setError('');
    try {
      const updated = action === 'resolve'
        ? await adminApi.resolveContentReport(id)
        : await adminApi.dismissContentReport(id);
      setReports((old) =>
        status === 'ALL' || status === updated.status
          ? old.map((r) => (r.id === id ? updated : r))
          : old.filter((r) => r.id !== id)
      );
      // Close the viewer once the report leaves PENDING, since its
      // resolve/dismiss buttons no longer apply.
      setViewing((old) => (old?.id === id ? null : old));
    } catch (e) {
      setError(apiMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <PageTitle
        title="Reported Content"
        subtitle="Posts and messages only appear here once a user reports them — nothing is shown by default"
      />

      <div className="social-card mb-3 p-2 d-flex gap-2 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={`btn btn-sm ${status === tab.value ? 'btn-brand' : 'btn-outline-secondary'}`}
            onClick={() => setStatus(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <Loader label="Loading reports…" />
      ) : reports.length === 0 ? (
        <div className="social-card">
          <EmptyState
            icon="bi-flag"
            title="No reports here"
            message={
              status === 'PENDING'
                ? 'Nothing is currently awaiting review.'
                : 'No reports match this filter yet.'
            }
          />
        </div>
      ) : (
        reports.map((report) => (
          <div key={report.id} className="social-card mb-3 p-3">
            <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
              <div>
                <span className={`badge ${STATUS_BADGE[report.status] || 'bg-secondary'} me-2`}>
                  {enumLabel(report.status)}
                </span>
                <span className="badge bg-light text-dark border me-2">
                  {enumLabel(report.targetType)}
                </span>
                <span className="fw-semibold">{reportCategoryLabel(report.category)}</span>
              </div>
              <span className="text-muted small">{timeAgo(report.createdAt)} ago</span>
            </div>

            <div className="row g-3 mt-1">
              <div className="col-md-6">
                <div className="text-muted small">Reported by</div>
                <div>
                  {report.reporterId ? (
                    <Link to={`/profile/${report.reporterId}`}>
                      {report.reporterName || `User #${report.reporterId}`}
                    </Link>
                  ) : (
                    report.reporterName || '—'
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="text-muted small">Content owner</div>
                <div>
                  {report.targetOwnerId ? (
                    <Link to={targetLink(report)}>
                      {report.targetOwnerName || `User #${report.targetOwnerId}`}
                    </Link>
                  ) : (
                    report.targetOwnerName || '—'
                  )}
                </div>
              </div>
            </div>

            {report.contentSnapshot && (
              <div className="mt-2 p-2 bg-light rounded small">
                <span className="text-muted">Content at time of report:</span> "{report.contentSnapshot}"
              </div>
            )}

            {report.details && (
              <div className="mt-2 small">
                <span className="text-muted">Reporter's note:</span> {report.details}
              </div>
            )}

            <div className="d-flex gap-2 mt-3 flex-wrap">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setViewing(report)}
              >
                <i className="bi bi-eye me-1" /> View content
              </button>
              {report.status === 'PENDING' && (
                <>
                  <button
                    type="button"
                    className="btn btn-sm btn-success"
                    disabled={busyId === report.id}
                    onClick={() => act(report.id, 'resolve')}
                  >
                    <i className="bi bi-check-lg me-1" /> Mark resolved
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    disabled={busyId === report.id}
                    onClick={() => act(report.id, 'dismiss')}
                  >
                    <i className="bi bi-x-lg me-1" /> Dismiss
                  </button>
                </>
              )}
            </div>
          </div>
        ))
      )}

      <ContentViewer
        report={viewing}
        onClose={() => setViewing(null)}
        onResolve={(id) => act(id, 'resolve')}
        onDismiss={(id) => act(id, 'dismiss')}
        busy={busyId === viewing?.id}
      />
    </div>
  );
}
