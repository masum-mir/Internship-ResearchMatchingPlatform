// import client from './axiosClient.js';

// export const researchApi = {
//   create: (body) => client.post('/research', body).then((r) => r.data),
//   update: (id, body) => client.put(`/research/${id}`, body).then((r) => r.data),
//   remove: (id) => client.delete(`/research/${id}`),
//   mine: () => client.get('/research/mine').then((r) => r.data),
//   matched: () => client.get('/research/matched').then((r) => r.data),
//   search: (params) => client.get('/research', { params }).then((r) => r.data),
//   getById: (id) => client.get(`/research/${id}`).then((r) => r.data)
// };

import api from './axiosClient.js';

const unwrap = (response) => response?.data ?? response;

export const researchApi = {
  mine: async () => {
    const response = await api.get('/research/mine');
    return unwrap(response);
  },

  getById: async (id) => {
    const response = await api.get(`/research/${id}`);
    return unwrap(response);
  },

  create: async (data) => {
    const response = await api.post('/research', data);
    return unwrap(response);
  },

  update: async (id, data) => {
    const response = await api.put(`/research/${id}`, data);
    return unwrap(response);
  },

  remove: async (id) => {
    const response = await api.delete(`/research/${id}`);
    return unwrap(response);
  },

  applicants: async (id) => {
    const response = await api.get(`/research/${id}/applicants`);
    return unwrap(response);
  },
  matched: async () => {
    const response = await api.get('/research/matched');
    return unwrap(response);
  } ,
  search: async (params) => {
    const response = await api.get('/research', { params });
    return unwrap(response);
  } 
 
};
