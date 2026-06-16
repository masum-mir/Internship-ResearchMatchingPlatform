import client from './axiosClient.js';

export const applicationApi = {
  apply: (body) => client.post('/applications', body).then((r) => r.data),
  withdraw: (id) => client.delete(`/applications/${id}`),
  mine: () => client.get('/applications/me').then((r) => r.data),
  internshipApplicants: (internshipId) =>
    client.get(`/applications/internships/${internshipId}`).then((r) => r.data),
  researchApplicants: (researchId) =>
    client.get(`/applications/research/${researchId}`).then((r) => r.data),
  updateStatus: (id, status) =>
    client.put(`/applications/${id}/status`, { status }).then((r) => r.data)
};
