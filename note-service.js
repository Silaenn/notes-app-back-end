import { nanoid } from "nanoid";
import notes from "./notes.js";

/**
 * Service layer for Note operations.
 * Handles all business logic and data persistence (currently in-memory).
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
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
      id,
      title,
      tags: tags || [],
      body,
      createdAt,
      updatedAt,
    };

    notes.push(newNote);

    const isSuccess = notes.some((note) => note.id === id);
    if (!isSuccess) {
      throw new Error("Failed to persist note");
    }

    return id;
  }

  /**
   * Retrieves all notes.
   * @returns {Array<Object>} List of all notes.
   */
  async getAllNotes() {
    return notes;
  }

  /**
   * Retrieves a single note by its ID.
   * @param {string} id - The note ID.
   * @returns {Object|null} The note object or null if not found.
   */
  async getNoteById(id) {
    const note = notes.find((n) => n.id === id);
    return note || null;
  }

  /**
   * Updates an existing note.
   * @param {string} id - The note ID to update.
   * @param {Object} payload - The updated note data.
   * @returns {boolean} True if update was successful.
   */
  async editNoteById(id, { title, tags, body }) {
    const updatedAt = new Date().toISOString();
    const index = notes.findIndex((note) => note.id === id);

    if (index === -1) {
      return false;
    }

    notes[index] = {
      ...notes[index],
      title,
      tags: tags || notes[index].tags,
      body,
      updatedAt,
    };

    return true;
  }

  /**
   * Deletes a note by its ID.
   * @param {string} id - The note ID to delete.
   * @returns {boolean} True if deletion was successful.
   */
  async deleteNoteById(id) {
    const index = notes.findIndex((note) => note.id === id);

    if (index === -1) {
      return false;
    }

    notes.splice(index, 1);
    return true;
  }
}

export const noteService = new NoteService();
