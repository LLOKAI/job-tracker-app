import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const statusColors = {
  APPLIED: { bg: 'var(--status-bg-applied)', text: 'var(--status-text-applied)' },
  INTERVIEW: { bg: 'var(--status-bg-interview)', text: 'var(--status-text-interview)' },
  REJECTED: { bg: 'var(--status-bg-rejected)', text: 'var(--status-text-rejected)' },
  OFFER: { bg: 'var(--status-bg-offer)', text: 'var(--status-text-offer)' },
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
        setJobs(data.data || []);
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
              background: 'var(--card-bg)',
              borderRadius: "8px",
              boxShadow: `0 2px 8px var(--card-shadow)`,
              padding: "1rem",
              marginBottom: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong style={{ fontSize: "1.1rem" }}>{job.position}</strong> at {job.company}
              <div style={{ fontSize: "0.9rem", marginTop: "0.3rem" }}>
                {job.location}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span
                style={{
                  backgroundColor: statusColors[job.status]?.bg || 'gray',
                  color: statusColors[job.status]?.text || '#fff',
                  padding: "0.25rem 0.75rem",
                  borderRadius: "12px",
                  fontWeight: "600",
                  fontSize: "0.85rem",
                  textTransform: "capitalize",
                }}
              >
                {job.status}
              </span>
              <Link
                to={`/jobs/${job.id}/edit`}
                style={{
                  backgroundColor: 'var(--button-bg)',
                  color: 'var(--button-text)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  border: '1px solid transparent',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--button-text)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
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
