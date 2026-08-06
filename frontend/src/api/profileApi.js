import client from './axiosClient.js';

export const facultyApi = {
  getMyProfile: () => client.get('/faculty/me').then((r) => r.data),

  updateMyProfile: (body) =>
    client.put('/faculty/me', body).then((r) => r.data),

  uploadProfileImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return client.post("/upload/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then((r) => r.data);
  },

  uploadCoverImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return client.post("/upload/cover", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then((r) => r.data);
  }
};

export const companyApi = {
  getMyProfile: () => client.get('/companies/me').then((r) => r.data),

  updateMyProfile: (body) =>
    client.put('/companies/me', body).then((r) => r.data),

  uploadProfileImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return client.post("/upload/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then((r) => r.data);
  },

  uploadCoverImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return client.post("/upload/cover", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then((r) => r.data);
  }
};