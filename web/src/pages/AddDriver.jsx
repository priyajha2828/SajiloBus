import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../css/AddDriver.css";

function AddDriver() {

  const [collapsed,setCollapsed] = useState(false);
  const [darkMode,setDarkMode] = useState(false);

  return (

    <div className={`dashboard ${darkMode ? "dark-theme" : ""}`}>

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        darkMode={darkMode}
      />

      <div className={`dashboard-content ${collapsed ? "collapsed-content" : ""}`}>

        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <div className="add-driver-container">

          <h2>Add New Driver</h2>

          <form className="driver-form">

            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Enter full name"/>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Enter email"/>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" placeholder="Enter phone"/>
            </div>

            <div className="form-group">
              <label>License Number</label>
              <input type="text" placeholder="Enter license number"/>
            </div>

            <div className="form-group">
              <label>Gender</label>

              <select>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

            </div>

            <div className="form-group">
              <label>Address</label>
              <input type="text" placeholder="Enter address"/>
            </div>

            <div className="form-group">
              <label>Experience</label>
              <input type="number" placeholder="Years"/>
            </div>

            <div className="form-group">
              <label>Assign Bus</label>

              <select>
                <option>Select Bus</option>
                <option>Bus 101</option>
                <option>Bus 205</option>
                <option>Bus 302</option>
              </select>

            </div>

            <div className="form-group">
              <label>Status</label>

              <select>
                <option>Available</option>
                <option>Online</option>
                <option>Offline</option>
              </select>

            </div>

            <div className="form-group">
              <label>Driver Photo</label>
              <input type="file"/>
            </div>

            <div className="button-group">

              <Link to="/drivers" className="cancel-btn">
                Cancel
              </Link>

              <button type="submit" className="save-btn">
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