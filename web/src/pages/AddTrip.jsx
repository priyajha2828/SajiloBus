import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/AddTrip.css";

function AddTrip() {
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

  const [drivers, setDrivers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [formData, setFormData] = useState({
    driverId: "",
    busId: "",
    routeId: "",
  });

  useEffect(() => {
    fetchDrivers();
    fetchBuses();
    fetchRoutes();
  }, []);


  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  const fetchDrivers = async () => {
  try {
    const response = await api.get("/drivers");

    if (response.data.success) {
      setDrivers(response.data.drivers);
    }
  } catch (error) {
    console.error(error);
  }
};

 const fetchBuses = async () => {
  try {
    const response = await api.get("/buses");

    if (response.data.success) {
      setBuses(response.data.buses);
    }
  } catch (error) {
    console.error(error);
  }
};

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

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await api.post("/trips", {
      driverId: Number(formData.driverId),
      busId: Number(formData.busId),
      routeId: Number(formData.routeId),
    });

    alert(response.data.message);
    navigate("/trips");
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

        <div className="assignment-form-container">

          <div className="form-header">

            <Link
              to="/trips"
              className="back-btn"
            >
              <ArrowLeft size={22} />
            </Link>

            <h2>Start New Trip</h2>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label>Driver</label>

              <select
                name="driverId"
                value={formData.driverId}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Driver
                </option>

                {drivers.map((driver) => (
                  <option
                    key={driver.id}
                    value={driver.id}
                  >
                    {driver.name}
                  </option>
                ))}

              </select>

            </div>

            <div className="form-group">

              <label>Bus</label>

              <select
                name="busId"
                value={formData.busId}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Bus
                </option>

                {buses.map((bus) => (
                  <option
                    key={bus.id}
                    value={bus.id}
                  >
                    {bus.busNumber}
                  </option>
                ))}

              </select>

            </div>

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

            <button
              type="submit"
              className="submit-btn"
            >
              <Save size={18} />
              Start Trip
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}

export default AddTrip;