import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CheckCircle, PlayCircle } from "lucide-react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/ViewTrip.css";

function ViewTrip() {
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

  const [trip, setTrip] = useState(null);

  useEffect(() => {
    fetchTrip();
  }, []);

 const fetchTrip = async () => {
  try {
    const response = await api.get(`/trips/${id}`);

    if (response.data.success) {
      setTrip(response.data.trip);
    }
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      "Failed to fetch trip"
    );
  }
};


if (!trip) {
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

        <div className="view-trip-container">
          <h2>Loading Trip...</h2>
        </div>
      </div>
    </div>
  );
}



  return (
    <div
      className={`dashboard ${
        darkMode ? "dark-theme" : ""
      }`}
    >
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

        <div className="view-trip-container">

          <div className="view-header">

            <Link
              to="/trips"
              className="back-btn"
            >
              <ArrowLeft size={22} />
            </Link>

            <h2>Trip Details</h2>

          </div>

          <div className="trip-card">

            <div className="trip-row">
              <span>Trip ID</span>
              <strong>{trip?.id}</strong>
            </div>

            <div className="trip-row">
              <span>Driver</span>
              <strong>{trip?.driver?.name || "-"}</strong>
            </div>

            <div className="trip-row">
              <span>Bus</span>
              <strong>{trip?.bus?.busNumber || "-"}</strong>
            </div>

            <div className="trip-row">
              <span>Route</span>
             <strong>{trip?.route?.routeName || "-"}</strong>
            </div>

            <div className="trip-row">
              <span>Started At</span>
              <strong>
                {trip?.startedAt
  ? new Date(trip.startedAt).toLocaleString()
  : "-"}
              </strong>
            </div>

            <div className="trip-row">
              <span>Ended At</span>

              <strong>
                {trip.endedAt
                  ? new Date(
                      trip.endedAt
                    ).toLocaleString()
                  : "-"}
              </strong>
            </div>

            <div className="trip-row">
              <span>Status</span>

              <strong>
                {trip.endedAt ? (
                  <span className="completed">
                    <CheckCircle size={16} style={{ marginRight: "6px" }} />
                    Completed
                  </span>
                ) : (
                  <span className="running">
                    <PlayCircle size={16} style={{ marginRight: "6px" }} />
                    Running
                  </span>
                )}
              </strong>
            </div>

            {!trip.endedAt && (
              <div style={{ marginTop: "24px" }}>
                <h4 style={{ margin: "0 0 12px 0", fontSize: "15px", fontWeight: "700" }}>
                  📍 Live Vehicle Location Map
                </h4>
                {trip.latestLocation ? (
                  <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                    <iframe
                      title="Live Trip Tracking Map"
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                        Number(trip.latestLocation.longitude) - 0.01
                      }%2C${
                        Number(trip.latestLocation.latitude) - 0.01
                      }%2C${
                        Number(trip.latestLocation.longitude) + 0.01
                      }%2C${
                        Number(trip.latestLocation.latitude) + 0.01
                      }&layer=mapnik&marker=${trip.latestLocation.latitude}%2C${trip.latestLocation.longitude}`}
                    />
                  </div>
                ) : (
                  <div style={{
                    padding: "24px",
                    textAlign: "center",
                    background: darkMode ? "#0f172a" : "#f8fafc",
                    borderRadius: "12px",
                    border: "1px dashed #cbd5e1",
                    color: "#64748b"
                  }}>
                    Running • Waiting for live driver GPS pings
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default ViewTrip;