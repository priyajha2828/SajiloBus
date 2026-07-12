import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CheckCircle, PlayCircle } from "lucide-react";

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
      const response = await fetch(
        `http://localhost:5000/trips/${id}`
      );

      const data = await response.json();

      if (data.success) {
        setTrip(data.trip);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!trip) {
    return (
      <div className="loading">
        Loading...
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
              <strong>{trip.id}</strong>
            </div>

            <div className="trip-row">
              <span>Driver</span>
              <strong>{trip.driver.name}</strong>
            </div>

            <div className="trip-row">
              <span>Bus</span>
              <strong>{trip.bus.busNumber}</strong>
            </div>

            <div className="trip-row">
              <span>Route</span>
              <strong>{trip.route.routeName}</strong>
            </div>

            <div className="trip-row">
              <span>Started At</span>
              <strong>
                {new Date(
                  trip.startedAt
                ).toLocaleString()}
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

          </div>

        </div>

      </div>
    </div>
  );
}

export default ViewTrip;