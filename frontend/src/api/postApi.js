import client from './axiosClient.js';
import { buildMultipart } from './multipart.js';

export const postApi = {
  feed: () => client.get('/posts/feed').then((r) => r.data),
  mine: () => client.get('/posts/mine').then((r) => r.data),
  saved: () => client.get('/posts/saved').then((r) => r.data),
  search: (q) => client.get('/posts/search', { params: { q } }).then((r) => r.data),
  get: (id) => client.get(`/posts/${id}`).then((r) => r.data),

  create: (body, media = null) =>
    media instanceof File
      ? client.post('/posts', buildMultipart(body, { media })).then((r) => r.data)
      : client.post('/posts', body).then((r) => r.data),

  update: (id, body, media = null) =>
    media instanceof File
      ? client.put(`/posts/${id}`, buildMultipart(body, { media })).then((r) => r.data)
      : client.put(`/posts/${id}`, body).then((r) => r.data),

  remove: (id) => client.delete(`/posts/${id}`),

  react: (id, reaction) =>
    client.put(`/posts/${id}/reaction`, { type: reaction }).then((r) => r.data),
  like: (id) => client.put(`/posts/${id}/like`).then((r) => r.data),
  unreact: (id) => client.delete(`/posts/${id}/reaction`).then((r) => r.data),
  reactions: (id) => client.get(`/posts/${id}/reactions`).then((r) => r.data),

  comments: (id) => client.get(`/posts/${id}/comments`).then((r) => r.data),
  comment: (id, content, parentCommentId = null) =>
    client.post(`/posts/${id}/comments`, { content, parentCommentId }).then((r) => r.data),
  deleteComment: (id) => client.delete(`/posts/comments/${id}`),

  share: (id, caption = '') => client.post(`/posts/${id}/share`, { caption }),
  save: (id) => client.put(`/posts/${id}/save`),
  unsave: (id) => client.delete(`/posts/${id}/save`),

  report: (id, category, details = '') =>
    client.post(`/posts/${id}/report`, { category, details }).then((r) => r.data),

  reportComment: (id, category, details = '') =>
    client.post(`/posts/comments/${id}/report`, { category, details }).then((r) => r.data)
};
