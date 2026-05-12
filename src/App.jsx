import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Save
} from 'lucide-react';

const Window = ({ title, children, onClose, onMinimize, className, width = 400, height = 300, icon: Icon, zIndex = 10 }) => (
  <motion.div 
    drag
    dragMomentum={false}
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.9, opacity: 0 }}
    style={{ width, height, zIndex }}
    className={`win-border absolute shadow-2xl overflow-hidden flex flex-col ${className}`}
  >
    <div className="win-title-bar drag-handle">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        <span className="win-text truncate">{title}</span>
      </div>
      <div className="flex gap-0.5">
        <button className="win-control-btn win-control-min" onClick={onMinimize} aria-label="Minimize window"><Minus className="w-2.5 h-2.5" /></button>
        <button className="win-control-btn win-control-max" aria-label="Maximize window"><Square className="w-2.5 h-2.5" /></button>
        <button className="win-control-btn win-control-close" onClick={onClose} aria-label="Close window"><X className="w-2.5 h-2.5" /></button>
      </div>
    </div>
    <div className="flex-1 overflow-auto bg-white win-border-inset m-1 p-1">
      {children}
    </div>
  </motion.div>
);

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
        <div className="win-text text-blue-800 italic pr-4 border-r border-gray-400">CyberNote_OS</div>
        <div className="flex gap-4">
          {['System', 'View', 'Tools', 'Help'].map((item) => (
            <button key={item} className="win-text hover:text-blue-800">{item}</button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="win-border-inset px-2 py-0.5 flex items-center gap-2 win-text bg-[#C0C0C0]/50">
          <Clock className="w-3 h-3" />
          {formatTime(time)} - {formatDate(time)}
        </div>
      </div>
    </div>
  );
};

const DesktopIcon = ({ icon: Icon, label, color, onClick }) => (
  <div className="desktop-icon group" onClick={onClick}>
    <div className={`p-3 rounded-lg bg-white/40 win-border group-hover:bg-white/60 transition-colors`}>
      <Icon className="w-8 h-8" style={{ color }} />
    </div>
    <span className="win-text mt-1 px-1 bg-white/20 rounded shadow-sm text-center line-clamp-1">{label}</span>
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
    <div className="h-screen w-screen relative pt-9 overflow-hidden">
      <Taskbar />

      {/* Asset Stickers */}
      <StaticSticker src="/hati.png" x="79%" y="18%" rotate={12} size={200} />
      <StaticSticker src="/kupu-kupu.png" x="17%" y="76%" rotate={-14} size={250} />
      <StaticSticker src="/alien.png" x="90%" y="56%" rotate={-6} size={126} />
      <StaticSticker src="/bintang.png" x="83%" y="84%" rotate={16} size={220} />
      <StaticSticker src="/kaset.png" x="54%" y="90%" rotate={7} size={170} />

      {/* Desktop Icons */}
      <div className="absolute top-12 left-4 grid grid-cols-1 gap-6 z-10">
        <DesktopIcon icon={Folder} label="My Notes" color="#ffd700" onClick={() => setWindows(p => ({...p, explorer: true}))} />
        <DesktopIcon icon={FileText} label="New Note" color="#169b62" onClick={() => {
          setActiveNote({ title: '', body: '', tags: [] });
          setWindows(p => ({...p, editor: true}));
        }} />
        <DesktopIcon icon={Music} label="Winamp" color="#2f6df6" onClick={() => setWindows(p => ({...p, winamp: true}))} />
      </div>

      <AnimatePresence>
        {windows.explorer && (
          <Window 
            title="Note Explorer" 
            icon={Folder} 
            width={600} 
            height={400} 
            onClose={() => setWindows(p => ({...p, explorer: false}))}
            className="left-32 top-16"
            zIndex={20}
          >
            <div className="flex h-full flex-col">
              <div className="p-2 border-b bg-gray-50 flex gap-2">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    placeholder="Search notes..." 
                    className="w-full win-border-inset px-6 py-1 text-xs outline-none" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Search className="absolute left-1.5 top-1.5 w-3 h-3 text-gray-400" />
                </div>
                <button 
                  className="win-button px-3 text-[10px] font-bold"
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
                  <div className="flex items-center justify-center h-full text-xs animate-pulse">LOADING_DATA...</div>
                ) : filteredNotes.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-xs text-gray-400 italic">NO_RECORDS_FOUND</div>
                ) : (
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="p-2 border win-text uppercase">Title</th>
                        <th className="p-2 border win-text uppercase">Tags</th>
                        <th className="p-2 border win-text uppercase">Updated</th>
                        <th className="p-2 border win-text uppercase w-16 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredNotes.map(note => (
                        <tr key={note.id} className="hover:bg-blue-50 cursor-pointer group" onClick={() => {
                          setActiveNote(note);
                          setWindows(p => ({...p, editor: true}));
                        }}>
                          <td className="p-2 border font-bold text-blue-800">{note.title}</td>
                          <td className="p-2 border">
                            <div className="flex gap-1">
                              {note.tags.map((t, i) => (
                                <span key={i} className="px-1.5 py-0.5 bg-gray-200 rounded text-[9px] uppercase font-black">{t}</span>
                              ))}
                            </div>
                          </td>
                          <td className="p-2 border text-gray-400 italic">{new Date(note.updatedAt).toLocaleDateString()}</td>
                          <td className="p-2 border text-center">
                            <button 
                              className="p-1 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                              onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
            title={activeNote.id ? `Editing: ${activeNote.title}` : 'Create New Note'} 
            icon={FileText} 
            width={400} 
            height={450} 
            onClose={() => setWindows(p => ({...p, editor: false}))}
            className="left-1/2 top-24 z-[30]"
            zIndex={30}
          >
            <form onSubmit={handleSave} className="flex flex-col h-full p-4 space-y-4">
              <div className="win-field-section space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Title</label>
                <input 
                  type="text" 
                  required
                  className="w-full win-input px-2 py-1 text-sm outline-none"
                  value={activeNote.title}
                  onChange={(e) => setActiveNote({...activeNote, title: e.target.value})}
                />
              </div>

              <div className="win-field-section space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Tags (comma separated)</label>
                <input 
                  type="text" 
                  className="w-full win-input px-2 py-1 text-sm outline-none"
                  value={Array.isArray(activeNote.tags) ? activeNote.tags.join(', ') : activeNote.tags}
                  onChange={(e) => setActiveNote({...activeNote, tags: e.target.value})}
                />
              </div>

              <div className="win-field-section flex-1 flex flex-col space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Content</label>
                <textarea 
                  required
                  className="flex-1 w-full win-input p-2 text-sm outline-none resize-none font-mono italic"
                  value={activeNote.body}
                  onChange={(e) => setActiveNote({...activeNote, body: e.target.value})}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="submit" 
                  className="flex-1 win-button bg-yellow-400 font-bold text-xs uppercase italic flex items-center justify-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" /> SAVE_CHANGES
                </button>
                <button 
                  type="button"
                  className="win-button px-4 text-xs italic"
                  onClick={() => setWindows(p => ({...p, editor: false}))}
                >
                  CANCEL
                </button>
              </div>
            </form>
          </Window>
        )}

        {windows.winamp && (
          <Window title="Winamp" icon={Music} width={280} height={180} onClose={() => setWindows(p => ({...p, winamp: false}))} className="bg-[#1a1a1a] right-8 bottom-8" zIndex={25}>
            <div className="bg-[#2b2b2b] p-2 text-[#00ff00] font-mono text-[10px] space-y-2 h-full">
              <div className="flex justify-between border-b border-[#00ff00]/20 pb-1">
                <span>00:42</span>
                <span>CYBER_CORE.MP3</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-gray-700">
                  <div className="w-1/3 h-full bg-[#00ff00]"></div>
                </div>
              </div>
              <div className="flex justify-center gap-2 pt-2">
                <button className="win-button bg-gray-400 text-black"><Play className="w-3 h-3 fill-black" /></button>
                <button className="win-button bg-gray-400 text-black"><Pause className="w-3 h-3" /></button>
              </div>
              <div className="flex justify-between text-[8px] uppercase font-bold text-yellow-500">
                <span>*SHUFFLE</span>
                <span>REPEAT*</span>
              </div>
            </div>
          </Window>
        )}
      </AnimatePresence>

      <div className="fixed bottom-4 left-4 text-[10px] font-black text-white/30 uppercase tracking-[0.5em] pointer-events-none">
        System: Connected // Mode: Production // v26.4
      </div>
      
      {/* CRT Overlay Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[100] bg-[length:100%_2px,3px_100%]"></div>
    </div>
  );
}
