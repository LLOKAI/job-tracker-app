import React from 'react';

export default function Layout({ children }) {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#f4f6f8',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Sidebar */}
      <aside style={{
        width: '220px',
        background: '#1e293b',
        color: '#f8fafc',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}>
        <h2 style={{ marginBottom: '2rem' }}>Job Tracker</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '0.5rem 0', cursor: 'pointer' }}>Dashboard</li>
            <li style={{ padding: '0.5rem 0', cursor: 'pointer' }}>Settings</li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main style={{
        flex: 1,
        padding: '2rem',
        overflowY: 'auto',
      }}>
        {children}
      </main>
    </div>
  );
}
