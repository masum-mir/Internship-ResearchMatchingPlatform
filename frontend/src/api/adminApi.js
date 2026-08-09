import client from './axiosClient.js';

export const adminApi = {
  listUsers: () => client.get('/admin/users').then((r) => r.data),
  blockUser: (id) => client.put(`/admin/users/${id}/block`).then((r) => r.data),
  unblockUser: (id) => client.put(`/admin/users/${id}/unblock`).then((r) => r.data),
  changeUserEmail: (id, email) => client.put(`/admin/users/${id}/email`, { email }).then((r) => r.data),
  changeUserName: (id, name) => client.put(`/admin/users/${id}/name`, { name }).then((r) => r.data),
  changeUserRole: (id, role) => client.put(`/admin/users/${id}/role`, { role }).then((r) => r.data),
  changeUserPassword: (id, newPassword) => client.put(`/admin/users/${id}/password`, { newPassword }).then((r) => r.data),
  deletePost: (type, id) => client.delete(`/admin/posts/${type}/${id}`),
  deleteSocialPost: (id) => client.delete(`/admin/social-posts/${id}`),
  reports: () => client.get('/admin/reports').then((r) => r.data),
  getMyProfile: () => client.get('/admin/me').then((r) => r.data)
};
