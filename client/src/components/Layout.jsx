import React, { useContext } from 'react';
import Header from './Header';
import { ThemeContext } from '../ThemeContext';
import Logo from './Logo';
import { FaGithub } from "react-icons/fa";
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const { darkMode } = useContext(ThemeContext);

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
      <Sidebar />
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
