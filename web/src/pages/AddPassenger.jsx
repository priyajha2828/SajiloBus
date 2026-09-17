import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { ArrowLeft } from "lucide-react";
import api from "../services/api";
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
});

 const handleChange = (e) => {
  setPassenger({
    ...passenger,
    [e.target.name]: e.target.value,
  });
};

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await api.post("/passengers", {
      firebaseUid: `passenger_${Date.now()}`, // Temporary UID for admin-created passenger
      name: passenger.name,
      email: passenger.email,
      phone: passenger.phone,
    });

    if (response.data.success) {
      alert(response.data.message);
      navigate("/passengers");
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      "Server Error"
    );
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