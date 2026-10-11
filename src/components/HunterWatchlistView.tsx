import React from 'react';
import { H1Program, HunterWatchlistEntry, HunterNote } from '../types/hackerone';
import { H1_PROGRAMS } from '../data/programs';
import { Bookmark, Sparkles, Trash2, ArrowRight, Shield, FileText } from 'lucide-react';

interface HunterWatchlistViewProps {
  watchlist: HunterWatchlistEntry[];
  notes: HunterNote[];
  onRemoveWatchlist: (progId: string) => void;
  onSelectProgram: (prog: H1Program) => void;
  onLaunchAi: (prog: H1Program) => void;
  onDeleteNote: (noteId: string) => void;
}

export const HunterWatchlistView: React.FC<HunterWatchlistViewProps> = ({
  watchlist,
  notes,
  onRemoveWatchlist,
  onSelectProgram,
  onLaunchAi,
  onDeleteNote
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#161b22] border border-[#21262d] rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-amber-400" />
          Hunter Workspace & Target Watchlist
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Track targets under active reconnaissance, manage research notes, and jump back into AI hunting intelligence.
        </p>
      </div>

      {/* Watchlist programs */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-neutral-300 uppercase tracking-wider font-mono">
          Tracked Programs ({watchlist.length})
        </h2>

        {watchlist.length === 0 ? (
          <div className="p-8 text-center bg-[#161b22] border border-[#21262d] rounded-2xl">
            <Bookmark className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
            <p className="text-sm text-neutral-300 font-semibold">No targets saved to watchlist yet</p>
            <p className="text-xs text-neutral-500 mt-1">
              Click the bookmark icon on any program card in the directory to add it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {watchlist.map((item) => {
              const program = H1_PROGRAMS.find((p) => p.id === item.programId);
              if (!program) return null;

              return (
                <div
                  key={item.programId}
                  className="bg-[#161b22] border border-[#21262d] rounded-xl p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-xs"
                        style={{ backgroundColor: program.avatarColor || '#1f2937' }}
                      >
                        {program.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-[11px] font-mono text-emerald-400 block">
                          @{program.handle}
                        </span>
                        <h3 className="font-bold text-white text-sm">{program.name}</h3>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveWatchlist(program.id)}
                      className="p-1 rounded text-neutral-500 hover:text-rose-400"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs text-neutral-400 flex items-center justify-between border-y border-[#21262d] py-2 font-mono">
                    <span>Bounty:</span>
                    <span className="text-emerald-400 font-bold">{program.bountyRangeText}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => onLaunchAi(program)}
                      className="py-1.5 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>Hunt</span>
                    </button>
                    <button
                      onClick={() => onSelectProgram(program)}
                      className="py-1.5 px-2 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-white text-xs font-semibold"
                    >
                      Scope
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Saved Notes Section */}
      <div className="space-y-4 pt-4 border-t border-[#21262d]">
        <h2 className="text-sm font-bold text-neutral-300 uppercase tracking-wider font-mono flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          Saved Hunter Reports & Notes ({notes.length})
        </h2>

        {notes.length === 0 ? (
          <div className="p-6 text-center bg-[#161b22] border border-[#21262d] rounded-2xl text-xs text-neutral-500">
            No saved research notes yet. Use the "Save to Notes" action in the AI Studio to preserve intelligence.
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-[#161b22] border border-[#21262d] rounded-xl p-4 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{note.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400">
                      @{note.programId}
                    </span>
                  </div>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="text-neutral-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-[#0d1117] p-3 rounded-lg border border-[#21262d] max-h-48 overflow-y-auto font-mono text-[11px] text-neutral-300 whitespace-pre-wrap">
                  {note.content}
                </div>
                <div className="text-[10px] text-neutral-500 font-mono">
                  Saved on {new Date(note.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
