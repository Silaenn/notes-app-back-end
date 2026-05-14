import React from 'react';

/**
 * Decorative background sticker for the Y2K aesthetic.
 */
const StaticSticker = ({ src, x, y, rotate = 0, size = 200, opacity = 0.82 }) => (
  <img 
    src={src} 
    className="absolute pointer-events-none select-none z-[-1]"
    style={{ 
      left: x, 
      top: y, 
      transform: `translate(-50%, -50%) rotate(${rotate}deg)`, 
      width: `${size}px`,
      mixBlendMode: 'multiply',
      filter: 'brightness(1.05) saturate(1.3) contrast(1.1)',
      opacity
    }} 
    alt=""
  />
);

export default StaticSticker;
