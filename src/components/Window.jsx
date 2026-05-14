import React, { useEffect, useState } from 'react';
import { motion, useDragControls, useMotionValue } from 'framer-motion';
import { X, Minus, Square } from 'lucide-react';

/**
 * Reusable Window component with Y2K aesthetic.
 * Supports dragging, maximizing, and custom sizing.
 * Includes dynamic focus management.
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
  compactWidth,
  compactHeight,
  icon: Icon, 
  zIndex = 10,
  onFocus,
  isFocused = false
}) => {
  const controls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isMaximized, setIsMaximized] = useState(false);
  const [viewport, setViewport] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMaximize = () => setIsMaximized(!isMaximized);
  const isCompactMode = viewport.width < 768;
  const horizontalPadding = isCompactMode ? 8 : 16;
  const topPadding = isCompactMode ? 8 : 16;
  const bottomPadding = isCompactMode ? 56 : 32;

  const maxWidth = Math.max(280, viewport.width - horizontalPadding * 2);
  const maxHeight = Math.max(220, viewport.height - topPadding - bottomPadding);
  const preferredWidth = Math.min(width, maxWidth);
  const preferredHeight = Math.min(height, maxHeight);
  const compactPreferredWidth = compactWidth ?? Math.floor(viewport.width * 0.86);
  const compactPreferredHeight = compactHeight ?? Math.floor(viewport.height * 0.72);
  const compactTargetWidth = Math.min(maxWidth, Math.max(280, compactPreferredWidth));
  const compactTargetHeight = Math.min(maxHeight, Math.max(220, compactPreferredHeight));
  const desktopMaxWidth = Math.min(maxWidth, Math.floor(width * 1.2));
  const desktopMaxHeight = Math.min(maxHeight, Math.floor(height * 1.2));
  const targetWidth = isCompactMode
    ? compactTargetWidth
    : (isMaximized ? desktopMaxWidth : preferredWidth);
  const targetHeight = isCompactMode
    ? compactTargetHeight
    : (isMaximized ? desktopMaxHeight : preferredHeight);
  const compactAvailableWidth = viewport.width - horizontalPadding * 2;
  const compactAvailableHeight = viewport.height - topPadding - bottomPadding;
  const compactLeft = horizontalPadding + Math.max(0, Math.floor((compactAvailableWidth - targetWidth) / 2));
  const compactTop = topPadding + Math.max(0, Math.floor((compactAvailableHeight - targetHeight) / 2));

  useEffect(() => {
    if (isCompactMode) {
      x.set(0);
      y.set(0);
    }
  }, [isCompactMode, x, y]);

  return (
    <motion.div 
      drag={!isCompactMode}
      dragMomentum={false}
      dragListener={false}
      dragControls={controls}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        width: targetWidth,
        height: targetHeight,
      }}
      exit={{ scale: 0.9, opacity: 0 }}
      style={{
        x,
        y,
        zIndex,
        top: isCompactMode ? compactTop : undefined,
        left: isCompactMode ? compactLeft : undefined,
      }}
      className={`win-border absolute flex flex-col ${className}`}
      onPointerDown={() => onFocus?.()}
    >
      <div 
        className={`win-title-bar drag-handle cursor-default transition-all ${!isFocused ? 'opacity-70 saturate-50' : ''}`}
        onPointerDown={(e) => {
          onFocus?.();
          if (!isCompactMode) {
            controls.start(e);
          }
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
            className={`win-control-btn win-control-btn-max win-control-max ${isCompactMode ? 'opacity-60 cursor-not-allowed' : ''}`}
            onClick={toggleMaximize} 
            aria-label="Maximize window"
            disabled={isCompactMode}
          >
            <Square className="w-3 h-3 font-bold" />
          </button>
          <button 
            className="win-control-btn win-control-btn-close win-control-close" 
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
