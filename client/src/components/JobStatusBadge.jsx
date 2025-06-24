import { statusColors } from "./jobConstants";

function JobStatusBadge({ status }) {
  const color = statusColors[status] || {};
  return (
    <span
      style={{
        backgroundColor: color.bg || "gray",
        color: color.text || "#fff",
        padding: "0.25rem 0.75rem",
        borderRadius: "12px",
        fontWeight: "600",
        fontSize: "calc(var(--font-size-base) * 0.85)",
        textTransform: "capitalize",
      }}
    >
      {status}
    </span>
  );
}

export default JobStatusBadge;