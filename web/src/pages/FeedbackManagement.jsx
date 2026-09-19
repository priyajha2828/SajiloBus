import { useState, useEffect } from "react";
import { MessageSquare, Star, Search, RefreshCw } from "lucide-react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function FeedbackManagement() {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/feedback");
      if (res.data.success) {
        setFeedbacks(res.data.feedbacks || []);
      }
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFeedbacks = feedbacks.filter((f) => {
    const term = search.toLowerCase();
    return (
      (f.comment && f.comment.toLowerCase().includes(term)) ||
      (f.category && f.category.toLowerCase().includes(term)) ||
      (f.passenger?.name && f.passenger.name.toLowerCase().includes(term)) ||
      (f.passenger?.email && f.passenger.email.toLowerCase().includes(term))
    );
  });

  return (
    <div className={`dashboard ${darkMode ? "dark-theme" : ""}`}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} darkMode={darkMode} />
      <div className={`dashboard-content ${collapsed ? "collapsed-content" : ""}`}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        
        <div style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <MessageSquare size={28} style={{ color: "#0F766E" }} />
              <div>
                <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "800" }}>Passenger Feedback & Reviews</h2>
                <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" }}>
                  Live feedback, commuter ratings & service reviews submitted by passengers.
                </p>
              </div>
            </div>
            <button
              onClick={fetchFeedbacks}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                background: "#0F766E",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              <RefreshCw size={16} /> Refresh Feed
            </button>
          </div>

          <div style={{ marginBottom: "20px", display: "flex", gap: "12px" }}>
            <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
              <Search size={18} style={{ position: "absolute", left: "12px", top: "12px", color: "#94a3b8" }} />
              <input
                type="text"
                placeholder="Search feedback, passenger name, category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 38px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  background: darkMode ? "#1e293b" : "#ffffff",
                  color: darkMode ? "#f8fafc" : "#0f172a",
                }}
              />
            </div>
          </div>

          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Loading feedback records...</div>
          ) : filteredFeedbacks.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", background: darkMode ? "#1e293b" : "#f8fafc", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
              <MessageSquare size={36} style={{ color: "#94a3b8", marginBottom: "8px" }} />
              <p style={{ margin: 0, fontWeight: "600" }}>No Feedback Found</p>
              <span style={{ fontSize: "12px", color: "#64748b" }}>Passenger reviews submitted from the mobile app will appear here.</span>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
              {filteredFeedbacks.map((f) => (
                <div
                  key={f.id}
                  style={{
                    background: darkMode ? "#1e293b" : "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "18px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
                    <div>
                      <strong style={{ fontSize: "15px", display: "block" }}>{f.passenger?.name || "Passenger"}</strong>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>{f.passenger?.email || "Anonymous"}</span>
                    </div>
                    <span
                      style={{
                        padding: "4px 8px",
                        background: "#0F766E15",
                        color: "#0F766E",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "700",
                      }}
                    >
                      {f.category || "General"}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "10px" }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < (f.rating || 5) ? "#f59e0b" : "none"}
                        color={i < (f.rating || 5) ? "#f59e0b" : "#cbd5e1"}
                      />
                    ))}
                    <span style={{ fontSize: "12px", fontWeight: "700", marginLeft: "6px", color: "#f59e0b" }}>
                      {f.rating || 5}/5 Stars
                    </span>
                  </div>

                  <p style={{ margin: "0 0 12px 0", fontSize: "13.5px", lineHeight: "1.5", color: darkMode ? "#cbd5e1" : "#334155" }}>
                    "{f.comment}"
                  </p>

                  <div style={{ fontSize: "11px", color: "#94a3b8", textAlign: "right" }}>
                    {f.createdAt ? new Date(f.createdAt).toLocaleString() : ""}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FeedbackManagement;
