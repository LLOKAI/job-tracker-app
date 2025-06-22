import React, { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';

export default function Settings() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <div style={{
      maxWidth: 600,
      margin: '2rem auto',
      background: darkMode ? '#1e293b' : '#fff',
      padding: '2rem',
      borderRadius: '8px',
      color: darkMode ? '#f8fafc' : '#222',
    }}>
      <h1>Settings</h1>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
        Enable Dark Mode
      </label>
    </div>
  );
}
