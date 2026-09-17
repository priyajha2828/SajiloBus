import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/AddRouteDetail.css";

function AddRouteDetail() {
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

  const [routes, setRoutes] = useState([]);
  const [busStops, setBusStops] = useState([]);

  const [formData, setFormData] = useState({
    routeId: "",
    busStopId: "",
    orderIndex: "",
    remarks: "",
  });

  useEffect(() => {
    fetchRoutes();
    fetchBusStops();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await api.get("/routes");

      if (response.data.success) {
        setRoutes(response.data.routes);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBusStops = async () => {
    try {
      const response = await api.get("/bus-stops");

      if (response.data.success) {
        setBusStops(response.data.busStops);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/route-details",
        {
          routeId: Number(formData.routeId),
          busStopId: Number(formData.busStopId),
          orderIndex: Number(formData.orderIndex),
          remarks: formData.remarks,
        }
      );

      if (response.data.success) {
        alert(response.data.message);
        navigate("/route-details");
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

        <div className="route-detail-form-container">

          <div className="form-header">

            <Link
              to="/route-details"
              className="back-btn"
            >
              <ArrowLeft size={22} />
            </Link>

            <h2>Add Route Detail</h2>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label>Route</label>

              <select
                name="routeId"
                value={formData.routeId}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Route
                </option>

                {routes.map((route) => (

                  <option
                    key={route.id}
                    value={route.id}
                  >
                    {route.routeName}
                  </option>

                ))}

              </select>

            </div>

            <div className="form-group">

              <label>Bus Stop</label>

              <select
                name="busStopId"
                value={formData.busStopId}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Bus Stop
                </option>

                {busStops.map((stop) => (

                  <option
                    key={stop.id}
                    value={stop.id}
                  >
                    {stop.stopName}
                  </option>

                ))}

              </select>

            </div>

            <div className="form-group">

              <label>Stop Order</label>

              <input
                type="number"
                name="orderIndex"
                value={formData.orderIndex}
                onChange={handleChange}
                placeholder="Enter Order"
                required
              />

            </div>

            <div className="form-group">

              <label>Remarks</label>

              <textarea
                rows="4"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Remarks..."
              />

            </div>

            <button
              type="submit"
              className="submit-btn"
            >
              <Save size={18} />
              Save Route Detail
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default AddRouteDetail;