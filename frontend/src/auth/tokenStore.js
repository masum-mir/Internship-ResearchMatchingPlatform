// Small localStorage wrapper shared by the axios client and the auth context.
const ACCESS = 'imp_access';
const REFRESH = 'imp_refresh';
const USER = 'imp_user';

export const tokenStore = {
  getAccess: () => localStorage.getItem(ACCESS),
  getRefresh: () => localStorage.getItem(REFRESH),
  getUser: () => {
    const raw = localStorage.getItem(USER);
    return raw ? JSON.parse(raw) : null;
  },
  setSession: ({ accessToken, refreshToken, userId, email, roles }) => {
    localStorage.setItem(ACCESS, accessToken);
    localStorage.setItem(REFRESH, refreshToken);
    localStorage.setItem(USER, JSON.stringify({ userId, email, roles }));
  },
  setAccess: (accessToken) => localStorage.setItem(ACCESS, accessToken),
  setRefresh: (refreshToken) => localStorage.setItem(REFRESH, refreshToken),
  clear: () => {
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
    localStorage.removeItem(USER);
  }
};
