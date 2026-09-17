import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/ViewDriver.css";

function ViewDriver() {
  const { id } = useParams();

  const [collapsed, setCollapsed] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [driver, setDriver] = useState(null);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    if (id) {
      fetchDriver();
    }
  }, [id]);

  const fetchDriver = async () => {
  try {
    const response = await api.get(`/drivers/${id}`);

    if (response.data.success) {
      setDriver(response.data.driver);
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      "Failed to fetch driver"
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

        <div className="view-driver-container">
          <div className="page-title">
            <Link
              to="/drivers"
              className="back-arrow"
            >
              <ArrowLeft size={24} />
            </Link>

            <h2>Driver Details</h2>
          </div>

          <div className="driver-card">
            <div className="driver-row">
              <strong>Name:</strong>
              <span>{driver?.name || "-"}</span>
            </div>

            <div className="driver-row">
              <strong>Email:</strong>
              <span>{driver?.email || "-"}</span>
            </div>

            <div className="driver-row">
              <strong>Phone:</strong>
              <span>{driver?.phone || "-"}</span>
            </div>

            <div className="driver-row">
              <strong>License:</strong>
              <span>{driver?.licenseNo || "-"}</span>
            </div>

            <div className="driver-row">
              <strong>Status:</strong>
              <span>
                {driver
                  ? driver.isAvailable
                    ? "Available"
                    : "Unavailable"
                  : "-"}
              </span>
            </div>

            <div className="driver-row">
              <strong>Created At:</strong>
              <span>
                {driver?.createdAt
                  ? new Date(driver.createdAt).toLocaleString()
                  : "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewDriver;