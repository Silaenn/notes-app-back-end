import { useState, useEffect, useCallback } from 'react';
import { API_CONFIG } from '../constants/config';

/**
 * Custom hook for managing notes data and operations.
 */
export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NOTES}`);
      const result = await response.json();

      if (result.status === 'success') {
        setNotes(result.data.notes);
        setError(null);
      } else {
        throw new Error(result.message || 'Failed to fetch notes');
      }
    } catch (err) {
      setError(err.message);
      // In a real app, we might use a toast notification here
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const saveNote = async (note) => {
    const isNew = !note.id;
    const url = isNew 
      ? `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NOTES}`
      : `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NOTES}/${note.id}`;
    
    const method = isNew ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: note.title,
          tags: typeof note.tags === 'string' 
            ? note.tags.split(',').map(t => t.trim()) 
            : note.tags,
          body: note.body
        })
      });

      const result = await response.json();
      if (result.status === 'success') {
        await fetchNotes();
        return { success: true };
      }
      throw new Error(result.message || 'Failed to save note');
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NOTES}/${id}`, { 
        method: 'DELETE' 
      });
      const result = await response.json();

      if (result.status === 'success') {
        await fetchNotes();
        return { success: true };
      }
      throw new Error(result.message || 'Failed to delete note');
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
