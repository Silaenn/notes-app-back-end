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
import { ToastContainer } from './components/Toast';

// Hooks
import { useNotes } from './hooks/use-notes';
import { useMusicPlayer } from './hooks/use-music-player';
import { useContextMenu } from './hooks/use-context-menu';
import { useWindowManager } from './hooks/use-window-manager';
import { useToast } from './hooks/use-toast';

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
  const { focusWindow, getZIndex } = useWindowManager();
  const { toasts, showToast, dismissToast } = useToast();

  // Window Handlers
  const toggleWindow = (name, state) => {
    setWindows(prev => ({ ...prev, [name]: state }));
    if (state) focusWindow(name);
  };

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
      showToast({ type: 'success', message: 'Note saved successfully' });
      toggleWindow('editor', false);
    } else {
      showToast({ type: 'error', message: result.error });
    }
  };

  const handleDeleteNote = async (id) => {
    const result = await deleteNote(id);
    if (result.success) {
      showToast({ type: 'warning', message: 'Note deleted' });
    } else if (result.error) {
      showToast({ type: 'error', message: result.error });
    }
  };

  const isTopWindow = (name) => {
    const windowNames = ['explorer', 'editor', 'winamp'];
    const activeZIndices = windowNames
      .filter(w => windows[w])
      .map(w => getZIndex(w));
    
    if (activeZIndices.length === 0) return false;
    return getZIndex(name) === Math.max(...activeZIndices);
  };

  return (
    <div 
      className="h-screen w-screen relative pb-10 overflow-hidden"
      onContextMenu={handleContextMenu}
    >
      {/* Persisted Audio Element - Always rendered for hook stability */}
      <audio ref={music.audioRef} src="/nexus.mp3" />

      {booting ? (
        <BootScreen onComplete={() => setBooting(false)} />
      ) : (
        <>
          <Taskbar />

          {/* Watermark background — large, subtle */}
          <StaticSticker src="/crt.png" x="50%" y="45%" rotate={0} size={520} opacity={0.8} />

          {/* Desktop Icons */}
          <div className="absolute top-8 left-8 grid grid-cols-1 gap-12 z-10">
            <DesktopIcon 
              icon={Folder} 
              label="My Notes" 
              onClick={() => toggleWindow('explorer', true)} 
            />
            <DesktopIcon 
              icon={FileText} 
              label="New Note" 
              onClick={handleNewNote} 
            />
            <DesktopIcon 
              icon={Music} 
              label="Winamp" 
              onClick={() => toggleWindow('winamp', true)} 
            />
          </div>

          <AnimatePresence>
            {/* Windows... (kept same as before) */}
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
                zIndex={getZIndex('explorer')}
                onFocus={() => focusWindow('explorer')}
                isFocused={isTopWindow('explorer')}
              />
            )}

            {windows.editor && (
              <NoteEditor 
                key={"note-editor"}
                activeNote={activeNote}
                onNoteChange={setActiveNote}
                onSave={handleSaveNote}
                onClose={() => toggleWindow('editor', false)}
                zIndex={getZIndex('editor')}
                onFocus={() => focusWindow('editor')}
                isFocused={isTopWindow('editor')}
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
                zIndex={getZIndex('winamp')}
                onFocus={() => focusWindow('winamp')}
                isFocused={isTopWindow('winamp')}
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
      <div className="crt-overlay"></div>
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
