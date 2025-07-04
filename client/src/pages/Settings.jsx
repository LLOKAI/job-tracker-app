import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../ThemeContext';
import { UserContext } from '../UserContext';
import { MdViewModule, MdViewList, MdDarkMode, MdLightMode, MdNotificationsActive, MdNotificationsNone } from "react-icons/md";

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

const getButtonStyle = (active, darkMode) => ({
  background: active ? "var(--button-bg)" : "transparent",
  color: active ? "var(--button-text)" : (darkMode ? "#f8fafc" : "#222"),
  border: "none",
  borderRadius: "6px",
  padding: "0.4rem 0.7rem",
  cursor: "pointer",
  fontSize: "1.4rem",
  transition: "background 0.2s, color 0.2s",
  display: "flex",
  alignItems: "center",
  gap: 6,
});

export default function Settings() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { name, setName } = useContext(UserContext);

  // Load from localStorage or use default
  const [email, setEmail] = useState(() => localStorage.getItem('settings_email') || '');
  const [defaultStatus, setDefaultStatus] = useState(() => localStorage.getItem('settings_defaultStatus') || 'APPLIED');
  const [defaultSort, setDefaultSort] = useState(() => localStorage.getItem('settings_defaultSort') || 'date');
  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem('settings_notifications');
    return stored ? JSON.parse(stored) : false;
  });
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('settings_fontSize') || 'medium');
  const [compactMode, setCompactMode] = useState(() => {
    const stored = localStorage.getItem('settings_compactMode');
    return stored ? JSON.parse(stored) : false;
  });
  const [saveStatus, setSaveStatus] = useState(false);

  // Effect to update font size CSS variable
  useEffect(() => {
    let size;
    if (fontSize === 'small') size = '14px';
    else if (fontSize === 'large') size = '20px';
    else size = '16px'; // medium
    document.documentElement.style.setProperty('--font-size-base', size);
  }, [fontSize]);

  // Save handler
  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('settings_name', name);
    localStorage.setItem('settings_email', email);
    localStorage.setItem('settings_defaultStatus', defaultStatus);
    localStorage.setItem('settings_defaultSort', defaultSort);
    localStorage.setItem('settings_notifications', JSON.stringify(notifications));
    localStorage.setItem('settings_fontSize', fontSize);
    localStorage.setItem('settings_compactMode', JSON.stringify(compactMode));
    setName(name); // Update context
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 1200);
  };

  return (
    <div style={getFormContainerStyle(darkMode)}>
      <h2 style={{ marginBottom: '1.5rem' }}>Settings</h2>
      <form
        style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        onSubmit={handleSave}
      >
        {/* Personal Info */}
        <div>
          <label style={{ fontWeight: 500 }}>Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            style={getInputStyle(darkMode)}
          />
        </div>
        <div>
          <label style={{ fontWeight: 500 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={getInputStyle(darkMode)}
          />
        </div>
        {/* Preferences */}
        <div>
          <label style={{ fontWeight: 500 }}>Default Job Status</label>
          <select
            value={defaultStatus}
            onChange={e => setDefaultStatus(e.target.value)}
            style={getInputStyle(darkMode)}
          >
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEW">Interview</option>
            <option value="REJECTED">Rejected</option>
            <option value="OFFER">Offer</option>
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 500 }}>Default Sort Order</label>
          <select
            value={defaultSort}
            onChange={e => setDefaultSort(e.target.value)}
            style={getInputStyle(darkMode)}
          >
            <option value="date">Date</option>
            <option value="company">Company</option>
            <option value="status">Status</option>
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 500 }}>Font Size</label>
          <select
            value={fontSize}
            onChange={e => setFontSize(e.target.value)}
            style={getInputStyle(darkMode)}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        {/* Compact Mode Toggle */}
        <div>
          <label style={{ fontWeight: 500, marginBottom: 6, display: "block" }}>Compact Mode</label>
          <div style={{ display: "flex", gap: 0 }}>
            <button
              type="button"
              aria-label="Grid view"
              onClick={() => setCompactMode(true)}
              style={getButtonStyle(compactMode, darkMode)}
            >
              <MdViewModule />
              Grid
            </button>
            <button
              type="button"
              aria-label="List view"
              onClick={() => setCompactMode(false)}
              style={getButtonStyle(!compactMode, darkMode)}
            >
              <MdViewList />
              List
            </button>
          </div>
        </div>
        {/* Dark Mode Toggle */}
        <div>
          <label style={{ fontWeight: 500, marginBottom: 6, display: "block" }}>Dark Mode</label>
          <div style={{ display: "flex", gap: 0 }}>
            <button
              type="button"
              aria-label="Dark mode"
              onClick={() => setDarkMode(true)}
              style={getButtonStyle(darkMode, darkMode)}
            >
              <MdDarkMode />
              Dark
            </button>
            <button
              type="button"
              aria-label="Light mode"
              onClick={() => setDarkMode(false)}
              style={getButtonStyle(!darkMode, darkMode)}
            >
              <MdLightMode />
              Light
            </button>
          </div>
        </div>
        {/* Notifications Toggle */}
        <div>
          <label style={{ fontWeight: 500, marginBottom: 6, display: "block" }}>Enable Notifications</label>
          <button
            type="button"
            aria-label="Toggle notifications"
            onClick={() => setNotifications(n => !n)}
            style={{
              ...getButtonStyle(notifications, darkMode),
              fontSize: "1.5rem",
              borderRadius: "50%",
              width: 44,
              height: 44,
              justifyContent: "center",
            }}
          >
            {notifications ? <MdNotificationsActive /> : <MdNotificationsNone />}
          </button>
        </div>
        <button
          type="submit"
          style={{
            marginTop: 12,
            padding: '0.75rem',
            borderRadius: 6,
            border: 'none',
            background: '#3b82f6',
            color: '#fff',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer'
          }}
        >
          Save
        </button>
      </form>
      {/* Save Confirmation Modal */}
      {saveStatus && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000,
        }}>
          <div style={{
            background: darkMode ? "#23263a" : "#fff",
            color: darkMode ? "#f8fafc" : "#222",
            padding: "2rem 2.5rem",
            borderRadius: 16,
            boxShadow: "0 2px 24px rgba(0,0,0,0.22)",
            fontSize: 22,
            fontWeight: 600,
            textAlign: "center",
          }}>
            Settings Saved!
          </div>
        </div>
      )}
    </div>
  );
}
