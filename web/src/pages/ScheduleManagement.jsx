import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarClock,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  ArrowLeft,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/ScheduleManagement.css";

function ScheduleManagement() {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await fetch("http://localhost:5000/schedules");

      const data = await response.json();

      if (data.success) {
        setSchedules(data.schedules);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const deleteSchedule = async (id) => {
    if (!window.confirm("Delete this schedule?")) return;

    try {
      const response = await fetch(`http://localhost:5000/schedules/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      alert(data.message);

      fetchSchedules();
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

        {/* Header */}

        <div className="schedule-header">
          <div className="schedule-title">
            <button
              className="back-arrow"
              onClick={() => navigate("/admin/dashboard")}
            >
              <ArrowLeft size={22} />
            </button>

            <CalendarClock size={30} />

            <h2>Bus Schedule</h2>
          </div>

          <Link to="/schedules/add" className="add-schedule-btn">
            <Plus size={18} />
            Add Schedule
          </Link>
        </div>

        {/* Toolbar */}

        {/* Toolbar */}

        <div className="schedule-toolbar">
          <div className="search-schedule">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search Schedule..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}

        <div className="schedule-table-card">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Bus</th>

                <th>Route</th>

                <th>Departure</th>

                <th>Day</th>

                <th>Status</th>

                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6">Loading...</td>
                </tr>
              ) : schedules.length === 0 ? (
                <tr>
                  <td colSpan="6">No Schedules Found</td>
                </tr>
              ) : (
                schedules
                  .filter(
                    (schedule) =>
                      schedule.bus.busNumber
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      schedule.route.routeName
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      schedule.dayOfWeek
                        .toLowerCase()
                        .includes(search.toLowerCase()),
                  )
                  .map((schedule) => (
                    <tr key={schedule.id}>
                      <td>{schedule.bus.busNumber}</td>

                      <td>{schedule.route.routeName}</td>

                      <td>
                        {new Date(schedule.departureTime).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </td>

                      <td>{schedule.dayOfWeek}</td>

                      <td>
                        {schedule.isActive ? (
                          <span className="active-status">Active</span>
                        ) : (
                          <span className="inactive-status">Inactive</span>
                        )}
                      </td>

                      <td>
                        <div className="actions">
                          <Eye
                            size={18}
                            onClick={() =>
                              navigate(`/schedules/view/${schedule.id}`)
                            }
                          />

                          <Pencil
                            size={18}
                            onClick={() =>
                              navigate(`/schedules/edit/${schedule.id}`)
                            }
                          />

                          <Trash2
                            size={18}
                            onClick={() => deleteSchedule(schedule.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ScheduleManagement;
