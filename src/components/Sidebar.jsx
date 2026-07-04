import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Sidebar.css";

function Sidebar() {

  const location = useLocation();

  return (

    <div className="sidebar">

      <div className="logo-section">

        <img src={logo} alt="Logo" />

        <h2>Smart Grocery Store</h2>

      </div>

      <ul>

        <li>
          <Link
            to="/dashboard"
            className={
              location.pathname === "/dashboard"
                ? "active"
                : ""
            }
          >
            🏠 Dashboard
          </Link>
        </li>

        <li>
          <Link
            to="/inventory"
            className={
              location.pathname === "/inventory"
                ? "active"
                : ""
            }
          >
            📦 Inventory
          </Link>
        </li>

        <li>
  <Link
    to="/stockdetails"
    className={
      location.pathname === "/stockdetails"
        ? "active"
        : ""
    }
  >
    📄 Stock Details
  </Link>
</li>

<li>
  <Link
    to="/sales"
    className={
      location.pathname === "/sales"
        ? "active"
        : ""
    }
  >
    💰 Sales
  </Link>
</li>

<li>
  <Link to="/login">
    🚪 Logout
  </Link>
</li>
      </ul>

    </div>

  );

}

export default Sidebar;