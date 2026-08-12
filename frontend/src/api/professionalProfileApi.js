// import client from './axiosClient.js';

// export const professionalProfileApi = {
//   get: (userId) => client.get(`/profiles/users/${userId}`).then((r) => r.data),
//   me: () => client.get('/profiles/me').then((r) => r.data),
//   education: (userId) => client.get(`/profiles/users/${userId}/education`).then((r) => r.data),
//   experience: (userId) => client.get(`/profiles/users/${userId}/experience`).then((r) => r.data),

//   addEducation: (body) => client.post('/profiles/me/education', body).then((r) => r.data),
//   updateEducation: (id, body) => client.put(`/profiles/me/education/${id}`, body).then((r) => r.data),
//   deleteEducation: (id) => client.delete(`/profiles/me/education/${id}`),

//   addExperience: (body) => client.post('/profiles/me/experience', body).then((r) => r.data),
//   updateExperience: (id, body) => client.put(`/profiles/me/experience/${id}`, body).then((r) => r.data),
//   deleteExperience: (id) => client.delete(`/profiles/me/experience/${id}`)
// };

import api from './axiosClient.js';

const unwrap = (response) => response?.data ?? response;

export const professionalProfileApi = {
  get: async (userId) =>
    unwrap(await api.get(`/profiles/users/${userId}`)),

  getEducation: async (userId) =>
    unwrap(await api.get(`/profiles/users/${userId}/education`)),

  getExperience: async (userId) =>
    unwrap(await api.get(`/profiles/users/${userId}/experience`)),

  addEducation: async (data) =>
    unwrap(await api.post('/profiles/me/education', data)),

  updateEducation: async (id, data) =>
    unwrap(await api.put(`/profiles/me/education/${id}`, data)),

  deleteEducation: async (id) =>
    unwrap(await api.delete(`/profiles/me/education/${id}`)),

  addExperience: async (data) =>
    unwrap(await api.post('/profiles/me/experience', data)),

  updateExperience: async (id, data) =>
    unwrap(await api.put(`/profiles/me/experience/${id}`, data)),

  deleteExperience: async (id) =>
    unwrap(await api.delete(`/profiles/me/experience/${id}`)),

  report: async (userId, category, details = '') =>
    unwrap(await api.post(`/profiles/users/${userId}/report`, { category, details }))
};
