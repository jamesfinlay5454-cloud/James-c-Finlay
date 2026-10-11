import React, { useState } from 'react';
import { H1Program, ScopeTarget } from '../types/hackerone';
import {
  X,
  Shield,
  Sparkles,
  ExternalLink,
  Award,
  AlertTriangle,
  CheckCircle,
  Copy,
  Check,
  Scale,
  Bookmark,
  DollarSign
} from 'lucide-react';

interface ProgramDetailModalProps {
  program: H1Program | null;
  onClose: () => void;
  onLaunchAi: (program: H1Program, targetScope?: string) => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (programId: string) => void;
}

export const ProgramDetailModal: React.FC<ProgramDetailModalProps> = ({
  program,
  onClose,
  onLaunchAi,
  isWatchlisted,
  onToggleWatchlist
}) => {
  const [copiedTarget, setCopiedTarget] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'scope' | 'rewards' | 'policy'>('scope');

  if (!program) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTarget(text);
    setTimeout(() => setCopiedTarget(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl text-neutral-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#21262d] bg-[#0d1117] flex items-start justify-between relative">
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center font-black text-white text-2xl shadow-lg border border-white/10 shrink-0"
              style={{ backgroundColor: program.avatarColor || '#1f2937' }}
            >
              {program.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-mono text-emerald-400">@{program.handle}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  {program.type}
                </span>
                {program.features.includes('Gold standard') && (
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-400" />
                    Gold Standard
                  </span>
                )}
                {program.safeHarbor && (
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                    Safe Harbor
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">{program.name}</h2>
              <p className="text-xs text-neutral-400 mt-1 max-w-xl">{program.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWatchlist(program.id)}
              className={`p-2.5 rounded-lg border transition-colors ${
                isWatchlisted
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-[#161b22] text-neutral-400 hover:text-white border-[#30363d]'
              }`}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Bookmark className={`w-4 h-4 ${isWatchlisted ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-lg bg-[#161b22] text-neutral-400 hover:text-white border border-[#30363d] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Highlight Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#12161f] border-b border-[#21262d] text-xs">
          <div>
            <span className="text-neutral-400 block text-[11px]">Bounty Payout Range</span>
            <span className="text-base font-extrabold text-[#00b87c] font-mono">
              {program.bountyRangeText}
            </span>
          </div>
          <div>
            <span className="text-neutral-400 block text-[11px]">Reports Resolved</span>
            <span className="text-base font-extrabold text-white font-mono">
              {program.reportsResolved.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-neutral-400 block text-[11px]">Response Efficiency</span>
            <span className="text-base font-extrabold text-emerald-400 font-mono">
              {program.responseEfficiency}%
            </span>
          </div>
          <div>
            <span className="text-neutral-400 block text-[11px]">Average Triage</span>
            <span className="text-base font-extrabold text-sky-400 font-mono">
              ~{program.avgTriageHours} hours
            </span>
          </div>
        </div>

        {/* Modal Tabs */}
        <div className="flex items-center gap-4 px-6 pt-3 border-b border-[#21262d] text-sm font-semibold bg-[#161b22]">
          <button
            onClick={() => setActiveTab('scope')}
            className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'scope'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            In-Scope & Out-of-Scope ({program.inScopeTargets.length})
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'rewards'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Rewards Matrix
          </button>
          <button
            onClick={() => setActiveTab('policy')}
            className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'policy'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Policy & Safe Harbor
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'scope' && (
            <div className="space-y-6">
              {/* In-Scope targets */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Eligible In-Scope Assets
                  </h3>
                  <span className="text-xs text-neutral-400">
                    Bounties awarded strictly for eligible assets
                  </span>
                </div>

                <div className="border border-[#21262d] rounded-xl overflow-hidden divide-y divide-[#21262d]">
                  {program.inScopeTargets.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-[#0d1117]/60 hover:bg-[#121620] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <code className="text-xs font-mono font-semibold text-sky-300 bg-sky-950/40 px-2 py-0.5 rounded border border-sky-800/40">
                            {item.target}
                          </code>
                          <span className="text-[11px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 font-mono">
                            {item.type}
                          </span>
                          <span className="text-[11px] px-1.5 py-0.2 rounded bg-rose-950/50 text-rose-300 font-mono border border-rose-800/40">
                            Max {item.maxSeverity}
                          </span>
                        </div>
                        {item.instruction && (
                          <p className="text-xs text-neutral-400 italic">
                            Instruction: {item.instruction}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleCopy(item.target)}
                          className="p-1.5 rounded bg-[#1f2937] hover:bg-[#374151] text-neutral-400 hover:text-white text-xs transition-colors"
                          title="Copy target"
                        >
                          {copiedTarget === item.target ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            onClose();
                            onLaunchAi(program, item.target);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Sparkles className="w-3 h-3 text-emerald-400" />
                          <span>Hunt Target</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Out-of-Scope items */}
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-2 mb-2 text-rose-400">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Out-of-Scope / Prohibited Actions
                </h3>
                <div className="p-4 bg-rose-950/15 border border-rose-900/30 rounded-xl space-y-2 text-xs text-neutral-300">
                  <p className="font-medium text-rose-300 mb-1">
                    Testing on the following assets or vulnerability classes is strictly prohibited and will result in disqualification:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-neutral-400">
                    {program.outOfScopeTargets.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                    <li>Denial of Service (DoS) attacks or automated volumetric rate flooding</li>
                    <li>Social engineering, spamming, or phishing employees/users</li>
                  </ul>
                </div>
              </div>

              {/* Technologies */}
              <div>
                <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-400 mb-2">
                  Observed Technologies & Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {program.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2.5 py-1 rounded-md bg-[#21262d] text-neutral-200 border border-[#30363d] font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-white text-base mb-1">Reward Distribution Matrix</h3>
                <p className="text-xs text-neutral-400 mb-4">
                  Payouts are calculated based on CVSS 3.1 score, business impact, and report reproducibility.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Critical */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-rose-950/30 to-[#161b22] border border-rose-800/40">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                        Critical Severity
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-900/50 text-rose-200">
                        CVSS 9.0 - 10.0
                      </span>
                    </div>
                    <div className="text-2xl font-black text-white font-mono">
                      ${program.rewards.critical.min.toLocaleString()} – ${program.rewards.critical.max.toLocaleString()}
                    </div>
                    <p className="text-xs text-neutral-400 mt-2">
                      RCE, authentication bypass on administrative systems, arbitrary SQLi with database takeover, multi-tenant container breakout.
                    </p>
                  </div>

                  {/* High */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/30 to-[#161b22] border border-amber-800/40">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                        High Severity
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-900/50 text-amber-200">
                        CVSS 7.0 - 8.9
                      </span>
                    </div>
                    <div className="text-2xl font-black text-white font-mono">
                      ${program.rewards.high.min.toLocaleString()} – ${program.rewards.high.max.toLocaleString()}
                    </div>
                    <p className="text-xs text-neutral-400 mt-2">
                      Stored XSS with session hijacking, IDOR revealing sensitive customer PII, unauthorized privilege escalation, SSRF to internal services.
                    </p>
                  </div>

                  {/* Medium */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-sky-950/30 to-[#161b22] border border-sky-800/40">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                        Medium Severity
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-900/50 text-sky-200">
                        CVSS 4.0 - 6.9
                      </span>
                    </div>
                    <div className="text-2xl font-black text-white font-mono">
                      ${program.rewards.medium.min.toLocaleString()} – ${program.rewards.medium.max.toLocaleString()}
                    </div>
                    <p className="text-xs text-neutral-400 mt-2">
                      CSRF on non-critical state changes, reflected XSS with user interaction, sensitive data exposure in headers/logs.
                    </p>
                  </div>

                  {/* Low */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/30 to-[#161b22] border border-emerald-800/40">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                        Low Severity
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-900/50 text-emerald-200">
                        CVSS 0.1 - 3.9
                      </span>
                    </div>
                    <div className="text-2xl font-black text-white font-mono">
                      ${program.rewards.low.min.toLocaleString()} – ${program.rewards.low.max.toLocaleString()}
                    </div>
                    <p className="text-xs text-neutral-400 mt-2">
                      Information leaks without privilege compromise, missing security headers with measurable risk.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'policy' && (
            <div className="space-y-4 text-xs text-neutral-300">
              <div className="p-4 rounded-xl bg-[#0d1117] border border-[#21262d] space-y-3">
                <h3 className="font-bold text-white text-sm">Program Disclosure Policy</h3>
                <p className="leading-relaxed text-neutral-300">{program.policySummary}</p>
                <div className="p-3 bg-emerald-950/20 border border-emerald-800/30 rounded-lg text-emerald-300">
                  <span className="font-bold">Safe Harbor Commitment:</span> This program adheres to Gold Standard Safe Harbor. The vendor agrees not to pursue legal action against researchers acting in good faith according to these guidelines.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0d1117] border border-[#21262d] space-y-2">
                <h4 className="font-bold text-white text-sm">Testing Rules</h4>
                <p>1. Only use designated test accounts created by you.</p>
                <p>2. Do not view, modify, or exfiltrate customer or employee data.</p>
                <p>3. Stop testing immediately upon confirming a vulnerability and report through HackerOne.</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with One-click Launch AI Strategist */}
        <div className="p-4 bg-[#0d1117] border-t border-[#21262d] flex items-center justify-between gap-3">
          <div className="text-xs text-neutral-400 hidden sm:block">
            Targeting <span className="text-white font-mono font-bold">@{program.handle}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-white text-xs font-semibold transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onLaunchAi(program);
              }}
              className="flex-1 sm:flex-none py-2.5 px-5 rounded-lg bg-gradient-to-r from-[#00b87c] to-[#059669] text-black font-extrabold text-xs hover:brightness-110 shadow-lg shadow-[#00b87c]/20 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>Launch AI Hunter Thinking (3.1 Pro)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
