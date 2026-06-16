import client from './axiosClient.js';

export const studentApi = {
  getMyProfile: () => client.get('/students/me').then((r) => r.data),
  updateMyProfile: (body) => client.put('/students/me', body).then((r) => r.data),
  listSkills: () => client.get('/students/me/skills').then((r) => r.data),
  addSkill: (body) => client.post('/students/me/skills', body).then((r) => r.data),
  removeSkill: (skillId) => client.delete(`/students/me/skills/${skillId}`).then((r) => r.data),
  listProjects: () => client.get('/students/me/projects').then((r) => r.data),
  addProject: (body) => client.post('/students/me/projects', body).then((r) => r.data),
  updateProject: (id, body) => client.put(`/students/me/projects/${id}`, body).then((r) => r.data),
  deleteProject: (id) => client.delete(`/students/me/projects/${id}`),
  listCertifications: () => client.get('/students/me/certifications').then((r) => r.data),
  addCertification: (body) => client.post('/students/me/certifications', body).then((r) => r.data),
  updateCertification: (id, body) => client.put(`/students/me/certifications/${id}`, body).then((r) => r.data),
  deleteCertification: (id) => client.delete(`/students/me/certifications/${id}`),
  getPortfolio: (id) => client.get(`/students/${id}/portfolio`).then((r) => r.data)
};
