import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminApi } from '../../api/adminApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import { resolveUploadUrl } from '../../utils/imageUrl.js';
import { timeAgo } from '../../utils/format.js';
import Avatar from '../../components/Avatar.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Loader from '../../components/Loader.jsx';
import PageTitle from '../../components/PageTitle.jsx';

function participantsLabel(conversation) {
  return (conversation?.participants || []).map((p) => p.name).filter(Boolean).join(' & ') || 'Conversation';
}

export default function AdminMessages() {
  const [params, setParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(params.get('conversation'));
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const loadConversations = useCallback(async () => {
    try {
      const list = await adminApi.listConversations();
      setConversations(list || []);
      return list || [];
    } catch (e) {
      setError(apiMessage(e));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (id) => {
    if (!id) return;
    setLoadingMessages(true);
    try {
      setMessages(await adminApi.conversationMessages(id));
    } catch (e) {
      setError(apiMessage(e));
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    loadConversations().then((list) => {
      const requested = params.get('conversation');
      if (requested) setSelectedId(requested);
      else if (list.length > 0) setSelectedId(String(list[0].id));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setParams({ conversation: selectedId }, { replace: true });
    loadMessages(selectedId);
  }, [selectedId, loadMessages, setParams]);

  const selected = useMemo(
    () => conversations.find((c) => String(c.id) === String(selectedId)),
    [conversations, selectedId]
  );

  const visibleConversations = conversations.filter((c) => {
    if (!query.trim()) return true;
    return participantsLabel(c).toLowerCase().includes(query.trim().toLowerCase());
  });

  return (
    <div>
      <PageTitle
        title="All Messages"
        subtitle="Direct conversations between users, for oversight — read-only"
      />

      <div className="messages-shell">
        <aside className="conversation-pane">
          <div className="conversation-pane-head">
            <div>
              <h5 className="mb-0">Conversations</h5>
              <span className="text-muted small">{conversations.length} total</span>
            </div>
          </div>

          <div className="p-2">
            <input
              className="form-control form-control-sm"
              placeholder="Search participants…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <Loader />
          ) : visibleConversations.length === 0 ? (
            <EmptyState
              icon="bi-chat-dots"
              title="No conversations"
              message="No one has messaged each other yet."
            />
          ) : (
            <div className="conversation-list">
              {visibleConversations.map((conversation) => (
                <button
                  type="button"
                  key={conversation.id}
                  className={`conversation-item ${
                    String(selectedId) === String(conversation.id) ? 'active' : ''
                  }`}
                  onClick={() => setSelectedId(String(conversation.id))}
                >
                  <div className="d-flex" style={{ marginLeft: '-4px' }}>
                    {(conversation.participants || []).slice(0, 2).map((p) => (
                      <Avatar key={p.userId} name={p.name} image={p.profilePicture} size={40} />
                    ))}
                  </div>
                  <div className="min-w-0">
                    <div className="fw-semibold text-truncate">{participantsLabel(conversation)}</div>
                    <div className="small text-muted text-truncate">
                      {(conversation.participants || []).map((p) => p.role).filter(Boolean).join(' · ')}
                    </div>
                  </div>
                  <span className="conversation-time">{timeAgo(conversation.updatedAt)}</span>
                </button>
              ))}
            </div>
          )}
        </aside>

        <section className="chat-pane">
          {!selectedId ? (
            <EmptyState
              icon="bi-chat-square-text"
              title="Select a conversation"
              message="Pick a conversation on the left to review its messages."
            />
          ) : (
            <>
              <div className="chat-head">
                <div>
                  <div className="fw-semibold">{participantsLabel(selected)}</div>
                  <div className="text-muted small">
                    {(selected?.participants || []).map((p) => p.role).filter(Boolean).join(' · ')}
                  </div>
                </div>
              </div>

              <div className="message-stream">
                {loadingMessages ? (
                  <Loader />
                ) : messages.length === 0 ? (
                  <EmptyState icon="bi-chat" title="No messages yet" />
                ) : (
                  messages.map((message) => {
                    const attachmentUrl = resolveUploadUrl(message.attachmentUrl);
                    return (
                      <div className="message-row" key={message.id}>
                        <div className="message-bubble">
                          <div className="message-sender">{message.senderName}</div>
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
                            {timeAgo(message.sentAt)} · {message.read ? 'Read' : 'Unread'}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="px-3 py-2 text-muted small border-top">
                <i className="bi bi-eye me-1" /> Admin view — messages are read-only here.
              </div>
            </>
          )}
        </section>
      </div>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}
