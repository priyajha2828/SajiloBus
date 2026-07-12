import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { ArrowLeft } from "lucide-react";

import "../css/AddPassenger.css";

function AddPassenger() {
  const [collapsed, setCollapsed] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (passenger.password !== passenger.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/passengers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firebaseUid: `passenger_${Date.now()}`, // temporary unique id
        name: passenger.name,
        email: passenger.email,
        phone: passenger.phone,
      }),
    });

    const data = await response.json();

    if (data.success) {
      alert("Passenger Added Successfully");
      navigate("/passengers");
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

        <div className="add-passenger-container">

          <div className="page-title">

          <Link
            to="/passengers"
            className="back-arrow"
          >
            <ArrowLeft size={24} />
          </Link>

          <h2>Add New Passenger</h2>
          </div>

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