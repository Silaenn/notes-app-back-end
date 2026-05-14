import React from 'react';

/**
 * Clickable desktop icon component.
 */
const DesktopIcon = ({ icon: Icon, label, onClick }) => (
  <div 
    className="flex flex-col items-center justify-center w-24 p-2 cursor-pointer group" 
    onClick={onClick}
  >
    <div className="p-2 transition-all">
      <Icon className="w-10 h-10 text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,1)]" />
    </div>
    <span className="win-text mt-1 px-1 text-white text-sm text-center font-medium group-hover:bg-[#000080] select-none text-shadow-sm">
      {label}
    </span>
  </div>
);

export default DesktopIcon;
