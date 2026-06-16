import client from './axiosClient.js';

export const internshipApi = {
  create: (body) => client.post('/internships', body).then((r) => r.data),
  update: (id, body) => client.put(`/internships/${id}`, body).then((r) => r.data),
  remove: (id) => client.delete(`/internships/${id}`),
  mine: () => client.get('/internships/mine').then((r) => r.data),
  matched: () => client.get('/internships/matched').then((r) => r.data),
  search: (params) => client.get('/internships', { params }).then((r) => r.data),
  getById: (id) => client.get(`/internships/${id}`).then((r) => r.data)
};
