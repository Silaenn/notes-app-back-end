import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const TOAST_CONFIG = {
  success: {
    icon: CheckCircle,
    accent: '#4ade80',
    title: 'FILE_SAVED.OK',
  },
  error: {
    icon: XCircle,
    accent: '#EC4899',
    title: 'ERROR_DETECTED',
  },
  warning: {
    icon: AlertTriangle,
    accent: '#FFFF00',
    title: 'WARNING_ISSUED',
  },
  info: {
    icon: Info,
    accent: '#06B6D4',
    title: 'SYS_MESSAGE',
  },
};

/**
 * Individual Toast notification component.
 */
const Toast = ({ id, type, message, duration, createdAt, onDismiss }) => {
  const config = TOAST_CONFIG[type] || TOAST_CONFIG.info;
  const Icon = config.icon;
  const [timeLeft, setTimeLeft] = useState(duration);

  // Progress bar animation
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, duration - elapsed);
      setTimeLeft(remaining);
      if (remaining === 0) clearInterval(interval);
    }, 10);
    return () => clearInterval(interval);
  }, [duration]);

  return (
    <motion.div
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="win-border bg-[#c0c0c0] w-[280px] flex flex-col shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
    >
      {/* Toast Title Bar */}
      <div 
        className="h-[22px] flex justify-between items-center px-1.5"
        style={{ 
          background: `linear-gradient(90deg, ${config.accent}, #000000 150%)`,
          borderBottom: '2px solid #000'
        }}
      >
        <div className="flex items-center gap-2">
          <Icon className="w-3 h-3 text-white fill-black/20" />
          <span className="font-['Press_Start_2P'] text-[7px] text-white uppercase tracking-tighter">
            {config.title}
          </span>
        </div>
        <button 
          onClick={() => onDismiss(id)}
          className="w-4 h-4 flex items-center justify-center hover:bg-black/30 transition-colors"
        >
          <X className="w-3 h-3 text-white" />
        </button>
      </div>

      {/* Toast Body */}
      <div className="p-2 pb-1 bg-white/50">
        <div className="font-['VT323'] text-base leading-tight mb-2 text-black">
          {message}
        </div>
        
        {/* Progress Countdown */}
        <div className="h-1 bg-black/10 w-full overflow-hidden">
          <div 
            className="h-full transition-all duration-100 ease-linear"
            style={{ 
              width: `${(timeLeft / duration) * 100}%`,
              backgroundColor: config.accent
            }}
          />
        </div>
      </div>

      {/* Toast Footer */}
      <div className="h-4 bg-black flex items-center px-1.5 justify-between">
        <span className="font-['VT323'] text-[8px] uppercase tracking-widest" style={{ color: `${config.accent}99` }}>
          SYNAPSE_OS // {createdAt.toLocaleTimeString()}
        </span>
        <span className="font-['VT323'] text-[8px] text-white/20">LOG_ID: {id.slice(0, 4).toUpperCase()}</span>
      </div>
    </motion.div>
  );
};

/**
 * Container for stacking toast notifications.
 */
export const ToastContainer = ({ toasts, onDismiss }) => (
  <div className="fixed bottom-[72px] right-4 z-[9998] flex flex-col-reverse gap-2">
    <AnimatePresence mode="sync">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
      ))}
    </AnimatePresence>
  </div>
);

export default Toast;
