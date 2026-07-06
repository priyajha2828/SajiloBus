import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/ViewDriver.css";

function ViewBus() {
  const { id } = useParams();

  const [collapsed, setCollapsed] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [bus, setBus] = useState(null);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    fetchBus();
  }, []);

  const fetchBus = async () => {
    try {
      const response = await fetch(`http://localhost:5000/buses/${id}`);
      const data = await response.json();

      if (data.success) {
        setBus(data.bus);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!bus) {
    return <h2>Loading...</h2>;
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

        <div className="view-driver-container">

          <div className="page-title">

            <Link
              to="/buses"
              className="back-arrow"
            >
              <ArrowLeft size={24}/>
            </Link>

            <h2>Bus Details</h2>

          </div>

          <div className="view-card">

            <div className="view-row">
              <strong>Bus Number</strong>
              <span>{bus.busNumber}</span>
            </div>

            <div className="view-row">
              <strong>Plate Number</strong>
              <span>{bus.plateNumber}</span>
            </div>

            <div className="view-row">
              <strong>Capacity</strong>
              <span>{bus.capacity}</span>
            </div>

            <div className="view-row">
              <strong>Status</strong>
              <span>{bus.status}</span>
            </div>

            <div className="view-row">
              <strong>Created At</strong>
              <span>
                {new Date(bus.createdAt).toLocaleString()}
              </span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default ViewBus;