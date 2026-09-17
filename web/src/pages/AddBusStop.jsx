import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/AddBusStop.css";

function AddBusStop() {
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

  const [formData, setFormData] = useState({
    stopName: "",
    latitude: "",
    longitude: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/bus-stops", {
        stopName: formData.stopName,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
      });

      if (response.data.success) {
        alert(response.data.message);
        navigate("/bus-stops");
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

        <div className="busstop-form-container">

          <div className="form-header">

            <Link
              to="/bus-stops"
              className="back-btn"
            >
              <ArrowLeft size={22} />
            </Link>

            <h2>Add Bus Stop</h2>

          </div>

          <form
            className="busstop-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">

              <label>Stop Name</label>

              <input
                type="text"
                name="stopName"
                placeholder="Enter Stop Name"
                value={formData.stopName}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label>Latitude</label>

              <input
                type="number"
                step="0.0000001"
                name="latitude"
                placeholder="27.6701234"
                value={formData.latitude}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label>Longitude</label>

              <input
                type="number"
                step="0.0000001"
                name="longitude"
                placeholder="85.3487654"
                value={formData.longitude}
                onChange={handleChange}
                required
              />

            </div>

            <div className="button-group">

              <Link
                to="/bus-stops"
                className="cancel-btn"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="save-btn"
              >
                Add Bus Stop
              </button>

            </div>

          </form>

        </div>

      </div>
    </div>
  );
}

export default AddBusStop;