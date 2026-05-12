import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../contexts";

const getFormContainerStyle = () => ({
  maxWidth: "600px",
  margin: "0 auto",
});

const getInputStyle = () => ({
  padding: "0.6rem 0.8rem",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--input-border)",
  fontSize: "1rem",
  fontFamily: "inherit",
  backgroundColor: "var(--input-bg)",
  color: "var(--input-text)",
});

const getButtonStyle = (submitting, darkMode) => ({
  backgroundColor: submitting 
    ? (darkMode ? "#1e40af" : "#93c5fd")
    : "#3b82f6",
  cursor: submitting ? "not-allowed" : "pointer",
});

export default function NewJob() {
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  // Get defaults from localStorage
  const defaultStatus = localStorage.getItem('settings_defaultStatus') || 'APPLIED';
  const today = new Date().toISOString().slice(0, 10);

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    url: "",
    notes: "",
    tags: "",
    status: defaultStatus,
    appliedDate: today,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    // Prepare tags as array, trim whitespace, filter empty
    const tagsArray = formData.tags
      ? formData.tags.split(",").map(t => t.trim()).filter(Boolean)
      : [];

    const payload = {
      ...formData,
      tags: tagsArray,
      appliedDate: formData.appliedDate || today,
    };

    try {
      const res = await fetch("http://localhost:3000/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create job");
      navigate("/dashboard");
    } catch (err) {
      setError("Could not submit job. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={getFormContainerStyle(darkMode)}>
      <div className="page-header">
        <div>
          <p className="page-kicker">New opportunity</p>
          <h1 className="page-title">Add New Job</h1>
          <p className="page-subtitle">Capture the essentials now; refine the details as the role moves forward.</p>
        </div>
      </div>
      <div className="surface-card form-card">
      {error && <p style={{ color: darkMode ? "#f87171" : "#b91c1c", marginBottom: "1rem" }}>{error}</p>}
      <form onSubmit={handleSubmit} className="form-grid">
        <input
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
          required
          style={getInputStyle(darkMode)}
        />
        <input
          name="position"
          placeholder="Position"
          value={formData.position}
          onChange={handleChange}
          required
          style={getInputStyle(darkMode)}
        />
        <input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
          style={getInputStyle(darkMode)}
        />
        <input
          name="url"
          placeholder="Job URL"
          value={formData.url}
          onChange={handleChange}
          style={getInputStyle(darkMode)}
        />
        <textarea
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          style={{ ...getInputStyle(darkMode), resize: "vertical" }}
        />
        <input
          name="tags"
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={handleChange}
          style={getInputStyle(darkMode)}
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          style={getInputStyle(darkMode)}
        >
          <option value="APPLIED">Applied</option>
          <option value="INTERVIEW">Interview</option>
          <option value="REJECTED">Rejected</option>
          <option value="OFFER">Offer</option>
        </select>
        <input
          type="date"
          name="appliedDate"
          value={formData.appliedDate}
          onChange={handleChange}
          style={getInputStyle(darkMode)}
          max={today}
        />
        <button className="btn" type="submit" disabled={submitting} style={getButtonStyle(submitting, darkMode)}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      </div>
    </div>
  );
}
