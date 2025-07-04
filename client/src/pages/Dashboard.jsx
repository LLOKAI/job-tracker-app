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
