import React, { useState, useEffect } from 'react';
import { Clock, Zap, Volume2, Search, FileText, Music, Folder} from 'lucide-react';

/**
 * Enhanced Taskbar component with Balanced Retro-Future Aesthetic.
 */
const Taskbar = ({ windows = {}, onRestore, isTopWindow }) => {
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

  const windowConfig = {
    explorer: { label: 'Explorer', icon: Folder },
    editor: { label: 'Editor', icon: FileText },
    winamp: { label: 'Winamp', icon: Music },
  };

  const activeWindowNames = Object.keys(windows).filter(name => windows[name].isOpen);

  return (
    <div className="win-taskbar">
      {/* Main Brand Button */}
      <div className="flex items-center gap-2">
        <button className="win-button px-2 flex items-center gap-1.5 h-8 bg-[#c0c0c0]">
          <div className="w-4 h-4 bg-gradient-to-br from-[#000080] to-[#004d4d] border border-black/30" />
          <span className="font-bold text-xs" style={{ fontVariant: 'small-caps' }}>CyberNote</span>
        </button>
        
        <div className="hidden md:flex gap-1 border-l border-white/30 ml-2 pl-2">
          <StatusItem label="SYS" dotColor="#4ade80" tooltip="SYSTEM_OK" />
        </div>
      </div>
      
      {/* Active Windows Area */}
      <div className="flex-1 flex items-center gap-1 px-2 overflow-x-auto no-scrollbar h-full">
        {activeWindowNames.map(name => {
          const config = windowConfig[name];
          const isFocused = isTopWindow(name);
          const isMinimized = windows[name].isMinimized;
          const Icon = config.icon;

          return (
            <button
              key={name}
              onClick={() => onRestore(name)}
              className={`
                flex items-center gap-2 px-3 h-8 border-2 transition-all select-none min-w-[100px] max-w-[160px]
                ${isFocused 
                  ? 'bg-white border-inset border-[#808080] shadow-inner font-bold' 
                  : 'win-border bg-[#c0c0c0] hover:bg-[#d0d0d0]'
                }
                ${isMinimized ? 'opacity-60 saturate-50 italic' : ''}
              `}
              style={isFocused ? { 
                borderColor: '#808080 #dfdfdf #dfdfdf #808080',
                borderWidth: '2px'
              } : {}}
            >
              <Icon className={`w-3.5 h-3.5 ${isFocused ? 'text-[#000080]' : 'text-gray-700'}`} />
              <span className="text-[10px] md:text-xs truncate uppercase tracking-tight">
                {config.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Marquee Center - Hidden when windows are open to save space */}
      {activeWindowNames.length === 0 && (
        <div className="marquee-container hidden lg:block">
          <div className="marquee-text">
            CYBER_NOTE_Y2K v1.2 ░░ CORE_STABLE ░░ MEMORY_LOADED ░░ VIBE_CHECK: PASSED ░░ SYSTEM_INITIALIZED ░░ 
          </div>
        </div>
      )}

      {/* System Tray (Right) */}
      <div className="flex items-center gap-1 h-8 win-border-inset px-2 bg-[#c0c0c0] ml-2">
        <Volume2 className="w-3.5 h-3.5 mr-1" />
        <div className="w-[1px] h-4 bg-[#808080] border-r border-white mx-1" />
        <span className="text-sm font-medium font-mono">{formatTime(time)}</span>
      </div>
    </div>
  );
};

export default Taskbar;
