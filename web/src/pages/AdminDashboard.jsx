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
  const [totalPassengers, setTotalPassengers] = useState(0);
  const [totalTrips, setTotalTrips] = useState(0);
  const [recentTrips, setRecentTrips] = useState([]);
  const [driverStatus, setDriverStatus] = useState([]);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);


useEffect(() => {
  fetchDriverCount();
  fetchBusCount();
  fetchPassengerCount();
  fetchTripCount();
  fetchRecentTrips();
  fetchDriverStatus();   // <-- You forgot this line
}, []);

const fetchTripCount = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/trips/count"
    );

    const data = await response.json();

    if (data.success) {
      setTotalTrips(data.count);
    }
  } catch (error) {
    console.log(error);
  }
};

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

const fetchPassengerCount = async () => {
  try {
    const response = await fetch("http://localhost:5000/passengers/count");
    const data = await response.json();

    if (data.success) {
      setTotalPassengers(data.count);
    }
  } catch (error) {
    console.log(error);
  }
};

const fetchRecentTrips = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/trips/recent"
    );

    const data = await response.json();

    if (data.success) {
      setRecentTrips(data.trips);
    }
  } catch (error) {
    console.log(error);
  }
};

const fetchDriverStatus = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/drivers/status"
    );

    const data = await response.json();

    if (data.success) {
      setDriverStatus(data.drivers);
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

           <h1>{totalPassengers}</h1>
          </div>

          <div className="card trips">
            <div className="card-header">
              <Route size={26} className="card-icon" />
              <h3>Active Trips</h3>
            </div>

            <h1>{totalTrips}</h1>
          </div>
        </div>

        {/* Map */}

        <div className="map-section">
          <LiveMap />
        </div>

        {/* Bottom */}

<div className="bottom-section">

  {/* Recent Trips */}

  <div className="panel">

    <h2>Recent Trips</h2>

    <table>

      <thead>
        <tr>
          <th>Bus</th>
          <th>Driver</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {recentTrips.length === 0 ? (
          <tr>
            <td colSpan="3">No Recent Trips</td>
          </tr>
        ) : (
          recentTrips.map((trip) => (
            <tr key={trip.id}>
              <td>{trip.bus.busNumber}</td>

              <td>{trip.driver.name}</td>

              <td>
                {trip.endedAt ? (
                  <span className="trip-status completed">
                    Completed
                  </span>
                ) : (
                  <span className="trip-status running">
                    Running
                  </span>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>

    </table>

  </div>

  {/* Driver Status */}

  <div className="panel">

    <h2>Driver Status</h2>

    <table className="driver-status-table">

      <thead>

        <tr>
          <th>Driver</th>
          <th>Status</th>
        </tr>

      </thead>

      <tbody>

        {driverStatus.length === 0 ? (
          <tr>
            <td colSpan="2">No Drivers Found</td>
          </tr>
        ) : (
          driverStatus.slice(0, 5).map((driver) => (
  <tr key={driver.id}>
    <td>{driver.name}</td>

    <td>
      <span
        className={`driver-status ${driver.status.toLowerCase()}`}
      >
        {driver.status}
      </span>
    </td>
  </tr>
))
        )}

      </tbody>

    </table>

  </div>

</div>

</div>
</div>
);
}

export default AdminDashboard;