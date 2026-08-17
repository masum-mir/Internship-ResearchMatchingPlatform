import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationApi } from '../../api/notificationApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import { enumLabel, timeAgo } from '../../utils/format.js';
import { notifyNotificationsUpdated } from '../../utils/profileEvents.js';
import { useAuth } from '../../auth/AuthContext.jsx';
import Loader from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import PageTitle from '../../components/PageTitle.jsx';

const ICONS = {
  CONNECTION_REQUEST: 'bi-person-plus',
  CONNECTION_ACCEPTED: 'bi-person-check',
  NEW_FOLLOWER: 'bi-person-heart',
  POST_REACTED: 'bi-hand-thumbs-up',
  POST_COMMENTED: 'bi-chat-left-text',
  POST_SHARED: 'bi-arrow-repeat',
  NEW_MESSAGE: 'bi-chat-dots',
  APPLICATION_SUBMITTED: 'bi-file-earmark-person',
  APPLICATION_STATUS_CHANGED: 'bi-file-earmark-check',
  NEW_OPPORTUNITY: 'bi-briefcase',
  SKILL_ENDORSED: 'bi-patch-check',
  CONTENT_REPORTED: 'bi-flag'
};

export default function Notifications() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setItems(await notificationApi.mine());
    } catch (e) {
      setError(apiMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const destination = (item) => {
    if (item.referenceType === 'POST') return `/feed?post=${item.referenceId}`;
    if (item.referenceType === 'CONVERSATION') return `/messages?conversation=${item.referenceId}`;
    if (item.referenceType === 'CONNECTION') return '/network?tab=requests';
    if (item.referenceType === 'CONTENT_REPORT') return '/admin/content-reports';
    // A followed faculty/company posted a new opportunity — students can open
    // it directly; other roles (who can follow too, but have no browse page
    // for it) fall back to the feed instead of hitting a 403.
    if (item.referenceType === 'RESEARCH' && role === 'STUDENT') return `/student/research?opportunity=${item.referenceId}`;
    if (item.referenceType === 'INTERNSHIP' && role === 'STUDENT') return `/student/internships?opportunity=${item.referenceId}`;
    if (item.type === 'APPLICATION_STATUS_CHANGED') return '/student/applications';
    if (item.type === 'NEW_OPPORTUNITY') return '/feed';
    if (item.actorId) return `/profile/${item.actorId}`;
    return '/feed';
  };

  const open = async (item) => {
    if (!item.read) {
      try {
        await notificationApi.markRead(item.id);
        setItems((old) => old.map((n) => (n.id === item.id ? { ...n, read: true } : n)));
        notifyNotificationsUpdated();
      } catch (e) {
        setError(apiMessage(e));
      }
    }
    navigate(destination(item));
  };

  const markAll = async () => {
    try {
      await notificationApi.markAllRead();
      setItems((old) => old.map((n) => ({ ...n, read: true })));
      notifyNotificationsUpdated();
    } catch (e) {
      setError(apiMessage(e));
    }
  };

  return (
    <div style={{ maxWidth: 820 }}>
      <PageTitle
        title="Notifications"
         action={
          items.some((x) => !x.read) ? (
            <button className="btn btn-outline-primary btn-sm" onClick={markAll}>
              Mark all as read
            </button>
          ) : null
        }
      />

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="social-card notification-list">
        {loading ? (
          <Loader />
        ) : items.length === 0 ? (
          <EmptyState icon="bi-bell" title="No notifications yet" />
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`notification-row ${item.read ? '' : 'unread'}`}
              onClick={() => open(item)}
            >
              <span className="notification-icon">
                <i className={`bi ${ICONS[item.type] || 'bi-bell'}`} />
              </span>
              <span className="flex-grow-1 text-start">
                <span className="notification-message">{item.message}</span>
                <span className="notification-meta">
                  {enumLabel(item.type)} · {timeAgo(item.createdAt)}
                </span>
              </span>
              {!item.read && <span className="unread-dot" />}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
