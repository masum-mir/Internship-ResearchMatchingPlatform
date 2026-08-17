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
  getMyProfile: () => client.get('/admin/me').then((r) => r.data),

  // Monitoring: every post / conversation on the platform, for oversight.
  listAllPosts: () => client.get('/admin/posts').then((r) => r.data),
  getSocialPost: (id) => client.get(`/admin/social-posts/${id}`).then((r) => r.data),
  getComment: (id) => client.get(`/admin/comments/${id}`).then((r) => r.data),
  listConversations: () => client.get('/admin/conversations').then((r) => r.data),
  conversationMessages: (id) => client.get(`/admin/conversations/${id}/messages`).then((r) => r.data),

  // Content moderation: only user-reported posts/messages surface here,
  // instead of admins seeing every post/message by default.
  contentReports: (status = 'PENDING') =>
    client.get('/admin/content-reports', { params: { status } }).then((r) => r.data),
  resolveContentReport: (id) => client.put(`/admin/content-reports/${id}/resolve`).then((r) => r.data),
  dismissContentReport: (id) => client.put(`/admin/content-reports/${id}/dismiss`).then((r) => r.data),

  // Email/password change requests submitted by users whose accounts don't
  // have self-edit permission — an admin has to approve or reject them.
  credentialChangeRequests: (status = 'PENDING') =>
    client.get('/admin/credential-change-requests', { params: { status } }).then((r) => r.data),
  approveCredentialChangeRequest: (id) => client.put(`/admin/credential-change-requests/${id}/approve`).then((r) => r.data),
  rejectCredentialChangeRequest: (id) => client.put(`/admin/credential-change-requests/${id}/reject`).then((r) => r.data),
  setSelfEditPermission: (id, enabled) => client.put(`/admin/users/${id}/self-edit-permission`, { enabled }).then((r) => r.data)
};
