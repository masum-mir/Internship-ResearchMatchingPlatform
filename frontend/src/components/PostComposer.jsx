import { useEffect, useMemo, useState } from 'react';
import { postApi } from '../api/postApi.js';
import { apiMessage } from '../api/axiosClient.js';
import Avatar from './Avatar.jsx';

const EMPTY = {
  content: '',
  mediaUrl: null,
  mediaType: null,
  visibility: 'PUBLIC'
};

export default function PostComposer({ profile, user, onCreated }) {
  const [form, setForm] = useState(EMPTY);
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!media) {
      setPreview(null);
      return undefined;
    }
    const url = URL.createObjectURL(media);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [media]);

  const mediaKind = useMemo(() => media?.type || '', [media]);

  const submit = async (event) => {
    event.preventDefault();
    if (!form.content.trim() && !media) return;

    setPosting(true);
    setError('');
    try {
      const created = await postApi.create(
        {
          ...form,
          content: form.content.trim(),
          mediaType: media?.type || form.mediaType
        },
        media
      );
      setForm(EMPTY);
      setMedia(null);
      onCreated?.(created);
    } catch (e) {
      setError(apiMessage(e));
    } finally {
      setPosting(false);
    }
  };

  return (
    <form className="social-card post-composer" onSubmit={submit}>
      <div className="d-flex gap-3">
        <Avatar
          name={profile?.name || profile?.companyName || user?.email}
          image={profile?.profilePicture}
          size={48}
        />
        <textarea
          className="composer-input"
          rows={2}
          placeholder="Share an update, achievement, opportunity or idea…"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
      </div>

      {preview && (
        <div className="composer-preview">
          {mediaKind.startsWith('video/') ? (
            <video src={preview} controls />
          ) : (
            <img src={preview} alt="Selected upload preview" />
          )}
          <button
            type="button"
            className="icon-button composer-preview-remove"
            onClick={() => setMedia(null)}
            aria-label="Remove media"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>
      )}

      {error && <div className="text-danger small mt-2">{error}</div>}

      <div className="composer-actions">
        <label className="composer-action">
          <i className="bi bi-image text-success" />
          <span>Photo/video</span>
          <input
            type="file"
            hidden
            accept="image/*,video/mp4,video/webm,video/quicktime"
            onChange={(e) => setMedia(e.target.files?.[0] || null)}
          />
        </label>

        {/* <select
          className="form-select form-select-sm composer-visibility"
          value={form.visibility}
          onChange={(e) => setForm({ ...form, visibility: e.target.value })}
          aria-label="Post visibility"
        >
          <option value="PUBLIC">Public</option>
          <option value="CONNECTIONS_ONLY">Connections only</option>
          <option value="PRIVATE">Only me</option>
        </select> */}

        <button
          className="btn btn-brand btn-sm ms-auto"
          disabled={posting || (!form.content.trim() && !media)}
        >
          {posting ? 'Posting…' : 'Post'}
        </button>
      </div>
    </form>
  );
}
