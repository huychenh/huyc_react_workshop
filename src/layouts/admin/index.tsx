import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Header from "./header";
import Footer from "./footer";
import { UserProvider } from "./user-context";


const AdminLayout = () => {
  return (
    <UserProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />

        {/* Main area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />

          {/* Main content */}
          <main className="flex-1 overflow-auto bg-gray-100 p-6">
            <Outlet />
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </UserProvider>
  );
};

export default AdminLayout;
