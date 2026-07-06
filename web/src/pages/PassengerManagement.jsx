import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/PassengerManagement.css";

function PassengerManagement() {
  const [collapsed, setCollapsed] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const passengers = [
    {
      id: 1,
      name: "Ram Sharma",
      email: "ram@gmail.com",
      phone: "9812345678",
      gender: "Male",
      status: "Active",
    },
    {
      id: 2,
      name: "Sita Rai",
      email: "sita@gmail.com",
      phone: "9801234567",
      gender: "Female",
      status: "Active",
    },
    {
      id: 3,
      name: "Hari Karki",
      email: "hari@gmail.com",
      phone: "9865432109",
      gender: "Male",
      status: "Blocked",
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

        <div className="passenger-header">
          <div className="passenger-title">
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

        {/* Toolbar */}

        <div className="passenger-toolbar">
          <div className="search-passenger">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search Passenger..."
            />
          </div>

          <div className="filter-container">
            <Filter size={18} />
            <select>
              <option>All Status</option>
              <option>Active</option>
              <option>Blocked</option>
            </select>
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
                <th>Gender</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {passengers.map((passenger) => (
                <tr key={passenger.id}>
                  <td>{passenger.name}</td>
                  <td>{passenger.email}</td>
                  <td>{passenger.phone}</td>
                  <td>{passenger.gender}</td>

                  <td>
                    <span
                      className={`passenger-status passenger-${passenger.status.toLowerCase()}`}
                    >
                      {passenger.status}
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

export default PassengerManagement;