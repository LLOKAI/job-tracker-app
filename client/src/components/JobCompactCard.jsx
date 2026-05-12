import React from "react";
import JobStatusBadge from "./JobStatusBadge";
import JobEditDeleteButtons from "./JobEditDeleteButtons";

const JobCompactCard = React.forwardRef(function JobCompactCard(
  { job, onSelect, onDelete, onEdit }, // add onEdit
  ref
) {
  return (
    <div
      key={job.id}
      ref={ref}
      onClick={onSelect}
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--card-shadow)",
        padding: "1.05rem",
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        minHeight: "120px",
        justifyContent: "space-between",
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
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontWeight: 600,
            fontSize: "var(--font-size-base)",
            marginBottom: 4,
            textAlign: "center",
          }}
        >
          {job.position}
        </div>
        <div
          style={{
            fontSize: "calc(var(--font-size-base) * 0.95)",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          {job.company}
        </div>
        <JobStatusBadge status={job.status} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: "0.7rem",
          minWidth: 40,
        }}
      >
        <JobEditDeleteButtons
          jobId={job.id}
          onEdit={onEdit}
          onDelete={e => {
            e.stopPropagation();
            onDelete(job.id);
          }}
        />
      </div>
    </div>
  );
});

export default JobCompactCard;
