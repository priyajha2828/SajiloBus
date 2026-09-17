import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/AddSchedule.css";

function EditSchedule() {
  const navigate = useNavigate();
  const { id } = useParams();

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

  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [formData, setFormData] = useState({
    busId: "",
    routeId: "",
    departureTime: "",
    dayOfWeek: "",
    isActive: true,
  });

  useEffect(() => {
    fetchBuses();
    fetchRoutes();
    fetchSchedule();
  }, []);

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

const fetchSchedule = async () => {
  try {
    const response = await api.get(`/schedules/${id}`);

    if (response.data.success) {
      setFormData({
        busId: response.data.schedule.busId.toString(),
        routeId: response.data.schedule.routeId.toString(),
        departureTime: new Date(
          response.data.schedule.departureTime
        )
          .toISOString()
          .substring(11, 16),
        dayOfWeek: response.data.schedule.dayOfWeek,
        isActive: response.data.schedule.isActive,
      });
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
    const response = await api.put(`/schedules/${id}`, {
      busId: Number(formData.busId),
      routeId: Number(formData.routeId),
      departureTime: formData.departureTime,
      dayOfWeek: formData.dayOfWeek,
      isActive: formData.isActive,
    });

    if (response.data.success) {
      alert(response.data.message);
      navigate("/schedules");
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      "Something went wrong"
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

        <div className="schedule-form-container">

          <div className="form-header">

            <Link
              to="/schedules"
              className="back-btn"
            >
              <ArrowLeft size={22} />
            </Link>

            <h2>Edit Bus Schedule</h2>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">

  <label>Bus</label>

  <select
    name="busId"
    value={formData.busId}
    onChange={handleChange}
    required
  >
    <option value="">Select Bus</option>

    {buses.map((bus) => (
      <option key={bus.id} value={bus.id}>
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
    <option value="">Select Route</option>

    {routes.map((route) => (
      <option key={route.id} value={route.id}>
        {route.routeName}
      </option>
    ))}

  </select>

</div>

<div className="form-group">

  <label>Departure Time</label>

  <input
    type="time"
    name="departureTime"
    value={formData.departureTime}
    onChange={handleChange}
    required
  />

</div>

<div className="form-group">

  <label>Day</label>

  <select
    name="dayOfWeek"
    value={formData.dayOfWeek}
    onChange={handleChange}
    required
  >
    <option value="">Select Day</option>

    <option>Sunday</option>
    <option>Monday</option>
    <option>Tuesday</option>
    <option>Wednesday</option>
    <option>Thursday</option>
    <option>Friday</option>
    <option>Saturday</option>

  </select>

</div>

<div className="form-group">

  <label>Status</label>

  <div className="status-radio">

    <label>

      <input
        type="radio"
        checked={formData.isActive === true}
        onChange={() =>
          setFormData({
            ...formData,
            isActive: true,
          })
        }
      />

      Active

    </label>

    <label>

      <input
        type="radio"
        checked={formData.isActive === false}
        onChange={() =>
          setFormData({
            ...formData,
            isActive: false,
          })
        }
      />

      Inactive

    </label>

  </div>

</div>

<button
  type="submit"
  className="submit-btn"
>
  <Save size={18} />
  Update Schedule
</button>

        </form>

      </div>

    </div>

  </div>
);

}

export default EditSchedule;

          