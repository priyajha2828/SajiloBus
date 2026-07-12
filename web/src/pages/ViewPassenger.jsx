import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/ViewDriver.css";

function ViewPassenger() {
  const { id } = useParams();

  const [collapsed, setCollapsed] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [passenger, setPassenger] = useState(null);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
  if (id) {
    fetchPassenger();
  }
}, [id]);

  const fetchPassenger = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/passengers/${id}`
      );

      const data = await response.json();

      if (data.success) {
        setPassenger(data.passenger);
      }
    } catch (error) {
      console.log(error);
    }
  };

 <div className="driver-card">
  <div className="driver-row">
    <strong>Name:</strong>
    <span>{passenger?.name || "-"}</span>
  </div>

  <div className="driver-row">
    <strong>Email:</strong>
    <span>{passenger?.email || "-"}</span>
  </div>

  <div className="driver-row">
    <strong>Phone:</strong>
    <span>{passenger?.phone || "-"}</span>
  </div>

  <div className="driver-row">
    <strong>Firebase UID:</strong>
    <span>{passenger?.firebaseUid || "-"}</span>
  </div>

  <div className="driver-row">
    <strong>Created At:</strong>
    <span>
      {passenger?.createdAt
        ? new Date(passenger.createdAt).toLocaleString()
        : "-"}
    </span>
  </div>
</div>

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
              to="/passengers"
              className="back-arrow"
            >
              <ArrowLeft size={24} />
            </Link>

            <h2>Passenger Details</h2>
          </div>

          <div className="driver-card">
            <div className="driver-row">
  <strong>Name:</strong>
  <span>{passenger?.name || "-"}</span>
</div>

<div className="driver-row">
  <strong>Email:</strong>
  <span>{passenger?.email || "-"}</span>
</div>

<div className="driver-row">
  <strong>Phone:</strong>
  <span>{passenger?.phone || "-"}</span>
</div>

<div className="driver-row">
  <strong>Firebase UID:</strong>
  <span>{passenger?.firebaseUid || "-"}</span>
</div>

<div className="driver-row">
  <strong>Created At:</strong>
  <span>
    {passenger?.createdAt
      ? new Date(passenger.createdAt).toLocaleString()
      : "-"}
  </span>
</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewPassenger;