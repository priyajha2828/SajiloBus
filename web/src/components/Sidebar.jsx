import { Link } from "react-router-dom";
import {
  Menu,
  ChevronsRight,
  LayoutDashboard,
  Bus,
  Users,
  Route,
  UserCheck,
  MapPinned,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

import "../css/Sidebar.css";
import logo from "../assets/logo.png";

function Sidebar({ collapsed, setCollapsed, darkMode }) {
  return (
    <aside
  className={`sidebar ${
    collapsed ? "collapsed" : ""
  } ${darkMode ? "dark-sidebar" : "light-sidebar"}`}
>

      {/* Top */}

     <div className="sidebar-header">

  <div className="sidebar-brand">

    <img
      src={logo}
      alt="Vehicle Tracking Logo"
      className="sidebar-logo-img"
    />

    {!collapsed && (
      <h2 className="logo">Vehicle Tracking</h2>
    )}

  </div>

  <button
    className="toggle-btn"
    onClick={() => setCollapsed(!collapsed)}
  >
    {collapsed ? (
      <ChevronsRight size={22} />
    ) : (
      <Menu size={22} />
    )}
  </button>

</div>

      {/* Menu */}

      <nav className="sidebar-menu">

        <Link to="/admin/dashboard">
          <LayoutDashboard size={20} />
          {!collapsed && <span>Dashboard</span>}
        </Link>

        <Link to="/drivers">
          <UserCheck size={20} />
          {!collapsed && <span>Drivers</span>}
        </Link>

        <Link to="/buses">
          <Bus size={20} />
          {!collapsed && <span>Buses</span>}
        </Link>

        <Link to="/passengers">
          <Users size={20} />
          {!collapsed && <span>Passengers</span>}
        </Link>

        <Link to="/routes">
          <Route size={20} />
          {!collapsed && <span>Routes</span>}
        </Link>

        <Link to="/tracking">
          <MapPinned size={20} />
          {!collapsed && <span>Live Tracking</span>}
        </Link>

        <Link to="/reports">
          <FileText size={20} />
          {!collapsed && <span>Reports</span>}
        </Link>

        <Link to="/settings">
          <Settings size={20} />
          {!collapsed && <span>Settings</span>}
        </Link>

      </nav>

      {/* Logout */}

      <div className="logout-section">

        <Link to="/">
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </Link>

      </div>

    </aside>
  );
}

export default Sidebar;