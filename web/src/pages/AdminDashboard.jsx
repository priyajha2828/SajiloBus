import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import LiveMap from "../components/LiveMap";
import "../css/AdminDashboard.css";
import { useEffect } from "react";
import { Bus, UserCheck, Users, Route } from "lucide-react";

function AdminDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [totalDrivers, setTotalDrivers] = useState(0);
  const [totalBuses, setTotalBuses] = useState(0);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
  fetchDriverCount();
  fetchBusCount();
}, []);

const fetchBusCount = async () => {
  try {
    const response = await fetch("http://localhost:5000/buses/count");
    const data = await response.json();

    if (data.success) {
      setTotalBuses(data.count);
    }
  } catch (error) {
    console.log(error);
  }
};

const fetchDriverCount = async () => {
  const response = await fetch("http://localhost:5000/drivers/count");
  const data = await response.json();

  if (data.success) {
    setTotalDrivers(data.count);
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
        className={`dashboard-content ${collapsed ? "collapsed-content" : ""}`}
      >
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* Cards */}

        <div className="cards">
          <div className="card buses">
            <div className="card-header">
              <Bus size={26} className="card-icon" />
              <h3>Total Buses</h3>
            </div>

            <h1>{totalBuses}</h1>
          </div>

          <div className="card drivers">
            <div className="card-header">
              <UserCheck size={26} className="card-icon" />
              <h3>Total Drivers</h3>
            </div>

            <h1>{totalDrivers}</h1>
          </div>

          <div className="card passengers">
            <div className="card-header">
              <Users size={26} className="card-icon" />
              <h3>Total Passengers</h3>
            </div>

            <h1>342</h1>
          </div>

          <div className="card trips">
            <div className="card-header">
              <Route size={26} className="card-icon" />
              <h3>Active Trips</h3>
            </div>

            <h1>14</h1>
          </div>
        </div>

        {/* Map */}

        <div className="map-section">
          <LiveMap />
        </div>

        {/* Bottom */}

        <div className="bottom-section">
          <div className="panel">
            <h2> Recent Trips</h2>

            <table>
              <thead>
                <tr>
                  <th>Bus</th>
                  <th>Driver</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Bus 101</td>
                  <td>Ram Sharma</td>
                  <td>
                    <span className="trip-status running">Running</span>
                  </td>
                </tr>

                <tr>
                  <td>Bus 205</td>
                  <td>Hari Lama</td>
                  <td>
                    <span className="trip-status completed">Completed</span>
                  </td>
                </tr>

                <tr>
                  <td>Bus 302</td>
                  <td>Suman Rai</td>
                  <td>
                    <span className="trip-status waiting">Waiting</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="panel">
            <h2> Driver Status</h2>

            <ul className="status-list">
              <li>
                <span>Ram Sharma</span>
                <span className="driver-status online">Online</span>
              </li>

              <li>
                <span>Hari Lama</span>
                <span className="driver-status online">Online</span>
              </li>

              <li>
                <span>Suman Rai</span>
                <span className="driver-status offline">Offline</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
