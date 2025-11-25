import { Navigate } from "react-router";
import { ADMIN_URL, AUTH_URL } from "../constant/url";
import { useAuth } from "../hooks/use-auth";

export default function AuthRedirect() {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) return <Navigate to={ADMIN_URL.DASHBOARD} replace />;

  return <Navigate to={AUTH_URL.LOGIN} replace />;
}
