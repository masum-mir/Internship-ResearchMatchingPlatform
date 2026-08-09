import client from './axiosClient.js';

export const directoryApi = {
  search: (q) => client.get('/directory/search', { params: { q } }).then((r) => r.data)
};
