import client from './axiosClient.js';

export const dashboardApi = {
  student: () => client.get('/dashboard/student').then((r) => r.data),
  company: () => client.get('/dashboard/company').then((r) => r.data),
  faculty: () => client.get('/dashboard/faculty').then((r) => r.data),
  admin: () => client.get('/dashboard/admin').then((r) => r.data)
};
