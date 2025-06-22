import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const inputStyle = {
  padding: "0.6rem 0.8rem",
  borderRadius: "6px",
  border: "1px solid #cbd5e1",
  fontSize: "1rem",
  fontFamily: "inherit",
};

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    url: "",
    notes: "",
    status: "APPLIED",
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
          status: data.status || "APPLIED",
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
      const res = await fetch(`http://localhost:3000/api/jobs/${id}`, {
        method: "PUT", // or PATCH if API supports partial updates
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div
      style={{
        background: "#fff",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        maxWidth: "600px",
        margin: "2rem auto",
      }}
    >
      <h1 style={{ marginBottom: "1rem" }}>Edit Job</h1>
      {submitError && (
        <p style={{ color: "red", marginBottom: "1rem" }}>{submitError}</p>
      )}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <input
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          name="position"
          placeholder="Position"
          value={formData.position}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          name="url"
          placeholder="Job URL"
          value={formData.url}
          onChange={handleChange}
          style={inputStyle}
        />
        <textarea
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          style={{ ...inputStyle, resize: "vertical" }}
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="APPLIED">Applied</option>
          <option value="INTERVIEW">Interview</option>
          <option value="REJECTED">Rejected</option>
          <option value="OFFER">Offer</option>
        </select>

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: "0.75rem 1rem",
            background: submitting ? "#94a3b8" : "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: submitting ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          {submitting ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
