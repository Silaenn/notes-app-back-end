import React from 'react';

/**
 * Clickable desktop icon component.
 */
const DesktopIcon = ({ icon: Icon, label, onClick }) => (
  <div className="desktop-icon group hover-glitch" onClick={onClick}>
    <div className="p-4 win-border bg-white group-hover:bg-yellow-400 group-hover:border-pink-500 transition-colors border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <Icon className="w-10 h-10" style={{ color: '#000' }} />
    </div>
    <span className="win-text mt-2 px-2 bg-yellow-400 text-black font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:bg-pink-500 group-hover:text-white">
      {label}
    </span>
  </div>
);

export default DesktopIcon;
