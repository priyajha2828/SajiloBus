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
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/TripManagement.css";

function TripManagement() {
  const navigate = useNavigate();

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

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
  fetchTrips();
}, [search]);

  const fetchTrips = async () => {
  try {
    setLoading(true);

    const response = await fetch(
      `http://localhost:5000/trips?search=${search}`
    );

    const data = await response.json();

    if (data.success) {
      setTrips(data.trips);
    }

    setLoading(false);
  } catch (error) {
    console.log(error);
    setLoading(false);
  }
};

  const endTrip = async (id) => {
    if (!window.confirm("End this trip?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/trips/end/${id}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      alert(data.message);

      fetchTrips();
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

                            <Square
                              size={18}
                              onClick={() =>
                                endTrip(trip.id)
                              }
                            />

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
    </div>
  );
}

export default TripManagement;