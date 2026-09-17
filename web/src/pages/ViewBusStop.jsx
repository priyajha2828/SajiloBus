import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/ViewBusStop.css";

function ViewBusStop() {
  const { id } = useParams();

  const [collapsed, setCollapsed] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [busStop, setBusStop] = useState(null);

  useEffect(() => {
    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  useEffect(() => {
    if (id) {
      fetchBusStop();
    }
  }, [id]);

  const fetchBusStop = async () => {
    try {
      const response = await api.get(`/bus-stops/${id}`);

      if (response.data.success) {
        setBusStop(response.data.busStop);
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to fetch Bus Stop"
      );
    }
  };

  if (!busStop) {
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

          <div className="view-busstop-container">
            <h2>Loading Bus Stop...</h2>
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

        <div className="view-busstop-container">

          <div className="view-header">

            <Link
              to="/bus-stops"
              className="back-btn"
            >
              <ArrowLeft size={22} />
            </Link>

            <h2>Bus Stop Details</h2>

          </div>

          <div className="busstop-card">

            <div className="busstop-row">
              <label>Stop Name</label>
              <span>{busStop.stopName}</span>
            </div>

            <div className="busstop-row">
              <label>Latitude</label>
              <span>{busStop.latitude}</span>
            </div>

            <div className="busstop-row">
              <label>Longitude</label>
              <span>{busStop.longitude}</span>
            </div>

            <div className="busstop-row">
              <label>Created At</label>
              <span>
                {busStop.createdAt
                  ? new Date(busStop.createdAt).toLocaleString()
                  : "-"}
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default ViewBusStop;