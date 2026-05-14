import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing the context menu state and global event listeners.
 */
export const useContextMenu = () => {
  const [menuState, setMenuState] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const handleContextMenu = useCallback((e) => {
    // Only show menu if we're clicking on something that isn't a window or button
    // This allows the desktop to have a context menu while items like buttons keep their own behavior
    const target = e.target;
    const isWindow = target.closest('.win-border');
    
    // If we click a window, let its own context (if any) or default behavior happen
    if (isWindow && !target.classList.contains('desktop-icon')) {
      // Allow browser context menu inside windows if desired, or just return
      return;
    }

    e.preventDefault();
    setMenuState({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    });
  }, []);

  const closeMenu = useCallback(() => {
    setMenuState((prev) => ({ ...prev, visible: false }));
  }, []);

  useEffect(() => {
    const handleGlobalClick = () => {
      if (menuState.visible) closeMenu();
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeMenu();
    };

    if (menuState.visible) {
      window.addEventListener('click', handleGlobalClick);
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuState.visible, closeMenu]);

  return {
    menuState,
    handleContextMenu,
    closeMenu,
  };
};
