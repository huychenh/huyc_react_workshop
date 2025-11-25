import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Header from "./header";
import Footer from "./footer";

const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar className="w-64 bg-gray-800 text-white" />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header className="bg-white shadow p-4" />

        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-100">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer className="bg-white shadow p-4 text-center">
          © 2025 Your Company. All rights reserved.
        </Footer>
      </div>
    </div>
  );
};

export default AdminLayout;
