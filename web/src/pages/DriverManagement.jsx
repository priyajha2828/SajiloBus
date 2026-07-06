import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  UserCheck,
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  ArrowLeft,
  Eye,
} from "lucide-react";

import "../css/DriverManagement.css";

function DriverManagement() {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await fetch("http://localhost:5000/drivers");

      const data = await response.json();

      if (data.success) {
        setDrivers(data.drivers);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDriver = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this driver?"
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `http://localhost:5000/drivers/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (data.success) {
      alert("Driver deleted successfully");
      fetchDrivers(); // Refresh the table
    }
  } catch (error) {
    console.error(error);
  }
};

  if (loading) {
    return <h2>Loading Drivers...</h2>;
  }

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

        {/* Header */}
        <div className="driver-header">
          <div className="driver-title">
            <Link to="/admin/dashboard" className="back-arrow">
              <ArrowLeft size={24} />
            </Link>

            <UserCheck size={30} />

            <h2>Driver Management</h2>
          </div>

          <Link to="/drivers/add" className="add-driver-btn">
            <Plus size={18} />
            Add Driver
          </Link>
        </div>

        {/* Search & Filter */}
        <div className="driver-toolbar">
          <div className="search-driver">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search driver..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-container">
            <Filter size={18} />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Drivers</option>
              <option value="Unavailable">Unavailable</option>
              <option value="Available">Available</option>
            </select>
          </div>
        </div>

        {/* Driver Table */}
        <div className="driver-table-card">
          <table className="driver-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>License</th>
                <th>Assigned Bus</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {drivers
                .filter((driver) => {
                  const matchesSearch = driver.name
                    .toLowerCase()
                    .includes(search.toLowerCase());

                  const matchesStatus =
                    statusFilter === "All"
                      ? true
                      : statusFilter === "Available"
                        ? driver.isAvailable
                        : !driver.isAvailable;

                  return matchesSearch && matchesStatus;
                })
                .map((driver) => (
                  <tr key={driver.id}>
                    <td>{driver.name}</td>

                    <td>{driver.phone}</td>

                    <td>{driver.licenseNo}</td>

                    <td>Not Assigned</td>

                    <td>
                      <span
                        className={`status ${
                          driver.isAvailable ? "online" : "offline"
                        }`}
                      >
                        {driver.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </td>

                    <td>
                      <div className="actions">
                        <Eye
                          size={18}
                          onClick={() => navigate(`/drivers/view/${driver.id}`)}
                        />

                        <Pencil
                          size={18}
                          onClick={() => navigate(`/drivers/edit/${driver.id}`)}
                        />

                        <Trash2
                          size={18}
                          onClick={() => deleteDriver(driver.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DriverManagement;
