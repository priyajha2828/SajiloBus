import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/AddDriver.css";

function EditDriver() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [driver, setDriver] = useState({
    name: "",
    email: "",
    phone: "",
    licenseNo: "",
    isAvailable: true,
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    fetchDriver();
  }, []);

  const fetchDriver = async () => {
    try {
      const response = await fetch(`http://localhost:5000/drivers/${id}`);
      const data = await response.json();

      if (data.success) {
        setDriver(data.driver);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
      const response = await fetch(
        `http://localhost:5000/drivers/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(driver),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Driver Updated Successfully");
        navigate("/drivers");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

          <div className="page-title">
            <Link to="/drivers" className="back-arrow">
              <ArrowLeft size={24} />
            </Link>

            <h2>Edit Driver</h2>
          </div>

          <form className="driver-form" onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Name</label>

              <input
                type="text"
                name="name"
                value={driver.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={driver.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Phone</label>

              <input
                type="text"
                name="phone"
                value={driver.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>License</label>

              <input
                type="text"
                name="licenseNo"
                value={driver.licenseNo}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Status</label>

              <select
                value={driver.isAvailable.toString()}
                onChange={(e) =>
                  setDriver({
                    ...driver,
                    isAvailable: e.target.value === "true",
                  })
                }
              >
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            </div>

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
                Update Driver
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}

export default EditDriver;