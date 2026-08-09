import client from './axiosClient.js';

export const notificationApi = {
  mine: () => client.get('/notifications').then((r) => r.data),
  unreadCount: () => client.get('/notifications/unread-count').then((r) => r.data),
  markRead: (id) => client.put(`/notifications/${id}/read`),
  markAllRead: () => client.put('/notifications/read-all')
};
