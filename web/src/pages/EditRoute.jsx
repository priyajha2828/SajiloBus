import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/AddRoute.css";

function EditRoute() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [route, setRoute] = useState({
    routeName: "",
    startPoint: "",
    endPoint: "",
    distance: "",
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    fetchRoute();
  }, []);

  const fetchRoute = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/routes/${id}`
      );

      const data = await response.json();

      if (data.success) {
        setRoute(data.route);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setRoute({
      ...route,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/routes/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(route),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Route Updated Successfully");
        navigate("/routes");
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

        <div className="add-route-container">
            <div className="page-title">
            <Link to="/routes" className="back-arrow">
              <ArrowLeft size={24} />
            </Link>
          <h2>Edit Route</h2>

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
                value={route.endPoint}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Distance (KM)</label>

              <input
                type="number"
                step="0.01"
                name="distance"
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
                Update Route
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditRoute;