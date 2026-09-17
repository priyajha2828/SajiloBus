import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  ArrowLeft,
} from "lucide-react";

import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/BusStopManagement.css";

function BusStopManagement() {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [busStops, setBusStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    fetchBusStops();
  }, []);

  const fetchBusStops = async () => {
    try {
      const response = await api.get("/bus-stops");

      if (response.data.success) {
        setBusStops(response.data.busStops);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBusStop = async (id) => {
    if (!window.confirm("Delete this bus stop?")) return;

    try {
      const response = await api.delete(`/bus-stops/${id}`);

      if (response.data.success) {
        alert(response.data.message);
        fetchBusStops();
      } else {
        alert(response.data.message);
      }
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

        {/* Header */}

        <div className="busstop-header">

          <div className="busstop-title">

            <button
              className="back-arrow"
              onClick={() =>
                navigate("/admin/dashboard")
              }
            >
              <ArrowLeft size={22} />
            </button>

            <MapPin size={30} />

            <h2>Bus Stop Management</h2>

          </div>

          <Link
            to="/bus-stops/add"
            className="add-busstop-btn"
          >
            <Plus size={18} />
            Add Bus Stop
          </Link>

        </div>

        {/* Search */}

        <div className="busstop-toolbar">

          <div className="search-busstop">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search Bus Stop..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>

        {/* Table */}

        <div className="busstop-table-card">

          <table className="busstop-table">

            <thead>

              <tr>

                <th>Stop Name</th>

                <th>Latitude</th>

                <th>Longitude</th>

                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td colSpan="4">
                    Loading...
                  </td>

                </tr>

              ) : busStops.length === 0 ? (

                <tr>

                  <td colSpan="4">
                    No Bus Stops Found
                  </td>

                </tr>

              ) : (

                busStops
                  .filter((stop) =>

                    stop.stopName
                      .toLowerCase()
                      .includes(search.toLowerCase())

                  )
                  .map((stop) => (

                    <tr key={stop.id}>

                      <td>{stop.stopName}</td>

                      <td>{stop.latitude}</td>

                      <td>{stop.longitude}</td>

                      <td>

                        <div className="actions">

                          <Eye
                            size={18}
                            onClick={() =>
                              navigate(
                                `/bus-stops/view/${stop.id}`
                              )
                            }
                          />

                          <Pencil
                            size={18}
                            onClick={() =>
                              navigate(
                                `/bus-stops/edit/${stop.id}`
                              )
                            }
                          />

                          <Trash2
                            size={18}
                            onClick={() =>
                              deleteBusStop(stop.id)
                            }
                          />

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

export default BusStopManagement;