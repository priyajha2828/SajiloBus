import { useState } from "react";
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import "../css/Navbar.css";

function Navbar({ collapsed, setCollapsed, darkMode, setDarkMode }) {
  const [showMenu, setShowMenu] = useState(false);
const [showNotifications, setShowNotifications] = useState(false);

const notifications = [
  {
    id: 1,
    title: "New Passenger Registered",
    message: "John Doe created a new account.",
    time: "2 min ago",
  },
  {
    id: 2,
    title: "Bus Arrived",
    message: "Bus 102 reached Kathmandu.",
    time: "10 min ago",
  },
  {
    id: 3,
    title: "SOS Alert",
    message: "Passenger sent an emergency alert.",
    time: "20 min ago",
  },
];

  return (
    <div className="navbar">
      <div className="navbar-left"></div>

      {/* Search */}
      <div className="search-box">
        <Search size={18} className="search-icon" />

        <input type="text" placeholder="Search buses, drivers, passengers..." />

        <span className="shortcut">Ctrl + K</span>
      </div>

      {/* Right Side */}
      <div className="navbar-right">
        {/* Language */}
        <button className="nav-icon">
          <Globe size={20} />
        </button>

        {/* Notification */}
        <div className="notification-wrapper">
  <button
    className="notification-btn"
    onClick={() => {
      setShowNotifications(!showNotifications);
      setShowMenu(false);
    }}
  >
    <Bell size={20} />
  </button>

  <span className="notification-badge">
    {notifications.length}
  </span>

  {showNotifications && (
    <div className="notification-dropdown">
  <div className="notification-header">
    <div className="notification-title">Notifications</div>

    <button
      className="close-notification"
      onClick={() => setShowNotifications(false)}
    >
      ✕
    </button>
  </div>

  {notifications.map((item) => (
    <div key={item.id} className="notification-item">
      <h5>{item.title}</h5>
      <p>{item.message}</p>
      <span>{item.time}</span>
    </div>
  ))}
</div>
  )}
</div>

        {/* Theme */}
        <button className="nav-icon" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Profile */}
        <div className="profile" onClick={() => setShowMenu(!showMenu)}>
          <div className="avatar">R</div>

          <div className="profile-info">
            <h4>Rejina</h4>
            <p>Administrator</p>
          </div>

          <ChevronDown size={18} />

          {showMenu && (
            <div className="profile-menu">
              <div className="menu-item">
                <User size={18} />
                Profile
              </div>

              <div className="menu-item">
                <Settings size={18} />
                Settings
              </div>

              <div className="menu-item logout">
                <LogOut size={18} />
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
