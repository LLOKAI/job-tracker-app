import React, { useEffect, useState, useContext, useRef, useCallback } from "react";
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
  const [editingJob, setEditingJob] = useState(null); // NEW

  // Infinite scroll state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // Reset jobs when sort/search changes
  useEffect(() => {
    setJobs([]);
    setPage(1);
    setHasMore(true);
  }, [sort, search]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("sort", sortToApi[sort]);
        params.append("page", page);
        params.append("limit", 20); // Adjust page size as needed
        if (search) params.append("q", search);
        const res = await fetch(
          `http://localhost:3000/api/jobs?${params.toString()}`
        );
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        setJobs(prev => page === 1 ? (data.data || []) : [...prev, ...(data.data || [])]);
        setHasMore(data.data && data.data.length > 0 && page < data.meta.pages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [sort, search, page]);

  // Infinite scroll observer
  const lastJobRef = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

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

  // --- Add this function for saving edits ---
  const handleSaveJob = async (updatedJob) => {
    try {
      const res = await fetch(`http://localhost:3000/api/jobs/${updatedJob.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updatedJob,
          tags: Array.isArray(updatedJob.tags)
            ? updatedJob.tags
            : (updatedJob.tags || "").split(",").map(t => t.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error("Failed to update job");
      const savedJob = await res.json();
      setJobs((prev) =>
        prev.map((j) => (j.id === savedJob.id ? savedJob : j))
      );
      setEditingJob(null);
      setSelectedJob(savedJob); // Optionally show updated job
    } catch (err) {
      alert("Failed to save job changes.");
    }
  };

  return (
    <div>
      {/* Header Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "0.3rem",
          justifyContent: "flex-start",
          flexWrap: "wrap",
        }}
        className="joblist-header-row"
      >
        <h2 style={{ fontSize: "var(--font-size-base)", margin: 0 }}>
          Job Applications
        </h2>
      </div>
      {/* Controls Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
        className="joblist-controls-row"
      >
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
              width: 250,
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
      {/* Main Content */}
      {error && (
        <div style={{ color: "#b91c1c", marginBottom: "1rem" }}>
          Error loading jobs: {error}
        </div>
      )}
      {jobs.length === 0 && !loading ? (
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
          {jobs.map((job, idx) => (
            <JobCompactCard
              key={job.id}
              job={job}
              onSelect={e => {
                if (e.target.tagName === "A" || e.target.tagName === "BUTTON") return;
                setSelectedJob(job);
              }}
              onDelete={setDeleteJobId}
              onEdit={e => {
                e.stopPropagation();
                setEditingJob(job);
              }}
              ref={idx === jobs.length - 1 ? lastJobRef : undefined}
            />
          ))}
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {jobs.map((job, idx) => (
            <JobRowCard
              key={job.id}
              job={job}
              darkMode={darkMode}
              onSelect={e => {
                if (e.target.tagName === "A" || e.target.tagName === "BUTTON") return;
                setSelectedJob(job);
              }}
              onDelete={setDeleteJobId}
              onEdit={e => {
                e.stopPropagation();
                setEditingJob(job);
              }}
              ref={idx === jobs.length - 1 ? lastJobRef : undefined}
            />
          ))}
        </ul>
      )}
      {/* Show loading spinner/message at the bottom */}
      {loading && (
        <div style={{ textAlign: "center", margin: "1rem" }}>Loading...</div>
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
        onEdit={() => setEditingJob(selectedJob)} // NEW: open modal in edit mode
      />
      <JobDetailsModal
        job={editingJob}
        darkMode={darkMode}
        onClose={() => setEditingJob(null)}
        onDelete={setDeleteJobId}
        editable // NEW: open in editable mode
        onSave={handleSaveJob} // <-- Pass the handler here
      />
    </div>
  );
};

export default JobList;
