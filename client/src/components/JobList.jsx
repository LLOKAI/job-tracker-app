import React, { useEffect, useState, useContext, useRef, useCallback } from "react";
import { ThemeContext } from "../contexts";
import { MdClose, MdSearch, MdWorkOutline } from "react-icons/md";

import JobRowCard from "./JobRowCard";
import JobCompactCard from "./JobCompactCard";
import DeleteJobModal from "./DeleteJobModal";
import JobDetailsModal from "./JobDetailsModal";

const sortOptions = [
  { value: "date_desc", label: "Date (Newest to Oldest)" },
  { value: "date_asc", label: "Date (Oldest to Newest)" },
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
  const [editingJob, setEditingJob] = useState(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  useEffect(() => {
    setJobs([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [sort, search]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("sort", sortToApi[sort]);
        params.append("page", page);
        params.append("limit", 20);
        if (search) params.append("q", search);

        const res = await fetch(
          `http://localhost:3000/api/jobs?${params.toString()}`,
          { signal: controller.signal }
        );
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        setJobs((prev) => page === 1 ? (data.data || []) : [...prev, ...(data.data || [])]);
        setHasMore(data.data && data.data.length > 0 && page < data.meta.pages);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchJobs();
    return () => controller.abort();
  }, [sort, search, page]);

  const lastJobRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

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
      setJobs((currentJobs) => currentJobs.filter((job) => job.id !== id));
      setDeleteJobId(null);
    } catch {
      alert("Failed to delete job.");
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveJob = async (updatedJob) => {
    try {
      const res = await fetch(`http://localhost:3000/api/jobs/${updatedJob.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updatedJob,
          tags: Array.isArray(updatedJob.tags)
            ? updatedJob.tags
            : (updatedJob.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error("Failed to update job");
      const savedJob = await res.json();
      setJobs((prev) => prev.map((job) => (job.id === savedJob.id ? savedJob : job)));
      setEditingJob(null);
      setSelectedJob(savedJob);
    } catch {
      alert("Failed to save job changes.");
    }
  };

  const showEmpty = jobs.length === 0 && !loading;

  return (
    <div>
      <div
        className="surface-card joblist-controls-row"
        style={{
          marginBottom: "1rem",
          padding: 16,
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 220 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              display: "grid",
              placeItems: "center",
              background: "var(--accent-soft)",
              color: "var(--accent)",
            }}
          >
            <MdWorkOutline size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: "1rem", margin: 0 }}>Job Applications</h2>
            <div style={{ color: "var(--text-muted)", fontSize: "0.86rem" }}>
              {search ? `Filtered by "${search}"` : "Sorted and searchable"}
            </div>
          </div>
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="select"
          style={{ maxWidth: 240 }}
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <form
          onSubmit={handleSearchSubmit}
          style={{ display: "flex", alignItems: "center", gap: 8, flex: "1 1 300px", maxWidth: 450 }}
        >
          <div style={{ position: "relative", flex: 1 }}>
            <MdSearch
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="Search company, role, or tag"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="input"
              style={{ paddingLeft: 38 }}
            />
          </div>
          {searchInput && (
            <button className="icon-btn" type="button" onClick={handleSearchClear} title="Clear">
              <MdClose />
            </button>
          )}
          <button className="btn" type="submit">
            Search
          </button>
        </form>
      </div>

      {error && (
        <div className="surface-card" style={{ color: "var(--error-color)", marginBottom: "1rem" }}>
          Error loading jobs: {error}
        </div>
      )}

      {showEmpty ? (
        <div className="empty-state">
          {search ? (
            <>
              No results found.
              <button className="btn btn-secondary" type="button" onClick={handleSearchClear} style={{ marginLeft: 12 }}>
                Clear Search
              </button>
            </>
          ) : (
            "No jobs found. Add your first opportunity to start building the pipeline."
          )}
        </div>
      ) : compactMode ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1rem",
          }}
        >
          {jobs.map((job, idx) => (
            <JobCompactCard
              key={job.id}
              job={job}
              onSelect={(e) => {
                if (e.target.tagName === "A" || e.target.tagName === "BUTTON") return;
                setSelectedJob(job);
              }}
              onDelete={setDeleteJobId}
              onEdit={(e) => {
                e.stopPropagation();
                setEditingJob(job);
              }}
              ref={idx === jobs.length - 1 ? lastJobRef : undefined}
            />
          ))}
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {jobs.map((job, idx) => (
            <JobRowCard
              key={job.id}
              job={job}
              darkMode={darkMode}
              onSelect={(e) => {
                if (e.target.tagName === "A" || e.target.tagName === "BUTTON") return;
                setSelectedJob(job);
              }}
              onDelete={setDeleteJobId}
              onEdit={(e) => {
                e.stopPropagation();
                setEditingJob(job);
              }}
              ref={idx === jobs.length - 1 ? lastJobRef : undefined}
            />
          ))}
        </ul>
      )}

      {loading && (
        <div style={{ textAlign: "center", margin: "1rem", color: "var(--text-muted)" }}>
          Loading...
        </div>
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
      <JobDetailsModal
        job={editingJob}
        darkMode={darkMode}
        onClose={() => setEditingJob(null)}
        onDelete={setDeleteJobId}
        editable
        onSave={handleSaveJob}
      />
    </div>
  );
};

export default JobList;
