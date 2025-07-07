// This file is part of the Job Application Tracker project.
// It is a simple dashboard page that displays a welcome message.

import React, { useState } from 'react';
import Layout from '../components/Layout';
import JobList from '../components/JobList';
import { MdViewModule, MdViewList } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [compactMode, setCompactMode] = useState(() => {
    const stored = localStorage.getItem('settings_compactMode');
    return stored ? JSON.parse(stored) : false;
  });
  const [dashboardQuote, setDashboardQuote] = useState(() => localStorage.getItem('settings_dashboardQuote') || '');
  const [dashboardQuoteAuthor, setDashboardQuoteAuthor] = useState(() => localStorage.getItem('settings_dashboardQuoteAuthor') || '');
  const [showQuote, setShowQuote] = useState(true); // Add this line
  const navigate = useNavigate();

  // Save compact mode to localStorage when changed
  const handleCompactToggle = (mode) => {
    setCompactMode(mode);
    localStorage.setItem("settings_compactMode", JSON.stringify(mode));
  };

  return (
    <>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1.5rem"
      }}>
        <h1 style={{ margin: 0 }}>Dashboard</h1>
        <div style={{ display: "flex", gap: 4 }}>
          {/* Toggle Quote Button */}
          {dashboardQuote && (
            <button
              onClick={() => setShowQuote((v) => !v)}
              style={{
                background: "var(--button-bg)",
                color: "var(--button-text)",
                border: "none",
                borderRadius: 6,
                padding: "0.4rem 0.9rem",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
                marginRight: 8,
              }}
              title={showQuote ? "Hide quote" : "Show quote"}
            >
              {showQuote ? "Hide Quote" : "Show Quote"}
            </button>
          )}
          <button
            aria-label="Grid view"
            onClick={() => handleCompactToggle(true)}
            style={{
              background: compactMode ? "var(--button-bg)" : "transparent",
              color: compactMode ? "var(--button-text)" : "#222",
              border: "none",
              borderRadius: "6px 0 0 6px",
              padding: "0.4rem 0.7rem",
              cursor: "pointer",
              fontSize: "1.4rem",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            <MdViewModule />
          </button>
          <button
            aria-label="List view"
            onClick={() => handleCompactToggle(false)}
            style={{
              background: !compactMode ? "var(--button-bg)" : "transparent",
              color: !compactMode ? "var(--button-text)" : "#222",
              border: "none",
              borderRadius: "0 6px 6px 0",
              padding: "0.4rem 0.7rem",
              cursor: "pointer",
              fontSize: "1.4rem",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            <MdViewList />
          </button>
        </div>
      </div>
      {/* Dashboard Quote */}
      {dashboardQuote && showQuote && (
        <div
          style={{
            margin: "0 0 1.5rem 0",
            padding: "1rem 2rem",
            background: "var(--card-bg)",
            color: "var(--text-color)",
            borderRadius: 10,
            boxShadow: "0 2px 8px var(--card-shadow)",
            fontSize: 20,
            fontStyle: "italic",
            textAlign: "center",
            fontWeight: 500,
            letterSpacing: 0.2,
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
        onClick={() => navigate("/jobs/new")}
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          background: "#3b82f6",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 60,
          height: 60,
          fontSize: 32,
          boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
          cursor: "pointer",
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
