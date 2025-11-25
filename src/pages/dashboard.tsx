import { Outlet, NavLink } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-50">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-lg p-5 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Simple KYC</h2>

        <nav className="space-y-2">

          {/* My Profile */}
          <NavLink
            to="/admin/profile"
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
          >
            <span className="text-lg">👤</span>
            <span>My Profile</span>
          </NavLink>

          {/* My Submissions */}
          <NavLink
            to="/admin/submissions"
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
          >
            <span className="text-lg">📄</span>
            <span>My Submissions</span>
          </NavLink>

        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <header className="w-full h-16 bg-white shadow flex items-center justify-between px-6">

          {/* Search */}
          <div className="flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="border rounded-lg pl-10 pr-4 py-2 w-72 bg-gray-50 focus:ring-2 focus:ring-blue-600"
              />
              <span className="absolute left-3 top-2.5 text-gray-500">🔍</span>
            </div>
          </div>

          {/* Right icons */}
          <div className="flex items-center space-x-4 text-xl">
            <button className="hover:bg-gray-100 p-2 rounded-full">🔔</button>
            <button className="hover:bg-gray-100 p-2 rounded-full">🌙</button>

            <img
              src="https://i.pravatar.cc/40"
              className="w-10 h-10 rounded-full border"
              alt="User avatar"
            />
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 overflow-auto bg-gray-50">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default Dashboard;
