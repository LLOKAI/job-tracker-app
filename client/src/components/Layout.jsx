import React from 'react';
import Header from './Header';
import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const links = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Settings', path: '/settings' }
  ];

  const location = useLocation();
  const activePath = location.pathname;

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
              <li key={link.name} style={{ marginBottom: '0.5rem' }}>
                <Link
                  to={link.path}
                  style={{
                    display: 'block',
                    padding: '0.6rem 1rem',
                    borderRadius: '4px',
                    backgroundColor: activePath === link.path ? '#3b82f6' : 'transparent',
                    color: '#fff',
                    fontWeight: activePath === link.path ? '600' : '400',
                    textDecoration: 'none',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    if (activePath !== link.path) {
                      e.currentTarget.style.backgroundColor = '#334155';
                    }
                  }}
                  onMouseLeave={e => {
                    if (activePath !== link.path) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {link.name}
                </Link>
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
