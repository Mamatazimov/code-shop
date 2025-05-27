import { FaHome,FaShoppingBasket } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";


function Navbar() {
  return (
    <nav className="navbar">
        <ul className="navLinks">
            <li><FaHome /> <a href="/">Home</a></li>
            <li><FaShoppingBasket /> <a href="/products">Products</a></li>
            <li><MdOutlineDashboard /> <a href="/dashboard">Dashboard</a></li>
        </ul>
    </nav>
  );
}
export default Navbar;