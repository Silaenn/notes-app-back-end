import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

/**
 * Desktop Taskbar component displaying OS name, menu items, and real-time clock.
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
    hour12: true 
  });

  return (
    <div className="win-taskbar">
      <div className="flex items-center gap-4">
        <button className="win-button px-4 bg-yellow-400 text-black border-2 border-black shadow-none active:translate-y-0.5 hover:bg-black hover:text-yellow-400">
          SYNAPSE_OS
        </button>
        <div className="hidden md:flex gap-4">
          {['SYS', 'MEM', 'RAD', 'HLP'].map((item) => (
            <button 
              key={item} 
              className="win-text hover:bg-black hover:text-pink-500 px-2 uppercase font-black transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      
      <div className="marquee-container hidden lg:block">
        <div className="marquee-text">
          WELCOME TO SYNAPSE_OS v2.0 // NEURAL LINK ESTABLISHED // SYSTEM STATUS: RADICAL // MEMORY_VAULT_ACTIVE // 
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="win-border px-2 py-0.5 flex items-center gap-2 win-text bg-black text-yellow-400 border-2 border-black shadow-none">
          <Clock className="w-4 h-4" />
          {formatTime(time)}
        </div>
      </div>
    </div>
  );
};

export default Taskbar;
