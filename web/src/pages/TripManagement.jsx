import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Route,
  Plus,
  Search,
  Eye,
  Pencil,
  Square,
  ArrowLeft,
  MapPin,
  X,
} from "lucide-react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/TripManagement.css";

function TripManagement() {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [selectedLiveTrip, setSelectedLiveTrip] = useState(null);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
  fetchTrips();
}, [search]);

  const fetchTrips = async () => {
  try {
    setLoading(true);

    const response = await api.get(`/trips?search=${search}`);

    if (response.data.success) {
      setTrips(response.data.trips);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  const endTrip = async (id) => {
  if (!window.confirm("End this trip?")) return;

  try {
    const response = await api.put(`/trips/end/${id}`);

    alert(response.data.message);

    fetchTrips();
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      "Server Error"
    );
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

        <div className="trip-header">

          <div className="trip-title">

            <button
              className="back-arrow"
              onClick={() =>
                navigate("/admin/dashboard")
              }
            >
              <ArrowLeft size={22} />
            </button>

            <Route size={30} />

            <h2>Trip Management</h2>

          </div>

          <Link
            to="/trips/add"
            className="add-trip-btn"
          >
            <Plus size={18} />
            Start Trip
          </Link>

        </div>

        <div className="trip-toolbar">

          <div className="search-trip">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search Trip..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>

        <div className="trip-table-card">

          <table className="trip-table">

            <thead>

              <tr>

                <th>Bus</th>

                <th>Driver</th>

                <th>Route</th>

                <th>Started</th>

                <th>Ended</th>

                <th>Status</th>

                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td colSpan="7">
                    Loading...
                  </td>

                </tr>

              ) : trips.length === 0 ? (

                <tr>

                  <td colSpan="7">
                    No Trips Found
                  </td>

                </tr>

              ) : (

                trips.map((trip) => (

                    <tr key={trip.id}>

                      <td>
                        {trip.bus.busNumber}
                      </td>

                      <td>
                        {trip.driver.name}
                      </td>

                      <td>
                        {trip.route.routeName}
                      </td>

                      <td>
                        {new Date(
                          trip.startedAt
                        ).toLocaleString()}
                      </td>

                      <td>
                        {trip.endedAt
                          ? new Date(
                              trip.endedAt
                            ).toLocaleString()
                          : "-"}
                      </td>

                      <td>

                        {trip.endedAt ? (

                          <span className="completed">
                            Completed
                          </span>

                        ) : (

                          <span className="running">
                            Running
                          </span>

                        )}

                      </td>

                      <td>

                        <div className="actions">

                          <Eye
                            size={18}
                            onClick={() =>
                              navigate(
                                `/trips/view/${trip.id}`
                              )
                            }
                          />

                          <Pencil
                            size={18}
                            onClick={() =>
                              navigate(
                                `/trips/edit/${trip.id}`
                              )
                            }
                          />

                          {!trip.endedAt && (
                            <>
                              <MapPin
                                size={18}
                                title="View Live Track"
                                style={{ color: "#0F766E", cursor: "pointer" }}
                                onClick={() => setSelectedLiveTrip(trip)}
                              />
                              <Square
                                size={18}
                                title="End Trip"
                                onClick={() =>
                                  endTrip(trip.id)
                                }
                              />
                            </>
                          )}

                        </div>

                      </td>

                    </tr>

                  ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {selectedLiveTrip && (
        <div className="modal-overlay" style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(15, 23, 42, 0.75)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px"
        }}>
          <div style={{
            background: darkMode ? "#1e293b" : "#ffffff",
            color: darkMode ? "#f8fafc" : "#0f172a",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "750px",
            padding: "24px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>
                  📍 Live Tracking: Bus {selectedLiveTrip.bus?.busNumber}
                </h3>
                <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" }}>
                  Driver: {selectedLiveTrip.driver?.name} • Route: {selectedLiveTrip.route?.routeName}
                </p>
              </div>
              <button 
                onClick={() => setSelectedLiveTrip(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: darkMode ? "#94a3b8" : "#64748b" }}
              >
                <X size={22} />
              </button>
            </div>

            {selectedLiveTrip.tripHistory && selectedLiveTrip.tripHistory.length > 0 ? (
              <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                <iframe
                  title="Live Bus Tracking Map"
                  width="100%"
                  height="360"
                  style={{ border: 0 }}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                    Number(selectedLiveTrip.tripHistory[0].longitude) - 0.01
                  }%2C${
                    Number(selectedLiveTrip.tripHistory[0].latitude) - 0.01
                  }%2C${
                    Number(selectedLiveTrip.tripHistory[0].longitude) + 0.01
                  }%2C${
                    Number(selectedLiveTrip.tripHistory[0].latitude) + 0.01
                  }&layer=mapnik&marker=${selectedLiveTrip.tripHistory[0].latitude}%2C${selectedLiveTrip.tripHistory[0].longitude}`}
                />
              </div>
            ) : (
              <div style={{
                height: "240px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: darkMode ? "#0f172a" : "#f8fafc",
                borderRadius: "12px",
                border: "1px dashed #cbd5e1"
              }}>
                <MapPin size={36} style={{ color: "#0F766E", marginBottom: "8px" }} />
                <p style={{ margin: 0, fontWeight: "600" }}>Waiting for Live GPS Pings...</p>
                <span style={{ fontSize: "12px", color: "#64748b" }}>Driver has active trip, pings update as bus moves.</span>
              </div>
            )}

            <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
              <div>
                <strong>Lat:</strong> {selectedLiveTrip.tripHistory?.[0]?.latitude || "26.4837"} • <strong>Lng:</strong> {selectedLiveTrip.tripHistory?.[0]?.longitude || "87.2834"}
              </div>
              <button 
                onClick={() => navigate(`/trips/view/${selectedLiveTrip.id}`)}
                style={{
                  background: "#0F766E",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                View Full Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TripManagement;