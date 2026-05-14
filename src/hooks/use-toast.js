import { useState, useCallback, useRef, useEffect } from 'react';
import { nanoid } from 'nanoid';

/**
 * Custom hook for managing SYNAPSE_OS toast notifications.
 * Handles auto-dismissal, stacking limits, and cleanup.
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const timeouts = useRef({});

  const dismissToast = useCallback((id) => {
    if (timeouts.current[id]) {
      clearTimeout(timeouts.current[id]);
      delete timeouts.current[id];
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({ type, message, duration = 3000 }) => {
    const id = nanoid();
    const createdAt = new Date();

    const newToast = {
      id,
      type,
      message,
      duration,
      createdAt,
    };

    setToasts((prev) => {
      // Keep only the 2 newest to make room for the 1 new one (max 3)
      const filtered = prev.length >= 3 ? prev.slice(prev.length - 2) : prev;
      return [...filtered, newToast];
    });

    // Auto-dismissal timer
    const timeoutId = setTimeout(() => {
      dismissToast(id);
    }, duration);

    timeouts.current[id] = timeoutId;
  }, [dismissToast]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(timeouts.current).forEach(clearTimeout);
    };
  }, []);

  return {
    toasts,
    showToast,
    dismissToast,
  };
};
