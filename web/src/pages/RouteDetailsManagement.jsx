import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPinned,
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

import "../css/RouteDetailsManagement.css";

function RouteDetailsManagement() {
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

  const [routeDetails, setRouteDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRouteDetails();
  }, []);

  const fetchRouteDetails = async () => {
    try {
      const response = await api.get("/route-details");

      if (response.data.success) {
        setRouteDetails(response.data.routeDetails);
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to fetch Route Details"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteRouteDetail = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this Route Detail?"
    );

    if (!confirmDelete) return;

    try {
      const response = await api.delete(
        `/route-details/${id}`
      );

      if (response.data.success) {
        alert(response.data.message);

        fetchRouteDetails();
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

        <div className="route-detail-header">

          <div className="route-detail-title">

            <button
              className="back-arrow"
              onClick={() =>
                navigate("/admin/dashboard")
              }
            >
              <ArrowLeft size={22} />
            </button>

            <MapPinned size={30} />

            <h2>Route Details</h2>

          </div>

          <Link
            to="/route-details/add"
            className="add-route-detail-btn"
          >
            <Plus size={18} />
            Add Route Detail
          </Link>

        </div>

        {/* Search */}

        <div className="route-detail-toolbar">

          <div className="search-route-detail">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>

        {/* Table */}

        <div className="route-detail-table-card">

          <table className="route-detail-table">

            <thead>

              <tr>

                <th>Route</th>

                <th>Bus Stop</th>

                <th>Order</th>

                <th>Remarks</th>

                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td colSpan="5">
                    Loading...
                  </td>

                </tr>

              ) : routeDetails.length === 0 ? (

                <tr>

                  <td colSpan="5">
                    No Route Details Found
                  </td>

                </tr>

              ) : (

                routeDetails
                  .filter((item) => {
                    return (
                      item.route.routeName
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      item.busStop.stopName
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    );
                  })
                  .map((item) => (

                    <tr key={item.id}>

                      <td>
                        {item.route.routeName}
                      </td>

                      <td>
                        {item.busStop.stopName}
                      </td>

                      <td>
                        {item.orderIndex}
                      </td>

                      <td>
                        {item.remarks || "-"}
                      </td>

                      <td>

                        <div className="actions">

                          <Eye
                            size={18}
                            onClick={() =>
                              navigate(
                                `/route-details/view/${item.id}`
                              )
                            }
                          />

                          <Pencil
                            size={18}
                            onClick={() =>
                              navigate(
                                `/route-details/edit/${item.id}`
                              )
                            }
                          />

                          <Trash2
                            size={18}
                            onClick={() =>
                              deleteRouteDetail(item.id)
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

export default RouteDetailsManagement;