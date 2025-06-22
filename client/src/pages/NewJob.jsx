import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../ThemeContext";

const getFormContainerStyle = (darkMode) => ({
  background: darkMode ? "#1e293b" : "#ffffff",
  padding: "2rem",
  borderRadius: "8px",
  boxShadow: darkMode ? "0 2px 8px rgba(0, 0, 0, 0.7)" : "0 2px 8px rgba(0, 0, 0, 0.1)",
  maxWidth: "600px",
  margin: "2rem auto",
});

const getInputStyle = (darkMode) => ({
  padding: "0.6rem 0.8rem",
  borderRadius: "6px",
  border: darkMode ? "1px solid #475569" : "1px solid #cbd5e1",
  fontSize: "1rem",
  fontFamily: "inherit",
  backgroundColor: darkMode ? "#334155" : "#ffffff",
  color: darkMode ? "#f8fafc" : "#222222",
});

const getButtonStyle = (submitting, darkMode) => ({
  padding: "0.75rem 1rem",
  backgroundColor: submitting 
    ? (darkMode ? "#1e40af" : "#93c5fd")
    : "#3b82f6",
  color: "#ffffff",
  border: "none",
  borderRadius: "6px",
  cursor: submitting ? "not-allowed" : "pointer",
  fontWeight: "bold",
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
      <h1 style={{ marginBottom: "1rem" }}>Add New Job</h1>
      {error && <p style={{ color: darkMode ? "#f87171" : "#b91c1c", marginBottom: "1rem" }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
        <button type="submit" disabled={submitting} style={getButtonStyle(submitting, darkMode)}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}