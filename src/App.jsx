import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { 
  X, 
  Minus, 
  Square, 
  Search, 
  FileText, 
  Folder, 
  Music, 
  Clock,
  Play,
  Pause,
  Trash2,
  Save,
  Volume2
} from 'lucide-react';

const Window = ({ title, children, onClose, onMinimize, className, contentClassName = "bg-white", width = 400, height = 300, icon: Icon, zIndex = 10 }) => {
  const controls = useDragControls();
  const [isMaximized, setIsMaximized] = useState(false);

  const toggleMaximize = () => setIsMaximized(!isMaximized);

  return (
    <motion.div 
      drag
      dragMomentum={false}
      dragListener={false}
      dragControls={controls}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        width: isMaximized ? width * 1.2 : width,
        height: isMaximized ? height * 1.2 : height,
      }}
      exit={{ scale: 0.9, opacity: 0 }}
      style={{ zIndex }}
      className={`win-border absolute flex flex-col ${className}`}
    >
      <div 
        className="win-title-bar drag-handle cursor-default"
        onPointerDown={(e) => controls.start(e)}
      >
        <div className="flex items-center gap-2 pointer-events-none">
          {Icon && <Icon className="w-3.5 h-3.5" />}
          <span className="win-text truncate">{title}</span>
        </div>
        <div className="flex gap-1.5">
          <button className="win-control-btn win-control-min" onClick={onMinimize} aria-label="Minimize window"><Minus className="w-3 h-3" /></button>
          <button className="win-control-btn win-control-max" onClick={toggleMaximize} aria-label="Maximize window"><Square className="w-3 h-3" /></button>
          <button className="win-control-btn win-control-close" onClick={onClose} aria-label="Close window"><X className="w-3 h-3" /></button>
        </div>
      </div>
      <div 
        className={`flex-1 overflow-auto win-border-inset m-1 p-1 ${contentClassName}`}
      >
        {children}
      </div>
    </motion.div>
  );
};

const Taskbar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const formatDate = (date) => date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="win-taskbar">
      <div className="flex items-center gap-4">
        <button className="win-button px-4 bg-yellow-400 text-black border-2 border-black shadow-none active:translate-y-0.5 hover:bg-black hover:text-yellow-400">
          SYNAPSE_OS
        </button>
        <div className="hidden md:flex gap-4">
          {['SYS', 'MEM', 'RAD', 'HLP'].map((item) => (
            <button key={item} className="win-text hover:bg-black hover:text-pink-500 px-2 uppercase font-black transition-colors">{item}</button>
          ))}
        </div>
      </div>
      
      <div className="marquee-container hidden lg:block">
        <div className="marquee-text">
          WELCOME TO SYNAPSE_OS v2.0 // NEURAL LINK ESTABLISHED // SYSTEM STATUS: RADICAL // MEMORY_VAULT_ACTIVE // 
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="win-border px-2 py-0.5 flex items-center gap-2 win-text bg-black text-yellow-400 border-2 border-black shadow-none">
          <Clock className="w-4 h-4" />
          {formatTime(time)}
        </div>
      </div>
    </div>
  );
};

const DesktopIcon = ({ icon: Icon, label, color, onClick }) => (
  <div className="desktop-icon group hover-glitch" onClick={onClick}>
    <div className={`p-4 win-border bg-white group-hover:bg-yellow-400 group-hover:border-pink-500 transition-colors border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
      <Icon className="w-10 h-10" style={{ color: '#000' }} />
    </div>
    <span className="win-text mt-2 px-2 bg-yellow-400 text-black font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:bg-pink-500 group-hover:text-white">{label}</span>
  </div>
);

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

export default function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [windows, setWindows] = useState({ explorer: true, editor: false, winamp: false });
  const [activeNote, setActiveNote] = useState(null);
  const [search, setSearch] = useState('');

  // Music Player State
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnd = () => {
      audio.currentTime = 0;
      audio.play();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnd);
    };
  }, [volume]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
  };

  const formatMusicTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchNotes = async () => {
    try {
      const response = await fetch('http://localhost:5000/notes');
      const result = await response.json();
      if (result.status === 'success') setNotes(result.data.notes);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotes(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const isNew = !activeNote.id;
    const url = isNew ? 'http://localhost:5000/notes' : `http://localhost:5000/notes/${activeNote.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: activeNote.title,
          tags: typeof activeNote.tags === 'string' ? activeNote.tags.split(',').map(t => t.trim()) : activeNote.tags,
          body: activeNote.body
        })
      });
      const result = await response.json();
      if (result.status === 'success') {
        fetchNotes();
        setWindows(prev => ({ ...prev, editor: false }));
      }
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note permanently?')) return;
    try {
      const response = await fetch(`http://localhost:5000/notes/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.status === 'success') fetchNotes();
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.body.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen w-screen relative pb-12 overflow-hidden">
      <Taskbar />

      {/* Persisted Audio Element */}
      <audio ref={audioRef} src="/nexus.mp3" />

      {/* Asset Stickers */}
      <StaticSticker src="/hati.png" x="79%" y="18%" rotate={12} size={200} />
      <StaticSticker src="/kupu-kupu.png" x="17%" y="76%" rotate={-14} size={250} />
      <StaticSticker src="/alien.png" x="55%" y="56%" rotate={20} size={180} />
      <StaticSticker src="/bintang.png" x="83%" y="84%" rotate={16} size={220} />
      <StaticSticker src="/kaset.png" x="30%" y="30%" rotate={-10} size={170} />

      {/* Desktop Icons */}
      <div className="absolute top-8 left-8 grid grid-cols-1 gap-12 z-10">
        <DesktopIcon icon={Folder} label="MY_NOTES" color="#ffd700" onClick={() => setWindows(p => ({...p, explorer: true}))} />
        <DesktopIcon icon={FileText} label="NEW_NOTE" color="#169b62" onClick={() => {
          setActiveNote({ title: '', body: '', tags: [] });
          setWindows(p => ({...p, editor: true}));
        }} />
        <DesktopIcon icon={Music} label="WINAMP" color="#2f6df6" onClick={() => setWindows(p => ({...p, winamp: true}))} />
      </div>

      <AnimatePresence>
        {windows.explorer && (
          <Window 
            key="explorer"
            title="Note Explorer" 
            icon={Folder} 
            width={600} 
            height={400} 
            onClose={() => setWindows(p => ({...p, explorer: false}))}
            className="left-40 top-16"
            zIndex={20}
          >
            <div className="flex h-full flex-col">
              <div className="p-2 border-b-2 border-black bg-gray-200 flex gap-2 items-stretch">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    placeholder="SEARCH_DB..." 
                    className="w-full h-full win-input px-8 py-2 text-lg outline-none" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                </div>
                <button 
                  className="win-button px-6 text-xs font-black bg-yellow-400"
                  onClick={() => {
                    setActiveNote({ title: '', body: '', tags: [] });
                    setWindows(p => ({...p, editor: true}));
                  }}
                >
                  NEW_FILE.EXE
                </button>
              </div>
              
              <div className="flex-1 overflow-auto p-4">
                {loading ? (
                  <div className="flex items-center justify-center h-full text-lg animate-pulse font-black">LOADING_DATA...</div>
                ) : filteredNotes.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-lg text-gray-400 italic font-black">NO_RECORDS_FOUND</div>
                ) : (
                  <table className="w-full text-base text-left border-collapse">
                    <thead className="bg-yellow-400 sticky top-0 border-b-2 border-black">
                      <tr>
                        <th className="p-3 border-2 border-black win-text uppercase text-lg">Title</th>
                        <th className="p-3 border-2 border-black win-text uppercase text-lg">Tags</th>
                        <th className="p-3 border-2 border-black win-text uppercase text-lg">Updated</th>
                        <th className="p-3 border-2 border-black win-text uppercase text-lg w-20 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredNotes.map(note => (
                        <tr key={note.id} className="hover:bg-black hover:text-yellow-400 group border-b-2 border-black bg-white transition-colors cursor-pointer" onClick={() => {
                          setActiveNote(note);
                          setWindows(p => ({...p, editor: true}));
                        }}>
                          <td className="p-3 border-r-2 border-black font-black text-lg">{note.title}</td>
                          <td className="p-3 border-r-2 border-black">
                            <div className="flex flex-wrap gap-2">
                              {note.tags.map((t, i) => (
                                <span key={i} className="px-2 py-1 bg-pink-500 text-white border-2 border-black text-[10px] uppercase font-black group-hover:border-yellow-400">{t}</span>
                              ))}
                            </div>
                          </td>
                          <td className="p-3 border-r-2 border-black italic text-lg font-bold">{new Date(note.updatedAt).toLocaleDateString()}</td>
                          <td className="p-3 text-center">
                            <button 
                              className="p-2 bg-red-500 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-white hover:text-red-500 active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
                              onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </Window>
        )}

        {windows.editor && activeNote && (
          <Window 
            key="editor"
            title={activeNote.id ? `EDIT: ${activeNote.title}` : 'CREATE_NEW_RECORD'} 
            icon={FileText} 
            width={500} 
            height={600} 
            onClose={() => setWindows(p => ({...p, editor: false}))}
            className="left-1/2 top-10 -translate-x-1/2 z-[30]"
            zIndex={30}
          >
            <form onSubmit={handleSave} className="flex flex-col h-full p-6 space-y-6">
              <div className="win-field-section space-y-2">
                <label className="text-sm font-black uppercase text-black">FILE_NAME</label>
                <input 
                  type="text" 
                  required
                  className="w-full win-input px-3 py-2 text-xl outline-none font-black focus:border-pink-500 focus:shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all"
                  value={activeNote.title}
                  onChange={(e) => setActiveNote({...activeNote, title: e.target.value})}
                />
              </div>

              <div className="win-field-section space-y-2">
                <label className="text-sm font-black uppercase text-black">METADATA_TAGS</label>
                <input 
                  type="text" 
                  className="w-full win-input px-3 py-2 text-xl outline-none font-black focus:border-pink-500 focus:shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all"
                  placeholder="tag1, tag2..."
                  value={Array.isArray(activeNote.tags) ? activeNote.tags.join(', ') : activeNote.tags}
                  onChange={(e) => setActiveNote({...activeNote, tags: e.target.value})}
                />
              </div>

              <div className="win-field-section flex-1 flex flex-col space-y-2">
                <label className="text-sm font-black uppercase text-black">DATA_CONTENT</label>
                <textarea 
                  required
                  className="flex-1 w-full win-input p-3 text-xl outline-none resize-none font-bold italic focus:border-pink-500 focus:shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all"
                  value={activeNote.body}
                  onChange={(e) => setActiveNote({...activeNote, body: e.target.value})}
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button 
                  type="submit" 
                  className="flex-1 win-button bg-yellow-400 font-black text-xs uppercase flex items-center justify-center gap-3 p-4 hover:bg-black hover:text-yellow-400"
                >
                  <Save className="w-5 h-5" /> EXECUTE_SAVE.SH
                </button>
                <button 
                  type="button"
                  className="win-button px-6 text-xs font-black bg-white hover:bg-black hover:text-white"
                  onClick={() => setWindows(p => ({...p, editor: false}))}
                >
                  ABORT
                </button>
              </div>
            </form>
          </Window>
        )}

        {windows.winamp && (
          <Window 
            key="winamp" 
            title="Winamp" 
            icon={Music} 
            width={320} 
            height={240} 
            onClose={() => {
              handleStop();
              setWindows(p => ({...p, winamp: false}));
            }} 
            className="right-8 bottom-8" 
            contentClassName="bg-[#1a1a1a]" 
            zIndex={25}
          >
            <div className="p-0 flex flex-col h-full select-none no-drag">
              {/* Main Display Area */}
              <div className="bg-black m-1 p-2 border-2 border-[#333] shadow-[inset_0_0_10px_rgba(0,0,0,1)] flex gap-3 h-24">
                {/* Visualizer & Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-[7px] text-pink-500 font-black tracking-tighter uppercase leading-none mb-1">STEREOPHONIC</span>
                      <span className="text-cyan-400 font-mono text-[10px] truncate w-32 shadow-[0_0_5px_rgba(34,211,238,0.3)]">Nexus.MP3</span>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="text-[7px] text-gray-500 font-bold uppercase leading-none">kbps/khz</span>
                      <span className="text-[9px] text-cyan-500/80 font-mono">128/44.1</span>
                    </div>
                  </div>
                  
                  {/* Mock Oscilloscope */}
                  <div className="flex-1 flex items-end gap-[1px] pt-1 overflow-hidden w-full">
                    {[...Array(50)].map((_, i) => (
                      <motion.div 
                        key={i}
                        animate={{ height: isPlaying ? [2, Math.random() * 35 + 5, 2] : 2 }}
                        transition={{ repeat: isPlaying ? Infinity : 0, duration: 0.2, delay: i * 0.005 }}
                        className="flex-1 bg-cyan-500/70"
                      />
                    ))}
                  </div>
                </div>

                {/* Time Display */}
                <div className="w-20 bg-[#001100] border border-[#003300] flex flex-col items-center justify-center p-1 rounded-sm shadow-[inset_0_0_8px_rgba(0,255,0,0.1)]">
                  <span className="text-[7px] text-[#00ff00]/40 font-bold uppercase leading-none mb-1">TIME</span>
                  <div className="text-xl font-mono text-[#00ff00] leading-none tracking-tighter drop-shadow-[0_0_3px_rgba(0,255,0,0.5)]">
                    {formatMusicTime(currentTime)}
                  </div>
                  <div className="w-full mt-1 h-0.5 bg-[#002200]">
                    <div 
                      className="h-full bg-[#00ff00] shadow-[0_0_3px_#00ff00]" 
                      style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Controls Section */}
              <div className="flex-1 bg-[#c0c0c0] p-1 border-t border-[#f6f6f6] flex flex-col gap-2">
                {/* Seek Bar */}
                <div className="px-1">
                  <input 
                    type="range"
                    min="0"
                    max={duration || 100}
                    step="0.1"
                    value={currentTime}
                    onChange={handleSeek}
                    className="win-seek-bar w-full h-3 bg-black border border-[#555] appearance-none cursor-pointer"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-between items-center px-1">
                  <div className="flex gap-1">
                    <button onClick={togglePlay} className="win-button w-8 h-8 flex items-center justify-center active:bg-gray-400">
                      {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
                    </button>
                    <button onClick={handleStop} className="win-button w-8 h-8 flex items-center justify-center active:bg-gray-400">
                      <Square className="w-3 h-3 fill-black" />
                    </button>
                  </div>

                  {/* Volume / EQ Area */}
                  <div className="flex flex-col gap-1 items-end">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-3 h-3 text-blue-800" />
                      <div className="w-20 h-3 bg-black border border-[#555] relative overflow-hidden group">
                        <input 
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 opacity-80" style={{ clipPath: `inset(0 ${100 - (volume * 100)}% 0 0)` }}></div>
                        <div className="absolute inset-0 flex gap-[1px] pointer-events-none">
                          {[...Array(10)].map((_, i) => <div key={i} className="flex-1 border-r border-black/30"></div>)}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 text-[8px] font-black text-gray-600 italic">
                      <span className={isPlaying ? "text-blue-700 animate-pulse" : ""}>AUTO_EQ</span>
                      <span className="text-pink-600">LOOP_ON</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Status Bar */}
              <div className="bg-[#0c2268] text-white text-[7px] px-2 py-0.5 flex justify-between font-bold italic border-t border-[#000]">
                <span>CYBER_WAVE_OS_AUDIO_ENGINE</span>
                <span className="animate-pulse">SAMPLED: OK</span>
              </div>
            </div>
          </Window>
        )}
      </AnimatePresence>
      
      {/* CRT Overlay Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[100] bg-[length:100%_2px,3px_100%]"></div>
    </div>
  );
}
