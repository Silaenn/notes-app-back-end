import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Custom hook for managing notes data using Supabase.
 */
export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (fetchError) throw fetchError;

      setNotes(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
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
        body: note.body,
        updated_at: new Date().toISOString()
      };

      let result;
      if (note.id) {
        // Update
        result = await supabase
          .from('notes')
          .update(noteData)
          .eq('id', note.id);
      } else {
        // Insert
        result = await supabase
          .from('notes')
          .insert([{ ...noteData, created_at: new Date().toISOString() }]);
      }

      if (result.error) throw result.error;

      await fetchNotes();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteNote = async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

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
