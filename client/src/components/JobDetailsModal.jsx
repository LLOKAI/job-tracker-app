import JobStatusBadge from "./JobStatusBadge";
import JobTags from "./JobTags";
import JobEditDeleteButtons from "./JobEditDeleteButtons";

function JobDetailsModal({ job, darkMode, onClose, onDelete }) {
  if (!job) return null;
  return (
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
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: darkMode ? "#23263a" : "#fff",
          color: darkMode ? "#f8fafc" : "#222",
          padding: "2.5rem 2rem",
          borderRadius: 16,
          boxShadow: "0 2px 24px rgba(0,0,0,0.22)",
          minWidth: 340,
          maxWidth: 420,
          width: "90vw",
          textAlign: "left",
          position: "relative",
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "transparent",
            border: "none",
            color: darkMode ? "#f8fafc" : "#222",
            fontSize: 22,
            cursor: "pointer",
          }}
          aria-label="Close"
        >
          ×
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
            gap: 12,
          }}
        >
          <h2 style={{ margin: 0 }}>{job.position}</h2>
          <JobStatusBadge status={job.status} />
        </div>
        <div style={{ fontWeight: 500, marginBottom: 8 }}>{job.company}</div>
        <div style={{ color: "#64748b", marginBottom: 8 }}>
          <b>Location:</b> {job.location}
        </div>
        {job.appliedDate && (
          <div style={{ color: "#64748b", marginBottom: 8 }}>
            <b>Applied:</b> {new Date(job.appliedDate).toLocaleDateString()}
          </div>
        )}
        <JobTags tags={job.tags} darkMode={darkMode} />
        {job.notes && (
          <div style={{ marginBottom: 8 }}>
            <b>Notes:</b> {job.notes}
          </div>
        )}
        {job.url && (
          <div style={{ marginBottom: 8 }}>
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--button-bg)",
                textDecoration: "underline",
                fontSize: "1rem",
              }}
            >
              Job Posting
            </a>
          </div>
        )}
        <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
          <JobEditDeleteButtons
            jobId={job.id}
            onEdit={() => {}}
            onDelete={() => {
              onDelete(job.id);
              onClose();
            }}
            colorEdit="var(--button-bg)"
            colorDelete="#ef4444"
            fontSize={28}
          />
        </div>
      </div>
    </div>
  );
}

export default JobDetailsModal;