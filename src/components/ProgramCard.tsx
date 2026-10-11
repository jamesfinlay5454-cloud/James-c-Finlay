import React from 'react';
import { H1Program } from '../types/hackerone';
import {
  Award,
  Sparkles,
  Bookmark,
  CheckCircle2,
  Users,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

interface ProgramCardProps {
  program: H1Program;
  onSelect: (program: H1Program) => void;
  onLaunchAi: (program: H1Program) => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (programId: string) => void;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  onSelect,
  onLaunchAi,
  isWatchlisted,
  onToggleWatchlist
}) => {
  const isGoldStandard = program.features.includes('Gold standard');
  const isTriagedByH1 = program.features.includes('Triaged by H1');
  const hasRetesting = program.features.includes('Offers retesting');
  const hasCollab = program.features.includes('Open for collaboration');

  // Format resolved count
  const formattedResolved =
    program.reportsResolved >= 1000
      ? `${(program.reportsResolved / 1000).toFixed(program.reportsResolved % 1000 >= 100 ? 1 : 0)}k`
      : program.reportsResolved;

  const formattedHackers =
    program.hackersPaid >= 1000
      ? `${(program.hackersPaid / 1000).toFixed(1)}k`
      : program.hackersPaid;

  return (
    <div className="group bg-[#161b22] hover:bg-[#1a202c] border border-[#21262d] hover:border-[#38bdf8]/40 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-black/40 relative">
      {/* Top Header: Handle & Watchlist */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-3">
            {/* Avatar / Monogram */}
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center font-bold text-white text-base shadow-inner border border-white/10 shrink-0 select-none"
              style={{ backgroundColor: program.avatarColor || '#1f2937' }}
            >
              {program.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="text-xs font-mono text-neutral-400 block group-hover:text-emerald-400 transition-colors">
                @{program.handle}
              </span>
              <h3 className="font-bold text-white text-lg tracking-tight group-hover:text-white leading-snug">
                {program.name}
              </h3>
            </div>
          </div>

          {/* Watchlist Star / Bookmark */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist(program.id);
            }}
            title={isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
            className={`p-2 rounded-lg border transition-colors ${
              isWatchlisted
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-[#0d1117] text-neutral-400 hover:text-white border-[#30363d]'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isWatchlisted ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>

        {/* Tagline */}
        <p className="text-xs text-neutral-400 line-clamp-1 mb-3">
          {program.tagline}
        </p>

        {/* Feature Badges matching HackerOne exact chips */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            {program.type}
          </span>

          {isTriagedByH1 && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#1f293d] text-sky-300 border border-sky-500/30">
              Triaged by HackerOne
            </span>
          )}

          {hasRetesting && hasCollab && !isTriagedByH1 && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#21262d] text-neutral-300 border border-neutral-700">
              Retesting, Collaboration
            </span>
          )}

          {hasRetesting && hasCollab && isTriagedByH1 && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#21262d] text-neutral-300 border border-neutral-700">
              Retesting, Collab
            </span>
          )}

          {hasRetesting && !hasCollab && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#21262d] text-neutral-300 border border-neutral-700">
              Retesting
            </span>
          )}

          {isGoldStandard && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-400" />
              Gold Standard
            </span>
          )}

          {program.safeHarbor && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-900/30 text-blue-300 border border-blue-700/30">
              Safe Harbor
            </span>
          )}
        </div>
      </div>

      {/* Centerpiece: Bounty Range */}
      <div className="my-2 py-3 px-3.5 bg-[#0d1117] rounded-lg border border-[#21262d] flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">
            Bounty Range
          </span>
          <span className="text-xl font-extrabold text-[#00b87c] tracking-tight">
            {program.bountyRangeText}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">
            Avg Triage
          </span>
          <span className="text-xs font-semibold text-neutral-200">
            ~{program.avgTriageHours} hours
          </span>
        </div>
      </div>

      {/* Bottom Trio: Metrics */}
      <div className="grid grid-cols-3 gap-2 py-3 border-t border-[#21262d] my-2 text-center text-xs">
        <div>
          <span className="block text-sm font-bold text-white font-mono">
            {formattedResolved}
          </span>
          <span className="text-[10px] text-neutral-400">Resolved</span>
        </div>
        <div className="border-x border-[#21262d]">
          <span className="block text-sm font-bold text-white font-mono">
            {formattedHackers}
          </span>
          <span className="text-[10px] text-neutral-400">Hackers paid</span>
        </div>
        <div>
          <span
            className={`block text-sm font-bold font-mono ${
              program.responseEfficiency >= 90
                ? 'text-emerald-400'
                : program.responseEfficiency >= 75
                ? 'text-sky-400'
                : 'text-amber-400'
            }`}
          >
            {program.responseEfficiency}%
          </span>
          <span className="text-[10px] text-neutral-400">Response</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        <button
          onClick={() => onSelect(program)}
          className="w-full py-2 px-3 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
        >
          <span>See details</span>
          <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
        </button>

        <button
          onClick={() => onLaunchAi(program)}
          title="Analyze target with Gemini 3.1 Pro (Thinking Mode)"
          className="w-full py-2 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Hunter AI</span>
        </button>
      </div>
    </div>
  );
};
