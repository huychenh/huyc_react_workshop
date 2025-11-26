import { Link, NavLink } from "react-router-dom";
import { ADMIN_URL } from "../../constant/url";

const Sidebar = () => {
  const baseClasses =
    "flex items-center gap-2 p-2 rounded hover:bg-gray-300 hover:text-black";

  return (
    <aside className="bg-white shadow p-4 text-center">
      <Link
        to={ADMIN_URL.DASHBOARD}
        className="text-xl font-semibold mb-4 inline-block"
      >
        Simple KYC
      </Link>


      <nav className="space-y-2">
        {/* My Profile */}
        <NavLink
          to={ADMIN_URL.PROFILE}
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? "bg-gray-300 text-black" : ""}`
          }
        >
          <span>My Profile</span>
        </NavLink>

        {/* My Submissions */}
        <NavLink
          to={ADMIN_URL.SUBMISSIONS}
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? "bg-gray-300 text-black" : ""}`
          }
        >
          <span>My Submissions</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
