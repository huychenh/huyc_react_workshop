const AUTH_BASE = "/auth";

export const AUTH_URL = {
  BASE: AUTH_BASE,
  LOGIN: `${AUTH_BASE}/login`,
  SIGNUP: "/auth/signup"
};

const ADMIN_BASE = "/admin";

export const ADMIN_URL = {
  BASE: ADMIN_BASE,
  DASHBOARD: `${ADMIN_BASE}/dashboard`,
  SUBMISSIONS: `${ADMIN_BASE}/submissions`,
  PROFILE: `${ADMIN_BASE}/profile`,
  LOGOUT: `${ADMIN_BASE}/logout`,
  USERS: `${ADMIN_BASE}/users`,
};

export const API_URL_BASE = "https://dummyjson.com";
export const API_URL_GET_LIST_USERS = `${API_URL_BASE}/users`;
export const API_URL_ADD_USERS = `${API_URL_BASE}/users/add`;
export const API_URL_GET_USER_BY_ID = (id: number | string) => `${API_URL_BASE}/users/${id}`;
export const API_URL_UPDATE_USER = (id: number | string) => `${API_URL_BASE}/users/${id}`;
