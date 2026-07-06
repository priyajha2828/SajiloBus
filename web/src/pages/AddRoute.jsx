import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { ArrowLeft } from "lucide-react";

import "../css/AddRoute.css";

function AddRoute() {
  const [collapsed, setCollapsed] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const [route, setRoute] = useState({
    routeName: "",
    startPoint: "",
    endPoint: "",
    distance: "",
  });

  const handleChange = (e) => {
    setRoute({
      ...route,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(route);

    alert("Route Added Successfully!");
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

        <div className="add-route-container">

          <div className="page-title">

  <Link to="/routes" className="back-arrow">
    <ArrowLeft size={24} />
  </Link>

  <h2>Add New Route</h2>

</div>

          <form
            className="route-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">
              <label>Route Name</label>

              <input
                type="text"
                name="routeName"
                placeholder="Ring Road Route"
                value={route.routeName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Start Point</label>

              <input
                type="text"
                name="startPoint"
                placeholder="Kalanki"
                value={route.startPoint}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>End Point</label>

              <input
                type="text"
                name="endPoint"
                placeholder="Koteshwor"
                value={route.endPoint}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Distance (KM)</label>

              <input
                type="number"
                name="distance"
                placeholder="27"
                value={route.distance}
                onChange={handleChange}
                required
              />
            </div>

            <div className="button-group">

              <Link
                to="/routes"
                className="cancel-btn"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="save-btn"
              >
                Save Route
              </button>

            </div>

          </form>

        </div>
      </div>
    </div>
  );
}

export default AddRoute;