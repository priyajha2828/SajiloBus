import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/AddPassenger.css";

function AddPassenger() {
  const [collapsed, setCollapsed] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const [passenger, setPassenger] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    status: "Active",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setPassenger({
      ...passenger,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (passenger.password !== passenger.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log(passenger);

    alert("Passenger Added Successfully");
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

        <div className="add-passenger-container">

          <h2>Add New Passenger</h2>

          <form
            className="passenger-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                value={passenger.name}
                onChange={handleChange}
                placeholder="Enter Full Name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={passenger.email}
                onChange={handleChange}
                placeholder="Enter Email"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>

              <input
                type="text"
                name="phone"
                value={passenger.phone}
                onChange={handleChange}
                placeholder="98XXXXXXXX"
                required
              />
            </div>

            <div className="form-group">
              <label>Gender</label>

              <select
                name="gender"
                value={passenger.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>

              <select
                name="status"
                value={passenger.status}
                onChange={handleChange}
              >
                <option>Active</option>
                <option>Blocked</option>
              </select>
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                value={passenger.password}
                onChange={handleChange}
                placeholder="Enter Password"
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>

              <input
                type="password"
                name="confirmPassword"
                value={passenger.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
              />
            </div>

            <div className="button-group">

              <Link
                to="/passengers"
                className="cancel-btn"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="save-btn"
              >
                Save Passenger
              </button>

            </div>

          </form>

        </div>

      </div>
    </div>
  );
}

export default AddPassenger;