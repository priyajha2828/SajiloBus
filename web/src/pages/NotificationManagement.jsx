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
                      (notification.passenger?.name || "System Alert")
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

                  .map((notification) => {
                    const photoMatch = notification.message?.match(/\[?Photo:\s*(\S+)\]?/i) || notification.message?.match(/(https?:\/\/[^\s]+\.(?:png|jpg|jpeg|gif|webp)|\/uploads\/[^\s]+\.(?:png|jpg|jpeg|gif|webp))/i);
                    const photoUrl = photoMatch ? photoMatch[1].replace(/\]$/, '') : null;
                    const fullPhotoSrc = photoUrl ? (photoUrl.startsWith('http') || photoUrl.startsWith('data:') ? photoUrl : `http://localhost:5000${photoUrl}`) : null;

                    return (
                      <tr key={notification.id}>
                        <td>
                          {notification.passenger?.name || "System / Driver Alert"}
                        </td>

                        <td>
                          <div style={{ fontWeight: 600 }}>{notification.title}</div>
                          {fullPhotoSrc && (
                            <a href={fullPhotoSrc} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: "4px" }}>
                              <img
                                src={fullPhotoSrc}
                                alt="Reported issue attachment"
                                style={{ width: "42px", height: "42px", borderRadius: "6px", objectFit: "cover", border: "1px solid #cbd5e1" }}
                              />
                            </a>
                          )}
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
                  );
                })
              )}    

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default NotificationManagement;