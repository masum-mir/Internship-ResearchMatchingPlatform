import client from './axiosClient.js';

export const networkApi = {
  connect: (userId) => client.post('/network/connections', { userId }).then((r) => r.data),
  accept: (id) => client.put(`/network/connections/${id}/accept`).then((r) => r.data),
  reject: (id) => client.put(`/network/connections/${id}/reject`).then((r) => r.data),
  removeConnection: (id) => client.delete(`/network/connections/${id}`),
  connections: () => client.get('/network/connections').then((r) => r.data),
  pending: () => client.get('/network/connections/pending').then((r) => r.data),

  follow: (userId) => client.post('/network/follow', { userId }).then((r) => r.data),
  unfollow: (userId) => client.delete(`/network/follow/${userId}`),
  followers: () => client.get('/network/followers').then((r) => r.data),
  following: () => client.get('/network/following').then((r) => r.data),

  block: (userId) => client.put(`/network/block/${userId}`),
  unblock: (userId) => client.delete(`/network/block/${userId}`)
};
