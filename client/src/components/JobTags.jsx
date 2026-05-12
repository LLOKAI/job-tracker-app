function JobTags({ tags, darkMode }) {
  if (!tags || tags.length === 0) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
      {tags.map((tag) => (
        <span
          key={tag}
          style={{
            background: darkMode ? "rgba(96, 165, 250, 0.14)" : "var(--accent-soft)",
            color: darkMode ? "#bfdbfe" : "#1d4ed8",
            border: "1px solid var(--border-color)",
            borderRadius: 999,
            padding: "0.12rem 0.55rem",
            fontSize: "calc(var(--font-size-base) * 0.85)",
            fontWeight: 700,
            display: "inline-block",
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export default JobTags;
