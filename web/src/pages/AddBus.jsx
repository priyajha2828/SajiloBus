import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import "../css/AddBus.css";

function AddBus() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const [bus, setBus] = useState({
    busNumber: "",
    plateNumber: "",
    capacity: "",
    status: "ACTIVE",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setBus({
      ...bus,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/buses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bus),
      });

      const data = await response.json();

      if (data.success) {
        alert("Bus Added Successfully");
        navigate("/buses");
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
        className={`dashboard-content ${collapsed ? "collapsed-content" : ""}`}
      >
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <div className="add-bus-container">
          
        <div className="page-title">

          <Link
            to="/buses"
            className="back-arrow"
          >
            <ArrowLeft size={24} />
          </Link>
          <h2>Add New Bus</h2>
          </div>

          <form className="bus-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Bus Number</label>

              <input
                type="text"
                name="busNumber"
                placeholder="Enter Bus Number"
                value={bus.busNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Plate Number</label>

              <input
                type="text"
                name="plateNumber"
                placeholder="Enter Plate Number"
                value={bus.plateNumber}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Capacity</label>

              <input
                type="number"
                name="capacity"
                placeholder="Enter Capacity"
                value={bus.capacity}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Status</label>

              <select name="status" value={bus.status} onChange={handleChange}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>

            <div className="button-group">
              <Link to="/buses" className="cancel-btn">
                Cancel
              </Link>

              <button type="submit" className="save-btn">
                Save Bus
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddBus;
