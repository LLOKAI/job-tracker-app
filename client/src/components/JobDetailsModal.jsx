import React, { useState, useEffect } from "react";
import JobStatusBadge from "./JobStatusBadge";
import JobTags from "./JobTags";
import JobEditDeleteButtons from "./JobEditDeleteButtons";

function getInputStyle() {
  return {
    padding: "0.6rem 0.8rem",
    borderRadius: "var(--radius-md)",
    border: "1px solid var(--input-border)",
    fontSize: "1rem",
    fontFamily: "inherit",
    backgroundColor: "var(--input-bg)",
    color: "var(--input-text)",
    marginBottom: 8,
    width: "100%",
  };
}

function JobDetailsModal({
  job,
  darkMode,
  onClose,
  onDelete,
  editable = false,
  onSave,
}) {
  const [isEditing, setIsEditing] = useState(editable);
  const [formData, setFormData] = useState(job || {});

  useEffect(() => {
    setFormData(job || {});
    setIsEditing(editable);
  }, [job, editable]);

  if (!job) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagsChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
    }));
  };

  const handleSave = async () => {
    // Call onSave with updated job data
    if (onSave) {
      await onSave(formData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(job);
    setIsEditing(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.38)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--card-bg)",
          color: "var(--text-color)",
          padding: "2rem 3rem 2rem 2rem",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--card-shadow-hover)",
          minWidth: 360,
          maxWidth: 520,
          width: "90vw",
          textAlign: "left",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            fontSize: 22,
            cursor: "pointer",
          }}
          aria-label="Close"
        >
          X
        </button>
        {/* Modal header: title, edit/delete, status badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
            gap: 12,
          }}
        >
          {isEditing ? (
            <input
              name="position"
              value={formData.position || ""}
              onChange={handleChange}
              style={{
                ...getInputStyle(darkMode),
                fontWeight: 700,
                fontSize: "1.2rem",
                margin: 0,
              }}
              placeholder="Position"
              autoFocus
            />
          ) : (
            <h2 style={{ margin: 0, flex: 1 }}>{job.position}</h2>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {!isEditing && (
              <JobEditDeleteButtons
                jobId={job.id}
                onEdit={(e) => {
                  e.preventDefault();
                  setIsEditing(true);
                }}
                onDelete={() => {
                  onDelete(job.id);
                  onClose();
                }}
                colorEdit="var(--button-bg)"
                colorDelete="#ef4444"
                fontSize={28}
              />
            )}
            <JobStatusBadge status={isEditing ? formData.status : job.status} />
          </div>
        </div>
        <div style={{ fontWeight: 500, marginBottom: 8 }}>
          {isEditing ? (
            <input
              name="company"
              value={formData.company || ""}
              onChange={handleChange}
              style={getInputStyle(darkMode)}
              placeholder="Company"
            />
          ) : (
            job.company
          )}
        </div>
        <div style={{ color: "var(--text-muted)", marginBottom: 8 }}>
          <b>Location:</b>{" "}
          {isEditing ? (
            <input
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              style={getInputStyle(darkMode)}
              placeholder="Location"
            />
          ) : (
            job.location
          )}
        </div>
        {job.appliedDate && (
          <div style={{ color: "var(--text-muted)", marginBottom: 8 }}>
            <b>Applied:</b>{" "}
            {isEditing ? (
              <input
                type="date"
                name="appliedDate"
                value={
                  formData.appliedDate
                    ? formData.appliedDate.slice(0, 10)
                    : ""
                }
                onChange={handleChange}
                style={getInputStyle(darkMode)}
              />
            ) : (
              new Date(job.appliedDate).toLocaleDateString()
            )}
          </div>
        )}
        <div style={{ marginBottom: 8 }}>
          <b>Tags:</b>{" "}
          {isEditing ? (
            <input
              name="tags"
              value={formData.tags ? formData.tags.join(", ") : ""}
              onChange={handleTagsChange}
              style={getInputStyle(darkMode)}
              placeholder="tag1, tag2"
            />
          ) : (
            <JobTags tags={job.tags} darkMode={darkMode} />
          )}
        </div>
        <div style={{ marginBottom: 8 }}>
          <b>Notes:</b>{" "}
          {isEditing ? (
            <textarea
              name="notes"
              value={formData.notes || ""}
              onChange={handleChange}
              rows={3}
              style={{ ...getInputStyle(darkMode), resize: "vertical" }}
              placeholder="Notes"
            />
          ) : (
            job.notes
          )}
        </div>
        <div style={{ marginBottom: 8 }}>
          <b>Status:</b>{" "}
          {isEditing ? (
            <select
              name="status"
              value={formData.status || "APPLIED"}
              onChange={handleChange}
              style={getInputStyle(darkMode)}
            >
              <option value="APPLIED">Applied</option>
              <option value="INTERVIEW">Interview</option>
              <option value="REJECTED">Rejected</option>
              <option value="OFFER">Offer</option>
            </select>
          ) : (
            job.status
          )}
        </div>
        <div style={{ marginBottom: 8 }}>
          <b>Job Posting:</b>{" "}
          {isEditing ? (
            <input
              name="url"
              value={formData.url || ""}
              onChange={handleChange}
              style={getInputStyle(darkMode)}
              placeholder="Job URL"
            />
          ) : job.url ? (
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
          ) : (
            <span style={{ color: "#888" }}>N/A</span>
          )}
        </div>
        {isEditing && (
          <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
            <button className="btn" onClick={handleSave}>
              Save
            </button>
            <button className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobDetailsModal;
