// rrd import
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function MainLayout() {
  return (
    <>
        <Navbar />
        <main>
            <Outlet />
        </main>
        { /* Footer */}
    </>
  );
}
export default MainLayout;