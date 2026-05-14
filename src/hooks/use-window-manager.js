import { useState, useCallback } from 'react';

/**
 * Custom hook for managing window focus and z-index stack.
 * Ensures the last focused window always has the highest z-index.
 */
export const useWindowManager = () => {
  // Tracks the focus order as a stack
  // Most recently focused = last in array = highest z-index
  const [focusOrder, setFocusOrder] = useState(['explorer', 'winamp', 'editor']);

  const focusWindow = useCallback((name) => {
    setFocusOrder(prev => {
      // If already on top, don't trigger state update
      if (prev[prev.length - 1] === name) return prev;
      return [...prev.filter(w => w !== name), name];
    });
  }, []);

  const getZIndex = useCallback((name) => {
    const index = focusOrder.indexOf(name);
    if (index === -1) return 10; // BASE_Z_INDEX
    return 10 + (index * 10); // BASE_Z_INDEX + (index * Z_STEP)
  }, [focusOrder]);

  return { focusWindow, getZIndex };
};
