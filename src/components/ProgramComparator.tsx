import React, { useState } from 'react';
import { H1Program } from '../types/hackerone';
import { H1_PROGRAMS } from '../data/programs';
import { Scale, Check, Award, Shield, Sparkles, X, Plus } from 'lucide-react';

interface ProgramComparatorProps {
  onSelectProgram: (program: H1Program) => void;
  onLaunchAi: (program: H1Program) => void;
}

export const ProgramComparator: React.FC<ProgramComparatorProps> = ({
  onSelectProgram,
  onLaunchAi
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'crypto',
    'shopify',
    'security'
  ]);

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((i) => i !== id));
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      } else {
        setSelectedIds([selectedIds[1], selectedIds[2], id]);
      }
    }
  };

  const programs = selectedIds
    .map((id) => H1_PROGRAMS.find((p) => p.id === id))
    .filter(Boolean) as H1Program[];

  return (
    <div className="space-y-6">
      <div className="bg-[#161b22] border border-[#21262d] rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Scale className="w-6 h-6 text-emerald-400" />
              Bug Bounty Program Comparator
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Compare scope breadth, max bounties, response SLAs, and triage efficiency across up to 3 programs simultaneously.
            </p>
          </div>
        </div>

        {/* Quick Program Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#21262d]">
          {H1_PROGRAMS.slice(0, 15).map((prog) => {
            const isSelected = selectedIds.includes(prog.id);
            return (
              <button
                key={prog.id}
                onClick={() => handleToggle(prog.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-[#0d1117] text-neutral-400 border-[#30363d] hover:text-white'
                }`}
              >
                {isSelected && <Check className="w-3 h-3" />}
                {prog.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {programs.map((program) => (
          <div
            key={program.id}
            className="bg-[#161b22] border border-[#21262d] rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-lg relative"
          >
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-inner"
                    style={{ backgroundColor: program.avatarColor || '#1f2937' }}
                  >
                    {program.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-xs font-mono text-emerald-400">@{program.handle}</span>
                    <h3 className="font-bold text-white text-lg">{program.name}</h3>
                  </div>
                </div>

                {programs.length > 1 && (
                  <button
                    onClick={() => handleToggle(program.id)}
                    className="p-1 rounded-md text-neutral-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Bounty Big Block */}
              <div className="p-3.5 bg-[#0d1117] rounded-xl border border-[#21262d] text-center mb-4">
                <span className="text-[10px] uppercase font-mono text-neutral-400 block">
                  Bounty Payout Range
                </span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  {program.bountyRangeText}
                </span>
              </div>

              {/* Key Specs */}
              <div className="space-y-3 text-xs divide-y divide-[#21262d]">
                <div className="flex items-center justify-between pt-2">
                  <span className="text-neutral-400">Response Efficiency:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {program.responseEfficiency}%
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-neutral-400">Average Triage SLA:</span>
                  <span className="font-mono font-bold text-white">
                    ~{program.avgTriageHours} hours
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-neutral-400">Resolved Reports:</span>
                  <span className="font-mono font-bold text-white">
                    {program.reportsResolved.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-neutral-400">Hackers Paid:</span>
                  <span className="font-mono font-bold text-white">
                    {program.hackersPaid.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-neutral-400">Safe Harbor:</span>
                  <span className="font-semibold text-sky-400">
                    {program.safeHarbor ? 'Gold Standard Safe Harbor' : 'Standard'}
                  </span>
                </div>

                <div className="pt-2">
                  <span className="text-neutral-400 block mb-1">In-Scope Target Types:</span>
                  <div className="flex flex-wrap gap-1">
                    {program.assetTypes.slice(0, 4).map((a) => (
                      <span
                        key={a}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0d1117] text-neutral-300 border border-[#30363d]"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-neutral-400 block mb-1">Max Severity Reward:</span>
                  <span className="font-mono font-bold text-rose-400">
                    Up to ${program.rewards.critical.max.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-[#21262d]">
              <button
                onClick={() => onLaunchAi(program)}
                className="w-full py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Attack Surface Plan</span>
              </button>
              <button
                onClick={() => onSelectProgram(program)}
                className="w-full py-2 px-3 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-white text-xs font-semibold transition-colors"
              >
                Inspect Program Scope
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
