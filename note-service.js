import db from "./db.js";

/**
 * Service layer for Note operations using Turso database.
 * Handles all business logic and data persistence.
 */
class NoteService {
  /**
   * Creates a new note.
   * @param {Object} payload - The note data.
   * @param {string} payload.title - Note title.
   * @param {Array<string>} payload.tags - Note tags.
   * @param {string} payload.body - Note body content.
   * @returns {string} The ID of the created note.
   */
  async addNote({ title, tags, body }) {
    const id = Math.random().toString(36).substring(2, 18);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const tagsJson = JSON.stringify(tags || []);

    try {
      await db.execute(
        "INSERT INTO notes (id, title, tags, body, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
        [id, title, tagsJson, body, createdAt, updatedAt]
      );
      return id;
    } catch (error) {
      console.error("Error adding note:", error);
      throw new Error("Failed to persist note");
    }
  }

  /**
   * Retrieves all notes.
   * @returns {Array<Object>} List of all notes.
   */
  async getAllNotes() {
    try {
      const result = await db.execute("SELECT * FROM notes ORDER BY created_at DESC");
      
      return result.rows.map((row) => ({
        id: row.id,
        title: row.title,
        tags: JSON.parse(row.tags || "[]"),
        body: row.body,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (error) {
      console.error("Error fetching notes:", error);
      return [];
    }
  }

  /**
   * Retrieves a single note by its ID.
   * @param {string} id - The note ID.
   * @returns {Object|null} The note object or null if not found.
   */
  async getNoteById(id) {
    try {
      const result = await db.execute(
        "SELECT * FROM notes WHERE id = ?",
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        title: row.title,
        tags: JSON.parse(row.tags || "[]"),
        body: row.body,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    } catch (error) {
      console.error("Error fetching note by ID:", error);
      return null;
    }
  }

  /**
   * Edits an existing note.
   * @param {string} id - The note ID.
   * @param {Object} payload - The new note data.
   * @returns {boolean} True if successful, false otherwise.
   */
  async editNoteById(id, { title, tags, body }) {
    try {
      const updatedAt = new Date().toISOString();
      const tagsJson = JSON.stringify(tags || []);

      await db.execute(
        "UPDATE notes SET title = ?, tags = ?, body = ?, updated_at = ? WHERE id = ?",
        [title, tagsJson, body, updatedAt, id]
      );

      return true;
    } catch (error) {
      console.error("Error editing note:", error);
      return false;
    }
  }

  /**
   * Deletes a note by its ID.
   * @param {string} id - The note ID.
   * @returns {boolean} True if successful, false otherwise.
   */
  async deleteNoteById(id) {
    try {
      await db.execute("DELETE FROM notes WHERE id = ?", [id]);
      return true;
    } catch (error) {
      console.error("Error deleting note:", error);
      return false;
    }
  }
}

export const noteService = new NoteService();
