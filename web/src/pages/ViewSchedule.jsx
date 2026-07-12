import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/ViewSchedule.css";

function ViewSchedule() {
  const { id } = useParams();

  const [collapsed, setCollapsed] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  useEffect(() => {
    if (id) {
      fetchSchedule();
    }
  }, [id]);

  const fetchSchedule = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/schedules/${id}`
      );

      const data = await response.json();

      if (data.success) {
        setSchedule(data.schedule);
      }
    } catch (error) {
      console.log(error);
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

        <div className="view-schedule-container">

          <div className="page-title">

            <Link
              to="/schedules"
              className="back-arrow"
            >
              <ArrowLeft size={24} />
            </Link>

            <h2>Schedule Details</h2>

          </div>

          <div className="schedule-card">

            <div className="schedule-row">
              <strong>Bus</strong>

              <span>
                {schedule?.bus?.busNumber || "-"}
              </span>
            </div>

            <div className="schedule-row">
              <strong>Route</strong>

              <span>
                {schedule?.route?.routeName || "-"}
              </span>
            </div>

            <div className="schedule-row">
              <strong>Departure Time</strong>

              <span>
                {schedule?.departureTime
                  ? new Date(
                      schedule.departureTime
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </span>
            </div>

            <div className="schedule-row">
              <strong>Day</strong>

              <span>
                {schedule?.dayOfWeek || "-"}
              </span>
            </div>

            <div className="schedule-row">
              <strong>Status</strong>

              <span>
                {schedule?.isActive
                  ? "Active"
                  : "Inactive"}
              </span>
            </div>

            <div className="schedule-row">
              <strong>Created At</strong>

              <span>
                {schedule?.createdAt
                  ? new Date(
                      schedule.createdAt
                    ).toLocaleString()
                  : "-"}
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default ViewSchedule;