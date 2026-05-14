import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FileText, Folder, Music } from 'lucide-react';

// Components
import Taskbar from './components/Taskbar';
import DesktopIcon from './components/DesktopIcon';
import StaticSticker from './components/StaticSticker';
import NoteExplorer from './components/NoteExplorer';
import NoteEditor from './components/NoteEditor';
import Winamp from './components/Winamp';
import BootScreen from './components/BootScreen';
import ContextMenu from './components/ContextMenu';

// Hooks
import { useNotes } from './hooks/use-notes';
import { useMusicPlayer } from './hooks/use-music-player';
import { useContextMenu } from './hooks/use-context-menu';

/**
 * Main application orchestrator for CyberNote Y2K.
 */
export default function App() {
  // State Management
  const [booting, setBooting] = useState(true);
  const [windows, setWindows] = useState({ explorer: true, editor: false, winamp: false });
  const [activeNote, setActiveNote] = useState(null);
  const [search, setSearch] = useState('');

  // Custom Hooks
  const { notes, loading, saveNote, deleteNote } = useNotes();
  const music = useMusicPlayer('/nexus.mp3');
  const { menuState, handleContextMenu, closeMenu } = useContextMenu();

  // Window Handlers
  const toggleWindow = (name, state) => setWindows(prev => ({ ...prev, [name]: state }));

  const handleNewNote = () => {
    setActiveNote({ title: '', body: '', tags: [] });
    toggleWindow('editor', true);
  };

  const handleEditNote = (note) => {
    setActiveNote(note);
    toggleWindow('editor', true);
  };

  const handleSaveNote = async () => {
    const result = await saveNote(activeNote);
    if (result.success) {
      toggleWindow('editor', false);
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const handleDeleteNote = async (id) => {
    const result = await deleteNote(id);
    if (result.error) {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <div 
      className="h-screen w-screen relative pb-12 overflow-hidden"
      onContextMenu={handleContextMenu}
    >
      {booting ? (
        <BootScreen onComplete={() => setBooting(false)} />
      ) : (
        <>
          <Taskbar />

          {/* Persisted Audio Element */}
          <audio ref={music.audioRef} src="/nexus.mp3" />
          {/* Watermark background — large, very faint */}
          <StaticSticker src="/crt.png"     x="50%" y="45%" rotate={0}   size={520} opacity={0.15} />

          {/* Desktop Icons */}
          <div className="absolute top-8 left-8 grid grid-cols-1 gap-12 z-10">
            <DesktopIcon 
              icon={Folder} 
              label="MY_NOTES" 
              onClick={() => toggleWindow('explorer', true)} 
            />
            <DesktopIcon 
              icon={FileText} 
              label="NEW_NOTE" 
              onClick={handleNewNote} 
            />
            <DesktopIcon 
              icon={Music} 
              label="WINAMP" 
              onClick={() => toggleWindow('winamp', true)} 
            />
          </div>

          <AnimatePresence>
            {windows.explorer && (
              <NoteExplorer 
                key={"note-explorer"}
                notes={notes}
                loading={loading}
                search={search}
                onSearchChange={setSearch}
                onNoteClick={handleEditNote}
                onNewNote={handleNewNote}
                onDeleteNote={handleDeleteNote}
                onClose={() => toggleWindow('explorer', false)}
              />
            )}

            {windows.editor && (
              <NoteEditor 
                key={"note-editor"}
                activeNote={activeNote}
                onNoteChange={setActiveNote}
                onSave={handleSaveNote}
                onClose={() => toggleWindow('editor', false)}
              />
            )}

            {windows.winamp && (
              <Winamp 
                key={"winamp"}
                isPlaying={music.isPlaying}
                currentTime={music.currentTime}
                duration={music.duration}
                volume={music.volume}
                onTogglePlay={music.togglePlay}
                onStop={music.stop}
                onSeek={music.seek}
                onVolumeChange={music.changeVolume}
                onClose={() => {
                  music.stop();
                  toggleWindow('winamp', false);
                }}
              />
            )}

            {menuState.visible && (
              <ContextMenu
                key="context-menu"
                x={menuState.x}
                y={menuState.y}
                onClose={closeMenu}
                onNewNote={() => { handleNewNote(); closeMenu(); }}
                onOpenWinamp={() => { toggleWindow('winamp', true); closeMenu(); }}
                noteCount={notes.length}
              />
            )}
          </AnimatePresence>
        </>
      )}
      
      {/* CRT Overlay Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[100] bg-[length:100%_2px,3px_100%]"></div>
    </div>
  );
}
