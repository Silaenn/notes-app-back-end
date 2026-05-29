/**
 * API client untuk backend server
 * Menggantikan Supabase dengan direct API calls ke backend Turso
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiClient = {
  async fetchNotes() {
    const res = await fetch(`${API_BASE_URL}/notes`);
    if (!res.ok) throw new Error('Failed to fetch notes');
    const { data } = await res.json();
    return data.notes;
  },

  async getNoteById(id) {
    const res = await fetch(`${API_BASE_URL}/notes/${id}`);
    if (!res.ok) throw new Error('Failed to fetch note');
    const { data } = await res.json();
    return data.note;
  },

  async createNote(note) {
    const res = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note)
    });
    if (!res.ok) throw new Error('Failed to create note');
    const { data } = await res.json();
    return data.noteId;
  },

  async updateNote(id, note) {
    const res = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note)
    });
    if (!res.ok) throw new Error('Failed to update note');
    return res.json();
  },

  async deleteNote(id) {
    const res = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete note');
    return res.json();
  }
};
