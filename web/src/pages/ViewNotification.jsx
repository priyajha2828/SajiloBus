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

          {(() => {
            const photoMatch = notification.message?.match(/\[?Photo:\s*(\S+)\]?/i) || notification.message?.match(/(https?:\/\/[^\s]+\.(?:png|jpg|jpeg|gif|webp)|\/uploads\/[^\s]+\.(?:png|jpg|jpeg|gif|webp))/i);
            const photoUrl = photoMatch ? photoMatch[1].replace(/\]$/, '') : null;
            const cleanMessage = notification.message ? notification.message.replace(/\[?Photo:\s*\S+\]?/gi, '').trim() : "";
            const fullPhotoSrc = photoUrl ? (photoUrl.startsWith('http') || photoUrl.startsWith('data:') ? photoUrl : `http://localhost:5000${photoUrl}`) : null;

            return (
              <div className="notification-card">
                <div className="detail-row">
                  <span>ID</span>
                  <strong>{notification.id}</strong>
                </div>

                <div className="detail-row">
                  <span>User / Passenger</span>
                  <strong>{notification.passenger?.name || "System / Driver Alert"}</strong>
                </div>

                <div className="detail-row">
                  <span>Title</span>
                  <strong>{notification.title}</strong>
                </div>

                <div className="detail-row">
                  <span>Message</span>
                  <strong>{cleanMessage}</strong>
                </div>

                {fullPhotoSrc && (
                  <div className="detail-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: "8px" }}>
                    <span>Reported Attachment / Photo</span>
                    <a href={fullPhotoSrc} target="_blank" rel="noreferrer">
                      <img
                        src={fullPhotoSrc}
                        alt="Issue Attachment"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "320px",
                          borderRadius: "10px",
                          border: "1px solid #e2e8f0",
                          objectFit: "cover",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                    </a>
                  </div>
                )}

                <div className="detail-row">
                  <span>Status</span>
                  <strong>
                    {notification.isRead ? (
                      <span className="read-status">Read</span>
                    ) : (
                      <span className="unread-status">Unread</span>
                    )}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Created At</span>
                  <strong>
                    {new Date(notification.createdAt).toLocaleString()}
                  </strong>
                </div>
              </div>
            );
          })()}

        </div>

      </div>

    </div>
  );
}

export default ViewNotification;