import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import {
  UserCheck,
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";

import "../css/DriverManagement.css";

function DriverManagement() {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("All");

  const drivers = [
    {
      id: 1,
      name: "Ram Sharma",
      phone: "9841000001",
      license: "BA12345",
      bus: "Bus 101",
      status: "Online",
    },
    {
      id: 2,
      name: "Hari Lama",
      phone: "9841000002",
      license: "BA56789",
      bus: "Bus 205",
      status: "Offline",
    },
    {
      id: 3,
      name: "Suman Rai",
      phone: "9841000003",
      license: "BA90876",
      bus: "Not Assigned",
      status: "Available",
    },
  ];

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
        <div className="driver-header">
          <div className="driver-title">
            <UserCheck size={30} />
            <h2>Driver Management</h2>
          </div>

          <Link to="/drivers/add" className="add-driver-btn">
    <Plus size={18}/>
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
    <option value="Online">Online</option>
    <option value="Offline">Offline</option>
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
              {drivers.map((driver) => (
                <tr key={driver.id}>
                  <td>{driver.name}</td>
                  <td>{driver.phone}</td>
                  <td>{driver.license}</td>
                  <td>{driver.bus}</td>

                  <td>
                    <span
                      className={`status ${driver.status.toLowerCase()}`}
                    >
                      {driver.status}
                    </span>
                  </td>

                 <td>
  <div className="actions">
    <Eye size={18} />
    <Pencil size={18} />
    <Trash2 size={18} />
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