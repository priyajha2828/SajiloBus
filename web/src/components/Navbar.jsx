import { useState, useEffect } from "react";
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

const [notifications, setNotifications] = useState([]);

useEffect(() => {
  fetchNotifications();
}, []);

const fetchNotifications = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/notifications"
    );

    const data = await response.json();

    if (data.success) {
      setNotifications(data.notifications);
    }
  } catch (error) {
    console.log(error);
  }
};

const markAllAsRead = async () => {
  try {
    await fetch(
      "http://localhost:5000/notifications/read-all",
      {
        method: "PUT",
      }
    );

    fetchNotifications();
  } catch (error) {
    console.log(error);
  }
};

const unreadCount = notifications.filter(
  (item) => !item.isRead
).length;

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
  const open = !showNotifications;

  setShowNotifications(open);
  setShowMenu(false);

  if (open) {
    markAllAsRead();
  }
}}
  >
    <Bell size={20} />
  </button>

  {unreadCount > 0 && (
  <span className="notification-badge">
    {unreadCount}
  </span>
)}

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

  {notifications.length > 0 ? (
  notifications.map((item) => (
    <div key={item.id} className="notification-item">
      <h5>{item.title}</h5>
      <p>{item.message}</p>
      <span>
        {new Date(item.createdAt).toLocaleString()}
      </span>
    </div>
  ))
) : (
  <div className="notification-item">
    <p>No notifications found.</p>
  </div>
)}
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
