import client from './axiosClient.js';
import { buildMultipart } from './multipart.js';

function profileClient(basePath) {
  return {
    getMyProfile: () => client.get(`${basePath}/me`).then((r) => r.data),
    updateMyProfile: (body, files = {}) => {
      const hasFiles = Object.values(files).some((file) => file instanceof File);
      return hasFiles
        ? client.put(`${basePath}/me`, buildMultipart(body, files)).then((r) => r.data)
        : client.put(`${basePath}/me`, body).then((r) => r.data);
    }
  };
}

export const facultyApi = profileClient('/faculty');
export const companyApi = profileClient('/companies');
