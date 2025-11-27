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

