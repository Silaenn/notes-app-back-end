import React, { useState, useEffect } from 'react';
import { Clock, Zap, Volume2 } from 'lucide-react';

/**
 * Enhanced Taskbar component with Balanced Retro-Future Aesthetic.
 */
const Taskbar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  });

  const StatusItem = ({ label, dotColor, tooltip }) => (
    <div className="group relative flex items-center">
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 text-[8px] font-mono border border-white/30 hidden group-hover:block z-50 whitespace-nowrap">
        {tooltip}
      </div>
      <button className="win-text hover:bg-black hover:text-[#00ff00] px-2 uppercase font-bold text-[11px] transition-colors flex items-center">
        <div className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: dotColor }} />
        {label}
      </button>
    </div>
  );

  return (
    <div className="win-taskbar">
      {/* Start Button & Menus */}
      <div className="flex items-center gap-2">
        <button className="win-button px-2 flex items-center gap-1 h-8 bg-[#c0c0c0]">
          <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-blue-700 border border-black/30" />
          <span className="font-bold text-sm" style={{ fontVariant: 'small-caps' }}>Start</span>
        </button>
        
        <div className="hidden md:flex gap-1 border-l border-white/30 ml-2 pl-2">
          <StatusItem label="SYS" dotColor="#4ade80" tooltip="SYSTEM_OK" />
          <StatusItem label="NET" dotColor="#06B6D4" tooltip="LINK_ACTIVE" />
          <StatusItem label="MEM" dotColor="#818cf8" tooltip="BUFF_OK" />
        </div>
      </div>
      
      {/* Marquee Center */}
      <div className="marquee-container hidden lg:block">
        <div className="marquee-text">
          CYBER_NOTE_Y2K v1.2 ░░ CORE_STABLE ░░ MEMORY_LOADED ░░ VIBE_CHECK: PASSED ░░ SYSTEM_INITIALIZED ░░ 
        </div>
      </div>

      {/* System Tray (Right) */}
      <div className="flex items-center gap-1 h-8 win-border-inset px-2 bg-[#c0c0c0]">
        <Volume2 className="w-3.5 h-3.5 mr-1" />
        <div className="w-[1px] h-4 bg-[#808080] border-r border-white mx-1" />
        <span className="text-sm font-medium font-mono">{formatTime(time)}</span>
      </div>
    </div>
  );
};

export default Taskbar;
