import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Route,
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  ArrowLeft,
  Trash2,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/RouteManagement.css";

function RouteManagement() {
  const [collapsed, setCollapsed] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [routes, setRoutes] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await fetch("http://localhost:5000/routes");
      const data = await response.json();

      if (data.success) {
        setRoutes(data.routes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteRoute = async (id) => {
    if (!window.confirm("Are you sure you want to delete this route?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/routes/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        fetchRoutes();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }
  };

  // Filter Routes
  const filteredRoutes = routes.filter((route) => {
    const matchesSearch =
      route.routeName.toLowerCase().includes(search.toLowerCase()) ||
      route.startPoint.toLowerCase().includes(search.toLowerCase()) ||
      route.endPoint.toLowerCase().includes(search.toLowerCase());

    let matchesFilter = true;

    const distance = Number(route.distance);

    if (filter === "short") {
      matchesFilter = distance <= 10;
    } else if (filter === "medium") {
      matchesFilter = distance > 10 && distance <= 30;
    } else if (filter === "long") {
      matchesFilter = distance > 30;
    }

    return matchesSearch && matchesFilter;
  });

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
            <Link
              to="/admin/dashboard"
              className="back-arrow"
            >
              <ArrowLeft size={24} />
            </Link>

            <Route size={30} />

            <h2>Route Management</h2>
          </div>

          <Link
            to="/routes/add"
            className="add-route-btn"
          >
            <Plus size={18} />
            Add Route
          </Link>
        </div>

        {/* Toolbar */}

        <div className="route-toolbar">
          <div className="search-route">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search Route..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-container">
            <Filter size={18} />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Routes</option>
              <option value="short">Short Routes (≤10 KM)</option>
              <option value="medium">Medium Routes (11-30 KM)</option>
              <option value="long">Long Routes (Above 30 KM)</option>
            </select>
          </div>
        </div>

        {/* Table */}

        <div className="route-table-card">
          <table className="route-table">
            <thead>
              <tr>
                <th>Route Name</th>
                <th>Start Point</th>
                <th>End Point</th>
                <th>Distance</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRoutes.length > 0 ? (
                filteredRoutes.map((route) => (
                  <tr key={route.id}>
                    <td>{route.routeName}</td>

                    <td>{route.startPoint}</td>

                    <td>{route.endPoint}</td>

                    <td>{route.distance} KM</td>

                    <td>
                      <div className="actions">
                        <Link to={`/routes/view/${route.id}`}>
                          <Eye size={18} />
                        </Link>

                        <Link to={`/routes/edit/${route.id}`}>
                          <Pencil size={18} />
                        </Link>

                        <Trash2
                          size={18}
                          className="delete-icon"
                          style={{ cursor: "pointer" }}
                          onClick={() => deleteRoute(route.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "25px",
                    }}
                  >
                    No Routes Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RouteManagement;