import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { postApi } from '../../api/postApi.js';
import { studentApi } from '../../api/studentApi.js';
import { facultyApi, companyApi } from '../../api/profileApi.js';
import { adminApi } from '../../api/adminApi.js';
import { useAuth } from '../../auth/AuthContext.jsx';
import { apiMessage } from '../../api/axiosClient.js';
import Loader from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import PostComposer from '../../components/PostComposer.jsx';
import PostCard from '../../components/PostCard.jsx';
import PageTitle from '../../components/PageTitle.jsx';

async function loadRoleProfile(role) {
  if (role === 'STUDENT') return studentApi.getMyProfile();
  if (role === 'FACULTY') return facultyApi.getMyProfile();
  if (role === 'COMPANY') return companyApi.getMyProfile();
  if (role === 'ADMIN') return adminApi.getMyProfile();
  return null;
}

export default function Feed() {
  const { user, role } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedPost = searchParams.get('post');

  const [mode, setMode] = useState(searchParams.get('view') || 'feed');
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (nextMode = mode) => {
    setLoading(true);
    setError('');
    try {
      let data;
      if (requestedPost) data = [await postApi.get(requestedPost)];
      else if (nextMode === 'mine') data = await postApi.mine();
      else if (nextMode === 'saved') data = await postApi.saved();
      else data = await postApi.feed();
      setPosts(data || []);
    } catch (e) {
      setError(apiMessage(e));
    } finally {
      setLoading(false);
    }
  }, [mode, requestedPost]);

  useEffect(() => {
    loadRoleProfile(role).then(setProfile).catch(() => setProfile(null));
  }, [role]);

  useEffect(() => {
    load(mode);
  }, [load, mode]);

  const changeMode = (next) => {
    setMode(next);
    const params = new URLSearchParams(searchParams);
    params.delete('post');
    if (next === 'feed') params.delete('view');
    else params.set('view', next);
    setSearchParams(params, { replace: true });
  };

  const upsert = (next) => {
    setPosts((old) => old.map((p) => (p.id === next.id ? next : p)));
  };

  const remove = (id) => {
    setPosts((old) => old.filter((p) => p.id !== id));
  };

  return (
    <div className="feed-page">
      <PageTitle
        title="Home"
        subtitle="Updates from your university professional network"
      />

      <div className="feed-layout">
        <div className="feed-main">
          {!requestedPost && (
            <PostComposer
              profile={profile}
              user={user}
              onCreated={(created) => setPosts((old) => [created, ...old])}
            />
          )}

          {!requestedPost && (
            <div className="feed-filter-tabs">
              {[
                ['feed', 'Feed', 'bi-house-door'],
                ['mine', 'My posts', 'bi-person-square'],
                ['saved', 'Saved', 'bi-bookmark']
              ].map(([value, label, icon]) => (
                <button
                  key={value}
                  type="button"
                  className={mode === value ? 'active' : ''}
                  onClick={() => changeMode(value)}
                >
                  <i className={`bi ${icon}`} /> {label}
                </button>
              ))}
            </div>
          )}

          {requestedPost && (
            <div className="mb-3">
              <Link to="/feed" className="btn btn-outline-secondary btn-sm">
                <i className="bi bi-arrow-left me-1" /> Back to feed
              </Link>
            </div>
          )}

          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <Loader label="Loading feed…" />
          ) : posts.length === 0 ? (
            <div className="social-card">
              <EmptyState
                icon="bi-newspaper"
                title={mode === 'saved' ? 'No saved posts yet' : 'Nothing here yet'}
                message={
                  mode === 'mine'
                    ? 'Create your first professional post.'
                    : 'Follow people and connect with your university community.'
                }
              />
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={user?.userId}
                role={role}
                onChanged={upsert}
                onRemoved={remove}
                autoOpenComments={Boolean(requestedPost)}
              />
            ))
          )}
        </div>

        {/* <aside className="feed-right">
          <div className="social-card side-info-card">
            <h6><i className="bi bi-compass me-2 text-primary" />Explore</h6>
            <Link to="/search">
              <i className="bi bi-people" /> Find people and organizations
            </Link>
            <Link to="/network">
              <i className="bi bi-person-plus" /> Grow your network
            </Link>
            {role === 'STUDENT' && (
              <>
                <Link to="/student/internships">
                  <i className="bi bi-briefcase" /> Internship opportunities
                </Link>
                <Link to="/student/research">
                  <i className="bi bi-journal-text" /> Research opportunities
                </Link>
              </>
            )}
            {role === 'COMPANY' && (
              <Link to="/company/internships/new">
                <i className="bi bi-plus-square" /> Post an internship
              </Link>
            )}
            {role === 'FACULTY' && (
              <Link to="/faculty/research/new">
                <i className="bi bi-plus-square" /> Post research opportunity
              </Link>
            )}
          </div>

          <div className="social-card side-info-card">
            <h6><i className="bi bi-shield-check me-2 text-success" />Professional community</h6>
            <p className="text-muted small mb-0">
              Keep your profile current, share useful work, and use messages and applications professionally.
            </p>
          </div>
        </aside> */}
      </div>
    </div>
  );
}
