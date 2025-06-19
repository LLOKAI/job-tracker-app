import React, { useState } from 'react';
import Header from './Header';

export default function Layout({ children }) {
  const [active, setActive] = useState('Dashboard');

  const links = ['Dashboard', 'Settings'];

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
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {links.map(link => (
              <li
                key={link}
                onClick={() => setActive(link)}
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: '4px',
                  backgroundColor: active === link ? '#3b82f6' : 'transparent',
                  cursor: 'pointer',
                  userSelect: 'none',
                  fontWeight: active === link ? '600' : '400',
                  transition: 'background-color 0.3s ease',
                  marginBottom: '0.5rem',
                }}
                onMouseEnter={e => {
                  if (active !== link) e.currentTarget.style.backgroundColor = '#334155';
                }}
                onMouseLeave={e => {
                  if (active !== link) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {link}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}>
        <Header />
        <div style={{ padding: '1rem 2rem', flex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
