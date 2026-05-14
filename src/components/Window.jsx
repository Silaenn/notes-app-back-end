import React, { useState } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { X, Minus, Square } from 'lucide-react';

/**
 * Reusable Window component with Y2K aesthetic.
 * Supports dragging, maximizing, and custom sizing.
 */
const Window = ({ 
  title, 
  children, 
  onClose, 
  onMinimize, 
  className = "", 
  contentClassName = "bg-white", 
  width = 400, 
  height = 300, 
  icon: Icon, 
  zIndex = 10 
}) => {
  const controls = useDragControls();
  const [isMaximized, setIsMaximized] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const toggleMaximize = () => setIsMaximized(!isMaximized);

  return (
    <motion.div 
      drag
      dragMomentum={false}
      dragListener={false}
      dragControls={controls}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        width: isMaximized ? width * 1.2 : width,
        height: isMaximized ? height * 1.2 : height,
      }}
      exit={{ scale: 0.9, opacity: 0 }}
      style={{ zIndex }}
      className={`win-border absolute flex flex-col ${className}`}
      onPointerDown={() => setIsActive(true)}
      onPointerUp={() => setIsActive(false)}
    >
      <div 
        className={`win-title-bar drag-handle cursor-default transition-all ${!isActive ? 'opacity-80 grayscale-[30%]' : ''}`}
        onPointerDown={(e) => {
          setIsActive(true);
          controls.start(e);
        }}
      >
        <div className="flex items-center gap-2 pointer-events-none">
          {Icon && <Icon className="w-3.5 h-3.5" />}
          <span className="win-text truncate">{title}</span>
        </div>
        <div className="flex gap-1.5">
          <button 
            className="win-control-btn win-control-min" 
            onClick={onMinimize} 
            aria-label="Minimize window"
          >
            <Minus className="w-3 h-3 font-bold" />
          </button>
          <button 
            className="win-control-btn win-control-max" 
            onClick={toggleMaximize} 
            aria-label="Maximize window"
          >
            <Square className="w-3 h-3 font-bold" />
          </button>
          <button 
            className="win-control-btn win-control-close" 
            onClick={onClose} 
            aria-label="Close window"
          >
            <X className="w-3 h-3 font-bold" />
          </button>
        </div>
      </div>
      <div 
        className={`flex-1 overflow-auto win-border-inset m-1 p-1 border-t border-white/60 ${contentClassName}`}
      >
        {children}
      </div>
    </motion.div>
  );
};

export default Window;
