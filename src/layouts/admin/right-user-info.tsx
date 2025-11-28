import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ADMIN_URL, AUTH_URL, API_URL_BASE } from "../../constant/url";

const RightUserInfo = () => {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const username = storedUser.username || "User";
  const role = storedUser.role || "user";

  // When mount, call DummyJSON to get id by username.
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await fetch(`${API_URL_BASE}/users`);
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();

        // data.users
        const found = data.users.find((u: any) => u.username === username);
        if (found) setUserId(found.id);
      } catch (err) {
        console.error(err);
      }
    };

    if (username) fetchUserId();
  }, [username]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate(AUTH_URL.LOGIN);
  };

  const goToProfile = () => {
    if (userId) {
      navigate(`${ADMIN_URL.PROFILE}/${userId}`);
      setOpen(false);
    } else {
      alert("User ID not found yet");
    }
  };

  const goToUserList = () => {
    navigate(ADMIN_URL.USERS);
    setOpen(false);
  };

  return (
    <div className="relative flex items-center space-x-4">
      <button className="hover:bg-gray-100 p-2 rounded-full text-xl">🔔</button>

      <div className="relative">
        <img
          src="/images/avatar.png"
          className="w-10 h-10 rounded-full border cursor-pointer"
          alt="User avatar"
          onClick={() => setOpen(!open)}
        />

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg text-left z-50 p-2 text-sm">
            <div className="mb-2 text-gray-700">
              <p>
                Hello, <strong>{username}</strong> -- <em>{role}</em>
              </p>
            </div>

            <button
              onClick={goToProfile}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
            >
              My Profile
            </button>

            {role === "officer" && (
              <button
                onClick={goToUserList}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded cursor-pointer mt-1"
              >
                Client List
              </button>
            )}

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
