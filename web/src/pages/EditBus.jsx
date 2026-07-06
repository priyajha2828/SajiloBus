import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/ViewDriver.css";

function EditBus() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [bus, setBus] = useState({
    busNumber: "",
    plateNumber: "",
    capacity: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    fetchBus();
  }, []);

  const fetchBus = async () => {
    try {
      const response = await fetch(`http://localhost:5000/buses/${id}`);
      const data = await response.json();

      if (data.success) {
        setBus(data.bus);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setBus({
      ...bus,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/buses/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bus),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Bus Updated Successfully");
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
        className={`dashboard-content ${
          collapsed ? "collapsed-content" : ""
        }`}
      >
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <div className="add-bus-container">

          <div className="page-title">

            <Link to="/buses" className="back-arrow">
              <ArrowLeft size={24}/>
            </Link>

            <h2>Edit Bus</h2>

          </div>

          <form
            className="bus-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">
              <label>Bus Number</label>

              <input
                type="text"
                name="busNumber"
                value={bus.busNumber}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Plate Number</label>

              <input
                type="text"
                name="plateNumber"
                value={bus.plateNumber || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Capacity</label>

              <input
                type="number"
                name="capacity"
                value={bus.capacity || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Status</label>

              <select
                name="status"
                value={bus.status}
                onChange={handleChange}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>

            <div className="button-group">

              <Link
                to="/buses"
                className="cancel-btn"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="save-btn"
              >
                Update Bus
              </button>

            </div>

          </form>

        </div>

      </div>
    </div>
  );
}

export default EditBus;