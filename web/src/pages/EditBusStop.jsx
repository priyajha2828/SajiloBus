import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../css/AddBusStop.css";

function EditBusStop() {
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

  const [formData, setFormData] = useState({
    stopName: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    fetchBusStop();
  }, []);

  const fetchBusStop = async () => {
    try {
      const response = await api.get(`/bus-stops/${id}`);

      if (response.data.success) {
        setFormData({
          stopName: response.data.busStop.stopName,
          latitude: response.data.busStop.latitude,
          longitude: response.data.busStop.longitude,
        });
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to fetch Bus Stop"
      );
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
      const response = await api.put(`/bus-stops/${id}`, {
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

            <h2>Edit Bus Stop</h2>

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
                Update Bus Stop
              </button>

            </div>

          </form>

        </div>

      </div>
    </div>
  );
}

export default EditBusStop;