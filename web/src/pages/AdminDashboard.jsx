import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import LiveMap from "../components/LiveMap";
import "../css/AdminDashboard.css";
import api from "../services/api";
import { Bus, UserCheck, Users, Route, AlertTriangle } from "lucide-react";

function AdminDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [totalDrivers, setTotalDrivers] = useState(0);
  const [totalBuses, setTotalBuses] = useState(0);
  const [totalPassengers, setTotalPassengers] = useState(0);
  const [totalTrips, setTotalTrips] = useState(0);
  const [recentTrips, setRecentTrips] = useState([]);
  const [driverStatus, setDriverStatus] = useState([]);
  const [pendingSOS, setPendingSOS] = useState([]);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    fetchDriverCount();
    fetchBusCount();
    fetchPassengerCount();
    fetchTripCount();
    fetchRecentTrips();
    fetchDriverStatus();
    fetchSOSAlerts();
  }, []);

  const fetchSOSAlerts = async () => {
    try {
      const response = await api.get("/sos?status=PENDING");
      if (response.data.success) {
        setPendingSOS(response.data.sosAlerts || []);
      }
    } catch (error) {
      console.error("SOS Fetch Error:", error);
    }
  };

  const fetchTripCount = async () => {
    try {
      const response = await api.get("/trips/count");

      if (response.data.success) {
        setTotalTrips(response.data.count);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBusCount = async () => {
    try {
      const response = await api.get("/buses/count");

      if (response.data.success) {
        setTotalBuses(response.data.count);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDriverCount = async () => {
    try {
      const response = await api.get("/drivers/count");

      if (response.data.success) {
        setTotalDrivers(response.data.count);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPassengerCount = async () => {
    try {
      const response = await api.get("/passengers/count");

      if (response.data.success) {
        setTotalPassengers(response.data.count);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRecentTrips = async () => {
    try {
      const response = await api.get("/trips/recent");

      if (response.data.success) {
        setRecentTrips(response.data.trips);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDriverStatus = async () => {
    try {
      const response = await api.get("/drivers/status");

      if (response.data.success) {
        setDriverStatus(response.data.drivers);
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
        className={`dashboard-content ${collapsed ? "collapsed-content" : ""}`}
      >
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* Live SOS Emergency Banner */}
        {pendingSOS.length > 0 && (
          <div
            style={{
              background: "#fee2e2",
              border: "2px solid #ef4444",
              borderRadius: "12px",
              padding: "16px 20px",
              marginBottom: "20px",
              display: "flex",
              "justify-content": "space-between",
              "align-items": "center",
              "box-shadow": "0 4px 12px rgba(239, 68, 68, 0.15)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <AlertTriangle size={32} color="#dc2626" />
              <div>
                <h3
                  style={{
                    margin: 0,
                    color: "#991b1b",
                    fontSize: "16px",
                    fontWeight: "800",
                  }}
                >
                  🚨 CRITICAL EMERGENCY SOS ALERT ({pendingSOS.length} ACTIVE
                  PENDING TICKET{pendingSOS.length > 1 ? "S" : ""})
                </h3>
                <p
                  style={{
                    margin: "4px 0 0 0",
                    color: "#7f1d1d",
                    fontSize: "13.5px",
                  }}
                >
                  Passenger:{" "}
                  <strong>
                    {pendingSOS[0].passenger?.name || "Passenger"}
                  </strong>{" "}
                  (Phone: {pendingSOS[0].passenger?.phone || "N/A"}). Emergency
                  Contacts: [
                  {pendingSOS[0].passenger?.sosContacts
                    ?.map((c) => `${c.contactName}: ${c.contactNumber}`)
                    .join(", ") || "No Contacts"}
                  ]
                </p>
              </div>
            </div>
            <Link
              to="/sos-queue"
              style={{
                background: "#dc2626",
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "13px",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              View SOS Queue & Intercept →
            </Link>
          </div>
        )}

        {/* Cards */}

        <div className="cards">
          <div className="card buses">
            <div className="card-header">
              <Bus size={26} className="card-icon" />
              <h3>Total Buses</h3>
            </div>

            <h1>{totalBuses}</h1>
          </div>

          <div className="card drivers">
            <div className="card-header">
              <UserCheck size={26} className="card-icon" />
              <h3>Total Drivers</h3>
            </div>

            <h1>{totalDrivers}</h1>
          </div>

          <div className="card passengers">
            <div className="card-header">
              <Users size={26} className="card-icon" />
              <h3>Total Passengers</h3>
            </div>

            <h1>{totalPassengers}</h1>
          </div>

          <div className="card trips">
            <div className="card-header">
              <Route size={26} className="card-icon" />
              <h3>Active Trips</h3>
            </div>

            <h1>{totalTrips}</h1>
          </div>
        </div>

        {/* Map */}

        <div className="map-section">
          <LiveMap />
        </div>

        {/* Bottom */}

        <div className="bottom-section">
          {/* Recent Trips */}

          <div className="panel">
            <h2>Recent Trips</h2>

            <table>
              <thead>
                <tr>
                  <th>Bus</th>
                  <th>Driver</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentTrips.length === 0 ? (
                  <tr>
                    <td colSpan="3">No Recent Trips</td>
                  </tr>
                ) : (
                  recentTrips.map((trip) => (
                    <tr key={trip.id}>
                      <td>{trip.bus.busNumber}</td>

                      <td>{trip.driver.name}</td>

                      <td>
                        {trip.endedAt ? (
                          <span className="trip-status completed">
                            Completed
                          </span>
                        ) : (
                          <span className="trip-status running">Running</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Driver Status */}

          <div className="panel">
            <h2>Driver Status</h2>

            <table className="driver-status-table">
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {driverStatus.length === 0 ? (
                  <tr>
                    <td colSpan="2">No Drivers Found</td>
                  </tr>
                ) : (
                  driverStatus.slice(0, 5).map((driver) => (
                    <tr key={driver.id}>
                      <td>{driver.name}</td>

                      <td>
                        <span
                          className={`driver-status ${driver.status.toLowerCase()}`}
                        >
                          {driver.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
