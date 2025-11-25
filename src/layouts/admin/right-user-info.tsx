import { useState } from "react";
import { AUTH_URL } from "../../constant/url";

const RightUserInfo = () => {
  const [open, setOpen] = useState(false);

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
          <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg text-left z-50">
            <a
              href={AUTH_URL.LOGOUT}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Logout
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightUserInfo;
