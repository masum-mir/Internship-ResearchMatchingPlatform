import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';
import { messageApi } from '../../api/messageApi.js';
import { networkApi } from '../../api/networkApi.js';
import { directoryApi } from '../../api/directoryApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import { resolveUploadUrl } from '../../utils/imageUrl.js';
import { timeAgo } from '../../utils/format.js';
import Avatar from '../../components/Avatar.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Loader from '../../components/Loader.jsx';
import Modal from '../../components/Modal.jsx';
import ReportModal from '../../components/ReportModal.jsx';
import UserCard from '../../components/UserCard.jsx';
import { reportCategoriesFor } from '../../utils/reportCategories.js';

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(params.get('conversation'));
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [peopleQuery, setPeopleQuery] = useState('');
  const [people, setPeople] = useState([]);
  const [reportTarget, setReportTarget] = useState(null);
  const [connectedIds, setConnectedIds] = useState(new Set());
  const bottomRef = useRef(null);

  const loadConnectedIds = useCallback(() => {
    networkApi.connections()
      .then((list) => {
        const ids = new Set();
        (list || []).forEach((c) => {
          ids.add(Number(c.requesterId) === Number(user?.userId) ? Number(c.addresseeId) : Number(c.requesterId));
        });
        setConnectedIds(ids);
      })
      .catch(() => setConnectedIds(new Set()));
  }, [user?.userId]);

  useEffect(() => {
    loadConnectedIds();
  }, [loadConnectedIds]);

  const loadConversations = useCallback(async () => {
    try {
      const list = (await messageApi.conversations() || [])
        .filter((conversation) => !(conversation.participants || []).some((participant) => participant.role === 'ADMIN'));
      setConversations(list);
      return list;
    } catch (e) {
      setError(apiMessage(e));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (id, silent = false) => {
    if (!id) return;
    if (!silent) setLoadingMessages(true);
    try {
      const list = await messageApi.messages(id);
      setMessages(list || []);
      await messageApi.markRead(id).catch(() => {});
    } catch (e) {
      if (!silent) setError(apiMessage(e));
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    loadConversations().then((list) => {
      const requested = params.get('conversation');
      if (requested && list.some((conversation) => String(conversation.id) === requested)) setSelectedId(requested);
      else if (list.length > 0) setSelectedId(String(list[0].id));
      else setSelectedId(null);
    });
  }, [loadConversations]);

  useEffect(() => {
    if (!selectedId) return undefined;
    setParams({ conversation: selectedId }, { replace: true });
    loadMessages(selectedId);

    const timer = window.setInterval(() => {
      loadMessages(selectedId, true);
      loadConversations();
      loadConnectedIds();
    }, 8000);

    return () => window.clearInterval(timer);
  }, [selectedId, loadMessages, loadConversations, loadConnectedIds, setParams]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selected = useMemo(
    () => conversations.find((c) => String(c.id) === String(selectedId)),
    [conversations, selectedId]
  );

  const otherParticipant = (conversation) =>
    [...(conversation?.participants || [])].find(
      (p) => Number(p.userId) !== Number(user?.userId)
    ) || [...(conversation?.participants || [])][0];

  const send = async (event) => {
    event.preventDefault();
    if (!selectedId || (!text.trim() && !attachment)) return;
    setSending(true);
    setError('');
    try {
      const created = await messageApi.send(
        selectedId,
        { content: text.trim() || '', attachmentUrl: null },
        attachment
      );
      setMessages((old) => [...old, created]);
      setText('');
      setAttachment(null);
      await loadConversations();
    } catch (e) {
      setError(apiMessage(e));
    } finally {
      setSending(false);
    }
  };

  const searchPeople = async (event) => {
    event.preventDefault();
    if (!peopleQuery.trim()) return;
    try {
      setPeople(await directoryApi.search(peopleQuery.trim()));
    } catch (e) {
      setError(apiMessage(e));
    }
  };

  const startConversation = async (userId) => {
    try {
      const conversation = await messageApi.start(userId);
      setShowNew(false);
      setPeople([]);
      setPeopleQuery('');
      const list = await loadConversations();
      if (!list.some((c) => c.id === conversation.id)) {
        setConversations((old) => [conversation, ...old]);
      }
      setSelectedId(String(conversation.id));
    } catch (e) {
      setError(apiMessage(e));
    }
  };

  return (
    <div className="messages-page">
      <div className="messages-shell">
        <aside className="conversation-pane">
          <div className="conversation-pane-head">
            <div>
              <h5 className="mb-0">Messaging</h5>
              <span className="text-muted small">{conversations.length} conversations</span>
            </div>
            <button className="icon-button" onClick={() => setShowNew(true)} title="New message">
              <i className="bi bi-pencil-square" />
            </button>
          </div>

          {loading ? (
            <Loader />
          ) : conversations.length === 0 ? (
            <EmptyState
              icon="bi-chat-dots"
              title="No conversations"
              message="Start a conversation with someone from the directory."
            >
              <button className="btn btn-brand btn-sm" onClick={() => setShowNew(true)}>
                New message
              </button>
            </EmptyState>
          ) : (
            <div className="conversation-list">
              {conversations.map((conversation) => {
                const other = otherParticipant(conversation);
                return (
                  <button
                    type="button"
                    key={conversation.id}
                    className={`conversation-item ${
                      String(selectedId) === String(conversation.id) ? 'active' : ''
                    }`}
                    onClick={() => setSelectedId(String(conversation.id))}
                  >
                    <Avatar name={other?.name} image={other?.profilePicture} size={46} />
                    <div className="min-w-0">
                      <div className="fw-semibold text-truncate">{other?.name || 'Conversation'}</div>
                      <div className="small text-muted text-truncate">{other?.headline || other?.role}</div>
                    </div>
                    <span className="conversation-time">{timeAgo(conversation.updatedAt)}</span>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        <section className="chat-pane">
          {!selectedId ? (
            <EmptyState
              icon="bi-chat-square-text"
              title="Select a conversation"
              message="Your messages will appear here."
            />
          ) : (
            <>
              <div className="chat-head">
                {(() => {
                  const other = otherParticipant(selected);
                  return (
                    <button
                      type="button"
                      className="chat-head-identity"
                      onClick={() => other?.userId && other.role !== 'ADMIN' && navigate(`/profile/${other.userId}`)}
                      title={other?.role !== 'ADMIN' && other?.name ? `View ${other.name}'s profile` : undefined}
                    >
                      <Avatar name={other?.name} image={other?.profilePicture} size={42} />
                      <div>
                        <div className="fw-semibold">{other?.name || 'Conversation'}</div>
                        <div className="text-muted small">{other?.headline || other?.role}</div>
                      </div>
                    </button>
                  );
                })()}
              </div>

              <div className="message-stream">
                {loadingMessages ? (
                  <Loader />
                ) : (
                  messages.map((message) => {
                    const mine = Number(message.senderId) === Number(user?.userId);
                    const attachmentUrl = resolveUploadUrl(message.attachmentUrl);
                    return (
                      <div className={`message-row ${mine ? 'mine' : ''}`} key={message.id}>
                        <div className="message-bubble">
                          {!mine && <div className="message-sender">{message.senderName}</div>}
                          {message.content && message.content !== '[attachment]' && (
                            <div className="pre-line">{message.content}</div>
                          )}
                          {attachmentUrl && (
                            <a
                              className="message-attachment"
                              href={attachmentUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <i className="bi bi-paperclip" /> Open attachment
                            </a>
                          )}
                          <div className="message-meta">
                            {timeAgo(message.sentAt)}
                            {mine && <span> · {message.read ? 'Read' : 'Sent'}</span>}
                            {!mine && (
                              <button
                                type="button"
                                className="mini-link ms-2 text-danger"
                                onClick={() => setReportTarget(message)}
                              >
                                <i className="bi bi-flag" /> Report
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {error && <div className="px-3 py-2 text-danger small">{error}</div>}

              {(() => {
                const other = otherParticipant(selected);
                const stillConnected = !other?.userId || connectedIds.has(Number(other.userId));
                if (stillConnected) return null;
                return (
                  <div className="px-3 py-2 text-danger small">
                    You're no longer connected with {other?.name || 'this person'} — reconnect to send new messages.
                  </div>
                );
              })()}

              {attachment && (
                <div className="selected-attachment">
                  <i className="bi bi-paperclip" />
                  <span className="text-truncate">{attachment.name}</span>
                  <button type="button" onClick={() => setAttachment(null)}>
                    <i className="bi bi-x-lg" />
                  </button>
                </div>
              )}

              <form className="message-composer" onSubmit={send}>
                <label className="icon-button mb-0">
                  <i className="bi bi-paperclip" />
                  <input
                    type="file"
                    hidden
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    disabled={!(() => {
                      const other = otherParticipant(selected);
                      return !other?.userId || connectedIds.has(Number(other.userId));
                    })()}
                    onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                  />
                </label>
                <textarea
                  rows={1}
                  className="form-control"
                  placeholder={
                    (() => {
                      const other = otherParticipant(selected);
                      const stillConnected = !other?.userId || connectedIds.has(Number(other.userId));
                      return stillConnected ? 'Write a message…' : 'Reconnect to send new messages';
                    })()
                  }
                  disabled={!(() => {
                    const other = otherParticipant(selected);
                    return !other?.userId || connectedIds.has(Number(other.userId));
                  })()}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      e.currentTarget.form?.requestSubmit();
                    }
                  }}
                />
                <button
                  className="btn btn-brand"
                  disabled={
                    sending ||
                    (!text.trim() && !attachment) ||
                    !(() => {
                      const other = otherParticipant(selected);
                      return !other?.userId || connectedIds.has(Number(other.userId));
                    })()
                  }
                >
                  <i className="bi bi-send-fill" />
                </button>
              </form>
            </>
          )}
        </section>
      </div>

      <Modal show={showNew} title="New message" onClose={() => setShowNew(false)}>
        <form className="d-flex gap-2 mb-3" onSubmit={searchPeople}>
          <input
            className="form-control"
            placeholder="Search people"
            value={peopleQuery}
            onChange={(e) => setPeopleQuery(e.target.value)}
          />
          <button className="btn btn-brand">Search</button>
        </form>
        <div className="new-message-results">
          {people
            .filter((p) => Number(p.userId) !== Number(user?.userId))
            .map((person) => {
              const isConnected = connectedIds.has(Number(person.userId));
              return (
                <UserCard
                  key={person.userId}
                  compact
                  person={person}
                  actions={
                    <button
                      className="btn btn-outline-primary btn-sm"
                      disabled={!isConnected}
                      title={isConnected ? undefined : 'Connect with this person to message them'}
                      onClick={() => startConversation(person.userId)}
                    >
                      {isConnected ? 'Message' : 'Not connected'}
                    </button>
                  }
                />
              );
            })}
        </div>
      </Modal>

      <ReportModal
        show={!!reportTarget}
        title="Report message"
        categories={reportCategoriesFor('MESSAGE')}
        onClose={() => setReportTarget(null)}
        onSubmit={(category, details) => messageApi.report(reportTarget.id, category, details)}
      />
    </div>
  );
}
