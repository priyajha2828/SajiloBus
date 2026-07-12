import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  ArrowLeft,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../css/AssignmentManagement.css";

function AssignmentManagement() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [assignments, setAssignments] = useState([]);
const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
  fetchAssignments();
}, []);

const fetchAssignments = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/bus-assignments"
    );

    const data = await response.json();

    if (data.success) {
      setAssignments(data.assignments);
    }

    setLoading(false);
  } catch (error) {
    console.log(error);
    setLoading(false);
  }
};

const deleteAssignment = async (id) => {

  if (!window.confirm("Delete Assignment?"))
    return;

  try {

    const response = await fetch(
  `http://localhost:5000/bus-assignments/${id}`,
  {
    method: "DELETE",
  }
);

    const data = await response.json();

    alert(data.message);

    fetchAssignments();

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
        className={`dashboard-content ${
          collapsed ? "collapsed-content" : ""
        }`}
      >
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* Header */}

        <div className="assignment-header">
          <div className="assignment-title">
            <button
              className="back-arrow"
              onClick={() => navigate("/admin/dashboard")}
            >
              <ArrowLeft size={24} />
            </button>

            <ClipboardList size={30} />

            <h2>Bus Assignment Management</h2>
          </div>

          <Link
            to="/assignments/add"
            className="add-assignment-btn"
          >
            <Plus size={18} />
            Assign Bus
          </Link>
        </div>

        {/* Search */}

        <div className="assignment-toolbar">
          <div className="search-assignment">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search Assignment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}

        <div className="assignment-table-card">
          <table className="assignment-table">
            <thead>
              <tr>
                <th>Driver</th>
                <th>Bus</th>
                <th>Assigned From</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>

          <tbody>
  {loading ? (
    <tr>
      <td colSpan="5" style={{ textAlign: "center" }}>
        Loading...
      </td>
    </tr>
  ) : assignments.length === 0 ? (
    <tr>
      <td colSpan="5" style={{ textAlign: "center" }}>
        No Assignments Found
      </td>
    </tr>
  ) : (
    assignments
      .filter((assignment) => {
        const driverName = assignment.driver?.name || "";
        const busNumber = assignment.bus?.busNumber || "";

        return (
          driverName
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          busNumber
            .toLowerCase()
            .includes(search.toLowerCase())
        );
      })
      .map((assignment) => (
        <tr key={assignment.id}>
          <td>{assignment.driver?.name}</td>

          <td>{assignment.bus?.busNumber}</td>

          <td>
            {new Date(
              assignment.assignedFrom
            ).toLocaleDateString()}
          </td>

          <td>
            {assignment.assignedTo
              ? new Date(
                  assignment.assignedTo
                ).toLocaleDateString()
              : "-"}
          </td>

          <td>
            <div className="actions">
              <Eye
                size={18}
                onClick={() =>
                  navigate(`/assignments/view/${assignment.id}`)
                }
              />

              <Pencil
                size={18}
                onClick={() =>
                  navigate(`/assignments/edit/${assignment.id}`)
                }
              />

              <Trash2
                size={18}
                onClick={() =>
                  deleteAssignment(assignment.id)
                }
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

export default AssignmentManagement;