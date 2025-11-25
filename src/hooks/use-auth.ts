import { TOKEN } from "../constant/auth";

export const useAuth = () => {
  const token = localStorage.getItem(TOKEN);
  const isLoggedIn = Boolean(token);

  return { token, isLoggedIn };
};
