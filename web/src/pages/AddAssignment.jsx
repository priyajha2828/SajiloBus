import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/AddAssignment.css";

function AddAssignment() {
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


  // Driver List
const [drivers, setDrivers] = useState([]);

// Bus List
const [buses, setBuses] = useState([]);

// Form Data
const [formData, setFormData] = useState({
  driverId: "",
  busId: "",
  assignedFrom: "",
  assignedTo: "",
});

// Load Drivers & Buses
useEffect(() => {
  fetchDrivers();
  fetchBuses();
}, []);

const fetchDrivers = async () => {
  try {
    const response = await fetch("http://localhost:5000/drivers");
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
    const response = await fetch("http://localhost:5000/buses");
    const data = await response.json();

    if (data.success) {
      setBuses(data.buses);
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
      "http://localhost:5000/bus-assignments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          driverId: Number(formData.driverId),
          busId: Number(formData.busId),
          assignedFrom: formData.assignedFrom,
          assignedTo: formData.assignedTo || null,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      alert(data.message);
      navigate("/assignments");
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  }
};

  return (
    <div
      className={`dashboard ${
        darkMode ? "dark-theme" : ""
      }`}
    >
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
              to="/assignments"
              className="back-btn"
            >
              <ArrowLeft size={22} />
            </Link>

            <h2>Assign Bus</h2>

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

              <label>Assigned From</label>

              <input
                type="date"
                name="assignedFrom"
                value={formData.assignedFrom}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label>Assigned To</label>

              <input
                type="date"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
              />

            </div>

            <button
              type="submit"
              className="submit-btn"
            >
              <Save size={18} />
              Assign Bus
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}

export default AddAssignment;