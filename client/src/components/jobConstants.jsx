export const statusColors = {
  APPLIED: { bg: "var(--status-bg-applied)", text: "var(--status-text-applied)" },
  INTERVIEW: { bg: "var(--status-bg-interview)", text: "var(--status-text-interview)" },
  REJECTED: { bg: "var(--status-bg-rejected)", text: "var(--status-text-rejected)" },
  OFFER: { bg: "var(--status-bg-offer)", text: "var(--status-text-offer)" },
};

export const iconButtonStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  padding: 6,
  borderRadius: 8,
  transition: "box-shadow 0.15s, background 0.15s",
  boxShadow: "none",
};
export const iconButtonHoverStyle = {
  ...iconButtonStyle,
  boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
  background: "#e0e7ef",
};