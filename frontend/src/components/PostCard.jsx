import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { postApi } from '../api/postApi.js';
import { adminApi } from '../api/adminApi.js';
import { apiMessage } from '../api/axiosClient.js';
import { resolveUploadUrl } from '../utils/imageUrl.js';
import { enumLabel, timeAgo } from '../utils/format.js';
import Avatar from './Avatar.jsx';
import Modal from './Modal.jsx';

const REACTIONS = [
  ['LIKE', 'bi-hand-thumbs-up', 'Like'],
  ['CELEBRATE', 'bi-stars', 'Celebrate'],
  ['SUPPORT', 'bi-heart-pulse', 'Support'],
  ['LOVE', 'bi-heart-fill', 'Love'],
  ['INSIGHTFUL', 'bi-lightbulb', 'Insightful']
];

function CommentRow({ comment, own, onReply, onDelete }) {
  return (
    <div className={`comment-row ${comment.parentCommentId ? 'comment-reply' : ''}`}>
      <Link to={`/profile/${comment.authorId}`}>
        <Avatar name={comment.authorName} image={comment.authorProfilePicture} size={34} />
      </Link>
      <div className="comment-bubble">
        <div className="d-flex justify-content-between gap-2">
          <div>
            <Link to={`/profile/${comment.authorId}`} className="fw-semibold text-dark">
              {comment.authorName}
            </Link>
            <span className="text-muted small ms-2">{timeAgo(comment.createdAt)}</span>
          </div>
          {own && (
            <button className="mini-link text-danger" type="button" onClick={() => onDelete(comment.id)}>
              Delete
            </button>
          )}
        </div>
        <div className="comment-content">{comment.content}</div>
        <button className="mini-link mt-1" type="button" onClick={() => onReply(comment)}>
          Reply
        </button>
      </div>
    </div>
  );
}

export default function PostCard({
  post,
  currentUserId,
  role,
  onChanged,
  onRemoved,
  autoOpenComments = false
}) {
  const [data, setData] = useState(post);
  const [commentsOpen, setCommentsOpen] = useState(autoOpenComments);
  const [comments, setComments] = useState([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const [showEdit, setShowEdit] = useState(false);
  const [edit, setEdit] = useState({
    content: post.content || '',
    mediaUrl: post.mediaUrl || null,
    mediaType: post.mediaType || null,
    visibility: post.visibility || 'PUBLIC'
  });
  const [editMedia, setEditMedia] = useState(null);

  const [showShare, setShowShare] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [shareCaption, setShareCaption] = useState('');

  useEffect(() => {
    setData(post);
  }, [post]);

  useEffect(() => {
    if (!commentsOpen || commentsLoaded) return;
    postApi.comments(data.id)
      .then((items) => {
        setComments(items);
        setCommentsLoaded(true);
      })
      .catch((e) => setError(apiMessage(e)));
  }, [commentsOpen, commentsLoaded, data.id]);

  const isOwn = Number(data.authorId) === Number(currentUserId);
  const canDelete = isOwn || role === 'ADMIN';
  const mediaUrl = resolveUploadUrl(data.mediaUrl);

  const reactionSummary = useMemo(
    () =>
      Object.entries(data.reactions || {})
        .filter(([, count]) => Number(count) > 0)
        .map(([type, count]) => `${enumLabel(type)} ${count}`)
        .join(' · '),
    [data.reactions]
  );

  const refresh = (next) => {
    setData(next);
    onChanged?.(next);
  };

  const react = async (reaction) => {
    setBusy(true);
    setError('');
    try {
      const next =
        data.myReaction === reaction
          ? await postApi.unreact(data.id)
          : await postApi.react(data.id, reaction);
      refresh(next);
    } catch (e) {
      setError(apiMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const toggleSave = async () => {
    setBusy(true);
    try {
      if (data.savedByMe) await postApi.unsave(data.id);
      else await postApi.save(data.id);
      refresh({ ...data, savedByMe: !data.savedByMe });
    } catch (e) {
      setError(apiMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const removePost = async () => {
    if (!window.confirm('Delete this post?')) return;
    setBusy(true);
    try {
      if (role === 'ADMIN' && !isOwn) await adminApi.deleteSocialPost(data.id);
      else await postApi.remove(data.id);
      onRemoved?.(data.id);
    } catch (e) {
      setError(apiMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const submitComment = async (event) => {
    event.preventDefault();
    if (!commentText.trim()) return;
    setBusy(true);
    try {
      const created = await postApi.comment(data.id, commentText.trim(), replyTo?.id || null);
      setComments((old) => [...old, created]);
      setCommentText('');
      setReplyTo(null);
      refresh({ ...data, commentCount: Number(data.commentCount || 0) + 1 });
    } catch (e) {
      setError(apiMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const deleteComment = async (id) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await postApi.deleteComment(id);
      setComments((old) => old.filter((c) => c.id !== id));
      refresh({ ...data, commentCount: Math.max(0, Number(data.commentCount || 0) - 1) });
    } catch (e) {
      setError(apiMessage(e));
    }
  };

  const saveEdit = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      const next = await postApi.update(data.id, edit, editMedia);
      refresh(next);
      setShowEdit(false);
      setEditMedia(null);
    } catch (e) {
      setError(apiMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const share = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      await postApi.share(data.id, shareCaption);
      refresh({ ...data, shareCount: Number(data.shareCount || 0) + 1 });
      setShareCaption('');
      setShowShare(false);
    } catch (e) {
      setError(apiMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <article className="social-card post-card">
        <div className="post-head">
          <Link to={`/profile/${data.authorId}`}>
            <Avatar name={data.authorName} image={data.authorProfilePicture} size={48} />
          </Link>
          <div className="min-w-0 flex-grow-1">
            <Link to={`/profile/${data.authorId}`} className="post-author">
              {data.authorName}
            </Link>
            <div className="post-meta">
              {enumLabel(data.authorRole)} · {timeAgo(data.createdAt)}
              {data.edited ? ' · Edited' : ''}
              {' · '}
              <i className={`bi ${
                data.visibility === 'PRIVATE'
                  ? 'bi-lock-fill'
                  : data.visibility === 'CONNECTIONS_ONLY'
                    ? 'bi-people-fill'
                    : 'bi-globe2'
              }`} />
            </div>
          </div>

          {(isOwn || canDelete) && (
            <div className="post-options">
              <button
                className="icon-button"
                type="button"
                aria-label="Post options"
                onClick={() => setOptionsOpen((open) => !open)}
              >
                <i className="bi bi-three-dots" />
              </button>
              {optionsOpen && (
                <div className="post-options-menu">
                  {isOwn && (
                    <button
                      type="button"
                      onClick={() => {
                        setOptionsOpen(false);
                        setShowEdit(true);
                      }}
                    >
                      <i className="bi bi-pencil me-2" /> Edit
                    </button>
                  )}
                  {canDelete && (
                    <button
                      className="text-danger"
                      type="button"
                      onClick={() => {
                        setOptionsOpen(false);
                        removePost();
                      }}
                    >
                      <i className="bi bi-trash me-2" /> Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {data.content && <div className="post-content">{data.content}</div>}

        {mediaUrl && (
          <div className="post-media">
            {String(data.mediaType || '').startsWith('video/') ? (
              <video src={mediaUrl} controls />
            ) : String(data.mediaType || '').startsWith('image/') || !data.mediaType ? (
              <img src={mediaUrl} alt="Post media" />
            ) : (
              <a href={mediaUrl} target="_blank" rel="noreferrer" className="file-attachment">
                <i className="bi bi-paperclip" /> Open attachment
              </a>
            )}
          </div>
        )}

        {(data.reactionCount > 0 || data.commentCount > 0 || data.shareCount > 0) && (
          <div className="post-stats">
            <span title={reactionSummary}>
              <i className="bi bi-hand-thumbs-up-fill text-primary me-1" />
              {data.reactionCount || 0}
            </span>
            <span className="ms-auto">
              {data.commentCount || 0} comments  
            </span>
          </div>
        )}

        <div className="post-actions">
          <div className="reaction-action">
            <button
              type="button"
              className={`post-action ${data.myReaction ? 'active' : ''}`}
              disabled={busy}
              onClick={() => react(data.myReaction || 'LIKE')}
            >
              <i className="bi bi-hand-thumbs-up" />
              {data.myReaction ? enumLabel(data.myReaction) : 'Like'}
            </button>
            <div className="reaction-picker">
              {REACTIONS.map(([type, icon, label]) => (
                <button key={type} type="button" title={label} onClick={() => react(type)}>
                  <i className={`bi ${icon}`} />
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="post-action"
            onClick={() => setCommentsOpen((x) => !x)}
          >
            <i className="bi bi-chat-left-text" /> Comment
          </button>

          {/* {data.visibility !== 'PRIVATE' && (
            <button type="button" className="post-action" onClick={() => setShowShare(true)}>
              <i className="bi bi-arrow-repeat" /> Share
            </button>
          )} */}

          <button
            type="button"
            className={`post-action ${data.savedByMe ? 'active' : ''}`}
            onClick={toggleSave}
          >
            <i className={`bi ${data.savedByMe ? 'bi-bookmark-fill' : 'bi-bookmark'}`} /> Save
          </button>
        </div>

        {error && <div className="px-3 pb-2 text-danger small">{error}</div>}

        {commentsOpen && (
          <div className="comments-panel">
            {comments.length === 0 && commentsLoaded && (
              <div className="text-muted small py-2">No comments yet. Start the conversation.</div>
            )}

            {comments.map((comment) => (
              <CommentRow
                key={comment.id}
                comment={comment}
                own={Number(comment.authorId) === Number(currentUserId)}
                onReply={(item) => {
                  setReplyTo(item);
                  setCommentText(`@${item.authorName} `);
                }}
                onDelete={deleteComment}
              />
            ))}

            {replyTo && (
              <div className="replying-to">
                Replying to {replyTo.authorName}
                <button type="button" onClick={() => setReplyTo(null)}>
                  Cancel
                </button>
              </div>
            )}

            <form className="comment-form" onSubmit={submitComment}>
              <input
                className="form-control"
                placeholder="Add a comment…"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button className="btn btn-brand btn-sm" disabled={busy || !commentText.trim()}>
                Post
              </button>
            </form>
          </div>
        )}
      </article>

      <Modal show={showEdit} title="Edit post" onClose={() => setShowEdit(false)}>
        <form onSubmit={saveEdit}>
          <textarea
            className="form-control mb-3"
            rows={6}
            value={edit.content}
            onChange={(e) => setEdit({ ...edit, content: e.target.value })}
          />
          <div className="mb-3">
            <label className="form-label">Replace media</label>
            <input
              className="form-control"
              type="file"
              accept="image/*,video/mp4,video/webm,video/quicktime"
              onChange={(e) => setEditMedia(e.target.files?.[0] || null)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Visibility</label>
            <select
              className="form-select"
              value={edit.visibility}
              onChange={(e) => setEdit({ ...edit, visibility: e.target.value })}
            >
              <option value="PUBLIC">Public</option>
              <option value="CONNECTIONS_ONLY">Connections only</option>
              <option value="PRIVATE">Only me</option>
            </select>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-outline-secondary" type="button" onClick={() => setShowEdit(false)}>
              Cancel
            </button>
            <button className="btn btn-brand" disabled={busy}>Save changes</button>
          </div>
        </form>
      </Modal>

      <Modal show={showShare} title="Share post" onClose={() => setShowShare(false)}>
        <form onSubmit={share}>
          <textarea
            className="form-control mb-3"
            rows={4}
            placeholder="Add your thoughts (optional)"
            value={shareCaption}
            onChange={(e) => setShareCaption(e.target.value)}
          />
          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-outline-secondary" type="button" onClick={() => setShowShare(false)}>
              Cancel
            </button>
            <button className="btn btn-brand" disabled={busy}>Share</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
