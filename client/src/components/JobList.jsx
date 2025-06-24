import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../ThemeContext";
import { MdViewModule, MdViewList } from "react-icons/md";

const statusColors = {
  APPLIED: {
    bg: "var(--status-bg-applied)",
    text: "var(--status-text-applied)",
  },
  INTERVIEW: {
    bg: "var(--status-bg-interview)",
    text: "var(--status-text-interview)",
  },
  REJECTED: {
    bg: "var(--status-bg-rejected)",
    text: "var(--status-text-rejected)",
  },
  OFFER: { bg: "var(--status-bg-offer)", text: "var(--status-text-offer)" },
};

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

const JobList = ({ compactMode: initialCompactMode = false }) => {
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
  const [compactMode, setCompactMode] = useState(initialCompactMode);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [deleteJobId, setDeleteJobId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setCompactMode(initialCompactMode);
  }, [initialCompactMode]);

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

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const handleSearchClear = () => {
    setSearchInput("");
    setSearch("");
  };

  // Save compact mode preference to localStorage and update state
  const handleCompactToggle = (mode) => {
    setCompactMode(mode);
    localStorage.setItem("settings_compactMode", JSON.stringify(mode));
  };

  if (loading) return <div>Loading jobs...</div>;
  if (error) return <div>Error loading jobs: {error}</div>;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1rem",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
        <div style={{ display: "flex", gap: 4 }}>
          <button
            aria-label="Grid view"
            onClick={() => handleCompactToggle(true)}
            style={{
              background: compactMode ? "var(--button-bg)" : "transparent",
              color: compactMode
                ? "var(--button-text)"
                : darkMode
                ? "#f8fafc"
                : "#222",
              border: "none",
              borderRadius: "6px 0 0 6px",
              padding: "0.4rem 0.7rem",
              cursor: "pointer",
              fontSize: "1.4rem",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            <MdViewModule />
          </button>
          <button
            aria-label="List view"
            onClick={() => handleCompactToggle(false)}
            style={{
              background: !compactMode ? "var(--button-bg)" : "transparent",
              color: !compactMode
                ? "var(--button-text)"
                : darkMode
                ? "#f8fafc"
                : "#222",
              border: "none",
              borderRadius: "0 6px 6px 0",
              padding: "0.4rem 0.7rem",
              cursor: "pointer",
              fontSize: "1.4rem",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            <MdViewList />
          </button>
        </div>
      </div>
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
        // ...compact grid view...
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
          }}
        >
          {jobs.map((job) => (
            <div
              key={job.id}
              style={{
                background: "var(--card-bg)",
                borderRadius: "10px",
                boxShadow: `0 2px 8px var(--card-shadow)`,
                padding: "1rem",
                display: "flex",
                flexDirection: "row", // <-- horizontal split
                alignItems: "stretch",
                minHeight: "120px",
                justifyContent: "space-between",
                gap: "1.5rem",
              }}
            >
              {/* Left: Info */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center", // add this to center all children horizontally
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "var(--font-size-base)",
                    marginBottom: 4,
                    textAlign: "center", // center text
                  }}
                >
                  {job.position}
                </div>
                <div
                  style={{
                    fontSize: "calc(var(--font-size-base) * 0.95)",
                    marginBottom: 8,
                    textAlign: "center", // center text
                  }}
                >
                  {job.company}
                </div>
                <span
                  style={{
                    backgroundColor: statusColors[job.status]?.bg || "gray",
                    color: statusColors[job.status]?.text || "#fff",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "12px",
                    fontWeight: "600",
                    fontSize: "calc(var(--font-size-base) * 0.85)",
                    textTransform: "capitalize",
                    marginBottom: 8,
                    alignSelf: "center", // center the status badge
                  }}
                >
                  {job.status}
                </span>
              </div>
              {/* Right: Buttons */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-end",
                  gap: "0.7rem",
                  minWidth: 80,
                }}
              >
                <Link
                  to={`/jobs/${job.id}/edit`}
                  style={{
                    backgroundColor: "var(--button-bg)",
                    color: "var(--button-text)",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "6px",
                    textDecoration: "none",
                    fontWeight: "600",
                    fontSize: "var(--font-size-base)",
                    border: "none", // match Delete button
                    cursor: "pointer",
                    userSelect: "none",
                    width: "100%",
                    textAlign: "center",
                    boxSizing: "border-box", // ensure sizing is consistent
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.border = "1px solid var(--button-text)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.border = "none")
                  }
                >
                  Edit
                </Link>
                <button
                  style={{
                    backgroundColor: "#ef4444",
                    color: "#fff",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "6px",
                    border: "none",
                    fontWeight: "600",
                    fontSize: "var(--font-size-base)",
                    cursor: "pointer",
                    userSelect: "none",
                    width: "100%",
                  }}
                  onClick={() => setDeleteJobId(job.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // ...existing non-compact list view...
        <ul style={{ listStyle: "none", padding: 0 }}>
          {jobs.map((job) => (
            <li
              key={job.id}
              style={{
                background: "var(--card-bg)",
                borderRadius: "8px",
                boxShadow: `0 2px 8px var(--card-shadow)`,
                padding: "1rem",
                marginBottom: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "2rem",
              }}
            >
              {/* ...rest of non-compact job info... */}
              <div style={{ flex: 1 }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <strong
                    style={{ fontSize: "calc(var(--font-size-base) * 1.1)" }}
                  >
                    {job.position}
                  </strong>
                  <span
                    style={{
                      color: "#888",
                      fontSize: "calc(var(--font-size-base) * 0.95)",
                    }}
                  >
                    @ {job.company}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "calc(var(--font-size-base) * 0.9)",
                    marginTop: "0.3rem",
                    color: "#888",
                  }}
                >
                  {job.location}
                  {job.appliedDate && (
                    <span style={{ marginLeft: 16 }}>
                      <b>Applied:</b>{" "}
                      {new Date(job.appliedDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {job.tags && job.tags.length > 0 && (
                  <div style={{ marginTop: 4 }}>
                    <span style={{ fontWeight: 500 }}>Tags:</span>{" "}
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          background: darkMode ? "#334155" : "#e0e7ef",
                          color: darkMode ? "#bae6fd" : "#334155",
                          borderRadius: 6,
                          padding: "0.1rem 0.5rem",
                          marginRight: 4,
                          fontSize: "calc(var(--font-size-base) * 0.85)",
                          fontWeight: 500,
                          display: "inline-block",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {job.notes && (
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: "calc(var(--font-size-base) * 0.9)",
                      color: "#64748b",
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>Notes:</span>{" "}
                    {job.notes.length > 60
                      ? job.notes.slice(0, 60) + "..."
                      : job.notes}
                  </div>
                )}
                {job.url && (
                  <div style={{ marginTop: 4 }}>
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "var(--button-bg)",
                        textDecoration: "underline",
                        fontSize: "calc(var(--font-size-base) * 0.9)",
                      }}
                    >
                      Job Posting
                    </a>
                  </div>
                )}
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <span
                  style={{
                    backgroundColor: statusColors[job.status]?.bg || "gray",
                    color: statusColors[job.status]?.text || "#fff",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "12px",
                    fontWeight: "600",
                    fontSize: "calc(var(--font-size-base) * 0.85)",
                    textTransform: "capitalize",
                  }}
                >
                  {job.status}
                </span>
                <Link
                  to={`/jobs/${job.id}/edit`}
                  style={{
                    backgroundColor: "var(--button-bg)",
                    color: "var(--button-text)",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "6px",
                    textDecoration: "none",
                    fontWeight: "600",
                    fontSize: "var(--font-size-base)",
                    border: "1px solid transparent",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "var(--button-text)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "transparent")
                  }
                >
                  Edit
                </Link>
                <button
                  style={{
                    backgroundColor: "#ef4444",
                    color: "#fff",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "6px",
                    border: "none",
                    fontWeight: "600",
                    fontSize: "var(--font-size-base)",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                  onClick={() => setDeleteJobId(job.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {deleteJobId && (
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
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: darkMode ? "#23263a" : "#fff",
              color: darkMode ? "#f8fafc" : "#222",
              padding: "2rem",
              borderRadius: 12,
              boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
              minWidth: 320,
              textAlign: "center",
            }}
          >
            <h3 style={{ marginBottom: 16 }}>Delete Job?</h3>
            <p style={{ marginBottom: 24 }}>
              Are you sure you want to delete this job? This action cannot be
              undone.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
              <button
                onClick={() => setDeleteJobId(null)}
                style={{
                  padding: "0.5rem 1.2rem",
                  borderRadius: 6,
                  border: "none",
                  background: "#64748b",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setDeleting(true);
                  try {
                    const res = await fetch(
                      `http://localhost:3000/api/jobs/${deleteJobId}`,
                      { method: "DELETE" }
                    );
                    if (!res.ok) throw new Error("Failed to delete job");
                    setJobs((jobs) => jobs.filter((j) => j.id !== deleteJobId));
                    setDeleteJobId(null);
                  } catch (err) {
                    alert("Failed to delete job.");
                  } finally {
                    setDeleting(false);
                  }
                }}
                style={{
                  padding: "0.5rem 1.2rem",
                  borderRadius: 6,
                  border: "none",
                  background: "#ef4444",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobList;
