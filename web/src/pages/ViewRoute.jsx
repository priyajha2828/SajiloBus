import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/ViewDriver.css";

function ViewRoute() {
  const { id } = useParams();

  const [collapsed, setCollapsed] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [route, setRoute] = useState(null);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    if (id) {
      fetchRoute();
    }
  }, [id]);

  const fetchRoute = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/routes/${id}`
      );

      const data = await response.json();

      if (data.success) {
        setRoute(data.route);
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

        <div className="view-driver-container">
          <div className="page-title">
            <Link
              to="/routes"
              className="back-arrow"
            >
              <ArrowLeft size={24} />
            </Link>

            <h2>Route Details</h2>
          </div>

          <div className="view-card">
            <div className="view-row">
              <strong>Route Name</strong>
              <span>{route?.routeName || "-"}</span>
            </div>

            <div className="view-row">
              <strong>Start Point</strong>
              <span>{route?.startPoint || "-"}</span>
            </div>

            <div className="view-row">
              <strong>End Point</strong>
              <span>{route?.endPoint || "-"}</span>
            </div>

            <div className="view-row">
              <strong>Distance</strong>
              <span>{route?.distance || "-"}</span>
            </div>

            <div className="view-row">
              <strong>Created At</strong>
              <span>
                {route?.createdAt
                  ? new Date(route.createdAt).toLocaleString()
                  : "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewRoute;