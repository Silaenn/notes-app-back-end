import React from 'react';
import { FileText, Save } from 'lucide-react';
import Window from './Window';
import { UI_CONFIG } from '../constants/config';

const NoteEditor = ({ activeNote, onNoteChange, onSave, onClose }) => {
  if (!activeNote) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <Window 
      title={activeNote.id ? `EDIT: ${activeNote.title}` : 'CREATE_NEW_RECORD'} 
      icon={FileText} 
      width={500} 
      height={600} 
      onClose={onClose}
      className="left-1/2 top-10 -translate-x-1/2"
      zIndex={UI_CONFIG.WINDOW_Z_INDEX.EDITOR}
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full p-6 space-y-6">
        <div className="win-field-section space-y-2">
          <label className="text-sm font-black uppercase text-black">FILE_NAME</label>
          <input 
            type="text" 
            required
            className="w-full win-input px-3 py-2 text-xl outline-none font-black focus:border-pink-500 focus:shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all"
            value={activeNote.title}
            onChange={(e) => onNoteChange({...activeNote, title: e.target.value})}
          />
        </div>

        <div className="win-field-section space-y-2">
          <label className="text-sm font-black uppercase text-black">METADATA_TAGS</label>
          <input 
            type="text" 
            className="w-full win-input px-3 py-2 text-xl outline-none font-black focus:border-pink-500 focus:shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all"
            placeholder="tag1, tag2..."
            value={Array.isArray(activeNote.tags) ? activeNote.tags.join(', ') : activeNote.tags}
            onChange={(e) => onNoteChange({...activeNote, tags: e.target.value})}
          />
        </div>

        <div className="win-field-section flex-1 flex flex-col space-y-2">
          <label className="text-sm font-black uppercase text-black">DATA_CONTENT</label>
          <textarea 
            required
            className="flex-1 w-full win-input p-3 text-xl outline-none resize-none font-bold italic focus:border-pink-500 focus:shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all"
            value={activeNote.body}
            onChange={(e) => onNoteChange({...activeNote, body: e.target.value})}
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
            onClick={onClose}
          >
            ABORT
          </button>
        </div>
      </form>
    </Window>
  );
};

export default NoteEditor;
