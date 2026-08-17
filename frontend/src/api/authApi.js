import client from './axiosClient.js';

export const authApi = {
  register: (body) => client.post('/auth/register', body).then((r) => r.data),
  login: (body) => client.post('/auth/login', body).then((r) => r.data),
  logout: (refreshToken) => client.post('/auth/logout', { refreshToken }),
  changePassword: (body) => client.put('/auth/password', body),
  // Applies immediately if the account has self-edit permission enabled (or
  // is an admin); otherwise creates a request an admin must approve. Works
  // for a password change, an email change, or both in one call.
  requestCredentialChange: (body) => client.post('/auth/credential-change-requests', body).then((r) => r.data),
  myCredentialChangeRequests: () => client.get('/auth/credential-change-requests/mine').then((r) => r.data)
};
