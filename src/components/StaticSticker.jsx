import React from 'react';

/**
 * Decorative background sticker for the Y2K aesthetic.
 */
const StaticSticker = ({ src, x, y, rotate = 0, size = 200, blend = 'screen' }) => (
  <img 
    src={src} 
    className="absolute pointer-events-none select-none z-[-1]"
    style={{ 
      left: x, 
      top: y, 
      transform: `translate(-50%, -50%) rotate(${rotate}deg)`, 
      width: `${size}px`,
      mixBlendMode: blend,
      filter: blend === 'multiply' ? 'contrast(1.4) brightness(1.1) saturate(1.2)' : 'none',
      opacity: blend === 'multiply' ? 0.9 : 0.72
    }} 
    alt="Y2K Sticker"
  />
);

export default StaticSticker;
