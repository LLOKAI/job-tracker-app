import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../ThemeContext";
import { MdViewModule, MdViewList, MdEdit, MdDelete } from "react-icons/md";

import JobRowCard from "./JobRowCard";
import JobCompactCard from "./JobCompactCard";
import JobTags from "./JobTags";
import JobStatusBadge from "./JobStatusBadge";
import JobEditDeleteButtons from "./JobEditDeleteButtons";
import DeleteJobModal from "./DeleteJobModal";
import JobDetailsModal from "./JobDetailsModal";

const sortOptions = [
  { value: "date_desc", label: "Date (Newest → Oldest)" },
  { value: "date_asc", label: "Date (Oldest → Newest)" },
  { value: "company_asc", label: "Company (A-Z)" },
  { value: "company_desc", label: "Company (Z-A)" },
  { value: "position_asc", label: "Position (A-Z)" },
  { value: "position_desc", label: "Position (Z-A)" },
  { value: "status_asc", label: "Status (A-Z)" },
  { value: "status_desc", label: "Status (Z-A)" },
];

const sortToApi = {
  date_desc: "appliedDate_desc",
  date_asc: "appliedDate_asc",
  company_asc: "company_asc",
  company_desc: "company_desc",
  position_asc: "position_asc",
  position_desc: "position_desc",
  status_asc: "status_asc",
  status_desc: "status_desc",
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

// --- Main JobList Component ---

const JobList = ({ compactMode }) => {
  const { darkMode } = useContext(ThemeContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState(() => {
    const stored = localStorage.getItem("settings_defaultSort");
    if (stored === "date") return "date_desc";
    if (stored === "company") return "company_asc";
    if (stored === "status") return "status_asc";
    return stored || "date_desc";
  });
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [deleteJobId, setDeleteJobId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("sort", sortToApi[sort]);
        if (search) params.append("q", search);
        const res = await fetch(
          `http://localhost:3000/api/jobs?${params.toString()}`
        );
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
  }, [sort, search]);

  const handleSortChange = (e) => setSort(e.target.value);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const handleSearchClear = () => {
    setSearchInput("");
    setSearch("");
  };

  const handleDeleteJob = async (id) => {
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:3000/api/jobs/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete job");
      setJobs((jobs) => jobs.filter((j) => j.id !== id));
      setDeleteJobId(null);
    } catch (err) {
      alert("Failed to delete job.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div>Loading jobs...</div>;
  if (error) return <div>Error loading jobs: {error}</div>;

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1rem",
          justifyContent: "flex-start",
          flexWrap: "wrap",
        }}
        className="joblist-controls-row"
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
          minWidth: 0,
        }}>
          <h2 style={{ fontSize: "var(--font-size-base)", margin: 0 }}>
            Job Applications
          </h2>
          <select
            value={sort}
            onChange={handleSortChange}
            style={getSelectStyle(darkMode)}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <form
            onSubmit={handleSearchSubmit}
            style={{ display: "flex", alignItems: "center", gap: 4 }}
          >
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{
                ...getSelectStyle(darkMode),
                width: 180,
                fontSize: "1rem",
                borderRadius: 6,
                border: darkMode ? "1px solid #475569" : "1px solid #cbd5e1",
              }}
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleSearchClear}
                style={{
                  background: "transparent",
                  border: "none",
                  color: darkMode ? "#f8fafc" : "#222",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  marginLeft: 2,
                }}
                title="Clear"
              >
                ×
              </button>
            )}
            <button
              type="submit"
              style={{
                background: "var(--button-bg)",
                color: "var(--button-text)",
                border: "none",
                borderRadius: "6px",
                padding: "0.4rem 0.8rem",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
                marginLeft: 2,
              }}
            >
              Search
            </button>
          </form>
        </div>
      </div>
      {/* Main Content */}
      {jobs.length === 0 ? (
        <div style={{ margin: "2rem 0", textAlign: "center", color: "#888" }}>
          {search ? (
            <>
              No results found.
              <button
                type="button"
                onClick={handleSearchClear}
                style={{
                  marginLeft: 12,
                  background: "var(--button-bg)",
                  color: "var(--button-text)",
                  border: "none",
                  borderRadius: 6,
                  padding: "0.3rem 0.8rem",
                  fontWeight: 600,
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
              >
                Clear Search
              </button>
            </>
          ) : (
            "No jobs found."
          )}
        </div>
      ) : compactMode ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
          }}
        >
          {jobs.map((job) => (
            <JobCompactCard
              key={job.id}
              job={job}
              onSelect={e => {
                if (e.target.tagName === "A" || e.target.tagName === "BUTTON") return;
                setSelectedJob(job);
              }}
              onDelete={setDeleteJobId}
            />
          ))}
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {jobs.map((job) => (
            <JobRowCard
              key={job.id}
              job={job}
              darkMode={darkMode}
              onSelect={e => {
                if (e.target.tagName === "A" || e.target.tagName === "BUTTON") return;
                setSelectedJob(job);
              }}
              onDelete={setDeleteJobId}
            />
          ))}
        </ul>
      )}
      <DeleteJobModal
        open={!!deleteJobId}
        onCancel={() => setDeleteJobId(null)}
        onDelete={() => handleDeleteJob(deleteJobId)}
        deleting={deleting}
      />
      <JobDetailsModal
        job={selectedJob}
        darkMode={darkMode}
        onClose={() => setSelectedJob(null)}
        onDelete={setDeleteJobId}
      />
    </div>
  );
};

export default JobList;
