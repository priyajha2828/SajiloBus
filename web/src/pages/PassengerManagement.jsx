import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  ArrowLeft,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/PassengerManagement.css";

function PassengerManagement() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    fetchPassengers();
  }, []);

  const fetchPassengers = async () => {
    try {
      const response = await fetch("http://localhost:5000/passengers");
      const data = await response.json();

      if (data.success) {
        setPassengers(data.passengers);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deletePassenger = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this passenger?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/passengers/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Passenger deleted successfully");
        fetchPassengers();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Server Error");
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

        <div className="passenger-header">
          <div className="passenger-title">
            <button
              className="back-arrow"
              onClick={() => navigate("/admin/dashboard")}
            >
              <ArrowLeft size={24} />
            </button>

            <Users size={30} />

            <h2>Passenger Management</h2>
          </div>

          <Link
            to="/passengers/add"
            className="add-passenger-btn"
          >
            <Plus size={18} />
            Add Passenger
          </Link>
        </div>

        {/* Search */}

        <div className="passenger-toolbar">
          <div className="search-passenger">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search Passenger..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}

        <div className="passenger-table-card">
          <table className="passenger-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4">Loading...</td>
                </tr>
              ) : passengers.length === 0 ? (
                <tr>
                  <td colSpan="4">No Passengers Found</td>
                </tr>
              ) : (
                passengers
                  .filter((passenger) => {
                    return (
                      passenger.name
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      passenger.email
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      (passenger.phone || "")
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    );
                  })
                  .map((passenger) => (
                    <tr key={passenger.id}>
                      <td>{passenger.name}</td>

                      <td>{passenger.email}</td>

                      <td>{passenger.phone || "-"}</td>

                      <td>
                        <div className="actions">
                          <Eye
                            size={18}
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              navigate(
                                `/passengers/view/${passenger.id}`
                              )
                            }
                          />

                          <Pencil
                            size={18}
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              navigate(
                                `/passengers/edit/${passenger.id}`
                              )
                            }
                          />

                          <Trash2
                            size={18}
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              deletePassenger(passenger.id)
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

export default PassengerManagement;