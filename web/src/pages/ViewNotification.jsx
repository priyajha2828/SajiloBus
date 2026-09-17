import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import api from "../services/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/ViewNotification.css";

function ViewNotification() {
  const { id } = useParams();

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

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchNotification();
  }, []);

  const fetchNotification = async () => {
    try {
      const response = await api.get(`/notifications/${id}`);

      if (response.data.success) {
        setNotification(response.data.notification);
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to fetch Notification"
      );
    }
  };

  if (!notification) {
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

          <div className="view-notification-container">
            <h2>Loading Notification...</h2>
          </div>
        </div>
      </div>
    );
  }

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

        <div className="view-notification-container">

          <div className="view-header">

            <Link
              to="/notifications"
              className="back-btn"
            >
              <ArrowLeft size={22} />
            </Link>

            <h2>Notification Details</h2>

          </div>

          <div className="notification-card">

            <div className="detail-row">
              <span>ID</span>
              <strong>{notification.id}</strong>
            </div>

            <div className="detail-row">
              <span>Passenger</span>
              <strong>{notification.passenger.name}</strong>
            </div>

            <div className="detail-row">
              <span>Title</span>
              <strong>{notification.title}</strong>
            </div>

            <div className="detail-row">
              <span>Message</span>
              <strong>{notification.message}</strong>
            </div>

            <div className="detail-row">
              <span>Status</span>

              <strong>
                {notification.isRead ? (
                  <span className="read-status">
                    Read
                  </span>
                ) : (
                  <span className="unread-status">
                    Unread
                  </span>
                )}
              </strong>

            </div>

            <div className="detail-row">
              <span>Created At</span>

              <strong>
                {new Date(
                  notification.createdAt
                ).toLocaleString()}
              </strong>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ViewNotification;