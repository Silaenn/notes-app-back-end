import React from 'react';
import { Search, Trash2 } from 'lucide-react';
import Window from './Window';
import { UI_CONFIG } from '../constants/config';

const NoteExplorer = ({ 
  notes, 
  loading, 
  search, 
  onSearchChange, 
  onNoteClick, 
  onNewNote, 
  onDeleteNote, 
  onClose 
}) => {
  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.body.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Window 
      title="Note Explorer" 
      icon={Search} 
      width={600} 
      height={400} 
      onClose={onClose}
      className="left-40 top-16"
      zIndex={UI_CONFIG.WINDOW_Z_INDEX.EXPLORER}
    >
      <div className="flex h-full flex-col">
        <div className="p-2 border-b-2 border-black bg-gray-200 flex gap-2 items-stretch">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="SEARCH_DB..." 
              className="w-full h-full win-input px-8 py-2 text-lg outline-none" 
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
          </div>
          <button 
            className="win-button px-6 text-xs font-black bg-yellow-400"
            onClick={onNewNote}
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
                  <tr 
                    key={note.id} 
                    className="hover:bg-black hover:text-yellow-400 group border-b-2 border-black bg-white transition-colors cursor-pointer" 
                    onClick={() => onNoteClick(note)}
                  >
                    <td className="p-3 border-r-2 border-black font-black text-lg">{note.title}</td>
                    <td className="p-3 border-r-2 border-black">
                      <div className="flex flex-wrap gap-2">
                        {note.tags.map((t, i) => (
                          <span key={i} className="px-2 py-1 bg-pink-500 text-white border-2 border-black text-[10px] uppercase font-black group-hover:border-yellow-400">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 border-r-2 border-black italic text-lg font-bold">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-center">
                      <button 
                        className="p-2 bg-red-500 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-white hover:text-red-500 active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          onDeleteNote(note.id); 
                        }}
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
  );
};

export default NoteExplorer;
