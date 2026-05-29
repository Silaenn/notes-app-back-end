import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../lib/api-client';

/**
 * Custom hook for managing notes data using backend API.
 */
export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.fetchNotes();
      setNotes(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const saveNote = async (note) => {
    try {
      const noteData = {
        title: note.title,
        tags: typeof note.tags === 'string' 
          ? note.tags.split(',').map(t => t.trim()).filter(Boolean) 
          : note.tags,
        body: note.body
      };

      if (note.id) {
        await apiClient.updateNote(note.id, noteData);
      } else {
        await apiClient.createNote(noteData);
      }

      await fetchNotes();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteNote = async (id) => {
    try {
      await apiClient.deleteNote(id);
      await fetchNotes();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    notes,
    loading,
    error,
    saveNote,
    deleteNote,
    refreshNotes: fetchNotes
  };
};
