import client from './axiosClient.js';

export const researchApi = {
  create: (body) => client.post('/research', body).then((r) => r.data),
  update: (id, body) => client.put(`/research/${id}`, body).then((r) => r.data),
  remove: (id) => client.delete(`/research/${id}`),
  mine: () => client.get('/research/mine').then((r) => r.data),
  matched: () => client.get('/research/matched').then((r) => r.data),
  search: (params) => client.get('/research', { params }).then((r) => r.data),
  getById: (id) => client.get(`/research/${id}`).then((r) => r.data)
};
