import React from 'react';

export default function Header() {
  return (
    <header style={{
      backgroundColor: '#fff',
      padding: '1rem 2rem',
      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: '1rem',
      fontSize: '0.9rem',
      color: '#334155',
      userSelect: 'none',
    }}>
      <div>Hello, Liam</div>
      <button
        style={{
          backgroundColor: '#3b82f6',
          border: 'none',
          color: '#fff',
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
