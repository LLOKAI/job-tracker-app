import React from "react";
import { VscGraphLeft } from "react-icons/vsc";

export default function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
      <VscGraphLeft size={100} color="#3b82f6" />
      <span style={{ fontWeight: 700, fontSize: "1.3rem", letterSpacing: 1 }}>
        Job Application Tracker
      </span>
    </div>
  );
}