import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  RefreshCw,
  User,
  ExternalLink,
} from "lucide-react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../css/SOSManagement.css";

function SOSManagement() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [sosAlerts, setSosAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    fetchSOSQueue();
    const interval = setInterval(fetchSOSQueue, 5000); // Live poll every 5s
    return () => clearInterval(interval);
  }, []);

  const fetchSOSQueue = async () => {
    try {
      const response = await api.get("/sos");
      if (response.data.success) {
        setSosAlerts(response.data.sosAlerts || []);
      }
    } catch (error) {
      console.error("Error fetching SOS alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await api.patch(`/sos/${id}/status`, { status: newStatus });
      if (response.data.success) {
        fetchSOSQueue();
      }
    } catch (error) {
      console.error("Error updating SOS status:", error);
      alert(error.response?.data?.message || "Failed to update SOS status");
    }
  };

  const filteredAlerts = sosAlerts.filter((alert) => {
    if (statusFilter === "ALL") return true;
    return alert.status === statusFilter;
  });

  const pendingCount = sosAlerts.filter((a) => a.status === "PENDING").length;

  return (
    <div className={`dashboard ${darkMode ? "dark-theme" : ""}`}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} darkMode={darkMode} />

      <div className={`dashboard-content ${collapsed ? "collapsed-content" : ""}`}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* Header */}
        <div className="sos-header">
          <div className="sos-title-group">
            <button className="back-arrow" onClick={() => navigate("/admin/dashboard")}>
              <ArrowLeft size={22} />
            </button>
            <AlertTriangle size={28} color="#dc2626" />
            <h2>Emergency SOS Live Queue</h2>
            {pendingCount > 0 && (
              <span className="sos-badge-count">{pendingCount} PENDING</span>
            )}
          </div>
          <button className="sos-btn sos-btn-map" style={{ flex: "none", width: "auto", padding: "8px 16px" }} onClick={fetchSOSQueue}>
            <RefreshCw size={16} /> Refresh Queue
          </button>
        </div>

        {/* Tabs */}
        <div className="sos-filter-tabs">
          <button className={`sos-tab ${statusFilter === "ALL" ? "active" : ""}`} onClick={() => setStatusFilter("ALL")}>
            All Alerts ({sosAlerts.length})
          </button>
          <button className={`sos-tab ${statusFilter === "PENDING" ? "active" : ""}`} onClick={() => setStatusFilter("PENDING")}>
            Pending ({sosAlerts.filter((a) => a.status === "PENDING").length})
          </button>
          <button className={`sos-tab ${statusFilter === "IN_PROGRESS" ? "active" : ""}`} onClick={() => setStatusFilter("IN_PROGRESS")}>
            In Progress ({sosAlerts.filter((a) => a.status === "IN_PROGRESS").length})
          </button>
          <button className={`sos-tab ${statusFilter === "RESOLVED" ? "active" : ""}`} onClick={() => setStatusFilter("RESOLVED")}>
            Resolved ({sosAlerts.filter((a) => a.status === "RESOLVED").length})
          </button>
        </div>

        {/* Grid Cards */}
        {loading ? (
          <p>Loading live SOS queue...</p>
        ) : filteredAlerts.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", background: "white", borderRadius: "12px" }}>
            <CheckCircle size={48} color="#16a34a" style={{ marginBottom: "12px" }} />
            <h3 style={{ margin: 0, color: "#1e293b" }}>No Emergency Alerts Found</h3>
            <p style={{ color: "#64748b" }}>All transit corridors operate normally with zero pending SOS tickets.</p>
          </div>
        ) : (
          <div className="sos-grid">
            {filteredAlerts.map((sos) => (
              <div key={sos.id} className={`sos-card ${sos.status.toLowerCase()}`}>
                <div className="sos-card-header">
                  <span className="sos-ticket-id">🚨 SOS #{sos.id}</span>
                  <span className={`sos-status-tag ${sos.status}`}>{sos.status}</span>
                </div>

                <div className="sos-passenger-box">
                  <div className="sos-passenger-name">
                    <User size={16} inline style={{ marginRight: "6px" }} />
                    {sos.passenger?.name || "Passenger #1"}
                  </div>
                  <div className="sos-passenger-phone">
                    <Phone size={14} inline style={{ marginRight: "4px" }} />
                    {sos.passenger?.phone || "No Registered Phone"}
                  </div>
                </div>

                {/* Emergency Contacts */}
                <div className="sos-contacts-section">
                  <div className="sos-contacts-title">Emergency Contacts (Max 2):</div>
                  {sos.passenger?.sosContacts && sos.passenger.sosContacts.length > 0 ? (
                    sos.passenger.sosContacts.map((contact, idx) => (
                      <div key={contact.id || idx} className="sos-contact-pill">
                        <span className="sos-contact-name">
                          {contact.relationship || "Contact"}: {contact.contactName}
                        </span>
                        <span className="sos-contact-num">{contact.contactNumber}</span>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>No saved emergency contacts.</p>
                  )}
                </div>

                <p style={{ fontSize: "13px", color: "#334155", fontWeight: 600, background: "#f8fafc", padding: "8px", borderRadius: "6px" }}>
                  "{sos.message}"
                </p>

                <div className="sos-coords-box">
                  <span>
                    <MapPin size={16} inline style={{ marginRight: "4px" }} />
                    {sos.latitude}, {sos.longitude}
                  </span>
                  <a
                    href={`https://maps.google.com/?q=${sos.latitude},${sos.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}
                  >
                    Open Map <ExternalLink size={12} inline />
                  </a>
                </div>

                <div className="sos-actions-row">
                  {sos.status === "PENDING" && (
                    <button className="sos-btn sos-btn-progress" onClick={() => handleUpdateStatus(sos.id, "IN_PROGRESS")}>
                      <Clock size={16} /> Intercept
                    </button>
                  )}
                  {sos.status !== "RESOLVED" && (
                    <button className="sos-btn sos-btn-resolve" onClick={() => handleUpdateStatus(sos.id, "RESOLVED")}>
                      <CheckCircle size={16} /> Resolve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SOSManagement;
