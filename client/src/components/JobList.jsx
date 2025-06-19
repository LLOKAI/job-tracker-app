import React, { useEffect, useState } from "react";

const statusColors = {
  APPLIED: "bg-blue-100 text-blue-800",
  INTERVIEW: "bg-yellow-100 text-yellow-800",
  REJECTED: "bg-red-100 text-red-800",
  OFFER: "bg-green-100 text-green-800",
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
      <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Job Applications</h2>
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
              <strong style={{ fontSize: '1.1rem' }}>{job.position}</strong>{" "}
              at {job.company}
              <div style={{ color: "#555", marginTop: '0.3rem' }}>{job.location}</div>
            </div>
            <span
              style={{
                padding: "0.3rem 0.8rem",
                borderRadius: "12px",
                fontWeight: "600",
                fontSize: "0.85rem",
                color: statusColors[job.status]?.split(" ")[1] || "#333",
                backgroundColor: statusColors[job.status]?.split(" ")[0] || "#eee",
                whiteSpace: "nowrap",
              }}
            >
              {job.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobList;
