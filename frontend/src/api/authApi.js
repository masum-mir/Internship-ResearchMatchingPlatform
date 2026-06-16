import client from './axiosClient.js';

export const authApi = {
  register: (body) => client.post('/auth/register', body).then((r) => r.data),
  login: (body) => client.post('/auth/login', body).then((r) => r.data),
  logout: (refreshToken) => client.post('/auth/logout', { refreshToken }),
  changePassword: (body) => client.put('/auth/password', body)
};
