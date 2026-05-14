import React, { useState, useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, RefreshCw, Music, Info } from 'lucide-react';

/**
 * Windows 95 / Y2K styled Context Menu component.
 * Includes smart positioning to stay within viewport bounds.
 */
const ContextMenu = ({ x, y, onClose, onNewNote, onOpenWinamp, noteCount }) => {
  const [showProps, setShowProps] = useState(false);
  const [coords, setCoords] = useState({ x, y });
  const menuRef = useRef(null);

  useLayoutEffect(() => {
    if (menuRef.current) {
      const { offsetWidth, offsetHeight } = menuRef.current;
      let newX = x;
      let newY = y;

      if (x + offsetWidth > window.innerWidth) {
        newX = window.innerWidth - offsetWidth - 10;
      }
      if (y + offsetHeight > window.innerHeight) {
        newY = window.innerHeight - offsetHeight - 10;
      }

      setCoords({ x: newX, y: newY });
    }
  }, [x, y]);

  const MenuItem = ({ icon: Icon, label, onClick, disabled = false }) => (
    <div 
      className={`
        group flex items-center gap-3 px-4 py-2 transition-colors select-none
        ${disabled ? 'text-gray-400 cursor-default' : 'text-black cursor-default hover:bg-black hover:text-yellow-400'}
      `}
      onClick={(e) => {
        if (disabled) return;
        e.stopPropagation();
        // Brief flash effect
        const target = e.currentTarget;
        target.style.backgroundColor = '#FFFF00';
        target.style.color = '#000';
        setTimeout(() => {
          onClick();
        }, 100);
      }}
    >
      <Icon className={`w-3.5 h-3.5 ${!disabled && 'group-hover:text-yellow-400'}`} />
      <span className="font-['Press_Start_2P'] text-[8px] uppercase">{label}</span>
    </div>
  );

  const Separator = () => (
    <div className="mx-2 my-1 border-t-2 border-dashed border-black/20" />
  );

  return (
    <motion.div
      ref={menuRef}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.08 }}
      style={{ 
        position: 'fixed', 
        left: coords.x, 
        top: coords.y, 
        zIndex: 10000,
        transformOrigin: 'top left'
      }}
      className="win-border bg-[#c0c0c0] min-width-[220px] py-1 flex flex-col shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
    >
      {/* Header Bar */}
      <div className="h-5 flex items-center justify-center border-b-2 border-black mb-1 px-4" style={{ background: 'linear-gradient(90deg, #6B21A8, #EC4899, #06B6D4)' }}>
        <span className="font-['Press_Start_2P'] text-[7px] text-white uppercase">DESKTOP_MENU</span>
      </div>

      <MenuItem 
        icon={FileText} 
        label="NEW_NOTE.EXE" 
        onClick={onNewNote} 
      />
      <MenuItem 
        icon={RefreshCw} 
        label="REFRESH_DESKTOP" 
        onClick={() => window.location.reload()} 
      />
      
      <Separator />
      
      <MenuItem 
        icon={Music} 
        label="OPEN_WINAMP" 
        onClick={onOpenWinamp} 
      />
      
      <Separator />
      
      <MenuItem 
        icon={Info} 
        label="PROPERTIES" 
        onClick={() => setShowProps(!showProps)} 
      />

      {showProps && (
        <div className="px-4 py-3 mt-1 border-t-2 border-dashed border-black/20 bg-black/5 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="font-['VT323'] text-sm text-[#06B6D4] leading-tight space-y-1">
            <div>SYNAPSE_OS v2.0</div>
            <div>BUILD: Y2K_ULTRA</div>
            <div>NOTES: {noteCount.toString().padStart(2, '0')} FILES</div>
            <div className="flex items-center gap-2">
              STATUS: <span className="animate-pulse">RADICAL</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ContextMenu;
