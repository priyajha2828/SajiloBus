import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { auth } from "../firebase"; // adjust path to your firebase config file

import "../css/AddDriver.css";

function AddDriver() {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
    password: "",
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
    setSubmitting(true);

    try {
      // 1. Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        driver.email,
        driver.password
      );

      const firebaseUid = userCredential.user.uid;

      // 2. Send driver data (with real firebaseUid) to your backend
      const { password, ...driverWithoutPassword } = driver;

      const driverData = {
        ...driverWithoutPassword,
        firebaseUid,
      };

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/drivers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

      // Friendlier messages for common Firebase auth errors
      if (error.code === "auth/email-already-in-use") {
        alert("This email is already registered.");
      } else if (error.code === "auth/weak-password") {
        alert("Password should be at least 6 characters.");
      } else if (error.code === "auth/invalid-email") {
        alert("Please enter a valid email address.");
      } else {
        alert("Server Error");
      }
    } finally {
      setSubmitting(false);
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
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <div className="add-driver-container">
          <div className="page-title">
            <Link to="/drivers" className="back-arrow">
              <ArrowLeft size={24} />
            </Link>

            <h2>Add New Driver</h2>
          </div>

          <form className="driver-form" onSubmit={handleSubmit}>
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

            {/* Password */}
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={driver.password}
                onChange={handleChange}
                minLength={6}
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
              <Link to="/drivers" className="cancel-btn">
                Cancel
              </Link>

              <button type="submit" className="save-btn" disabled={submitting}>
                {submitting ? "Saving..." : "Save Driver"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddDriver;