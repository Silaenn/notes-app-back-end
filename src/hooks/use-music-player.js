import { useState, useEffect, useRef, useCallback } from 'react';
import { UI_CONFIG } from '../constants/config';

/**
 * Custom hook for managing audio playback.
 */
export const useMusicPlayer = (audioSrc) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(UI_CONFIG.DEFAULT_VOLUME);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnd = () => {
      audio.currentTime = 0;
      audio.play().catch(err => console.error("Looping failed:", err));
      setIsPlaying(true);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnd);
    };
  }, [audioSrc]); // Only re-attach if the source changes

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const seek = useCallback((time) => {
    if (!audioRef.current) return;
    
    const newTime = parseFloat(time);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, []);

  const changeVolume = useCallback((val) => {
    setVolume(parseFloat(val));
  }, []);

  return {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    stop,
    seek,
    changeVolume
  };
};
