export function toDateInputValue(value) {
  return value ? value.slice(0, 10) : "";
}

export function getReminderState(job) {
  if (!job?.followUpDate) return null;
  if (job.reminderDone) return "done";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reminderDate = new Date(job.followUpDate);
  reminderDate.setHours(0, 0, 0, 0);

  if (reminderDate < today) return "overdue";
  if (reminderDate.getTime() === today.getTime()) return "today";
  return "upcoming";
}

export function getReminderLabel(job) {
  const state = getReminderState(job);
  if (!state) return "";

  const date = new Date(job.followUpDate).toLocaleDateString();
  if (state === "done") return `Done ${date}`;
  if (state === "overdue") return `Overdue ${date}`;
  if (state === "today") return "Follow up today";
  return `Follow up ${date}`;
}

export function buildJobPayload(job, overrides = {}) {
  const next = { ...job, ...overrides };

  return {
    company: next.company,
    position: next.position,
    status: next.status || "APPLIED",
    appliedDate: toDateInputValue(next.appliedDate) || new Date().toISOString().slice(0, 10),
    location: next.location,
    tags: Array.isArray(next.tags)
      ? next.tags
      : (next.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean),
    notes: next.notes || "",
    url: next.url || "",
    followUpDate: toDateInputValue(next.followUpDate),
    reminderDone: Boolean(next.reminderDone),
  };
}
