import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ADMIN_URL, AUTH_URL } from "../../constant/url";

const RightUserInfo = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const username = storedUser.username || "User";
  const role = storedUser.role || "user";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate(AUTH_URL.LOGIN);
  };

  const goToProfile = () => {
    navigate(ADMIN_URL.PROFILE);
    setOpen(false);
  };

  return (
    <div className="relative flex items-center space-x-4 text-xl">
      <button className="hover:bg-gray-100 p-2 rounded-full">🔔</button>

      <div className="relative">
        <img
          src="/images/user-23.jpg"
          className="w-10 h-10 rounded-full border cursor-pointer"
          alt="User avatar"
          onClick={() => setOpen(!open)}
        />

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg text-left z-50 p-2">
            <div className="mb-2 text-sm text-gray-700">
              <p>Hello, <strong>{username}</strong></p>
              <p>Role: <em>{role}</em></p>
            </div>
            <button
              onClick={goToProfile}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
            >
              User Profile
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded cursor-pointer mt-1"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightUserInfo;
