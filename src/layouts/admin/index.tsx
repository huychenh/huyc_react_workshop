import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Header from "./header";
import Footer from "./footer";

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar cố định */}
      <Sidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header cố định */}
        <Header />

        {/* Main content scroll riêng */}
        <main className="flex-1 overflow-auto bg-gray-100 p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
