import React, { useState, useEffect } from 'react';
import { FileText, Save } from 'lucide-react';
import Window from './Window';

const NoteEditor = ({ 
  activeNote, 
  onNoteChange, 
  onSave, 
  onClose,
  zIndex,
  onFocus,
  isFocused
}) => {
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (activeNote?.body) {
      setCharCount(activeNote.body.length);
    } else {
      setCharCount(0);
    }
  }, [activeNote?.body]);

  if (!activeNote) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  const isReadyToSave = activeNote.title?.trim().length > 0 && activeNote.body?.trim().length > 0;

  const LabelPrompt = ({ text }) => (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-[#008080] font-['Press_Start_2P'] text-[9px]">▶</span>
      <label className="text-[8px] md:text-[10px] font-bold uppercase text-black tracking-wider">
        {text}
      </label>
    </div>
  );

  return (
    <Window 
      title={activeNote.id ? `EDIT_RECORD: ${activeNote.title}` : 'CREATE_NEW_RECORD'} 
      icon={FileText} 
      width={500} 
      height={600} 
      compactWidth={520}
      compactHeight={620}
      onClose={onClose}
      className="md:left-1/2 md:top-10 md:-translate-x-1/2"
      zIndex={zIndex}
      onFocus={onFocus}
      isFocused={isFocused}
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full p-3 md:p-6 space-y-4 md:space-y-6">
        {/* File Name Section */}
        <div className="win-field-section win-field-accent">
          <LabelPrompt text="FILE_NAME" />
          <input 
            type="text" 
            required
            className="w-full win-input px-3 py-2 text-base md:text-xl outline-none font-bold bg-white/50"
            value={activeNote.title}
            onChange={(e) => onNoteChange({...activeNote, title: e.target.value})}
          />
        </div>

        {/* Tags Section */}
        <div className="win-field-section win-field-accent">
          <LabelPrompt text="METADATA_TAGS" />
          <input 
            type="text" 
            className="w-full win-input px-3 py-2 text-base md:text-xl outline-none bg-white/50"
            placeholder="tag1, tag2..."
            value={Array.isArray(activeNote.tags) ? activeNote.tags.join(', ') : activeNote.tags}
            onChange={(e) => onNoteChange({...activeNote, tags: e.target.value})}
          />
        </div>

        {/* Body Content Section */}
        <div className="flex-1 flex flex-col win-field-accent">
          <LabelPrompt text="DATA_CONTENT" />
          <div className="flex-1 relative flex flex-col">
            <textarea 
              required
              className="flex-1 w-full win-input p-3 text-base md:text-xl outline-none resize-none font-medium bg-white/50"
              value={activeNote.body}
              onChange={(e) => onNoteChange({...activeNote, body: e.target.value})}
            />
            <div className="absolute bottom-2 right-3 font-mono text-[9px] md:text-[10px] text-gray-400 pointer-events-none select-none">
              {charCount.toString().padStart(3, '0')}_CHARS
            </div>
          </div>
        </div>

        {/* Button Row */}
        <div className="flex gap-2 md:gap-4 pt-2">
          <button 
            type="submit" 
            disabled={!isReadyToSave}
            className={`
              flex-1 win-button font-bold text-[10px] md:text-xs uppercase flex items-center justify-center gap-2 md:gap-3 p-3 md:p-4 
              ${!isReadyToSave ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#000080] hover:text-white'}
            `}
          >
            <Save className="w-4 h-4 md:w-5 md:h-5" /> SAVE_TO_MEMORY
          </button>
          <button 
            type="button"
            className="win-button px-4 md:px-6 text-[10px] md:text-xs font-bold hover:bg-red-800 hover:text-white"
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
