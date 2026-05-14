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
      <span className="text-[#06B6D4] font-['Press_Start_2P'] text-[10px] animate-pulse">▶</span>
      <label className="text-[9px] font-['Press_Start_2P'] uppercase text-[#06B6D4] tracking-wider">
        {text}
      </label>
    </div>
  );

  return (
    <Window 
      title={activeNote.id ? `EDIT: ${activeNote.title}` : 'CREATE_NEW_RECORD'} 
      icon={FileText} 
      width={500} 
      height={600} 
      onClose={onClose}
      className="left-1/2 top-10 -translate-x-1/2"
      zIndex={zIndex}
      onFocus={onFocus}
      isFocused={isFocused}
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full p-6 space-y-6">
        {/* File Name Section */}
        <div className="win-field-section win-field-accent transition-all duration-200">
          <LabelPrompt text="FILE_NAME" />
          <input 
            type="text" 
            required
            className="w-full win-input px-3 py-2 text-xl outline-none font-black scanline-input focus:glow-pink focus:border-l-[3px] focus:border-l-[#EC4899] transition-all"
            value={activeNote.title}
            onChange={(e) => onNoteChange({...activeNote, title: e.target.value})}
          />
        </div>

        {/* Tags Section */}
        <div className="win-field-section win-field-accent transition-all duration-200">
          <LabelPrompt text="METADATA_TAGS" />
          <input 
            type="text" 
            className="w-full win-input px-3 py-2 text-xl outline-none font-black scanline-input focus:glow-pink focus:border-l-[3px] focus:border-l-[#EC4899] transition-all"
            placeholder="tag1, tag2..."
            value={Array.isArray(activeNote.tags) ? activeNote.tags.join(', ') : activeNote.tags}
            onChange={(e) => onNoteChange({...activeNote, tags: e.target.value})}
          />
        </div>

        {/* Body Content Section */}
        <div className="win-field-section flex-1 flex flex-col win-field-accent transition-all duration-200">
          <LabelPrompt text="DATA_CONTENT" />
          <div className="flex-1 relative flex flex-col">
            <textarea 
              required
              className="flex-1 w-full win-input p-3 text-xl outline-none resize-none font-bold italic scanline-input focus:glow-pink focus:border-l-[3px] focus:border-l-[#EC4899] transition-all"
              value={activeNote.body}
              onChange={(e) => onNoteChange({...activeNote, body: e.target.value})}
            />
            <div className="absolute bottom-2 right-3 font-['VT323'] text-sm text-gray-400 pointer-events-none select-none">
              {charCount.toString().padStart(3, '0')}_CHARS
            </div>
          </div>
        </div>

        {/* Button Row */}
        <div className="flex gap-4 pt-2">
          <button 
            type="submit" 
            className={`
              flex-1 win-button bg-yellow-400 font-black text-xs uppercase flex items-center justify-center gap-3 p-4 
              hover:bg-black hover:text-yellow-400 hover:animate-none transition-all
              ${isReadyToSave ? 'animate-ready-pulse' : ''}
            `}
          >
            <Save className="w-5 h-5" /> EXECUTE_SAVE.SH
          </button>
          <button 
            type="button"
            className="win-button px-6 text-xs font-black bg-[#1a0000] text-red-400 border-2 border-black hover:bg-red-600 hover:text-white transition-colors"
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
