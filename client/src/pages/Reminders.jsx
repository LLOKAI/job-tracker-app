import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import JobStatusBadge from "../components/JobStatusBadge";
import { buildJobPayload, getReminderLabel, getReminderState } from "../utils/reminders";

const tabs = [
  { key: "open", label: "Open" },
  { key: "overdue", label: "Overdue" },
  { key: "upcoming", label: "Upcoming" },
  { key: "done", label: "Completed" },
];

export default function Reminders() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("open");
  const [savingId, setSavingId] = useState(null);

  async function fetchJobs() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3000/api/jobs?limit=1000&sort=appliedDate_desc");
      if (!res.ok) throw new Error("Failed to fetch reminders");
      const data = await res.json();
      setJobs(data.data || []);
    } catch (err) {
      setError(err.message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  const reminderJobs = useMemo(
    () => jobs.filter((job) => Boolean(job.followUpDate)),
    [jobs]
  );

  const groups = useMemo(() => {
    const open = reminderJobs.filter((job) => {
      const state = getReminderState(job);
      return state === "overdue" || state === "today" || state === "upcoming";
    });

    return {
      open,
      overdue: reminderJobs.filter((job) => getReminderState(job) === "overdue"),
      upcoming: reminderJobs.filter((job) => ["today", "upcoming"].includes(getReminderState(job))),
      done: reminderJobs.filter((job) => getReminderState(job) === "done"),
    };
  }, [reminderJobs]);

  const visibleJobs = groups[activeTab] || [];

  async function updateReminder(job, overrides) {
    setSavingId(job.id);
    try {
      const res = await fetch(`http://localhost:3000/api/jobs/${job.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildJobPayload(job, overrides)),
      });
      if (!res.ok) throw new Error("Failed to update reminder");
      const updated = await res.json();
      setJobs((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch {
      alert("Could not update reminder.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="page-kicker">Planning</p>
          <h1 className="page-title">Reminders</h1>
          <p className="page-subtitle">
            See which jobs need attention today, what is overdue, and what has already been handled.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <SummaryCard label="Open" value={groups.open.length} />
        <SummaryCard label="Overdue" value={groups.overdue.length} tone="danger" />
        <SummaryCard label="Upcoming" value={groups.upcoming.length} />
        <SummaryCard label="Completed" value={groups.done.length} />
      </div>

      <div className="surface-card" style={{ marginBottom: 16, padding: 12 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={activeTab === tab.key ? "btn" : "btn btn-secondary"}
              type="button"
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="surface-card">Loading reminders...</div>}
      {error && <div className="surface-card" style={{ color: "var(--error-color)" }}>{error}</div>}

      {!loading && !error && visibleJobs.length === 0 && (
        <div className="empty-state">
          {activeTab === "open"
            ? "No open reminders yet. Add a follow-up date to a job to start planning."
            : "Nothing in this reminder bucket."}
        </div>
      )}

      {!loading && !error && visibleJobs.length > 0 && (
        <div style={{ display: "grid", gap: 12 }}>
          {visibleJobs.map((job) => (
            <ReminderCard
              key={job.id}
              job={job}
              saving={savingId === job.id}
              onDone={() => updateReminder(job, { reminderDone: true })}
              onReopen={() => updateReminder(job, { reminderDone: false })}
              onClear={() => updateReminder(job, { followUpDate: "", reminderDone: false })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, tone }) {
  return (
    <div className="surface-card" style={{ padding: 16 }}>
      <div style={{ color: "var(--text-muted)", fontWeight: 800, fontSize: "0.8rem", textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ color: tone === "danger" ? "var(--danger)" : "var(--text-color)", fontSize: 30, fontWeight: 900 }}>
        {value}
      </div>
    </div>
  );
}

function ReminderCard({ job, saving, onDone, onReopen, onClear }) {
  const reminderState = getReminderState(job);
  const reminderLabel = getReminderLabel(job);

  return (
    <div
      className="surface-card"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: 18,
        borderColor: reminderState === "overdue" ? "rgba(220, 38, 38, 0.35)" : "var(--border-color)",
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <h3 style={{ margin: 0, fontSize: "1.05rem" }}>{job.position}</h3>
          <span className="muted">@ {job.company}</span>
          <JobStatusBadge status={job.status} />
        </div>
        <div
          style={{
            marginTop: 8,
            color:
              reminderState === "overdue"
                ? "var(--danger)"
                : reminderState === "today"
                  ? "var(--warning)"
                  : "var(--text-muted)",
            fontWeight: 800,
          }}
        >
          {reminderLabel}
        </div>
        <div style={{ marginTop: 6, color: "var(--text-muted)" }}>{job.location}</div>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
        <Link className="btn btn-secondary" to={`/jobs/${job.id}/edit`}>
          Edit
        </Link>
        {reminderState === "done" ? (
          <button className="btn btn-secondary" type="button" onClick={onReopen} disabled={saving}>
            Reopen
          </button>
        ) : (
          <button className="btn" type="button" onClick={onDone} disabled={saving}>
            Done
          </button>
        )}
        <button className="btn btn-secondary" type="button" onClick={onClear} disabled={saving}>
          Clear
        </button>
      </div>
    </div>
  );
}
