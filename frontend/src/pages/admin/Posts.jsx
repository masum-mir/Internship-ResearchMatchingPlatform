import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi.js';
import { useAuth } from '../../auth/AuthContext.jsx';
import { apiMessage } from '../../api/axiosClient.js';
import Loader from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import PostCard from '../../components/PostCard.jsx';
import PageTitle from '../../components/PageTitle.jsx';

export default function AdminPosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setPosts(await adminApi.listAllPosts());
    } catch (e) {
      setError(apiMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const upsert = (next) => {
    setPosts((old) => old.map((p) => (p.id === next.id ? next : p)));
  };

  const remove = (id) => {
    setPosts((old) => old.filter((p) => p.id !== id));
  };

  const visible = posts.filter((p) => {
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return (
      p.content?.toLowerCase().includes(q) ||
      p.authorName?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <PageTitle
        title="All Posts"
        subtitle="Every post shared across the platform, for moderation and oversight"
      />

      <div className="social-card mb-3 p-3">
        <input
          className="form-control"
          placeholder="Search by author or content…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <Loader label="Loading posts…" />
      ) : visible.length === 0 ? (
        <div className="social-card">
          <EmptyState
            icon="bi-newspaper"
            title="No posts found"
            message={query ? 'Try a different search term.' : 'Nothing has been posted yet.'}
          />
        </div>
      ) : (
        visible.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={user?.userId}
            role="ADMIN"
            onChanged={upsert}
            onRemoved={remove}
          />
        ))
      )}
    </div>
  );
}
