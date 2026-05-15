import React from 'react';
import { motion } from 'framer-motion';

/**
 * Decorative background sticker for the Y2K aesthetic.
 * Now includes entrance animation for smooth boot-to-desktop transition.
 */
const StaticSticker = ({ src, x, y, rotate = 0, size = 200, opacity = 0.8 }) => (
  <motion.img 
    src={src} 
    initial={{ opacity: 0, scale: 0.85, x: "-50%", y: "-50%" }}
    animate={{ opacity, scale: 1, x: "-50%", y: "-50%" }}
    transition={{ duration: 2, ease: "easeOut" }}
    className="absolute pointer-events-none select-none z-[-1]"
    style={{ 
      left: x, 
      top: y, 
      rotate: `${rotate}deg`,
      width: `${size}px`,
      mixBlendMode: 'multiply',
      filter: 'brightness(1.05) saturate(1.3) contrast(1.1)',
      opacity: opacity // Mengunci opacity agar tetap konsisten sejak awal
    }} 
    alt=""
  />
);

export default StaticSticker;
