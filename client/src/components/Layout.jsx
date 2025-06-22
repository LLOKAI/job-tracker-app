import React, { useContext } from 'react';
import Header from './Header';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../ThemeContext';

export default function Layout({ children }) {
  const { darkMode } = useContext(ThemeContext);
  const links = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Add Job', path: '/jobs/new' },
    { name: 'Settings', path: '/settings' }
  ];

  const location = useLocation();
  const activePath = location.pathname;

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--bg-color)',
        color: 'var(--text-color)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <aside
        style={{
          width: '180px',
          background: 'var(--sidebar-bg)',
          color: 'var(--sidebar-text)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
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
                    backgroundColor: activePath === link.path ? 'var(--link-active-bg)' : 'transparent',
                    color: 'var(--button-text)',
                    fontWeight: activePath === link.path ? '600' : '400',
                    textDecoration: 'none',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    if (activePath !== link.path) {
                      e.currentTarget.style.backgroundColor = 'var(--link-hover-bg)';
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

      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          backgroundColor: 'var(--bg-color)',
          color: 'var(--text-color)',
        }}
      >
        <Header />
        <div style={{ padding: '1rem 2rem', flex: 1 }}>{children}</div>
      </main>
    </div>
  );
}
