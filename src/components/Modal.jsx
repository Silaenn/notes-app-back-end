import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

/**
 * Global Retro Confirmation Modal.
 */
const Modal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="win-border w-[320px] shadow-[12px_12px_0_rgba(0,0,0,0.4)]"
          >
            <div className="win-title-bar">
              <span>{title || 'System Message'}</span>
            </div>
            <div className="p-6 bg-[#c0c0c0] flex flex-col items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-400 p-2 win-border">
                  <AlertTriangle className="w-8 h-8 text-black" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-black win-text">{message}</span>
                </div>
              </div>
              <div className="flex gap-4 w-full">
                <button 
                  className="flex-1 win-button py-2 bg-[#c0c0c0] hover:bg-[#000080] hover:text-white" 
                  onClick={() => {
                    onConfirm?.();
                    onCancel();
                  }}
                >
                  Yes
                </button>
                <button 
                  className="flex-1 win-button py-2 bg-[#c0c0c0] hover:bg-gray-400" 
                  onClick={onCancel}
                >
                  No
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
