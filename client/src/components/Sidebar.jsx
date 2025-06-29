import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaPlus, FaCog, FaChevronLeft, FaChevronRight, FaGithub } from "react-icons/fa";
import Logo from "./Logo";

const navLinks = [
  { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
  { name: "Add Job", path: "/jobs/new", icon: <FaPlus /> },
  { name: "Settings", path: "/settings", icon: <FaCog /> },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const activePath = location.pathname;

  return (
    <aside
      style={{
        width: collapsed ? 60 : 180,
        background: "var(--sidebar-bg)",
        color: "var(--sidebar-text)",
        padding: collapsed ? "1.5rem 0.5rem" : "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        alignItems: collapsed ? "center" : "stretch",
        transition: "width 0.2s",
        position: "relative",
      }}
    >
      <div>
        {!collapsed && <Logo />}
        <nav>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {navLinks.map(link => (
              <li key={link.name} style={{ marginBottom: "0.5rem" }}>
                <Link
                  to={link.path}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: collapsed ? 0 : 12,
                    justifyContent: collapsed ? "center" : "flex-start",
                    padding: collapsed ? "0.6rem" : "0.6rem 1rem",
                    borderRadius: "4px",
                    backgroundColor: activePath === link.path ? "var(--link-active-bg)" : "transparent",
                    color: "var(--button-text)",
                    fontWeight: activePath === link.path ? "600" : "400",
                    textDecoration: "none",
                    transition: "background-color 0.3s",
                    fontSize: 18,
                  }}
                  title={link.name}
                >
                  {link.icon}
                  {!collapsed && <span style={{ marginLeft: 10 }}>{link.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(c => !c)}
        style={{
          position: "absolute",
          top: 12,
          right: collapsed ? -18 : -12,
          background: "var(--sidebar-bg)",
          border: "none",
          color: "var(--sidebar-text)",
          borderRadius: "50%",
          width: 28,
          height: 28,
          cursor: "pointer",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>
      {/* Sidebar Footer */}
      <div style={{
        marginTop: "auto",
        textAlign: "center",
        fontSize: 13,
        opacity: 0.8,
        display: collapsed ? "none" : "block"
      }}>
        <a
          href="https://github.com/LLOKAI"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <FaGithub size={18} style={{ verticalAlign: "middle" }} />
          <span>created by <b>LLOKAI</b></span>
        </a>
      </div>
    </aside>
  );
}