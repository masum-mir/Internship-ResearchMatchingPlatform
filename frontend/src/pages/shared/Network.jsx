import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';
import { networkApi } from '../../api/networkApi.js';
import { directoryApi } from '../../api/directoryApi.js';
import { messageApi } from '../../api/messageApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import PageTitle from '../../components/PageTitle.jsx';
import UserCard from '../../components/UserCard.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Loader from '../../components/Loader.jsx';

const TABS = [
  ['discover', 'Discover', 'bi-search'],
  ['connections', 'Connections', 'bi-people'],
  ['requests', 'Requests', 'bi-person-plus'],
  ['followers', 'Followers', 'bi-person-heart'],
  ['following', 'Following', 'bi-person-check']
];

export default function Network() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const [tab, setTab] = useState(params.get('tab') || 'discover');
  const [query, setQuery] = useState(params.get('q') || '');
  const [people, setPeople] = useState([]);
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [notice, setNotice] = useState({ type: '', message: '' });

  const loadNetwork = useCallback(async () => {
    setLoading(true);
    try {
      const [c, r, f1, f2] = await Promise.all([
        networkApi.connections(),
        networkApi.pending(),
        networkApi.followers(),
        networkApi.following()
      ]);
      setConnections(c || []);
      setRequests(r || []);
      setFollowers(f1 || []);
      setFollowing(f2 || []);
    } catch (e) {
      setNotice({ type: 'danger', message: apiMessage(e) });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNetwork();
  }, [loadNetwork]);

  useEffect(() => {
    const q = params.get('q');
    if (q) {
      setQuery(q);
      setTab('discover');
      directoryApi.search(q).then(setPeople).catch(() => setPeople([]));
    }
  }, [params]);

  const search = async (event) => {
    event?.preventDefault();
    if (!query.trim()) {
      setPeople([]);
      return;
    }
    setLoading(true);
    setNotice({ type: '', message: '' });
    try {
      setPeople(await directoryApi.search(query.trim()));
      setParams({ tab: 'discover', q: query.trim() });
      setTab('discover');
    } catch (e) {
      setNotice({ type: 'danger', message: apiMessage(e) });
    } finally {
      setLoading(false);
    }
  };

  const connectionUserIds = useMemo(() => {
    const ids = new Set();
    connections.forEach((c) => {
      ids.add(Number(c.requesterId) === Number(user?.userId) ? c.addresseeId : c.requesterId);
    });
    return ids;
  }, [connections, user?.userId]);

  const followingIds = useMemo(
    () => new Set(following.map((f) => f.followingId)),
    [following]
  );

  const perform = async (key, fn, success) => {
    setActionId(key);
    setNotice({ type: '', message: '' });
    try {
      await fn();
      setNotice({ type: 'success', message: success });
      await loadNetwork();
    } catch (e) {
      setNotice({ type: 'danger', message: apiMessage(e) });
    } finally {
      setActionId(null);
    }
  };

  const connect = (person) =>
    perform(`connect-${person.userId}`, () => networkApi.connect(person.userId), 'Connection request sent.');

  const follow = (person) =>
    perform(`follow-${person.userId}`, () => networkApi.follow(person.userId), `You are now following ${person.name}.`);

  const unfollow = (person) =>
    perform(`follow-${person.userId}`, () => networkApi.unfollow(person.userId), `Unfollowed ${person.name}.`);

  const message = async (userId) => {
    setActionId(`message-${userId}`);
    try {
      const conversation = await messageApi.start(userId);
      window.location.assign(`/messages?conversation=${conversation.id}`);
    } catch (e) {
      setNotice({ type: 'danger', message: apiMessage(e) });
      setActionId(null);
    }
  };

  const showTab = (value) => {
    setTab(value);
    setParams(value === 'discover' && query ? { tab: value, q: query } : { tab: value });
  };

  const relationshipPerson = (id, name) => ({
    userId: id,
    name,
    headline: '',
    profilePicture: null
  });

  return (
    <div>
      <PageTitle
        title="My Network"
        subtitle="Connect, follow and discover people across the university community"
      />

      {notice.message && (
        <div className={`alert alert-${notice.type} alert-dismissible`}>
          {notice.message}
          <button className="btn-close" onClick={() => setNotice({ type: '', message: '' })} />
        </div>
      )}

      <div className="network-tabs social-card mb-3">
        {TABS.map(([value, label, icon]) => (
          <button
            key={value}
            className={tab === value ? 'active' : ''}
            onClick={() => showTab(value)}
            type="button"
          >
            <i className={`bi ${icon}`} />
            <span>{label}</span>
            {value === 'requests' && requests.length > 0 && (
              <span className="count-pill">{requests.length}</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'discover' && (
        <>
          <form className="social-card network-search" onSubmit={search}>
            <i className="bi bi-search" />
            <input
              className="form-control"
              placeholder="Search by name, department, company or industry"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-brand">Search</button>
          </form>

          {loading ? (
            <Loader />
          ) : people.length === 0 ? (
            <div className="social-card mt-3">
              <EmptyState
                icon="bi-people"
                title={query ? 'No matching profiles' : 'Search your community'}
                message="Find students, faculty members and companies."
              />
            </div>
          ) : (
            <div className="people-grid mt-3">
              {people
                .filter((person) => Number(person.userId) !== Number(user?.userId))
                .map((person) => (
                  <UserCard
                    key={person.userId}
                    person={person}
                    actions={
                      <>
                        {!connectionUserIds.has(person.userId) && (
                          <button
                            className="btn btn-outline-primary btn-sm"
                            disabled={actionId === `connect-${person.userId}`}
                            onClick={() => connect(person)}
                          >
                            <i className="bi bi-person-plus me-1" /> Connect
                          </button>
                        )}
                        {followingIds.has(person.userId) ? (
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            disabled={actionId === `follow-${person.userId}`}
                            onClick={() => unfollow(person)}
                          >
                            Following
                          </button>
                        ) : (
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            disabled={actionId === `follow-${person.userId}`}
                            onClick={() => follow(person)}
                          >
                            <i className="bi bi-plus me-1" /> Follow
                          </button>
                        )}
                        <button
                          className="btn btn-light btn-sm"
                          disabled={actionId === `message-${person.userId}`}
                          onClick={() => message(person.userId)}
                        >
                          <i className="bi bi-chat-dots" />
                        </button>
                      </>
                    }
                  />
                ))}
            </div>
          )}
        </>
      )}

      {tab === 'connections' && (
        <div className="social-card">
          {loading ? <Loader /> : connections.length === 0 ? (
            <EmptyState icon="bi-people" title="No connections yet" message="Use Discover to connect with people." />
          ) : (
            <div className="relationship-list">
              {connections.map((c) => {
                const otherId = Number(c.requesterId) === Number(user?.userId) ? c.addresseeId : c.requesterId;
                const otherName = Number(c.requesterId) === Number(user?.userId) ? c.addresseeName : c.requesterName;
                return (
                  <div className="relationship-row" key={c.id}>
                    <UserCard compact person={relationshipPerson(otherId, otherName)} />
                    <div className="d-flex gap-2">
                      <button className="btn btn-outline-primary btn-sm" onClick={() => message(otherId)}>
                        Message
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => perform(`remove-${c.id}`, () => networkApi.removeConnection(c.id), 'Connection removed.')}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'requests' && (
        <div className="social-card">
          {requests.length === 0 ? (
            <EmptyState icon="bi-person-plus" title="No pending requests" />
          ) : (
            <div className="relationship-list">
              {requests.map((r) => (
                <div className="relationship-row" key={r.id}>
                  <UserCard compact person={relationshipPerson(r.requesterId, r.requesterName)} />
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-brand btn-sm"
                      onClick={() => perform(`accept-${r.id}`, () => networkApi.accept(r.id), 'Connection accepted.')}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => perform(`reject-${r.id}`, () => networkApi.reject(r.id), 'Request declined.')}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'followers' && (
        <div className="social-card">
          {followers.length === 0 ? (
            <EmptyState icon="bi-person-heart" title="No followers yet" />
          ) : (
            <div className="relationship-list">
              {followers.map((f) => (
                <div className="relationship-row" key={f.id}>
                  <UserCard compact person={relationshipPerson(f.followerId, f.followerName)} />
                  <Link className="btn btn-outline-primary btn-sm" to={`/profile/${f.followerId}`}>
                    View profile
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'following' && (
        <div className="social-card">
          {following.length === 0 ? (
            <EmptyState icon="bi-person-check" title="You are not following anyone yet" />
          ) : (
            <div className="relationship-list">
              {following.map((f) => (
                <div className="relationship-row" key={f.id}>
                  <UserCard compact person={relationshipPerson(f.followingId, f.followingName)} />
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => perform(`unfollow-${f.id}`, () => networkApi.unfollow(f.followingId), 'Unfollowed.')}
                  >
                    Unfollow
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
