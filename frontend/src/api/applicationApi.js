import client from './axiosClient.js';
import { buildMultipart } from './multipart.js';

export const applicationApi = {
  apply: (body, resume = null) => {
    if (resume instanceof File) {
      return client.post('/applications', buildMultipart(body, { resume })).then((r) => r.data);
    }
    return client.post('/applications', body).then((r) => r.data);
  },
  withdraw: (id) => client.delete(`/applications/${id}`),
  mine: () => client.get('/applications/me').then((r) => r.data),
  internshipApplicants: (internshipId) =>
    client.get(`/applications/internships/${internshipId}`).then((r) => r.data),
  researchApplicants: (researchId) =>
    client.get(`/applications/research/${researchId}`).then((r) => r.data),
  updateStatus: (id, status, reviewerNote = '') =>
    client.put(`/applications/${id}/status`, { status, reviewerNote }).then((r) => r.data)
};
