// This file is part of the Job Application Tracker project.
// It is a simple dashboard page that displays a welcome message.

import React, { useState } from 'react';
import JobList from '../components/JobList';
import { MdViewModule, MdViewList } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [compactMode, setCompactMode] = useState(() => {
    const stored = localStorage.getItem('settings_compactMode');
    return stored ? JSON.parse(stored) : false;
  });
  const [dashboardQuote] = useState(() => localStorage.getItem('settings_dashboardQuote') || '');
  const [dashboardQuoteAuthor] = useState(() => localStorage.getItem('settings_dashboardQuoteAuthor') || '');
  const [showQuote, setShowQuote] = useState(true); // Add this line
  const navigate = useNavigate();

  // Save compact mode to localStorage when changed
  const handleCompactToggle = (mode) => {
    setCompactMode(mode);
    localStorage.setItem("settings_compactMode", JSON.stringify(mode));
  };

  return (
    <>
      <div className="page-header">
        <div>
          <p className="page-kicker">Pipeline</p>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Track every opportunity from first application to final decision.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {/* Toggle Quote Button */}
          {dashboardQuote && (
            <button
              className="btn btn-secondary"
              onClick={() => setShowQuote((v) => !v)}
              title={showQuote ? "Hide quote" : "Show quote"}
            >
              {showQuote ? "Hide Quote" : "Show Quote"}
            </button>
          )}
          <button
            aria-label="Grid view"
            className="icon-btn"
            onClick={() => handleCompactToggle(true)}
            style={{
              background: compactMode ? "var(--button-bg)" : "transparent",
              color: compactMode ? "var(--button-text)" : "var(--text-muted)",
              fontSize: "1.4rem",
            }}
          >
            <MdViewModule />
          </button>
          <button
            aria-label="List view"
            className="icon-btn"
            onClick={() => handleCompactToggle(false)}
            style={{
              background: !compactMode ? "var(--button-bg)" : "transparent",
              color: !compactMode ? "var(--button-text)" : "var(--text-muted)",
              fontSize: "1.4rem",
            }}
          >
            <MdViewList />
          </button>
        </div>
      </div>
      {/* Dashboard Quote */}
      {dashboardQuote && showQuote && (
        <div
          className="surface-card"
          style={{
            margin: "0 0 1.5rem 0",
            fontSize: 18,
            fontStyle: "italic",
            textAlign: "left",
            fontWeight: 500,
          }}
        >
          “{dashboardQuote}”
          {dashboardQuoteAuthor && (
            <div style={{
              fontSize: 16,
              fontStyle: "normal",
              fontWeight: 400,
              marginTop: 8,
              color: "var(--text-color)",
              opacity: 0.8,
            }}>
              — {dashboardQuoteAuthor}
            </div>
          )}
        </div>
      )}
      <JobList compactMode={compactMode} />
      <button
        className="btn"
        onClick={() => navigate("/jobs/new")}
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          borderRadius: "50%",
          width: 60,
          height: 60,
          fontSize: 32,
          boxShadow: "0 18px 36px rgba(37,99,235,0.28)",
          zIndex: 200,
        }}
        title="Add Job"
        aria-label="Add Job"
      >
        +
      </button>
    </>
  );
}
