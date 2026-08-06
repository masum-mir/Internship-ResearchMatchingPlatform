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
  reports: () => client.get('/admin/reports').then((r) => r.data),

  getMyProfile: () => client.get('/admin/me').then((r) => r.data),
  updateMyProfile: (body) => client.put('/admin/me', body).then((r) => r.data),

  uploadProfileImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return client.post('/upload/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then((r) => r.data);
  },

  uploadCoverImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return client.post('/upload/cover', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then((r) => r.data);
  }
};
