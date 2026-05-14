import { useState, useCallback } from 'react';

/**
 * Hook for managing a global confirmation modal state.
 */
export const useModal = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  const showModal = useCallback(({ title, message, onConfirm }) => {
    setModalState({
      isOpen: true,
      title,
      message,
      onConfirm,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  }, []);

  return {
    modalState,
    showModal,
    closeModal,
  };
};
