import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const statusColors = {
  APPLIED: { bg: "#DBEAFE", text: "#1E40AF" },     // light blue bg, darker blue text
  INTERVIEW: { bg: "#FEF3C7", text: "#92400E" },   // light yellow bg, darker yellow text
  REJECTED: { bg: "#FEE2E2", text: "#991B1B" },    // light red bg, darker red text
  OFFER: { bg: "#DCFCE7", text: "#166534" },       // light green bg, darker green text
};


const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/jobs");
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        setJobs(data.data || []); // Adjust if your backend nests jobs under data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <div>Loading jobs...</div>;
  if (error) return <div>Error loading jobs: {error}</div>;
  if (jobs.length === 0) return <div>No jobs found.</div>;

  return (
    <div>
      <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>Job Applications</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {jobs.map((job) => (
          <li
            key={job.id}
            style={{
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              padding: "1rem",
              marginBottom: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong style={{ fontSize: "1.1rem" }}>{job.position}</strong> at {job.company}
              <div style={{ color: "#555", marginTop: "0.3rem" }}>{job.location}</div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span
                style={{
                  padding: "0.3rem 0.8rem",
                  borderRadius: "12px",
                  fontWeight: "600",
                  fontSize: "0.85rem",
                  color: statusColors[job.status]?.text || "#333",
                  backgroundColor: statusColors[job.status]?.bg || "#eee",
                  whiteSpace: "nowrap",
                }}
              >
                {job.status}
              </span>


              {/* Add Edit Link here */}
              <Link
                to={`/jobs/${job.id}/edit`}
                style={{
                  display: 'inline-block',
                  padding: '0.4rem 0.8rem',
                  backgroundColor: '#3b82f6',
                  color: '#fff',
                  fontWeight: '600',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2563eb'} // a bit darker on hover
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#3b82f6'}
              >
                Edit
              </Link>

            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobList;
