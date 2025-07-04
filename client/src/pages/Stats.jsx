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

  // Simple pipeline: Applied → Interview → Offer/Rejected
  const pipeline = [
    { label: "Applied", count: byStatus.APPLIED || 0 },
    { label: "Interview", count: byStatus.INTERVIEW || 0 },
    { label: "Offer", count: byStatus.OFFER || 0 },
    { label: "Rejected", count: byStatus.REJECTED || 0 },
  ];

  return (
    <div style={{
      maxWidth: 700,
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

          {/* More stats can go here, e.g. top companies, most common positions */}
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