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
        top: 72,           // header height in px
        left: 0,
        width: collapsed ? 60 : 180,
        height: "calc(100vh - 72px)", // full viewport minus header
        background: "var(--sidebar-bg)",
        color: "var(--sidebar-text)",
        padding: collapsed ? "1.5rem 0.5rem" : "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        alignItems: collapsed ? "center" : "stretch",
        transition: "width 0.2s",
        zIndex: 101, // above main content, below header
        marginTop: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0
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
                  padding: collapsed ? "0.6rem" : "0.6rem 1rem",
                  borderRadius: "4px",
                  backgroundColor:
                    activePath === link.path
                      ? "var(--link-active-bg)"
                      : hovered === link.name
                        ? "var(--link-hover-bg)"
                        : "transparent",
                  color: "var(--button-text)",
                  fontWeight: activePath === link.path ? "600" : "400",
                  textDecoration: "none",
                  transition: "background-color 0.3s",
                  fontSize: 18,
                }}
                title={link.name}
                onMouseEnter={() => setHovered(link.name)}
                onMouseLeave={() => setHovered(null)}
              >
                {link.icon}
                {!collapsed && <span style={{ marginLeft: 10 }}>{link.name}</span>}
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
      <div
        style={{
          marginTop: "auto",
          textAlign: "center",
          fontSize: 13,
          opacity: 0.8,
          paddingBottom: "3rem",
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