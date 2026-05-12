import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext, UserContext } from '../contexts';
import Logo from './Logo';
import { MdOutlineDarkMode, MdOutlineLightMode, MdKeyboardArrowDown, MdLogout, MdSettings } from "react-icons/md";

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
        padding: '0 24px',
        height: 'var(--header-height)',
        background: 'var(--header-bg)',
        color: 'var(--header-text)',
        borderBottom: '1px solid var(--border-color)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 300,
      }}
    >
      {/* Left: Logo, Title, and Dark Mode Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Logo />
        <button
          aria-label="Toggle dark mode"
          onClick={() => setDarkMode(!darkMode)}
          className="icon-btn"
          style={{
            fontSize: '1.7rem',
          }}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <MdOutlineDarkMode /> : <MdOutlineLightMode />}
        </button>
      </div>
      {/* Right: Greeting Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              fontWeight: 700,
              color: 'inherit',
              fontSize: 16,
              padding: '0.35rem 0.45rem 0.35rem 0.85rem',
              borderRadius: 999,
              boxShadow: '0 8px 22px rgba(23, 32, 51, 0.08)',
              transition: 'background 0.15s, border-color 0.15s',
            }}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Hello,</span>
            <span>{name}</span>
            <MdKeyboardArrowDown />
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginLeft: 6,
                  border: "1.5px solid #d1d5db",
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
                  marginLeft: 6,
                }}
              >
                {name?.[0]?.toUpperCase() || "?"}
              </span>
            )}
          </button>
          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 54,
                background: darkMode ? '#23263a' : '#fff',
                color: darkMode ? '#f8fafc' : '#222',
                boxShadow: 'var(--card-shadow)',
                border: '1px solid var(--border-color)',
                borderRadius: 12,
                minWidth: 174,
                zIndex: 1000,
                padding: '0.45rem',
              }}
            >
              <Link
                to="/settings"
                onClick={() => setDropdownOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  textDecoration: 'none',
                  color: 'inherit',
                  padding: '0.65rem 0.75rem',
                  borderRadius: 8,
                  fontWeight: 650,
                  fontSize: 15,
                }}
              >
                <MdSettings />
                Settings
              </Link>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  background: logoutHover ? (darkMode ? '#334155' : '#f3f4f6') : 'none',
                  border: 'none',
                  color: 'inherit',
                  padding: '0.65rem 0.75rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: 650,
                  fontSize: 15,
                  borderRadius: 8,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={() => setLogoutHover(true)}
                onMouseLeave={() => setLogoutHover(false)}
                onClick={() => {
                  setDropdownOpen(false);
                  alert('Logout clicked!');
                }}
              >
                <MdLogout />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
