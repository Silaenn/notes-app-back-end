import React from 'react';
import { Search, Trash2 } from 'lucide-react';
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
  onMinimize,
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
      compactWidth={520}
      compactHeight={620}
      onClose={onClose}
      onMinimize={onMinimize}
      className="md:left-40 md:top-16"
      zIndex={zIndex}
      onFocus={onFocus}
      isFocused={isFocused}
    >
      <div className="flex h-full flex-col relative">
        {/* Search Bar Area */}
        <div className="p-2 border-b border-black bg-[#c0c0c0] flex flex-col md:flex-row gap-2 items-stretch scanline-panel">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="SEARCH_RECORDS..." 
              className="w-full h-full win-input px-8 py-2 text-sm md:text-lg outline-none" 
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
          </div>
          <button 
            className="win-button w-full md:w-auto px-6 text-xs font-bold bg-[#c0c0c0]"
            onClick={onNewNote}
          >
            NEW_FILE
          </button>
        </div>
        
        <div className="flex-1 overflow-auto overscroll-none p-2 bg-white/80">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="text-lg font-bold win-text">RETRIEVING_DATA...</div>
              <div className="w-[200px] h-4 win-border-inset bg-[#c0c0c0] overflow-hidden">
                <div className="h-full bg-[#000080] w-1/2" />
              </div>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-lg text-gray-500 font-bold win-text mb-2">0_RECORDS_FOUND</div>
              <button className="win-button px-4 py-1" onClick={onNewNote}>INITIALIZE_NEW</button>
            </div>
          ) : (
            <table className="w-full table-fixed text-xs md:text-base text-left border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#000080] text-white">
                  <th className="p-2 win-border font-bold uppercase text-[10px] md:text-sm border-white/20 w-[40%]">Title</th>
                  <th className="p-2 win-border font-bold uppercase text-[10px] md:text-sm border-white/20 w-[30%]">Tags</th>
                  <th className="p-2 win-border font-bold uppercase text-[10px] md:text-sm border-white/20 w-[20%]">Updated</th>
                  <th className="p-2 win-border font-bold uppercase text-sm w-24 text-center border-white/20">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotes.map((note, index) => (
                  <tr 
                    key={note.id} 
                    className={`
                      group border-b border-gray-200 transition-all cursor-pointer
                      ${index % 2 === 0 ? 'bg-white/50' : 'bg-black/5'}
                      hover:bg-[#000080] hover:text-white
                    `} 
                    onClick={() => onNoteClick(note)}
                  >
                    <td className="p-2 md:p-3 border-r border-gray-100 font-bold truncate">{note.title}</td>
                    <td className="p-2 md:p-3 border-r border-gray-100">
                      {(() => {
                        const tags = Array.isArray(note.tags) ? note.tags : [];
                        const useTwoColumns = tags.length > 1 && tags.every((tag) => String(tag).length <= 7);

                        return (
                          <div className={`grid gap-1 md:gap-2 ${useTwoColumns ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                            {tags.map((t, i) => (
                              <span
                                key={i}
                                className={`
                                  block w-full px-2 py-0.5 bg-[#808080] text-white border border-black text-[10px] md:text-[11px] uppercase font-bold text-center
                                  whitespace-nowrap overflow-hidden text-ellipsis leading-tight
                                  group-hover:bg-white group-hover:text-[#000080]
                                  ${useTwoColumns && tags.length % 2 === 1 && i === tags.length - 1 ? 'md:col-span-2' : ''}
                                `}
                                title={t}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        );
                      })()}
                    </td>
                    <td className="p-2 md:p-3 border-r border-gray-100 italic font-medium">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="p-2 md:p-3">
                      <div className="flex justify-center">
                        <button 
                          className="win-button p-1 bg-[#c0c0c0] text-black hover:bg-red-700 hover:text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteNote(note.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
