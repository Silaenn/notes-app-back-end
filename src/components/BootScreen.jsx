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
    "SYNAPSE_OS BIOS v2.0.0",
    "Copyright (C) 2000 CYBER_CORP Inc.",
    "─────────────────────────────────────",
    "CPU: NEURAL_PROC X1 @ 999MHz ... OK",
    "RAM: 640K ... EXTENDED TO 999MB ... OK",
    "GPU: CYBER_VGA ULTRA ... OK",
    "HDD: MEMORY_VAULT_DRIVE ... OK",
    "AUDIO: CYBER_WAVE_ENGINE ... OK",
    "─────────────────────────────────────",
    "Initializing SYNAPSE_OS..."
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
      className="fixed inset-0 z-[9999] bg-black text-[#00ff00] font-['VT323'] overflow-hidden select-none"
    >
      {/* Scanline Effect Layer */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.08] bg-[repeating-linear-gradient(rgba(0,0,0,0)_0px,rgba(0,0,0,0)_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_4px)] z-10" />

      {/* BIOS Screen Content */}
      {(phase === 'bios' || phase === 'loading') && (
        <div className="max-w-[600px] mx-auto pt-[15vh] px-4">
          {lines.map((line, i) => (
            <div key={i} className="leading-tight text-xl tracking-wide">{line}</div>
          ))}
          
          {phase === 'loading' && (
            <div className="mt-8 space-y-2">
              <div className="text-[#06B6D4] text-lg">LOADING_KERNEL.SYS</div>
              <div className="w-full h-6 border-2 border-[#00ff00] bg-black relative">
                <div 
                  className="h-full bg-gradient-to-r from-[#00ff00] via-[#06B6D4] to-[#EC4899] overflow-hidden transition-all duration-200"
                  style={{ width: `${progress}%` }}
                >
                  <div className="h-full w-[200%] flex animate-block-scroll whitespace-nowrap text-[10px] items-center px-1 opacity-50">
                    ████░░░░████░░░░████░░░░████░░░░████░░░░████░░░░████░░░░████░░░░████░░░░████░░░░████░░░░████░░░░████░░░░
                  </div>
                </div>
              </div>
              <div className="text-right text-[#00ff00]">{progress.toString().padStart(3, '0')}%</div>
            </div>
          )}
        </div>
      )}

      {/* Ready / Logo Screen */}
      {(phase === 'ready' || phase === 'prompt') && (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
          <div 
            className="font-['Press_Start_2P'] text-3xl"
            style={{ 
              background: 'linear-gradient(90deg, #EC4899, #06B6D4)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            }}
          >
            SYNAPSE_OS
          </div>
          <div className="text-[#06B6D4] text-xl flex items-center gap-2">
            NEURAL_LINK_ESTABLISHED <span className="w-3 h-6 bg-[#06B6D4] animate-blink" />
          </div>
          
          {phase === 'prompt' && (
            <div className="pt-16 font-['Press_Start_2P'] text-[10px] text-yellow-400 animate-pulse">
              [ PRESS ANY KEY TO CONTINUE ]
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
