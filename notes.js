/**
 * Initial state for the notes in-memory store.
 * Standardized to English identifiers and messages.
 */
const notes = [
  {
    id: "notes-1",
    title: "Welcome to CyberNote!",
    tags: ["INFO", "SYSTEM"],
    body: "This is your first note in CyberNote_OS. You can create, edit, and delete notes here.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default notes;
