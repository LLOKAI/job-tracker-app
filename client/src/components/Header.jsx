import React, { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';
import { UserContext } from '../UserContext';

import { MdOutlineDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";
import { FaBriefcase } from "react-icons/fa";
import Logo from './Logo';

export default function Header() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { name } = useContext(UserContext);

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        background: 'var(--header-bg)',
        boxShadow: darkMode ? '0 1px 4px rgba(0,0,0,0.7)' : '0 1px 4px rgba(0,0,0,0.1)',
      }}
    >
      {/* Left: dark mode */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button
          aria-label="Toggle dark mode"
          onClick={() => setDarkMode(!darkMode)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            borderRadius: '999px',
            border: 'none',
            background: darkMode ? '#22223b' : '#f1f5f9',
            boxShadow: darkMode ? '0 1px 4px rgba(0,0,0,0.4)' : '0 1px 4px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s',
            fontSize: '1.7rem',
          }}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <MdOutlineDarkMode color='#ffffff' /> : <MdOutlineLightMode color='#000000' />}
        </button>
      </div>
      {/* Right: Greeting, avatar, logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
          Hello, {name}
          <span
            style={{
              background: '#3b82f6',
              color: '#fff',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 16,
              marginLeft: 4,
            }}
          >
            {name?.[0]?.toUpperCase() || "?"}
          </span>
        </div>
        <button
          style={{
            backgroundColor: 'var(--button-bg)',
            border: 'none',
            color: 'var(--button-text)',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: 'var(--font-size-base)',
          }}
          onClick={() => alert('Logout clicked!')}
          title="Logout"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
