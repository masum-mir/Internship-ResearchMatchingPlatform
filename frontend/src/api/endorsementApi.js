import client from './axiosClient.js';

export const endorsementApi = {
  endorse: (studentId, skillId) =>
    client.post('/endorsements', { studentId, skillId }).then((r) => r.data),
  remove: (studentId, skillId) =>
    client.delete(`/endorsements/students/${studentId}/skills/${skillId}`),
  list: (studentId, skillId) =>
    client.get(`/endorsements/students/${studentId}/skills/${skillId}`).then((r) => r.data)
};
