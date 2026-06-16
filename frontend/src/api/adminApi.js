import client from './axiosClient.js';

export const adminApi = {
  listUsers: () => client.get('/admin/users').then((r) => r.data),
  blockUser: (id) => client.put(`/admin/users/${id}/block`).then((r) => r.data),
  unblockUser: (id) => client.put(`/admin/users/${id}/unblock`).then((r) => r.data),
  deletePost: (type, id) => client.delete(`/admin/posts/${type}/${id}`),
  reports: () => client.get('/admin/reports').then((r) => r.data)
};
