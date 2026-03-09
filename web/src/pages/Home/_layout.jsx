import { Outlet } from "react-router";
import Header from "../../components/Header";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Header variant="admin" />
      <Outlet />
    </div>
  );
}

export default AdminLayout;
