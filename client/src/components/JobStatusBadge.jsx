import { statusColors } from "./jobConstants";

function JobStatusBadge({ status }) {
  const color = statusColors[status] || {};
  const label = {
    APPLIED: "Applied",
    INTERVIEW: "Interview",
    REJECTED: "Rejected",
    OFFER: "Offer",
  }[status] || status;

  return (
    <span
      style={{
        backgroundColor: color.bg || "gray",
        color: color.text || "#fff",
        display: "inline-flex",
        alignItems: "center",
        minHeight: 28,
        padding: "0.25rem 0.65rem",
        borderRadius: "999px",
        fontWeight: "800",
        fontSize: "calc(var(--font-size-base) * 0.78)",
        letterSpacing: "0.02em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

export default JobStatusBadge;
