import client from './axiosClient.js';
import { buildMultipart } from './multipart.js';

export const messageApi = {
  start: (userId) => client.post('/messages/conversations', { userId }).then((r) => r.data),
  conversations: () => client.get('/messages/conversations').then((r) => r.data),
  messages: (conversationId) =>
    client.get(`/messages/conversations/${conversationId}`).then((r) => r.data),

  send: (conversationId, body, attachment = null) =>
    attachment instanceof File
      ? client.post(
          `/messages/conversations/${conversationId}`,
          buildMultipart(body, { attachment })
        ).then((r) => r.data)
      : client.post(`/messages/conversations/${conversationId}`, body).then((r) => r.data),

  markRead: (conversationId) => client.put(`/messages/conversations/${conversationId}/read`),

  report: (id, category, details = '') =>
    client.post(`/messages/${id}/report`, { category, details }).then((r) => r.data)
};
