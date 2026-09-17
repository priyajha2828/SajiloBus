import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/ViewRouteDetail.css";

function ViewRouteDetail() {
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

  const [routeDetail, setRouteDetail] = useState(null);

  useEffect(() => {
    fetchRouteDetail();
  }, []);

  const fetchRouteDetail = async () => {
    try {
      const response = await api.get(`/route-details/${id}`);

      if (response.data.success) {
        setRouteDetail(response.data.routeDetail);
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to fetch Route Detail"
      );
    }
  };

  if (!routeDetail) {
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

          <div className="view-route-detail-container">
            <h2>Loading Route Detail...</h2>
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

        <div className="view-route-detail-container">

          <div className="view-header">

            <Link
              to="/route-details"
              className="back-btn"
            >
              <ArrowLeft size={22} />
            </Link>

            <h2>Route Detail</h2>

          </div>

          <div className="route-detail-card">

            <div className="detail-row">
              <span>Route</span>

              <strong>
                {routeDetail.route.routeName}
              </strong>
            </div>

            <div className="detail-row">
              <span>Bus Stop</span>

              <strong>
                {routeDetail.busStop.stopName}
              </strong>
            </div>

            <div className="detail-row">
              <span>Stop Order</span>

              <strong>
                {routeDetail.orderIndex}
              </strong>
            </div>

            <div className="detail-row">
              <span>Remarks</span>

              <strong>
                {routeDetail.remarks || "-"}
              </strong>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ViewRouteDetail;