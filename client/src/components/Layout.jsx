// This is a simple layout component for a job tracking application.
import React from 'react';

export default function Layout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{
        width: '200px',
        background: '#333',
        color: '#fff',
        padding: '1rem'
      }}>
        <h2>Job Tracker</h2>
        <nav>
          <ul>
            <li>Dashboard</li>
            <li>Settings</li>
          </ul>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: '2rem' }}>
        {children}
      </main>
    </div>
  );
}
