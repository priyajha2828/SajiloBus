import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/AddPassenger.css";

function EditPassenger() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [passenger, setPassenger] = useState({
    firebaseUid: "",
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    fetchPassenger();
  }, []);

  const fetchPassenger = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/passengers/${id}`
      );

      const data = await response.json();

      if (data.success) {
        setPassenger(data.passenger);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setPassenger({
      ...passenger,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/passengers/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(passenger),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Passenger Updated Successfully");
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
            <Link to="/passengers" className="back-arrow">
              <ArrowLeft size={24} />
            </Link>
          <h2>Edit Passenger</h2>

          </div>

          <form
            className="passenger-form"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label>Name</label>

              <input
                type="text"
                name="name"
                value={passenger.name}
                onChange={handleChange}
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
                required
              />
            </div>

            <div className="form-group">
              <label>Phone</label>

              <input
                type="text"
                name="phone"
                value={passenger.phone}
                onChange={handleChange}
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
                Update Passenger
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditPassenger;