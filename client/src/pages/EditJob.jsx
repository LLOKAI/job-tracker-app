import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext); // Add this line

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    url: "",
    notes: "",
    tags: "",
    status: "APPLIED",
    appliedDate: "",
    followUpDate: "",
    reminderDone: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`http://localhost:3000/api/jobs/${id}`);
        if (!res.ok) throw new Error(`Error fetching job: ${res.status}`);
        const data = await res.json();
        setFormData({
          company: data.company || "",
          position: data.position || "",
          location: data.location || "",
          url: data.url || "",
          notes: data.notes || "",
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
          status: data.status || "APPLIED",
          appliedDate: data.appliedDate ? data.appliedDate.slice(0, 10) : "",
          followUpDate: data.followUpDate ? data.followUpDate.slice(0, 10) : "",
          reminderDone: Boolean(data.reminderDone),
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      const payload = {
        ...formData,
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
          : [],
        followUpDate: formData.followUpDate || "",
        reminderDone: Boolean(formData.reminderDone),
      };

      const res = await fetch(`http://localhost:3000/api/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update job");
      navigate("/dashboard");
    } catch (err) {
      setSubmitError("Could not update job. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading job data...</div>;
  if (error) return <div style={{ color: darkMode ? "#f87171" : "#b91c1c" }}>Error: {error}</div>;

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div style={getFormContainerStyle(darkMode)}>
      <div className="page-header">
        <div>
          <p className="page-kicker">Opportunity details</p>
          <h1 className="page-title">Edit Job</h1>
          <p className="page-subtitle">Keep this role accurate as the process changes.</p>
        </div>
      </div>
      <div className="surface-card form-card">
      {submitError && <p style={{ color: darkMode ? "#f87171" : "#b91c1c", marginBottom: "1rem" }}>{submitError}</p>}
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
        <input
          type="date"
          name="followUpDate"
          value={formData.followUpDate}
          onChange={handleChange}
          style={getInputStyle(darkMode)}
          aria-label="Follow-up date"
        />
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            name="reminderDone"
            checked={formData.reminderDone}
            onChange={(e) => setFormData((prev) => ({ ...prev, reminderDone: e.target.checked }))}
          />
          Mark reminder complete
        </label>

        <button className="btn" type="submit" disabled={submitting} style={getButtonStyle(submitting, darkMode)}>
          {submitting ? "Saving..." : "Save"}
        </button>
      </form>
      </div>
    </div>
  );
}
