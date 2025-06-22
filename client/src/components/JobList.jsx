import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../ThemeContext"; // Add this import

const statusColors = {
  APPLIED: { bg: 'var(--status-bg-applied)', text: 'var(--status-text-applied)' },
  INTERVIEW: { bg: 'var(--status-bg-interview)', text: 'var(--status-text-interview)' },
  REJECTED: { bg: 'var(--status-bg-rejected)', text: 'var(--status-text-rejected)' },
  OFFER: { bg: 'var(--status-bg-offer)', text: 'var(--status-text-offer)' },
};

const sortOptions = [
  { value: "date", label: "Date" },
  { value: "company", label: "Company" },
  { value: "status", label: "Status" },
];

const sortToApi = {
  date: "appliedDate_desc",
  company: "company_asc",
  status: "status_asc",
};

const getSelectStyle = (darkMode) => ({
  padding: "0.6rem 0.8rem",
  borderRadius: "6px",
  border: darkMode ? "1px solid #475569" : "1px solid #cbd5e1",
  fontSize: "1rem",
  fontFamily: "inherit",
  backgroundColor: darkMode ? "#334155" : "#ffffff",
  color: darkMode ? "#f8fafc" : "#222222",
});

const JobList = () => {
  const { darkMode } = useContext(ThemeContext); // Use ThemeContext
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState(() => localStorage.getItem('settings_defaultSort') || 'date');

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/api/jobs?sort=${sortToApi[sort]}`);
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
  }, [sort]);

  const handleSortChange = (e) => {
    setSort(e.target.value);
    // Do NOT update localStorage here!
  };

  if (loading) return <div>Loading jobs...</div>;
  if (error) return <div>Error loading jobs: {error}</div>;
  if (jobs.length === 0) return <div>No jobs found.</div>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Job Applications</h2>
        <select
          value={sort}
          onChange={handleSortChange}
          style={getSelectStyle(darkMode)}
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
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
