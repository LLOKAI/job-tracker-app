import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { ResponsiveSankey } from "@nivo/sankey";

const statusLabels = {
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  REJECTED: "Rejected",
  OFFER: "Offer",
};
const statusOrder = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"];
const chartColors = ["#3b82f6", "#22c55e", "#facc15", "#ef4444"];

export default function Stats() {
  const { darkMode } = useContext(ThemeContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalChart, setModalChart] = useState(null);

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
  const appliedThisWeek = jobs.filter((j) => {
    const d = new Date(j.appliedDate);
    const now = new Date();
    const weekAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 7
    );
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
    .filter((j) => {
      const d = new Date(j.appliedDate);
      const now = new Date();
      const weekAgo = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 7
      );
      return d >= weekAgo;
    })
    .sort((a, b) => new Date(a.appliedDate) - new Date(b.appliedDate));

  // Prepare data for charts
  const chartData = statusOrder.map((status, i) => ({
    status: statusLabels[status],
    count: byStatus[status] || 0,
    color: chartColors[i],
  }));

  const pieData = chartData.map((d) => ({
    name: d.status,
    value: d.count,
    color: d.color,
  }));

  // Line chart: applications per day (last 14 days)
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().slice(0, 10);
  });
  const jobsByDay = days.map((date) => ({
    date,
    count: jobs.filter(
      (j) => j.appliedDate && j.appliedDate.slice(0, 10) === date
    ).length,
  }));

  // Modal chart rendering
  function renderModalChart() {
    if (!modalChart) return null;
    let content = null;
    if (modalChart === "bar") {
      content = (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" stroke={darkMode ? "#f8fafc" : "#222"} />
            <YAxis stroke={darkMode ? "#f8fafc" : "#222"} allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count">
              {chartData.map((entry, i) => (
                <Cell key={entry.status} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    } else if (modalChart === "pie") {
      content = (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              label
            >
              {pieData.map((entry, i) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      );
    } else if (modalChart === "line") {
      content = (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={jobsByDay}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke={darkMode ? "#f8fafc" : "#222"} />
            <YAxis stroke={darkMode ? "#f8fafc" : "#222"} allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    } else if (modalChart === "sankey") {
      // Sankey chart data preparation
      const sankeyData = {
        nodes: [
          { id: "Applied" },
          { id: "Interview" },
          { id: "Offer" },
          { id: "Rejected" },
        ],
        links: [
          {
            source: "Applied",
            target: "Interview",
            value: byStatus.INTERVIEW || 0,
          },
          {
            source: "Interview",
            target: "Offer",
            value: byStatus.OFFER || 0,
          },
          {
            source: "Interview",
            target: "Rejected",
            value: byStatus.REJECTED || 0,
          },
        ],
      };
      content = (
        <div style={{ height: 400 }}>
          <ResponsiveSankey
            data={sankeyData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            colors={chartColors}
            nodeOpacity={0.9}
            linkOpacity={0.6}
            enableLinkGradient={true}
            labelPosition="inside"
            nodeWidth={18}
            nodePadding={6}
            onClick={(node) => console.log(node)}
          />
        </div>
      );
    }
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000,
        }}
        onClick={() => setModalChart(null)}
      >
        <div
          style={{
            background: darkMode ? "#23263a" : "#fff",
            color: darkMode ? "#f8fafc" : "#222",
            padding: 32,
            borderRadius: 16,
            minWidth: 400,
            maxWidth: 700,
            width: "90vw",
            boxShadow: "0 2px 24px rgba(0,0,0,0.22)",
            position: "relative",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setModalChart(null)}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              background: "transparent",
              border: "none",
              color: darkMode ? "#f8fafc" : "#222",
              fontSize: 28,
              cursor: "pointer",
            }}
            aria-label="Close"
          >
            ×
          </button>
          {content}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "2rem 0",
        color: darkMode ? "#f8fafc" : "#222",
      }}
    >
      <h1 style={{ marginBottom: 24 }}>Job Application Stats</h1>
      {loading ? (
        <div>Loading stats...</div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              gap: 32,
              flexWrap: "wrap",
              marginBottom: 32,
              justifyContent: "center", // Center the cards horizontally
            }}
          >
            <StatCard label="Total Applications" value={total} />
            <StatCard label="Applied This Week" value={appliedThisWeek} />
            {statusOrder.map((status) => (
              <StatCard
                key={status}
                label={statusLabels[status]}
                value={byStatus[status] || 0}
              />
            ))}
          </div>

          <h2 style={{ marginTop: 32, marginBottom: 12 }}>Pipeline Overview</h2>
          <PipelineBar
            pipeline={[
              { label: "Applied", count: byStatus.APPLIED || 0 },
              { label: "Interview", count: byStatus.INTERVIEW || 0 },
              { label: "Offer", count: byStatus.OFFER || 0 },
              { label: "Rejected", count: byStatus.REJECTED || 0 },
            ]}
            darkMode={darkMode}
          />

          {/* Advanced charts row */}
          <div
            style={{
              display: "flex",
              gap: 32,
              flexWrap: "wrap",
              marginBottom: 32,
            }}
          >
            {/* Bar Chart */}
            <div
              style={{
                flex: 1,
                minWidth: 320,
                background: darkMode ? "#23263a" : "#e5e7eb",
                borderRadius: 12,
                padding: 16,
                cursor: "pointer",
                transition: "box-shadow 0.2s",
                boxShadow: "0 1px 6px rgba(0,0,0,0.10)",
              }}
              title="Click to expand"
              onClick={() => setModalChart("bar")}
            >
              <h3
                style={{
                  textAlign: "center",
                  margin: 0,
                  marginBottom: 8,
                }}
              >
                Status Bar Chart
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="status"
                    stroke={darkMode ? "#f8fafc" : "#222"}
                  />
                  <YAxis stroke={darkMode ? "#f8fafc" : "#222"} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count">
                    {chartData.map((entry, i) => (
                      <Cell key={entry.status} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Pie Chart */}
            <div
              style={{
                flex: 1,
                minWidth: 320,
                background: darkMode ? "#23263a" : "#e5e7eb",
                borderRadius: 12,
                padding: 16,
                cursor: "pointer",
                transition: "box-shadow 0.2s",
                boxShadow: "0 1px 6px rgba(0,0,0,0.10)",
              }}
              title="Click to expand"
              onClick={() => setModalChart("pie")}
            >
              <h3
                style={{
                  textAlign: "center",
                  margin: 0,
                  marginBottom: 8,
                }}
              >
                Status Pie Chart
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Line Chart */}
            <div
              style={{
                flex: 1,
                minWidth: 320,
                background: darkMode ? "#23263a" : "#e5e7eb",
                borderRadius: 12,
                padding: 16,
                cursor: "pointer",
                transition: "box-shadow 0.2s",
                boxShadow: "0 1px 6px rgba(0,0,0,0.10)",
              }}
              title="Click to expand"
              onClick={() => setModalChart("line")}
            >
              <h3
                style={{
                  textAlign: "center",
                  margin: 0,
                  marginBottom: 8,
                }}
              >
                Applications Per Day
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={jobsByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    stroke={darkMode ? "#f8fafc" : "#222"}
                  />
                  <YAxis stroke={darkMode ? "#f8fafc" : "#222"} allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {/* Sankey Chart */}
            <div
              style={{
                flex: 1,
                minWidth: 320,
                background: darkMode ? "#23263a" : "#e5e7eb",
                borderRadius: 12,
                padding: 16,
                cursor: "pointer",
                transition: "box-shadow 0.2s",
                boxShadow: "0 1px 6px rgba(0,0,0,0.10)",
              }}
              title="Click to expand"
              onClick={() => setModalChart("sankey")}
            >
              <h3
                style={{
                  textAlign: "center",
                  margin: 0,
                  marginBottom: 8,
                }}
              >
                Application Flow
              </h3>
              <div style={{ height: 220 }}>
                <ResponsiveSankey
                  data={{
                    nodes: [
                      { id: "Applied" },
                      { id: "Interview" },
                      { id: "Offer" },
                      { id: "Rejected" },
                    ],
                    links: [
                      {
                        source: "Applied",
                        target: "Interview",
                        value: byStatus.INTERVIEW || 0,
                      },
                      {
                        source: "Interview",
                        target: "Offer",
                        value: byStatus.OFFER || 0,
                      },
                      {
                        source: "Interview",
                        target: "Rejected",
                        value: byStatus.REJECTED || 0,
                      },
                    ],
                  }}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  colors={chartColors}
                  nodeOpacity={0.9}
                  linkOpacity={0.6}
                  enableLinkGradient={true}
                  labelPosition="inside"
                  nodeWidth={18}
                  nodePadding={6}
                  onClick={(node) => console.log(node)}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 32,
              flexWrap: "wrap",
              marginBottom: 32,
            }}
          >
            {/* Top Companies */}
            <div style={{ flex: 1, minWidth: 220 }}>
              <h3 style={{ marginBottom: 8 }}>Top Companies</h3>
              <ol style={{ margin: 0, paddingLeft: 20 }}>
                {topCompanies.length === 0 && (
                  <li style={{ color: "#888" }}>No data</li>
                )}
                {topCompanies.map(([company, count]) => (
                  <li key={company}>
                    <b>{company}</b>{" "}
                    <span style={{ color: "#64748b" }}>({count})</span>
                  </li>
                ))}
              </ol>
            </div>
            {/* Most Common Positions */}
            <div style={{ flex: 1, minWidth: 220 }}>
              <h3 style={{ marginBottom: 8 }}>Most Common Positions</h3>
              <ol style={{ margin: 0, paddingLeft: 20 }}>
                {topPositions.length === 0 && (
                  <li style={{ color: "#888" }}>No data</li>
                )}
                {topPositions.map(([position, count]) => (
                  <li key={position}>
                    <b>{position}</b>{" "}
                    <span style={{ color: "#64748b" }}>({count})</span>
                  </li>
                ))}
              </ol>
            </div>
            {/* Recent Activity */}
            <div style={{ flex: 1, minWidth: 220 }}>
              <h3 style={{ marginBottom: 8 }}>Recent Applications</h3>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {recentJobs.length === 0 && (
                  <li style={{ color: "#888" }}>No recent jobs</li>
                )}
                {recentJobs.map((job) => (
                  <li key={job.id}>
                    <b>{job.position}</b> at <b>{job.company}</b>
                    <span style={{ color: "#64748b" }}>
                      {" "}
                      ({new Date(job.appliedDate).toLocaleDateString()})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {renderModalChart()}
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div
      style={{
        background: "var(--card-bg)",
        borderRadius: 10,
        boxShadow: "0 2px 8px var(--card-shadow)",
        padding: "1.2rem 2rem",
        minWidth: 140,
        textAlign: "center",
        marginBottom: 12,
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 600 }}>{value}</div>
      <div style={{ color: "#64748b", fontSize: 15 }}>{label}</div>
    </div>
  );
}

function PipelineBar({ pipeline, darkMode }) {
  const total = pipeline.reduce((sum, s) => sum + s.count, 0) || 1;
  const colors = ["#3b82f6", "#22c55e", "#facc15", "#ef4444"];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 40,
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 1px 6px rgba(0,0,0,0.10)",
        background: darkMode ? "#23263a" : "#e5e7eb",
        marginBottom: 24,
      }}
    >
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
