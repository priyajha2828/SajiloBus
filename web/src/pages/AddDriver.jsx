import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/AddDriver.css";

function AddDriver() {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const [driver, setDriver] = useState({
    firebaseUid: "",
    name: "",
    email: "",
    phone: "",
    licenseNo: "",
    isAvailable: true,
    adminId: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDriver({
      ...driver,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const driverData = {
        ...driver,
        firebaseUid: `driver_${Date.now()}`,
      };

      const response = await fetch("http://localhost:5000/drivers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(driverData),
      });

      const data = await response.json();

      if (data.success) {
        alert("Driver Added Successfully");

        navigate("/drivers");
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

      <div className="add-driver-container">

        <div className="page-title">

          <Link
            to="/drivers"
            className="back-arrow"
          >
            <ArrowLeft size={24} />
          </Link>

          <h2>Add New Driver</h2>

        </div>

        <form
          className="driver-form"
          onSubmit={handleSubmit}
        >

          {/* Name */}

          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={driver.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={driver.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone */}

          <div className="form-group">
            <label>Phone Number</label>

            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={driver.phone}
              onChange={handleChange}
            />
          </div>

          {/* License */}

          <div className="form-group">
            <label>License Number</label>

            <input
              type="text"
              name="licenseNo"
              placeholder="Enter License Number"
              value={driver.licenseNo}
              onChange={handleChange}
              required
            />
          </div>

          {/* Status */}

          <div className="form-group">
            <label>Status</label>

            <select
              name="isAvailable"
              value={driver.isAvailable}
              onChange={(e) =>
                setDriver({
                  ...driver,
                  isAvailable: e.target.value === "true",
                })
              }
            >
              <option value={true}>Available</option>
              <option value={false}>Unavailable</option>
            </select>
          </div>

          {/* Buttons */}

          <div className="button-group">

            <Link
              to="/drivers"
              className="cancel-btn"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="save-btn"
            >
              Save Driver
            </button>

          </div>

        </form>

      </div>

    </div>

  </div>
);
}

export default AddDriver;