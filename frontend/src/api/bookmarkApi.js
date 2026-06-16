import client from './axiosClient.js';

export const bookmarkApi = {
  add: (body) => client.post('/bookmarks', body).then((r) => r.data),
  remove: (id) => client.delete(`/bookmarks/${id}`),
  mine: () => client.get('/bookmarks').then((r) => r.data)
};
