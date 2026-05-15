import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * BootScreen component for SYNAPSE_OS.
 * Simulates BIOS POST, Kernel Loading, and System Initialization.
 */
const BootScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState('bios'); // bios, loading, ready, prompt, fadeout
  const [lines, setLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const [flash, setFlash] = useState(false);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  // Pre-load critical images during boot to prevent loading flashes on desktop
  const preloadImages = useCallback(async () => {
    const imagesToPreload = ['/crt.png'];
    
    const preloadImage = (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve; // Continue even if preload fails
        img.src = src;
      });
    };

    try {
      await Promise.all(imagesToPreload.map(src => preloadImage(src)));
      setImagesPreloaded(true);
    } catch {
      // Silently fail and mark as preloaded anyway
      setImagesPreloaded(true);
    }
  }, []);

  const biosLines = [
    "CyberNote System BIOS v1.2.4",
    "Copyright (C) 1998 RetroSystems Inc.",
    "─────────────────────────────────────",
    "CPU: Pentium II @ 333MHz ... OK",
    "Memory: 64MB ... OK",
    "Primary Master: 4.3GB HDD ... OK",
    "Secondary Master: CD-ROM ... OK",
    "Video: 4MB AGP ... OK",
    "─────────────────────────────────────",
    "Starting system..."
  ];

  // Phase 1: BIOS POST Screen
  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < biosLines.length) {
        setLines(prev => [...prev, biosLines[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase('loading'), 300);
      }
    }, 120);
    return () => clearInterval(interval);
  }, []);

  // Phase 2: Loading Kernel
  useEffect(() => {
    if (phase !== 'loading') return;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setPhase('ready'), 300);
          return 100;
        }
        return prev + 1;
      });
    }, 20); // Total 2000ms
    return () => clearInterval(interval);
  }, [phase]);

  // Phase 3: System Ready - Trigger image preload
  useEffect(() => {
    if (phase !== 'ready') return;
    preloadImages(); // Start preloading images while showing ready screen
    const timer = setTimeout(() => {
      setPhase('prompt');
    }, 800);
    return () => clearTimeout(timer);
  }, [phase, preloadImages]);

  // Phase 4: Press Any Key
  const handleProceed = useCallback(() => {
    if (phase !== 'prompt') return;
    setFlash(true);
    setTimeout(() => {
      setFlash(false);
      setPhase('fadeout');
    }, 100);
  }, [phase]);

  useEffect(() => {
    if (phase === 'prompt') {
      window.addEventListener('keydown', handleProceed);
      window.addEventListener('click', handleProceed);
    }
    return () => {
      window.removeEventListener('keydown', handleProceed);
      window.removeEventListener('click', handleProceed);
    };
  }, [phase, handleProceed]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={phase === 'fadeout' ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.8 }}
      onAnimationComplete={() => {
        if (phase === 'fadeout' && imagesPreloaded) onComplete();
      }}
      className="fixed inset-0 z-[9999] bg-black text-white font-['VT323'] overflow-hidden select-none"
    >
      <AnimatePresence mode="wait">
        {/* BIOS Screen Content */}
        {(phase === 'bios' || phase === 'loading') && (
          <motion.div 
            key="bios-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full max-w-[min(92vw,600px)] mx-auto px-3 sm:px-4 flex flex-col justify-center"
          >
            {lines.map((line, i) => (
              <div key={i} className="leading-tight text-sm sm:text-lg md:text-xl tracking-wide whitespace-pre-wrap break-words">{line}</div>
            ))}
            
            {phase === 'loading' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 space-y-2"
              >
                <div className="text-gray-400 text-sm sm:text-base md:text-lg">Loading modules...</div>
                <div className="w-full h-3 sm:h-4 win-border-inset bg-black relative">
                  <div 
                    className="h-full bg-white transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-center text-xs sm:text-sm">{progress}%</div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Ready / Logo Screen */}
        {(phase === 'ready' || phase === 'prompt') && (
          <motion.div 
            key="ready-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="h-full flex flex-col items-center justify-center space-y-2 bg-[#000080]"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-white text-3xl sm:text-4xl md:text-5xl font-bold italic tracking-tighter text-center px-4"
            >
              CyberNote<span className="text-gray-400">Y2K</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-white/60 text-sm sm:text-base md:text-lg flex items-center gap-2 text-center px-4"
            >
              System Initialized <span className="w-2 h-5 bg-white animate-blink" />
            </motion.div>
            
            {phase === 'prompt' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pt-6 font-mono text-[9px] sm:text-[10px] text-white animate-pulse text-center px-4"
              >
                [ CLICK OR PRESS ANY KEY TO START ]
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* White Flash Transition Overlay */}
      <AnimatePresence>
        {flash && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[10000]"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BootScreen;
