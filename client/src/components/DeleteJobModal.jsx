function DeleteJobModal({ open, onCancel, onDelete, deleting }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#23263a",
          color: "#f8fafc",
          padding: "2rem",
          borderRadius: 12,
          boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
          minWidth: 320,
          textAlign: "center",
        }}
      >
        <h3 style={{ marginBottom: 16 }}>Delete Job?</h3>
        <p style={{ marginBottom: 24 }}>
          Are you sure you want to delete this job? This action cannot be
          undone.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          <button
            onClick={onCancel}
            style={{
              padding: "0.5rem 1.2rem",
              borderRadius: 6,
              border: "none",
              background: "#64748b",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            style={{
              padding: "0.5rem 1.2rem",
              borderRadius: 6,
              border: "none",
              background: "#ef4444",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteJobModal;