import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { directoryApi } from '../../api/directoryApi.js';
import { postApi } from '../../api/postApi.js';
import { networkApi } from '../../api/networkApi.js';
import { messageApi } from '../../api/messageApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import { useAuth } from '../../auth/AuthContext.jsx';
import UserCard from '../../components/UserCard.jsx';
import PostCard from '../../components/PostCard.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Loader from '../../components/Loader.jsx';
import PageTitle from '../../components/PageTitle.jsx';

export default function SearchResults() {
  const { user, role } = useAuth();
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [people, setPeople] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(Boolean(q));
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!q.trim()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.allSettled([directoryApi.search(q), postApi.search(q)])
      .then(([p, s]) => {
        setPeople(p.status === 'fulfilled' ? p.value : []);
        setPosts(s.status === 'fulfilled' ? s.value : []);
      })
      .finally(() => setLoading(false));
  }, [q]);

  const action = async (fn) => {
    try {
      await fn();
      setNotice('Action completed.');
    } catch (e) {
      setNotice(apiMessage(e));
    }
  };

  if (!q) {
    return (
      <div className="social-card">
        <EmptyState
          icon="bi-search"
          title="Search EWU Match"
          message="Use the search bar to find people, companies, faculty and posts."
        />
      </div>
    );
  }

  return (
    <div>
      <PageTitle title={`Search results for “${q}”`} />
      {notice && <div className="alert alert-info py-2">{notice}</div>}
      {loading ? (
        <Loader />
      ) : (
        <div className="search-results-layout">
          <section>
            <h5 className="mb-3">People and organizations</h5>
            {people.length === 0 ? (
              <div className="social-card"><EmptyState icon="bi-people" title="No people found" /></div>
            ) : (
              <div className="people-grid">
                {people
                  .filter((p) => Number(p.userId) !== Number(user?.userId))
                  .map((person) => (
                    <UserCard
                      key={person.userId}
                      person={person}
                      actions={
                        <>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => action(() => networkApi.connect(person.userId))}
                          >
                            Connect
                          </button>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => action(() => networkApi.follow(person.userId))}
                          >
                            Follow
                          </button>
                          <button
                            className="btn btn-light btn-sm"
                            onClick={async () => {
                              try {
                                const c = await messageApi.start(person.userId);
                                window.location.assign(`/messages?conversation=${c.id}`);
                              } catch (e) {
                                setNotice(apiMessage(e));
                              }
                            }}
                          >
                            Message
                          </button>
                        </>
                      }
                    />
                  ))}
              </div>
            )}
          </section>

          <section className="mt-4">
            <h5 className="mb-3">Posts</h5>
            {posts.length === 0 ? (
              <div className="social-card"><EmptyState icon="bi-newspaper" title="No posts found" /></div>
            ) : (
              <div style={{ maxWidth: 760 }}>
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUserId={user?.userId}
                    role={role}
                    onChanged={(next) => setPosts((old) => old.map((x) => x.id === next.id ? next : x))}
                    onRemoved={(id) => setPosts((old) => old.filter((x) => x.id !== id))}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
