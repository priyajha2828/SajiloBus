import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/AddSchedule.css";

function AddSchedule() {
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
}, []);

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
    const response = await fetch(
      "http://localhost:5000/schedules",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          busId: Number(formData.busId),
          routeId: Number(formData.routeId),
          departureTime: formData.departureTime,
          dayOfWeek: formData.dayOfWeek,
          isActive: formData.isActive,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      alert(data.message);
      navigate("/schedules");
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);
    alert("Server Error");
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

          <h2>Add Bus Schedule</h2>

        </div>

        {/* IMPORTANT */}
        <form onSubmit={handleSubmit}>
            

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
              <option value="">
                Select Day
              </option>

              <option value="Sunday">Sunday</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>

            </select>

          </div>

                    {/* Status */}

          <div className="form-group">

            <label>Status</label>

            <div className="status-radio">

              <label>
                <input
                  type="radio"
                  name="isActive"
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
                  name="isActive"
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

          {/* Submit Button */}

          <button
            type="submit"
            className="submit-btn"
          >
            <Save size={18} />
            Save Schedule
          </button>

        </form>

      </div>

    </div>

  </div>
);

}

export default AddSchedule;