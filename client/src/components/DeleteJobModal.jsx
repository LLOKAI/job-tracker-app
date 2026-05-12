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
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "var(--card-bg)",
          color: "var(--text-color)",
          padding: "2rem",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--card-shadow-hover)",
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
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={onDelete}
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
