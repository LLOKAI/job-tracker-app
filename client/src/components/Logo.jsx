import React from "react";
import { VscGraphLeft } from "react-icons/vsc";

export default function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: "linear-gradient(135deg, #2563eb, #14b8a6)",
          color: "#fff",
          display: "grid",
          placeItems: "center",
          boxShadow: "0 10px 24px rgba(37, 99, 235, 0.28)",
        }}
      >
        <VscGraphLeft size={26} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
        <span style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: 0 }}>
          Job Tracker
        </span>
        <span style={{ color: "var(--text-muted)", fontSize: "0.78rem", fontWeight: 600 }}>
          Pipeline workspace
        </span>
      </div>
    </div>
  );
}
