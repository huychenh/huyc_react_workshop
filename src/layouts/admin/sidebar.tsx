import { NavLink } from "react-router-dom";

type SidebarProps = {
  className?: string;
};

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <aside className={`${className || "bg-white text-black"} shadow-lg p-5 space-y-4`}>
      <h2 className="text-xl font-semibold mb-4">Simple KYC</h2>

      <nav className="space-y-2">
        <NavLink
          to="/admin/profile"
          className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 hover:text-white"
        >
          <span className="text-lg">👤</span>
          <span>My Profile</span>
        </NavLink>

        <NavLink
          to="/admin/submissions"
          className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 hover:text-white"
        >
          <span className="text-lg">📄</span>
          <span>My Submissions</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
