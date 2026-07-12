import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/AddTrip.css";

function EditTrip() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [collapsed, setCollapsed] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
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
    fetchTrip();
  }, []);

  const fetchDrivers = async () => {
    const res = await fetch("http://localhost:5000/drivers");
    const data = await res.json();

    if (data.success) {
      setDrivers(data.drivers);
    }
  };

  const fetchBuses = async () => {
    const res = await fetch("http://localhost:5000/buses");
    const data = await res.json();

    if (data.success) {
      setBuses(data.buses);
    }
  };

  const fetchRoutes = async () => {
    const res = await fetch("http://localhost:5000/routes");
    const data = await res.json();

    if (data.success) {
      setRoutes(data.routes);
    }
  };

  const fetchTrip = async () => {
    const res = await fetch(`http://localhost:5000/trips/${id}`);
    const data = await res.json();

    if (data.success) {
      setFormData({
        driverId: data.trip.driverId.toString(),
        busId: data.trip.busId.toString(),
        routeId: data.trip.routeId.toString(),
      });
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

    const res = await fetch(
      `http://localhost:5000/trips/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          driverId: Number(formData.driverId),
          busId: Number(formData.busId),
          routeId: Number(formData.routeId),
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      alert(data.message);
      navigate("/trips");
    } else {
      alert(data.message);
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

            <Link to="/trips" className="back-btn">
              <ArrowLeft size={22} />
            </Link>

            <h2>Edit Trip</h2>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label>Driver</label>

              <select
                name="driverId"
                value={formData.driverId}
                onChange={handleChange}
              >
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
              >
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
              >
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
              Update Trip
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}

export default EditTrip;