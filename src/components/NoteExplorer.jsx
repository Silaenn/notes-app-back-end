import React from 'react';
import { Search, Trash2, Folder as FolderIcon } from 'lucide-react';
import Window from './Window';

const NoteExplorer = ({ 
  notes, 
  loading, 
  search, 
  onSearchChange, 
  onNoteClick, 
  onNewNote, 
  onDeleteNote, 
  onClose,
  zIndex,
  onFocus,
  isFocused
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
      zIndex={zIndex}
      onFocus={onFocus}
      isFocused={isFocused}
    >
      <div className="flex h-full flex-col">
        {/* Search Bar Area */}
        <div className="p-2 border-b-2 border-black bg-gray-200 flex gap-2 items-stretch scanline-panel">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="SEARCH_DB..." 
              className="w-full h-full win-input px-8 py-2 text-lg outline-none focus:glow-pink transition-all" 
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
          </div>
          <button 
            className="win-button px-6 text-xs font-black bg-yellow-400 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500 hover:text-white transition-all"
            onClick={onNewNote}
          >
            NEW_FILE.EXE
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-4 bg-white/50">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="text-lg animate-pulse font-black win-text">LOADING_DATA...</div>
              <div className="w-[200px] h-3 border-2 border-black bg-white overflow-hidden">
                <div className="h-full bg-cyan-400 animate-progress-fill" />
              </div>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <pre className="text-pink-500 font-mono text-lg leading-tight mb-2">
{`   ____
  /    \\____
 /          \\
|   FOLDER   |
 \\__________/`}
              </pre>
              <div className="text-lg text-gray-400 font-black win-text">NO_RECORDS_FOUND</div>
              <div className="text-[10px] font-['Press_Start_2P'] text-gray-400 mt-2 uppercase">
                [ CREATE NEW FILE TO BEGIN ]
              </div>
            </div>
          ) : (
            <table className="w-full text-base text-left border-collapse">
              <thead className="sticky top-0 z-10 border-b-[3px] border-black">
                <tr className="bg-gradient-header shadow-inner">
                  <th className="p-3 border-2 border-black win-text uppercase text-lg text-shadow-sm border-r-black/20">Title</th>
                  <th className="p-3 border-2 border-black win-text uppercase text-lg text-shadow-sm border-r-black/20">Tags</th>
                  <th className="p-3 border-2 border-black win-text uppercase text-lg text-shadow-sm border-r-black/20">Updated</th>
                  <th className="p-3 border-2 border-black win-text uppercase text-lg w-24 text-center text-shadow-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotes.map((note, index) => (
                  <tr 
                    key={note.id} 
                    className={`
                      group border-b-2 border-black transition-all cursor-pointer
                      ${index % 2 === 0 ? 'bg-white' : 'bg-black/5'}
                      hover:bg-black hover:text-yellow-400 hover:shadow-row-accent
                    `} 
                    onClick={() => onNoteClick(note)}
                  >
                    <td className="p-3 border-r-2 border-black font-black text-lg">{note.title}</td>
                    <td className="p-3 border-r-2 border-black">
                      <div className="flex flex-wrap gap-2">
                        {note.tags.map((t, i) => (
                          <span 
                            key={i} 
                            className="px-2 py-1 bg-pink-500 text-white border-2 border-black text-[15px] uppercase font-black group-hover:border-yellow-400 group-hover:text-yellow-400"
                          >
                            {t}
                          </span>
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
