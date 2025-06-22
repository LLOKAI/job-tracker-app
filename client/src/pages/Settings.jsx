import React, { useState, useEffect } from 'react';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.body.style.backgroundColor = '#1e293b';
      document.body.style.color = '#f8fafc';
    } else {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', background: '#fff', padding: '2rem', borderRadius: '8px' }}>
      <h1>Settings</h1>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
