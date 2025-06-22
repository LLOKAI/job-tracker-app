import React, { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';

export default function Header() {
  const { darkMode } = useContext(ThemeContext);

  return (
    <header
      style={{
        backgroundColor: 'var(--header-bg)',
        padding: '1rem 2rem',
        boxShadow: darkMode ? '0 1px 4px rgba(0,0,0,0.7)' : '0 1px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '1rem',
        fontSize: '0.9rem',
        color: 'var(--header-text)',
        userSelect: 'none',
      }}
    >
      <div>Hello, Liam</div>
      <button
        style={{
          backgroundColor: 'var(--button-bg)',
          border: 'none',
          color: 'var(--button-text)',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: '600',
        }}
        onClick={() => alert('Logout clicked!')}
      >
        Logout
      </button>
    </header>
  );
}
