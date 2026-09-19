import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  ArrowLeft,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Star,
  CheckCircle,
  Bus,
  Users,
  Route,
  Clock,
  Download,
} from "lucide-react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Reports() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [loading, setLoading] = useState(true);
  const [reportsData, setReportsData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/reports");
      if (response.data.success) {
        setReportsData(response.data.reports);
      }
    } catch (error) {
      console.error("Error fetching admin reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  const summary = reportsData?.summary || {
    totalTrips: 0,
    completedTrips: 0,
    activeTrips: 0,
    completionRate: "0%",
    totalSOS: 0,
    pendingSOS: 0,
    resolvedSOS: 0,
    avgRating: 5.0,
    totalFeedbacks: 0,
  };

  const analytics = reportsData?.analytics || {
    driverTripCounts: {},
    routeTripCounts: {},
    feedbackCategories: {},
    sosBreakdown: { PENDING: 0, IN_PROGRESS: 0, RESOLVED: 0 },
  };

  return (
    <div className={`dashboard ${darkMode ? "dark-theme" : ""}`}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} darkMode={darkMode} />

      <div className={`dashboard-content ${collapsed ? "collapsed-content" : ""}`}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => navigate("/admin/dashboard")}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <ArrowLeft size={22} color={darkMode ? "#f8fafc" : "#1e293b"} />
            </button>
            <FileText size={28} color="#2563eb" />
            <div>
              <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: darkMode ? "#f8fafc" : "#0f172a" }}>
                Transit Operational & Safety Reports
              </h2>
              <p style={{ margin: 0, fontSize: "13px", color: darkMode ? "#94a3b8" : "#64748b" }}>
                Real-time performance analytics, SOS audit logs, fleet activity & passenger feedback
              </p>
            </div>
          </div>

          <div className="no-print" style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={fetchReports}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                background: "#f1f5f9",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "13px",
              }}
            >
              <RefreshCw size={15} /> Refresh
            </button>
            <button
              onClick={handlePrintReport}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "13px",
              }}
            >
              <Download size={15} /> Export PDF / Print
            </button>
          </div>
        </div>

        {/* Summary KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          <div style={{ background: darkMode ? "#1e293b" : "white", padding: "18px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", color: darkMode ? "#94a3b8" : "#64748b", fontWeight: "600" }}>Total Dispatch Trips</span>
              <Bus size={20} color="#2563eb" />
            </div>
            <h3 style={{ fontSize: "24px", margin: "10px 0 4px 0", color: darkMode ? "#f8fafc" : "#0f172a" }}>{summary.totalTrips}</h3>
            <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: "600" }}>Completion Rate: {summary.completionRate}</span>
          </div>

          <div style={{ background: darkMode ? "#1e293b" : "white", padding: "18px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", color: darkMode ? "#94a3b8" : "#64748b", fontWeight: "600" }}>Emergency SOS Alerts</span>
              <AlertTriangle size={20} color="#dc2626" />
            </div>
            <h3 style={{ fontSize: "24px", margin: "10px 0 4px 0", color: darkMode ? "#f8fafc" : "#0f172a" }}>{summary.totalSOS}</h3>
            <span style={{ fontSize: "12px", color: summary.pendingSOS > 0 ? "#dc2626" : "#16a34a", fontWeight: "600" }}>
              {summary.pendingSOS} Pending Action
            </span>
          </div>

          <div style={{ background: darkMode ? "#1e293b" : "white", padding: "18px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", color: darkMode ? "#94a3b8" : "#64748b", fontWeight: "600" }}>Passenger Satisfaction</span>
              <Star size={20} color="#eab308" />
            </div>
            <h3 style={{ fontSize: "24px", margin: "10px 0 4px 0", color: darkMode ? "#f8fafc" : "#0f172a" }}>{summary.avgRating} / 5.0</h3>
            <span style={{ fontSize: "12px", color: "#64748b" }}>{summary.totalFeedbacks} Total Reviews</span>
          </div>

          <div style={{ background: darkMode ? "#1e293b" : "white", padding: "18px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", color: darkMode ? "#94a3b8" : "#64748b", fontWeight: "600" }}>Active Live Buses</span>
              <TrendingUp size={20} color="#16a34a" />
            </div>
            <h3 style={{ fontSize: "24px", margin: "10px 0 4px 0", color: darkMode ? "#f8fafc" : "#0f172a" }}>{summary.activeTrips}</h3>
            <span style={{ fontSize: "12px", color: "#2563eb", fontWeight: "600" }}>Currently En-Route</span>
          </div>
        </div>

        {/* Report Tabs */}
        <div className="no-print" style={{ display: "flex", gap: "10px", marginBottom: "20px", borderBottom: `2px solid ${darkMode ? "#334155" : "#e2e8f0"}` }}>
          {[
            { id: "overview", label: "Fleet & Trip Activity" },
            { id: "sos", label: "SOS Safety Audit" },
            { id: "feedback", label: "Feedback & Ratings" },
            { id: "drivers", label: "Driver Performance Log" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "10px 18px",
                border: "none",
                background: "none",
                borderBottom: activeTab === tab.id ? "3px solid #2563eb" : "3px solid transparent",
                color: activeTab === tab.id ? "#2563eb" : darkMode ? "#94a3b8" : "#64748b",
                fontWeight: activeTab === tab.id ? "700" : "600",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Views */}
        {loading ? (
          <p>Loading analytics reports...</p>
        ) : (
          <div>
            {activeTab === "overview" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                {/* Route Activity Report */}
                <div style={{ background: darkMode ? "#1e293b" : "white", padding: "20px", borderRadius: "12px" }}>
                  <h4 style={{ margin: "0 0 16px 0", fontSize: "16px", color: darkMode ? "#f8fafc" : "#0f172a" }}>
                    <Route size={18} inline style={{ marginRight: "8px" }} /> Route Volume Breakdown
                  </h4>
                  {Object.keys(analytics.routeTripCounts).length === 0 ? (
                    <p style={{ color: "#94a3b8", fontSize: "13px" }}>No trip data available across routes.</p>
                  ) : (
                    Object.entries(analytics.routeTripCounts).map(([routeName, count]) => (
                      <div key={routeName} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                        <span style={{ fontWeight: "600", fontSize: "14px", color: darkMode ? "#e2e8f0" : "#334155" }}>{routeName}</span>
                        <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "2px 10px", borderRadius: "12px", fontWeight: "700", fontSize: "12px" }}>
                          {count} Trips
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Driver Activity Distribution */}
                <div style={{ background: darkMode ? "#1e293b" : "white", padding: "20px", borderRadius: "12px" }}>
                  <h4 style={{ margin: "0 0 16px 0", fontSize: "16px", color: darkMode ? "#f8fafc" : "#0f172a" }}>
                    <Users size={18} inline style={{ marginRight: "8px" }} /> Driver Dispatch Activity
                  </h4>
                  {Object.keys(analytics.driverTripCounts).length === 0 ? (
                    <p style={{ color: "#94a3b8", fontSize: "13px" }}>No trip assignments logged.</p>
                  ) : (
                    Object.entries(analytics.driverTripCounts).map(([driverName, count]) => (
                      <div key={driverName} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                        <span style={{ fontWeight: "600", fontSize: "14px", color: darkMode ? "#e2e8f0" : "#334155" }}>{driverName}</span>
                        <span style={{ background: "#fef3c7", color: "#b45309", padding: "2px 10px", borderRadius: "12px", fontWeight: "700", fontSize: "12px" }}>
                          {count} Completed Runs
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "sos" && (
              <div style={{ background: darkMode ? "#1e293b" : "white", padding: "20px", borderRadius: "12px" }}>
                <h4 style={{ margin: "0 0 16px 0", fontSize: "16px", color: darkMode ? "#f8fafc" : "#0f172a" }}>
                  <AlertTriangle size={18} color="#dc2626" inline style={{ marginRight: "8px" }} /> Emergency SOS Log History
                </h4>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: darkMode ? "#334155" : "#f8fafc", color: darkMode ? "#cbd5e1" : "#475569", fontSize: "13px" }}>
                      <th style={{ padding: "10px" }}>Ticket ID</th>
                      <th style={{ padding: "10px" }}>Passenger</th>
                      <th style={{ padding: "10px" }}>Status</th>
                      <th style={{ padding: "10px" }}>Message / Reason</th>
                      <th style={{ padding: "10px" }}>Coordinates</th>
                      <th style={{ padding: "10px" }}>Date / Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(reportsData?.sosAlerts || []).map((sos) => (
                      <tr key={sos.id} style={{ borderBottom: `1px solid ${darkMode ? "#334155" : "#f1f5f9"}`, fontSize: "13px" }}>
                        <td style={{ padding: "10px", fontWeight: "700" }}>#SOS-{sos.id}</td>
                        <td style={{ padding: "10px" }}>{sos.passenger?.name || "Passenger"}</td>
                        <td style={{ padding: "10px" }}>
                          <span
                            style={{
                              padding: "4px 8px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: "700",
                              background: sos.status === "PENDING" ? "#fee2e2" : sos.status === "RESOLVED" ? "#dcfce7" : "#fef3c7",
                              color: sos.status === "PENDING" ? "#b91c1c" : sos.status === "RESOLVED" ? "#15803d" : "#b45309",
                            }}
                          >
                            {sos.status}
                          </span>
                        </td>
                        <td style={{ padding: "10px", maxWidth: "250px" }}>{sos.message}</td>
                        <td style={{ padding: "10px" }}>{sos.latitude}, {sos.longitude}</td>
                        <td style={{ padding: "10px", color: "#64748b" }}>{new Date(sos.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "feedback" && (
              <div style={{ background: darkMode ? "#1e293b" : "white", padding: "20px", borderRadius: "12px" }}>
                <h4 style={{ margin: "0 0 16px 0", fontSize: "16px", color: darkMode ? "#f8fafc" : "#0f172a" }}>
                  <Star size={18} color="#eab308" inline style={{ marginRight: "8px" }} /> Passenger Rating & Experience Log
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px" }}>
                  <div style={{ background: darkMode ? "#334155" : "#f8fafc", padding: "16px", borderRadius: "10px" }}>
                    <h5 style={{ margin: "0 0 10px 0" }}>Category Breakdown</h5>
                    {Object.entries(analytics.feedbackCategories || {}).map(([cat, cnt]) => (
                      <div key={cat} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", padding: "6px 0" }}>
                        <span>{cat}</span>
                        <strong>{cnt} feedback(s)</strong>
                      </div>
                    ))}
                  </div>

                  <div>
                    {(reportsData?.feedbacks || []).map((f) => (
                      <div key={f.id} style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "12px", marginBottom: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <strong>{f.passenger?.name || f.name || "Passenger"}</strong>
                          <span style={{ color: "#eab308", fontWeight: "700" }}>★ {f.rating}/5</span>
                        </div>
                        <p style={{ margin: "4px 0", fontSize: "13px", color: "#475569" }}>"{f.comment}"</p>
                        <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                          Category: {f.category} • {new Date(f.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "drivers" && (
              <div style={{ background: darkMode ? "#1e293b" : "white", padding: "20px", borderRadius: "12px" }}>
                <h4 style={{ margin: "0 0 16px 0", fontSize: "16px", color: darkMode ? "#f8fafc" : "#0f172a" }}>
                  <Clock size={18} inline style={{ marginRight: "8px" }} /> Driver Session & Authentication Logs
                </h4>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: darkMode ? "#334155" : "#f8fafc", color: darkMode ? "#cbd5e1" : "#475569", fontSize: "13px" }}>
                      <th style={{ padding: "10px" }}>Driver Name</th>
                      <th style={{ padding: "10px" }}>License No</th>
                      <th style={{ padding: "10px" }}>Login Time</th>
                      <th style={{ padding: "10px" }}>Logout Time</th>
                      <th style={{ padding: "10px" }}>Session Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(reportsData?.driverLogins || []).map((log) => (
                      <tr key={log.id} style={{ borderBottom: `1px solid ${darkMode ? "#334155" : "#f1f5f9"}`, fontSize: "13px" }}>
                        <td style={{ padding: "10px", fontWeight: "600" }}>{log.driver?.name || "Driver"}</td>
                        <td style={{ padding: "10px" }}>{log.driver?.licenseNo || "N/A"}</td>
                        <td style={{ padding: "10px" }}>{new Date(log.loginTime).toLocaleString()}</td>
                        <td style={{ padding: "10px" }}>{log.logoutTime ? new Date(log.logoutTime).toLocaleString() : "Active Session"}</td>
                        <td style={{ padding: "10px" }}>
                          <span style={{ color: "#16a34a", fontWeight: "700" }}>{log.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {/* CSS Print Styles */}
        <style>{`
          @media print {
            .sidebar, .navbar, .no-print, button, .sidebar-menu, .sidebar-header, .logout-section {
              display: none !important;
            }
            .dashboard-content {
              margin-left: 0 !important;
              padding: 0 !important;
              width: 100% !important;
            }
            body, .dashboard {
              background: white !important;
              color: black !important;
            }
            .report-card, table {
              page-break-inside: avoid;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default Reports;
