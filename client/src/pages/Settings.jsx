import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../ThemeContext';
import { UserContext } from '../UserContext';

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
  // Add a state to track save status
  const [saveStatus, setSaveStatus] = useState('');

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
    setSaveStatus('Saved!');
    setTimeout(() => setSaveStatus(''), 1500);
  };

  return (
    <div style={{ maxWidth: 480, margin: '2rem auto', padding: '2rem', background: darkMode ? '#23263a' : '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
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
        {saveStatus && (
          <div style={{ color: 'green', fontWeight: 500 }}>{saveStatus}</div>
        )}
      </form>
    </div>
  );
}
