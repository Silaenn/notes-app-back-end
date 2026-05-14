import React, { useState, useEffect } from 'react';
import { Clock, Zap, Volume2 } from 'lucide-react';

/**
 * Enhanced Taskbar component for SYNAPSE_OS.
 * Features a gradient start button, system status indicators, and a masked marquee.
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
    second: '2-digit',
    hour12: true 
  });

  const StatusItem = ({ label, dotColor, tooltip, animate = false }) => (
    <div className="group relative flex items-center">
      {/* Tooltip */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 text-[7px] font-['Press_Start_2P'] border border-white/30 hidden group-hover:block z-50 whitespace-nowrap pointer-events-none">
        {tooltip}
      </div>
      
      <button className="win-text hover:bg-black hover:text-pink-500 px-2 uppercase font-black transition-colors flex items-center">
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 bg-${dotColor} ${animate ? 'animate-pulse' : ''}`} style={{ backgroundColor: dotColor === 'white' ? '#fff' : dotColor === 'yellow' ? '#FFFF00' : dotColor === 'cyan' ? '#06B6D4' : dotColor === 'green' ? '#4ade80' : dotColor }} />
        {label}
      </button>
    </div>
  );

  return (
    <div className="win-taskbar taskbar-texture">
      {/* Top Bevel Highlight */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/60 pointer-events-none" />

      {/* Start Button & Menus */}
      <div className="flex items-center gap-4">
        <button className="win-button px-4 bg-gradient-to-r from-purple-700 to-pink-500 text-white border-2 border-black shadow-none active:translate-y-0.5 hover:from-pink-500 hover:to-purple-700 flex items-center gap-2">
          <Zap className="w-3 h-3 fill-white" />
          SYNAPSE_OS
        </button>
        
        <div className="hidden md:flex gap-2">
          <StatusItem label="SYS" dotColor="green" tooltip="SYSTEM_MONITOR" animate />
          <StatusItem label="MEM" dotColor="cyan" tooltip="MEMORY_USAGE" animate />
          <StatusItem label="RAD" dotColor="yellow" tooltip="RADIO_BROADCAST" />
          <StatusItem label="HLP" dotColor="white" tooltip="HELP_DOCS" />
        </div>
      </div>
      
      {/* Marquee Center */}
      <div className="marquee-container marquee-mask hidden lg:block">
        <div className="marquee-text">
          SYNAPSE_OS v2.0 ░░ NEURAL LINK ESTABLISHED ░░ MEMORY_VAULT: ACTIVE ░░ NOTES_LOADED: OK ░░ CRT_MODE: ENABLED ░░ SYSTEM_TEMP: 36.6°C ░░ UPTIME: ∞ ░░ VIBE_CHECK: PASSED ░░
        </div>
      </div>

      {/* System Tray (Right) */}
      <div className="flex items-center gap-3">
        {/* Audio Status */}
        <div className="win-border px-1.5 py-0.5 flex items-center gap-1.5 bg-black text-yellow-400 border-2 border-black shadow-none">
          <Volume2 className="w-3 h-3" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
        </div>

        {/* Network Status */}
        <div className="win-border px-1.5 py-0.5 flex items-center gap-1.5 bg-black text-yellow-400 border-2 border-black shadow-none">
          <span className="text-[10px] font-['VT323']">NET</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />
        </div>

        {/* Clock */}
        <div className="win-border px-2 py-0.5 flex items-center gap-2 win-text bg-black text-yellow-400 border-2 border-black shadow-none">
          <Clock className="w-4 h-4" />
          {formatTime(time)}
        </div>
      </div>
    </div>
  );
};

export default Taskbar;
