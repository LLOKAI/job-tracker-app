import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-frame">
      <Header />
      <div className="app-body">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main
          className={`app-main${collapsed ? ' is-collapsed' : ''}`}
        >
          <div className="app-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
