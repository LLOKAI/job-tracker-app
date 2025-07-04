import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../ThemeContext";

const statusLabels = {
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  REJECTED: "Rejected",
  OFFER: "Offer",
};

const statusOrder = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"];

export default function Stats() {
  const { darkMode } = useContext(ThemeContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/api/jobs?limit=1000");
        const data = await res.json();
        setJobs(data.data || []);
      } catch (err) {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  // Compute stats
  const total = jobs.length;
  const byStatus = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});
  const appliedThisWeek = jobs.filter(j => {
    const d = new Date(j.appliedDate);
    const now = new Date();
    const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    return d >= weekAgo;
  }).length;

  // Top companies
  const companyCounts = jobs.reduce((acc, job) => {
    acc[job.company] = (acc[job.company] || 0) + 1;
    return acc;
  }, {});
  const topCompanies = Object.entries(companyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Most common positions
  const positionCounts = jobs.reduce((acc, job) => {
    acc[job.position] = (acc[job.position] || 0) + 1;
    return acc;
  }, {});
  const topPositions = Object.entries(positionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Recent jobs (last 7 days)
  const recentJobs = jobs
    .filter(j => {
      const d = new Date(j.appliedDate);
      const now = new Date();
      const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      return d >= weekAgo;
    })
    .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
    .slice(0, 5);

  // Simple pipeline: Applied → Interview → Offer/Rejected
  const pipeline = [
    { label: "Applied", count: byStatus.APPLIED || 0 },
    { label: "Interview", count: byStatus.INTERVIEW || 0 },
    { label: "Offer", count: byStatus.OFFER || 0 },
    { label: "Rejected", count: byStatus.REJECTED || 0 },
  ];

  return (
    <div style={{
      maxWidth: 900,
      margin: "0 auto",
      padding: "2rem 0",
      color: darkMode ? "#f8fafc" : "#222",
    }}>
      <h1 style={{ marginBottom: 24 }}>Job Application Stats</h1>
      {loading ? (
        <div>Loading stats...</div>
      ) : (
        <>
          <div style={{
            display: "flex",
            gap: 32,
            flexWrap: "wrap",
            marginBottom: 32,
          }}>
            <StatCard label="Total Applications" value={total} />
            <StatCard label="Applied This Week" value={appliedThisWeek} />
            {statusOrder.map(status => (
              <StatCard
                key={status}
                label={statusLabels[status]}
                value={byStatus[status] || 0}
              />
            ))}
          </div>

          <h2 style={{ marginTop: 32, marginBottom: 12 }}>Pipeline Overview</h2>
          <PipelineBar pipeline={pipeline} darkMode={darkMode} />

          <div style={{
            display: "flex",
            gap: 32,
            flexWrap: "wrap",
            marginBottom: 32,
          }}>
            {/* Top Companies */}
            <div style={{ flex: 1, minWidth: 220 }}>
              <h3 style={{ marginBottom: 8 }}>Top Companies</h3>
              <ol style={{ margin: 0, paddingLeft: 20 }}>
                {topCompanies.length === 0 && <li style={{ color: "#888" }}>No data</li>}
                {topCompanies.map(([company, count]) => (
                  <li key={company}>
                    <b>{company}</b> <span style={{ color: "#64748b" }}>({count})</span>
                  </li>
                ))}
              </ol>
            </div>
            {/* Most Common Positions */}
            <div style={{ flex: 1, minWidth: 220 }}>
              <h3 style={{ marginBottom: 8 }}>Most Common Positions</h3>
              <ol style={{ margin: 0, paddingLeft: 20 }}>
                {topPositions.length === 0 && <li style={{ color: "#888" }}>No data</li>}
                {topPositions.map(([position, count]) => (
                  <li key={position}>
                    <b>{position}</b> <span style={{ color: "#64748b" }}>({count})</span>
                  </li>
                ))}
              </ol>
            </div>
            {/* Recent Activity */}
            <div style={{ flex: 1, minWidth: 220 }}>
              <h3 style={{ marginBottom: 8 }}>Recent Applications</h3>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {recentJobs.length === 0 && <li style={{ color: "#888" }}>No recent jobs</li>}
                {recentJobs.map(job => (
                  <li key={job.id}>
                    <b>{job.position}</b> at <b>{job.company}</b>
                    <span style={{ color: "#64748b" }}> ({new Date(job.appliedDate).toLocaleDateString()})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Placeholder for future chart */}
          <div style={{
            marginTop: 40,
            padding: 24,
            borderRadius: 12,
            background: darkMode ? "#23263a" : "#e5e7eb",
            textAlign: "center",
            color: "#64748b",
            fontStyle: "italic"
          }}>
            {/* In the future, add a pie chart or bar chart here using Chart.js, Recharts, or Nivo */}
            <span>📊 Chart visualizations coming soon!</span>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{
      background: "var(--card-bg)",
      borderRadius: 10,
      boxShadow: "0 2px 8px var(--card-shadow)",
      padding: "1.2rem 2rem",
      minWidth: 140,
      textAlign: "center",
      marginBottom: 12,
    }}>
      <div style={{ fontSize: 18, fontWeight: 600 }}>{value}</div>
      <div style={{ color: "#64748b", fontSize: 15 }}>{label}</div>
    </div>
  );
}

function PipelineBar({ pipeline, darkMode }) {
  const total = pipeline.reduce((sum, s) => sum + s.count, 0) || 1;
  const colors = ["#3b82f6", "#22c55e", "#facc15", "#ef4444"];
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      height: 40,
      borderRadius: 8,
      overflow: "hidden",
      boxShadow: "0 1px 6px rgba(0,0,0,0.10)",
      background: darkMode ? "#23263a" : "#e5e7eb",
      marginBottom: 24,
    }}>
      {pipeline.map((stage, i) => (
        <div
          key={stage.label}
          style={{
            flex: stage.count,
            background: colors[i],
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            fontSize: 16,
            height: "100%",
            minWidth: stage.count === 0 ? 0 : 60,
            opacity: stage.count === 0 ? 0.4 : 1,
            transition: "flex 0.3s",
          }}
        >
          {stage.label} ({stage.count})
        </div>
      ))}
    </div>
  );
}