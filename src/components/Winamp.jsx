import React from 'react';
import { Music, Play, Pause, Square, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Window from './Window';

const Winamp = ({ 
  isPlaying, 
  currentTime, 
  duration, 
  volume, 
  onTogglePlay, 
  onStop, 
  onSeek, 
  onVolumeChange, 
  onClose,
  zIndex,
  onFocus,
  isFocused
}) => {
  const formatMusicTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Window 
      title="Winamp" 
      icon={Music} 
      width={320} 
      height={240} 
      compactWidth={360}
      compactHeight={250}
      onClose={onClose} 
      className="md:right-8 md:bottom-20 md:left-auto md:top-auto" 
      contentClassName="bg-[#1a1a1a]" 
      zIndex={zIndex}
      onFocus={onFocus}
      isFocused={isFocused}
    >
      <div className="p-0 flex flex-col h-full select-none no-drag">
        {/* Main Display Area */}
        <div className="bg-black m-1 p-2 border-2 border-[#333] flex gap-2 md:gap-3 h-20 md:h-24">
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-[7px] text-gray-500 font-bold uppercase leading-none mb-1">STEREOPHONIC</span>
                <span className="text-[#00ff00] font-mono text-[9px] md:text-[10px] truncate w-24 md:w-32">nexus.mp3</span>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-[7px] text-gray-500 font-bold uppercase leading-none">kbps/khz</span>
                <span className="text-[9px] text-[#00ff00] font-mono">128/44.1</span>
              </div>
            </div>
            
            <div className="flex-1 flex items-end gap-[1px] pt-1 overflow-hidden w-full">
              {[...Array(50)].map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ height: isPlaying ? [2, Math.random() * 35 + 5, 2] : 2 }}
                  transition={{ repeat: isPlaying ? Infinity : 0, duration: 0.2, delay: i * 0.005 }}
                  className="flex-1 bg-[#00ff00]"
                />
              ))}
            </div>
          </div>

          <div className="w-16 md:w-20 bg-[#001100] border border-[#003300] flex flex-col items-center justify-center p-1 rounded-sm">
            <span className="text-[7px] text-[#00ff00]/40 font-bold uppercase leading-none mb-1">TIME</span>
            <div className="text-lg md:text-xl font-mono text-[#00ff00] leading-none tracking-tighter">
              {formatMusicTime(currentTime)}
            </div>
            <div className="w-full mt-1 h-0.5 bg-[#002200]">
              <div 
                className="h-full bg-[#00ff00]" 
                style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 bg-[#c0c0c0] p-1 border-t border-[#f6f6f6] flex flex-col gap-2">
          <div className="px-1">
            <input 
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={(e) => onSeek(e.target.value)}
              className="win-seek-bar w-full h-3 bg-black border border-[#555] appearance-none cursor-pointer"
            />
          </div>

          <div className="flex justify-between items-center px-1">
            <div className="flex gap-1">
              <button onClick={onTogglePlay} className="win-button w-7 h-7 md:w-8 md:h-8 flex items-center justify-center">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <button onClick={onStop} className="win-button w-7 h-7 md:w-8 md:h-8 flex items-center justify-center">
                <Square className="w-3 h-3" />
              </button>
            </div>

            <div className="flex flex-col gap-1 items-end">
              <div className="flex items-center gap-2">
                <Volume2 className="w-3 h-3 text-black" />
                <div className="w-16 md:w-20 h-3 bg-black border border-[#555] relative overflow-hidden">
                  <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => onVolumeChange(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="absolute inset-0 bg-[#00ff00]" style={{ clipPath: `inset(0 ${100 - (volume * 100)}% 0 0)` }}></div>
                  <div className="absolute inset-0 flex gap-[1px] pointer-events-none">
                    {[...Array(10)].map((_, i) => <div key={i} className="flex-1 border-r border-black/30"></div>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#808080] text-[#c0c0c0] text-[7px] px-2 py-0.5 flex justify-between font-bold border-t border-[#000]">
          <span>WINAMP v1.0</span>
          <span>SAMPLED: OK</span>
        </div>
      </div>
    </Window>
  );
};

export default Winamp;
