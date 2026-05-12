import React from "react";

export default function Tools() {
  return (
    <div>
      <div className="page-header">
        <div>
          <p className="page-kicker">Utilities</p>
          <h1 className="page-title">Tools</h1>
          <p className="page-subtitle">
            A future workspace for resume, cover letter, and job-search helpers.
          </p>
        </div>
      </div>
      <div className="surface-card">
        <ul style={{ marginTop: 0 }}>
          <li>AI Resume Builder (coming soon)</li>
          <li>Cover Letter Generator (coming soon)</li>
          <li>Mini-games for downtime (coming soon)</li>
        </ul>
        <p className="muted" style={{ marginBottom: 0 }}>More tools will be added in the future.</p>
      </div>
    </div>
  );
}
