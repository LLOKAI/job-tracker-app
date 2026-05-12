import React from "react";

export default function Reminders() {
  return (
    <div>
      <div className="page-header">
        <div>
          <p className="page-kicker">Planning</p>
          <h1 className="page-title">Reminders</h1>
          <p className="page-subtitle">
            Follow-ups, interview prep, and deadlines will live here.
          </p>
        </div>
      </div>
      <div className="surface-card">
        <ul style={{ marginTop: 0 }}>
          <li>Set reminders for interviews or follow-ups</li>
          <li>View upcoming reminders</li>
          <li>Mark reminders as done</li>
        </ul>
        <p className="muted" style={{ marginBottom: 0 }}>Feature coming soon.</p>
      </div>
    </div>
  );
}
