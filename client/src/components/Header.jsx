import React, { useContext, useState, useRef, useEffect } from 'react';
import { ThemeContext } from '../ThemeContext';
import { UserContext } from '../UserContext';
import Logo from './Logo';
import { MdOutlineDarkMode, MdOutlineLightMode, MdKeyboardArrowDown } from "react-icons/md";

export default function Header() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { name } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutHover, setLogoutHover] = useState(false);
  const dropdownRef = useRef();

  // Add state for profile picture
  const [profilePic, setProfilePic] = useState(() => localStorage.getItem('settings_profilePic') || '');

  // Keep profilePic in sync with localStorage changes
  useEffect(() => {
    const onStorage = () => setProfilePic(localStorage.getItem('settings_profilePic') || '');
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem',
        height: 72,
        background: 'var(--header-bg)',
        boxShadow: darkMode ? '0 1px 4px rgba(0,0,0,0.7)' : '0 1px 4px rgba(0,0,0,0.1)',
        position: 'relative',
        zIndex: 100,
      }}
    >
      {/* Left: Logo and Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Logo />
      </div>
      {/* Right: Greeting Dropdown and Dark Mode */}
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
        {/* Greeting Dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500,
              color: 'inherit',
              fontSize: 16,
              padding: '0.3rem 0.7rem',
              borderRadius: 8,
              transition: 'background 0.15s',
            }}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginRight: 6,
                  border: "2px solid #3b82f6",
                  background: "#fff",
                }}
              />
            ) : (
              <span
                style={{
                  background: '#4a4e69',
                  color: '#fff',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 16,
                  marginRight: 6,
                }}
              >
                {name?.[0]?.toUpperCase() || "?"}
              </span>
            )}
            Hello, {name}
            <MdKeyboardArrowDown />
          </button>
          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 44,
                background: darkMode ? '#23263a' : '#fff',
                color: darkMode ? '#f8fafc' : '#222',
                boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                borderRadius: 8,
                minWidth: 140,
                zIndex: 1000,
                padding: '0.5rem 0',
              }}
            >
              <button
                style={{
                  width: '100%',
                  background: logoutHover ? (darkMode ? '#334155' : '#f3f4f6') : 'none',
                  border: 'none',
                  color: 'inherit',
                  padding: '0.7rem 1.2rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: 15,
                  borderRadius: 0,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={() => setLogoutHover(true)}
                onMouseLeave={() => setLogoutHover(false)}
                onClick={() => {
                  setDropdownOpen(false);
                  alert('Logout clicked!');
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
