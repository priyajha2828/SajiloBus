import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ClipboardList } from "lucide-react";
import api from "../services/api";
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

 const [assignment, setAssignment] = useState(null);

useEffect(() => {
  if (id) {
    fetchAssignment();
  }
}, [id]);

const fetchAssignment = async () => {
  try {
    const response = await api.get(`/bus-assignments/${id}`);

    if (response.data.success) {
      setAssignment(response.data.assignment);
    }
  } catch (error) {
    console.error(error);
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
             <span>{assignment?.driver?.name || "-"}</span>
            </div>

            <div className="view-row">
              <label>Bus</label>
              <span>{assignment?.bus?.busNumber || "-"}</span>
            </div>

            <div className="view-row">
              <label>Assigned From</label>
              <span>
  {assignment?.assignedFrom
    ? new Date(assignment.assignedFrom).toLocaleDateString()
    : "-"}
</span>
            </div>

            <div className="view-row">
              <label>Assigned To</label>
              <span>
  {assignment?.assignedTo
    ? new Date(assignment.assignedTo).toLocaleDateString()
    : "-"}
</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default ViewAssignment;