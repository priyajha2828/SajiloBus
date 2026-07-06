import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Route, Plus, Search, Filter, Eye, Pencil, ArrowLeft, Trash2 } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/RouteManagement.css";

function RouteManagement() {
  const [collapsed, setCollapsed] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const routes = [
    {
      id: 1,
      routeName: "Ring Road",
      startPoint: "Kalanki",
      endPoint: "Koteshwor",
      distance: "27 KM",
    },
    {
      id: 2,
      routeName: "Airport Route",
      startPoint: "Ratnapark",
      endPoint: "Airport",
      distance: "8 KM",
    },
    {
      id: 3,
      routeName: "East Route",
      startPoint: "Itahari",
      endPoint: "Dharan",
      distance: "18 KM",
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
        className={`dashboard-content ${collapsed ? "collapsed-content" : ""}`}
      >
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* Header */}

        <div className="route-header">

  <div className="route-title">

    <Link to="/admin/dashboard" className="back-arrow">
      <ArrowLeft size={24} />
    </Link>

    <Route size={30} />

    <h2>Route Management</h2>

  </div>

  <Link to="/routes/add" className="add-route-btn">
    <Plus size={18} />
    Add Route
  </Link>

</div>

        {/* Toolbar */}

        <div className="route-toolbar">
          <div className="search-route">
            <Search size={18} />
            <input type="text" placeholder="Search Route..." />
          </div>

          <div className="filter-container">
            <Filter size={18} />

            <select>
              <option value="all">All Routes</option>
              <option value="short">Short Routes</option>
              <option value="medium">Medium Routes</option>
              <option value="long">Long Routes</option>
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
              {routes.map((route) => (
                <tr key={route.id}>
                  <td>{route.routeName}</td>

                  <td>{route.startPoint}</td>

                  <td>{route.endPoint}</td>

                  <td>{route.distance}</td>

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

export default RouteManagement;
