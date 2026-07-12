import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bus,
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  Eye,
  ArrowLeft,

} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/BusManagement.css";

function BusManagement() {
  const [collapsed, setCollapsed] = useState(false);


 

const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem("theme") === "dark";
});

useEffect(() => {
  localStorage.setItem("theme", darkMode ? "dark" : "light");
}, [darkMode]);

  const [buses, setBuses] = useState([]);
const [loading, setLoading] = useState(true);

const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("All");
const navigate = useNavigate();

useEffect(() => {
  fetchBuses();
}, []);

const fetchBuses = async () => {
  try {
    const response = await fetch("http://localhost:5000/buses");
    const data = await response.json();

    if (data.success) {
      setBuses(data.buses);
    }
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

const deleteBus = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this bus?"
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `http://localhost:5000/buses/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (data.success) {
      alert("Bus deleted successfully");
      fetchBuses();
    } else {
      alert(data.message);
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

        {/* Header */}

        <div className="route-header">
          <div className="route-title">
            <button
  className="back-arrow"
  onClick={() => navigate(-1)}
>
  <ArrowLeft size={24} />
</button>

            <bus size={30} />

            <h2>Bus Management</h2>
          </div>

          <Link to="/buses/add" className="add-bus-btn">
            <Plus size={18} />
            Add Bus
          </Link>
        </div>

        {/* Toolbar */}

        <div className="bus-toolbar">
          <div className="search-bus">
            <Search size={18} />
            <input
  type="text"
  placeholder="Search Bus..."
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
  <option value="All">All Buses</option>
  <option value="ACTIVE">Active</option>
  <option value="INACTIVE">Inactive</option>
  <option value="MAINTENANCE">Maintenance</option>
</select>
          </div>
        </div>

        {/* Table */}

        <div className="bus-table-card">
          <table className="bus-table">
            <thead>
              <tr>
                <th>Bus Number</th>
                <th>Plate Number</th>
                <th>Capacity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
  {buses
    .filter((bus) => {
      const matchesSearch =
        bus.busNumber
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (bus.plateNumber || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All"
          ? true
          : bus.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .map((bus) => (
      <tr key={bus.id}>
        <td>{bus.busNumber}</td>

        <td>{bus.plateNumber || "-"}</td>

        <td>{bus.capacity}</td>

        <td>
          <span className={`status ${bus.status.toLowerCase()}`}>
  {bus.status}
</span>
        </td>

        <td>
          <div className="actions">
            <Eye
  size={18}
  onClick={() => navigate(`/buses/view/${bus.id}`)}
/>

            <Pencil
  size={18}
  onClick={() => navigate(`/buses/edit/${bus.id}`)}
/>

<Trash2
  size={18}
  onClick={() => deleteBus(bus.id)}
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

export default BusManagement;