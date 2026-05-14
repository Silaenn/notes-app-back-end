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

  // Phase 3: System Ready
  useEffect(() => {
    if (phase !== 'ready') return;
    const timer = setTimeout(() => {
      setPhase('prompt');
    }, 800);
    return () => clearTimeout(timer);
  }, [phase]);

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
      transition={{ duration: 0.6 }}
      onAnimationComplete={() => {
        if (phase === 'fadeout') onComplete();
      }}
      className="fixed inset-0 z-[9999] bg-black text-white font-['VT323'] overflow-hidden select-none"
    >
      {/* BIOS Screen Content */}
      {(phase === 'bios' || phase === 'loading') && (
        <div className="max-w-[600px] mx-auto pt-[15vh] px-4">
          {lines.map((line, i) => (
            <div key={i} className="leading-tight text-xl tracking-wide">{line}</div>
          ))}
          
          {phase === 'loading' && (
            <div className="mt-8 space-y-2">
              <div className="text-gray-400 text-lg">Loading modules...</div>
              <div className="w-full h-4 win-border-inset bg-black relative">
                <div 
                  className="h-full bg-white transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-right text-sm">{progress}%</div>
            </div>
          )}
        </div>
      )}

      {/* Ready / Logo Screen */}
      {(phase === 'ready' || phase === 'prompt') && (
        <div className="h-full flex flex-col items-center justify-center space-y-4 bg-[#000080]">
          <div className="text-white text-4xl font-bold italic tracking-tighter">
            CyberNote<span className="text-gray-400">Y2K</span>
          </div>
          <div className="text-white/60 text-lg flex items-center gap-2">
            System Initialized <span className="w-2 h-5 bg-white animate-blink" />
          </div>
          
          {phase === 'prompt' && (
            <div className="pt-16 font-mono text-[10px] text-white animate-pulse">
              [ CLICK OR PRESS ANY KEY TO START ]
            </div>
          )}
        </div>
      )}

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
