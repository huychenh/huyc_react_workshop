import { Outlet, useMatches } from "react-router";

const AuthLayout = () => {
  const matches = useMatches();
  const match = matches[matches.length - 1];
  const title = (match.handle as { title?: string })?.title || "Welcome";

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {title}
        </h2>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
