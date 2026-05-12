import React from "react";
import JobTags from "./JobTags";
import JobStatusBadge from "./JobStatusBadge";
import JobEditDeleteButtons from "./JobEditDeleteButtons";

const JobRowCard = React.forwardRef(function JobRowCard(
  { job, darkMode, onSelect, onDelete, onEdit }, // add onEdit
  ref
) {
  return (
    <li
      key={job.id}
      ref={ref}
      onClick={onSelect}
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--card-shadow)",
        padding: "1.05rem 1.1rem",
        marginBottom: "0.9rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "1.5rem",
        cursor: "pointer",
        transition: "box-shadow 0.18s, transform 0.18s, border-color 0.18s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = "var(--card-shadow-hover)";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = "var(--border-strong)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "var(--card-shadow)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "var(--border-color)";
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <strong style={{ fontSize: "calc(var(--font-size-base) * 1.1)" }}>
            {job.position}
          </strong>
          <span
            style={{
              color: "var(--text-muted)",
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
            color: "var(--text-muted)",
          }}
        >
          {job.location}
          {job.appliedDate && (
            <span style={{ marginLeft: 16 }}>
              <b>Applied:</b> {new Date(job.appliedDate).toLocaleDateString()}
            </span>
          )}
        </div>
        <JobTags tags={job.tags} darkMode={darkMode} />
        {job.notes && (
          <div
            style={{
              marginTop: 4,
              fontSize: "calc(var(--font-size-base) * 0.9)",
              color: "var(--text-muted)",
            }}
          >
            <span style={{ fontWeight: 500 }}>Notes:</span>{" "}
            {job.notes.length > 60 ? job.notes.slice(0, 60) + "..." : job.notes}
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
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <JobStatusBadge status={job.status} />
        <JobEditDeleteButtons
          jobId={job.id}
          onEdit={onEdit}
          onDelete={e => {
            e.stopPropagation();
            onDelete(job.id);
          }}
        />
      </div>
    </li>
  );
});

export default JobRowCard;
