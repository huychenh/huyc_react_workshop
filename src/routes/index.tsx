import { createBrowserRouter, redirect } from "react-router";

import Login from "../pages/login";
import Dashboard from "../pages/dashboard";

import { ADMIN_URL, AUTH_URL } from "../constant/url";

import AuthRedirect from "./auth-redirect";
import { TOKEN } from "../constant/auth";
import AuthLayout from "../layouts/auth";
import AdminLayout from "../layouts/admin";
import SignUp from "../pages/signup";
import KYCSubmission from "../pages/kyc-submission";
import UserProfile from "../pages/user-profile";
import UserList from "../pages/user-list";
import KYCInformation from "../pages/kyc-information";
import KYCSubmissionResult from "../pages/kyc-submission-result";


const requireAuth = () => {
  const token = localStorage.getItem(TOKEN);

  if (!token) {
    throw redirect(AUTH_URL.LOGIN);
  }

  return null;
};

const Router = createBrowserRouter([
  {
    path: "/",
    Component: AuthRedirect,
  },

  // AUTH ZONE
  {
    path: AUTH_URL.BASE,
    Component: AuthLayout,
    children: [
      { index: true, Component: Login },
      { path: AUTH_URL.LOGIN, Component: Login },
      { path: AUTH_URL.SIGNUP, Component: SignUp },
    ],
  },

  // ADMIN ZONE
  {
    path: ADMIN_URL.BASE,
    Component: AdminLayout,
    loader: requireAuth,
    children: [
      { index: true, Component: Dashboard },
      {
        path: ADMIN_URL.DASHBOARD,
        Component: Dashboard,
      },
      {
        path: `${ADMIN_URL.PROFILE}/:id`,
        Component: UserProfile,
      },
      {
        path: ADMIN_URL.SUBMISSIONS,
        Component: KYCSubmission,
      },
      {
        path: `${ADMIN_URL.SUBMISSION_RESULTS}/:id`,
        Component: KYCSubmissionResult,
      },
      {
        path: ADMIN_URL.USERS,
        Component: UserList,
      },
      {
        path: `${ADMIN_URL.KYC}/:id`,
        Component: KYCInformation,
      }
    ],
  },
]);

export default Router;
