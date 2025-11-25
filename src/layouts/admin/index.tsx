import { Outlet } from "react-router";
import Sidebar from "./sidebar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1">
        {/* <Header /> */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};


export default AdminLayout;
