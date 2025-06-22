import React, { useContext, useState } from 'react';
import { ThemeContext } from '../ThemeContext';

export default function Settings() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  // Example state for personal info (not persisted yet)
  const [name, setName] = useState('Liam');
  const [email, setEmail] = useState('');
  const [defaultStatus, setDefaultStatus] = useState('APPLIED');
  const [defaultSort, setDefaultSort] = useState('date');
  const [notifications, setNotifications] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [compactMode, setCompactMode] = useState(false);

  return (
    <div style={{ maxWidth: 480, margin: '2rem auto', padding: '2rem', background: darkMode ? '#23263a' : '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Settings</h2>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Personal Info */}
        <div>
          <label style={{ fontWeight: 500 }}>Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }}
          />
        </div>
        <div>
          <label style={{ fontWeight: 500 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }}
          />
        </div>
        {/* Preferences */}
        <div>
          <label style={{ fontWeight: 500 }}>Default Job Status</label>
          <select
            value={defaultStatus}
            onChange={e => setDefaultStatus(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }}
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
            style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }}
          >
            <option value="date">Date</option>
            <option value="company">Company</option>
            <option value="status">Status</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            checked={notifications}
            onChange={e => setNotifications(e.target.checked)}
            id="notifications"
          />
          <label htmlFor="notifications" style={{ fontWeight: 500 }}>Enable Notifications</label>
        </div>
        <div>
          <label style={{ fontWeight: 500 }}>Font Size</label>
          <select
            value={fontSize}
            onChange={e => setFontSize(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            checked={compactMode}
            onChange={e => setCompactMode(e.target.checked)}
            id="compactMode"
          />
          <label htmlFor="compactMode" style={{ fontWeight: 500 }}>Compact Mode</label>
        </div>
        {/* Theme toggle (already in header, but shown here as well) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            id="darkMode"
          />
          <label htmlFor="darkMode" style={{ fontWeight: 500 }}>Dark Mode</label>
        </div>
      </form>
    </div>
  );
}
