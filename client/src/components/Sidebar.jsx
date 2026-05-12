import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaPlus, FaCog, FaChevronLeft, FaChevronRight, FaGithub, FaChartBar, FaBell, FaTools } from "react-icons/fa";

const navLinks = [
  { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
  { name: "Add Job", path: "/jobs/new", icon: <FaPlus /> },
  { name: "Stats", path: "/stats", icon: <FaChartBar /> },         // Stats/Analytics page
  { name: "Reminders", path: "/reminders", icon: <FaBell /> },     // Reminders/follow-ups
  { name: "Tools", path: "/tools", icon: <FaTools /> },            // Tools/games/AI helpers
  { name: "Settings", path: "/settings", icon: <FaCog /> },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const [hovered, setHovered] = useState(null);
  const location = useLocation();
  const activePath = location.pathname;

  return (
    <aside
      style={{
        position: "fixed", // changed from relative
        top: "var(--header-height)",
        left: 0,
        width: collapsed ? "var(--sidebar-collapsed)" : "var(--sidebar-expanded)",
        height: "calc(100vh - var(--header-height))",
        background: "var(--sidebar-bg)",
        color: "var(--sidebar-text)",
        padding: collapsed ? "18px 12px" : "20px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        alignItems: collapsed ? "center" : "stretch",
        transition: "width 180ms ease",
        zIndex: 250,
        marginTop: 0,
        borderRight: "1px solid rgba(255,255,255,0.08)",
      }}
    >
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
                  minHeight: 44,
                  padding: collapsed ? "0.65rem" : "0.65rem 0.8rem",
                  borderRadius: "8px",
                  backgroundColor:
                    activePath === link.path
                      ? "var(--link-active-bg)"
                      : hovered === link.name
                        ? "var(--link-hover-bg)"
                        : "transparent",
                  color: activePath === link.path ? "#172033" : "var(--sidebar-text)",
                  fontWeight: activePath === link.path ? "800" : "650",
                  textDecoration: "none",
                  transition: "background-color 150ms ease, color 150ms ease, transform 150ms ease",
                  fontSize: 16,
                  boxShadow: activePath === link.path ? "0 12px 24px rgba(0,0,0,0.18)" : "none",
                }}
                title={link.name}
                onMouseEnter={() => setHovered(link.name)}
                onMouseLeave={() => setHovered(null)}
              >
                {link.icon}
                {!collapsed && <span>{link.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(c => !c)}
        style={{
          position: "absolute",
          top: 12,
          right: collapsed ? -15 : -14,
          background: "var(--card-bg)",
          border: "1px solid var(--border-color)",
          color: "var(--text-color)",
          borderRadius: "50%",
          width: 30,
          height: 30,
          cursor: "pointer",
          boxShadow: "var(--card-shadow)",
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
      <div
        style={{
          marginTop: "auto",
          textAlign: "center",
          fontSize: 13,
          opacity: 0.8,
          paddingBottom: "2rem",
        }}
      >
        <a
          href="https://github.com/LLOKAI"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "inherit",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            justifyContent: "center",
          }}
          title="GitHub"
        >
          <FaGithub size={30} style={{ verticalAlign: "middle" }} />
          {!collapsed && (
            <span>
              created by <b>LLOKAI</b>
            </span>
          )}
        </a>
      </div>
    </aside>
  );
}
