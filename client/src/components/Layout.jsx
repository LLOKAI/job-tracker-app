import React, { useContext, useState } from 'react';
import Header from './Header';
import { ThemeContext } from '../ThemeContext';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const { darkMode } = useContext(ThemeContext);
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? 80 : 220;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'var(--bg-color)',
        color: 'var(--text-color)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <Header />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            backgroundColor: 'var(--bg-color)',
            color: 'var(--text-color)',
            marginLeft: sidebarWidth,
            transition: 'margin-left 0.2s',
          }}
        >
          <div style={{ padding: '1rem 2rem', flex: 1 }}>{children}</div>
        </main>
      </div>
    </div>
  );
}
