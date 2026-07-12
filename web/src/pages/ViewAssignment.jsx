import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ClipboardList } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/ViewAssignment.css";

function ViewAssignment() {
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

  // Dummy Data
  const assignment = {
    id,
    driver: "Ram Sharma",
    bus: "BA 2 PA 1234",
    assignedFrom: "08 Jul 2026",
    assignedTo: "20 Jul 2026",
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

        <div className="view-assignment-container">

          <div className="view-header">

            <Link
              to="/assignments"
              className="back-btn"
            >
              <ArrowLeft size={22} />
            </Link>

            <ClipboardList size={30} />

            <h2>Assignment Details</h2>

          </div>

          <div className="view-card">

            <div className="view-row">
              <label>Driver</label>
              <span>{assignment.driver}</span>
            </div>

            <div className="view-row">
              <label>Bus</label>
              <span>{assignment.bus}</span>
            </div>

            <div className="view-row">
              <label>Assigned From</label>
              <span>{assignment.assignedFrom}</span>
            </div>

            <div className="view-row">
              <label>Assigned To</label>
              <span>{assignment.assignedTo}</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default ViewAssignment;