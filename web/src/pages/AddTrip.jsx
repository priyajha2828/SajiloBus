import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

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

  const fetchDrivers = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/drivers"
      );

      const data = await response.json();

      if (data.success) {
        setDrivers(data.drivers);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBuses = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/buses"
      );

      const data = await response.json();

      if (data.success) {
        setBuses(data.buses);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/routes"
      );

      const data = await response.json();

      if (data.success) {
        setRoutes(data.routes);
      }
    } catch (error) {
      console.log(error);
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
    const response = await fetch("http://localhost:5000/trips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        driverId: Number(formData.driverId),
        busId: Number(formData.busId),
        routeId: Number(formData.routeId),
      }),
    });

    const data = await response.json();

    console.log(data);

    if (!response.ok) {
      alert(data.message);
      return;
    }

    alert(data.message);
    navigate("/trips");

  } catch (error) {
    console.error(error);
    alert(error.message);
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