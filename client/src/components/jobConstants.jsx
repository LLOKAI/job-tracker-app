export const statusColors = {
  APPLIED: { bg: "var(--status-bg-applied)", text: "var(--status-text-applied)" },
  INTERVIEW: { bg: "var(--status-bg-interview)", text: "var(--status-text-interview)" },
  REJECTED: { bg: "var(--status-bg-rejected)", text: "var(--status-text-rejected)" },
  OFFER: { bg: "var(--status-bg-offer)", text: "var(--status-text-offer)" },
};

export const iconButtonStyle = {
  background: "var(--card-bg)",
  border: "1px solid var(--border-color)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 38,
  height: 38,
  padding: 0,
  borderRadius: 8,
  transition: "box-shadow 0.15s, background 0.15s, transform 0.15s",
  boxShadow: "none",
};
export const iconButtonHoverStyle = {
  ...iconButtonStyle,
  boxShadow: "0 10px 20px rgba(23,32,51,0.12)",
  background: "var(--accent-soft)",
  transform: "translateY(-1px)",
};
