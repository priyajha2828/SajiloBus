import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  Eye,
  Trash2,
  ArrowLeft,
} from "lucide-react";

import api from "../services/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/NotificationManagement.css";

function NotificationManagement() {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications");

      if (response.data.success) {
        setNotifications(response.data.notifications);
      }

      setLoading(false);

    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const deleteNotification = async (id) => {
    if (!window.confirm("Delete this notification?")) return;

    try {
      const response = await api.delete(
        `/notifications/${id}`
      );

      alert(response.data.message);

      fetchNotifications();

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Server Error"
      );
    }
  };

  return (
    <div className={`dashboard ${darkMode ? "dark-theme" : ""}`}>

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        darkMode={darkMode}
      />

      <div
        className={`dashboard-content ${
          collapsed ? "collapsed-content" : ""
        }`}
      >

        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* Header */}

        <div className="notification-header">

          <div className="notification-title">

            <button
              className="back-arrow"
              onClick={() =>
                navigate("/admin/dashboard")
              }
            >
              <ArrowLeft size={22} />
            </button>

            <Bell size={30} />

            <h2>Notifications</h2>

          </div>

        </div>

        {/* Search */}

        <div className="notification-toolbar">

          <div className="search-notification">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search Notification..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>

        {/* Table */}

        <div className="notification-table-card">

          <table className="notification-table">

            <thead>

              <tr>

                <th>Passenger</th>
                <th>Title</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td colSpan="5">
                    Loading...
                  </td>
                </tr>

              ) : notifications.length === 0 ? (

                <tr>
                  <td colSpan="5">
                    No Notifications Found
                  </td>
                </tr>

              ) : (

                notifications
                  .filter(
                    (notification) =>
                      notification.passenger.name
                        .toLowerCase()
                        .includes(
                          search.toLowerCase()
                        ) ||
                      notification.title
                        .toLowerCase()
                        .includes(
                          search.toLowerCase()
                        )
                  )

                  .map((notification) => (

                    <tr key={notification.id}>

                      <td>
                        {notification.passenger.name}
                      </td>

                      <td>
                        {notification.title}
                      </td>

                      <td>

                        {notification.isRead ? (

                          <span className="read-status">
                            Read
                          </span>

                        ) : (

                          <span className="unread-status">
                            Unread
                          </span>

                        )}

                      </td>

                      <td>

                        {new Date(
                          notification.createdAt
                        ).toLocaleString()}

                      </td>

                      <td>

                        <div className="actions">

                          <Eye
                            size={18}
                            onClick={() =>
                              navigate(
                                `/notifications/view/${notification.id}`
                              )
                            }
                          />


                          <Trash2
                            size={18}
                            onClick={() =>
                              deleteNotification(
                                notification.id
                              )
                            }
                          />

                        </div>

                      </td>

                    </tr>

                  ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default NotificationManagement;