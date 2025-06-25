function JobTags({ tags, darkMode }) {
  if (!tags || tags.length === 0) return null;
  return (
    <div style={{ marginTop: 4 }}>
      <span style={{ fontWeight: 500 }}>Tags:</span>{" "}
      {tags.map((tag) => (
        <span
          key={tag}
          style={{
            background: darkMode ? "#334155" : "#e0e7ef",
            color: darkMode ? "#bae6fd" : "#334155",
            borderRadius: 6,
            padding: "0.1rem 0.5rem",
            marginRight: 4,
            fontSize: "calc(var(--font-size-base) * 0.85)",
            fontWeight: 500,
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