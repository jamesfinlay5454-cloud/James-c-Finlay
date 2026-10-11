import React, { useState } from 'react';
import { H1Program } from '../types/hackerone';
import { H1_PROGRAMS } from '../data/programs';
import {
  Sparkles,
  Shield,
  FileText,
  AlertTriangle,
  Code2,
  Copy,
  Check,
  Download,
  Terminal,
  Bookmark,
  Zap,
  RefreshCw,
  Cpu,
  Brain,
  Layers,
  ArrowRight
} from 'lucide-react';

interface HunterIntelligenceStudioProps {
  initialProgram?: H1Program | null;
  initialScopeTarget?: string;
  initialQueryType?: 'attack-surface-strategy' | 'report-drafter' | 'scope-checker' | 'disclosed-report-breakdown' | 'free-query';
  initialUserQuery?: string;
  onSaveToNotes?: (programHandle: string, title: string, content: string) => void;
}

export const HunterIntelligenceStudio: React.FC<HunterIntelligenceStudioProps> = ({
  initialProgram,
  initialScopeTarget = '',
  initialQueryType = 'attack-surface-strategy',
  initialUserQuery = '',
  onSaveToNotes
}) => {
  const [selectedProgramId, setSelectedProgramId] = useState<string>(
    initialProgram?.id || 'crypto'
  );
  const [targetScope, setTargetScope] = useState<string>(
    initialScopeTarget || initialProgram?.inScopeTargets[0]?.target || '*.crypto.com'
  );
  const [queryType, setQueryType] = useState<
    'attack-surface-strategy' | 'report-drafter' | 'scope-checker' | 'disclosed-report-breakdown' | 'free-query'
  >(initialQueryType);
  const [userQuery, setUserQuery] = useState<string>(initialUserQuery);
  const [researcherNotes, setResearcherNotes] = useState<string>('');
  const [severityTarget, setSeverityTarget] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('Critical');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [intelligenceResult, setIntelligenceResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const currentProgram = H1_PROGRAMS.find((p) => p.id === selectedProgramId) || H1_PROGRAMS[0];

  const handleProgramChange = (progId: string) => {
    setSelectedProgramId(progId);
    const prog = H1_PROGRAMS.find((p) => p.id === progId);
    if (prog && prog.inScopeTargets.length > 0) {
      setTargetScope(prog.inScopeTargets[0].target);
    }
  };

  const handleRunThinkingIntelligence = async () => {
    setIsLoading(true);
    setError(null);
    setIntelligenceResult(null);

    try {
      const response = await fetch('/api/hunter-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programName: currentProgram.name,
          programHandle: currentProgram.handle,
          bountyRange: currentProgram.bountyRangeText,
          features: currentProgram.features,
          assetTypes: currentProgram.assetTypes,
          industries: currentProgram.industries,
          targetScope: targetScope || currentProgram.inScopeTargets[0]?.target,
          queryType,
          userQuery: userQuery.trim() || undefined,
          researcherNotes: researcherNotes.trim() || undefined,
          severityTarget,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate hunter intelligence');
      }

      setIntelligenceResult(data.text);
    } catch (err: any) {
      console.error(err);
      setError(
        err.message ||
          'Failed to connect to the reasoning server. Ensure your Gemini API credentials are set.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!intelligenceResult) return;
    navigator.clipboard.writeText(intelligenceResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveNotes = () => {
    if (!intelligenceResult || !onSaveToNotes) return;
    const title = `${queryType.toUpperCase()} - ${currentProgram.name} (${targetScope})`;
    onSaveToNotes(currentProgram.handle, title, intelligenceResult);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDownload = () => {
    if (!intelligenceResult) return;
    const blob = new Blob([intelligenceResult], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `H1-${currentProgram.handle}-${queryType}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const samplePresets = [
    {
      title: 'Shopify Admin Multi-tenant Isolation Bypass',
      progId: 'shopify',
      scope: 'admin.shopify.com',
      type: 'attack-surface-strategy' as const,
      prompt: 'Formulate an attack methodology targeting tenant organization boundary isolation, GraphQL batching race conditions, and staff privilege escalation.'
    },
    {
      title: 'Crypto.com API Cold/Hot Wallet Signature Manipulation',
      progId: 'crypto',
      scope: 'api.crypto.com',
      type: 'attack-surface-strategy' as const,
      prompt: 'Develop testing vectors for withdrawal authorization HMAC tampering, order book race conditions, and 2FA token reuse.'
    },
    {
      title: 'Gold Standard Report: IDOR Leaking Customer PII',
      progId: 'security',
      scope: 'api.hackerone.com',
      type: 'report-drafter' as const,
      prompt: 'A researcher found an IDOR on /api/v1/user/{id}/profile where incrementing the integer ID returns unredacted emails and private 2FA backup codes.'
    },
    {
      title: 'Safe Harbor Scope Validation for Subdomain Takeover',
      progId: 'github',
      scope: '*.github.com',
      type: 'scope-checker' as const,
      prompt: 'I discovered an unclaimed S3 bucket CNAME pointing to sub.github.com. How can I safely verify and claim proof without altering customer traffic or exceeding Safe Harbor?'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Studio Banner */}
      <div className="bg-gradient-to-br from-[#161b22] via-[#0d1117] to-[#121620] border border-[#21262d] rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00b87c] to-[#059669] flex items-center justify-center shadow-lg shadow-[#00b87c]/20">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  AI Hunter Intelligence & Strategist
                </h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Thinking Mode: HIGH
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Powered by <code className="text-emerald-400 font-bold font-mono">gemini-3.1-pro-preview</code> with maximal reasoning depth
              </p>
            </div>
          </div>

          {/* Model Specification Card */}
          <div className="bg-[#0d1117] border border-[#30363d] px-3.5 py-2 rounded-xl text-right shrink-0">
            <div className="flex items-center justify-end gap-1.5 text-xs text-emerald-400 font-mono font-bold">
              <Cpu className="w-3.5 h-3.5" />
              gemini-3.1-pro-preview
            </div>
            <div className="text-[10px] text-neutral-400">
              ThinkingLevel: <span className="text-white font-bold font-mono">HIGH</span> (No token limit)
            </div>
          </div>
        </div>

        {/* Quick presets */}
        <div className="mt-4 pt-4 border-t border-[#21262d]">
          <span className="text-[11px] uppercase tracking-wider font-mono text-neutral-400 block mb-2">
            Instant Research Scenarios
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {samplePresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedProgramId(preset.progId);
                  setTargetScope(preset.scope);
                  setQueryType(preset.type);
                  setUserQuery(preset.prompt);
                }}
                className="text-left p-2.5 rounded-lg bg-[#0d1117]/80 hover:bg-[#1a2332] border border-[#21262d] hover:border-emerald-500/40 transition-colors text-xs group"
              >
                <span className="font-semibold text-white group-hover:text-emerald-400 block truncate">
                  {preset.title}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono block">
                  @{preset.progId} • {preset.type}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Studio Configuration Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Panel: 5 columns */}
        <div className="lg:col-span-5 bg-[#161b22] border border-[#21262d] rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            Target Configuration
          </h2>

          {/* Program Selector */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Target HackerOne Program
            </label>
            <select
              value={selectedProgramId}
              onChange={(e) => handleProgramChange(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              {H1_PROGRAMS.map((prog) => (
                <option key={prog.id} value={prog.id}>
                  {prog.name} (@{prog.handle}) — {prog.bountyRangeText}
                </option>
              ))}
            </select>
          </div>

          {/* Target Scope Asset */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-neutral-300">
                Asset Scope / Endpoint
              </label>
              <span className="text-[11px] text-neutral-500 font-mono">
                {currentProgram.inScopeTargets.length} in-scope assets
              </span>
            </div>
            <input
              type="text"
              value={targetScope}
              onChange={(e) => setTargetScope(e.target.value)}
              placeholder="e.g. *.shopify.com, api.crypto.com, /api/v2/auth"
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
            {currentProgram.inScopeTargets.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {currentProgram.inScopeTargets.slice(0, 3).map((item, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setTargetScope(item.target)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#21262d] text-neutral-400 hover:text-white border border-[#30363d]"
                  >
                    {item.target}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Research Query Type */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Intelligence Capability Mode
            </label>
            <div className="grid grid-cols-1 gap-2">
              <label
                onClick={() => setQueryType('attack-surface-strategy')}
                className={`p-2.5 rounded-xl border cursor-pointer text-xs flex items-center justify-between transition-colors ${
                  queryType === 'attack-surface-strategy'
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-white font-semibold'
                    : 'bg-[#0d1117] border-[#30363d] text-neutral-300 hover:border-neutral-500'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Attack Surface Strategy</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-normal block mt-0.5">
                    High-ROI reconnaissance, attack tree, and exploit vectors
                  </span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    queryType === 'attack-surface-strategy'
                      ? 'border-emerald-500 bg-emerald-500 text-black'
                      : 'border-neutral-600'
                  }`}
                >
                  {queryType === 'attack-surface-strategy' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </label>

              <label
                onClick={() => setQueryType('report-drafter')}
                className={`p-2.5 rounded-xl border cursor-pointer text-xs flex items-center justify-between transition-colors ${
                  queryType === 'report-drafter'
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-white font-semibold'
                    : 'bg-[#0d1117] border-[#30363d] text-neutral-300 hover:border-neutral-500'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-sky-400" />
                    <span>Gold Standard Report Drafter</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-normal block mt-0.5">
                    Generates CVSS 3.1, PoC reproduction steps, and remediation
                  </span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    queryType === 'report-drafter'
                      ? 'border-emerald-500 bg-emerald-500 text-black'
                      : 'border-neutral-600'
                  }`}
                >
                  {queryType === 'report-drafter' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </label>

              <label
                onClick={() => setQueryType('scope-checker')}
                className={`p-2.5 rounded-xl border cursor-pointer text-xs flex items-center justify-between transition-colors ${
                  queryType === 'scope-checker'
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-white font-semibold'
                    : 'bg-[#0d1117] border-[#30363d] text-neutral-300 hover:border-neutral-500'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>Safe Harbor & Scope Guard</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-normal block mt-0.5">
                    Validates boundary rules, out-of-scope traps, and test safety
                  </span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    queryType === 'scope-checker'
                      ? 'border-emerald-500 bg-emerald-500 text-black'
                      : 'border-neutral-600'
                  }`}
                >
                  {queryType === 'scope-checker' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </label>
            </div>
          </div>

          {/* Severity Target */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Severity Focus & Payout Level
            </label>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {(['Critical', 'High', 'Medium', 'Low'] as ('Critical' | 'High' | 'Medium' | 'Low')[]).map(
                (sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverityTarget(sev)}
                    className={`py-1.5 rounded-lg border font-mono font-bold transition-colors ${
                      severityTarget === sev
                        ? sev === 'Critical'
                          ? 'bg-rose-950 text-rose-300 border-rose-600'
                          : sev === 'High'
                          ? 'bg-amber-950 text-amber-300 border-amber-600'
                          : sev === 'Medium'
                          ? 'bg-sky-950 text-sky-300 border-sky-600'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-600'
                        : 'bg-[#0d1117] text-neutral-400 border-[#30363d]'
                    }`}
                  >
                    {sev}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Custom Prompt / Notes */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              {queryType === 'report-drafter'
                ? 'Researcher Finding Notes & PoC Summary'
                : 'Custom Instructions / Specific Vulnerability Angle'}
            </label>
            <textarea
              rows={4}
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder={
                queryType === 'report-drafter'
                  ? 'Enter raw notes, vulnerable URL parameter, observed behavior, and header responses...'
                  : 'Specify areas of interest (e.g., Focus on OAuth callback flows, race conditions during checkout, SSRF into internal VPC)...'
              }
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          {/* Action Button */}
          <button
            onClick={handleRunThinkingIntelligence}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#00b87c] to-[#059669] hover:brightness-110 disabled:opacity-50 text-black font-extrabold text-sm transition-all shadow-lg shadow-[#00b87c]/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
                <span>Thinking Deeply (Gemini 3.1 Pro)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-black" />
                <span>Generate Deep Intelligence</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output Panel: 7 columns */}
        <div className="lg:col-span-7 bg-[#161b22] border border-[#21262d] rounded-2xl p-5 flex flex-col justify-between shadow-sm min-h-[550px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#21262d] mb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white text-sm">Reasoning Output</span>
                {isLoading && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 animate-pulse">
                    Synthesizing high thinking model...
                  </span>
                )}
              </div>

              {intelligenceResult && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-1 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-neutral-300 text-xs flex items-center gap-1 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleSaveNotes}
                    className="px-2.5 py-1 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-amber-300 text-xs flex items-center gap-1 transition-colors"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                    <span>{savedSuccess ? 'Saved!' : 'Save to Notes'}</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="px-2.5 py-1 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-neutral-300 text-xs flex items-center gap-1 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>.MD</span>
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 text-xs flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Execution Error:</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center animate-pulse">
                  <Brain className="w-8 h-8 text-emerald-400 animate-spin" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">Engaging High Thinking Mode</h3>
                  <p className="text-xs text-neutral-400 max-w-sm">
                    gemini-3.1-pro-preview is evaluating Safe Harbor boundaries, decomposing attack trees, and formulating exploitation proof-of-concept steps...
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400/80 bg-[#0d1117] px-3 py-1.5 rounded-full border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Thinking Level: HIGH • Uncapped Token Generation
                </div>
              </div>
            )}

            {!isLoading && !intelligenceResult && !error && (
              <div className="py-20 text-center space-y-3">
                <Code2 className="w-12 h-12 text-neutral-600 mx-auto" />
                <h3 className="text-sm font-bold text-neutral-300">
                  Ready to run Hunter Intelligence
                </h3>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  Select a program, define your target asset scope, and click "Generate Deep Intelligence" to invoke Gemini 3.1 Pro with High Thinking mode.
                </p>
              </div>
            )}

            {!isLoading && intelligenceResult && (
              <div className="bg-[#0d1117] border border-[#21262d] rounded-xl p-5 max-h-[600px] overflow-y-auto text-neutral-200 text-xs font-mono leading-relaxed space-y-4 scrollbar-thin">
                <div className="prose prose-invert prose-emerald max-w-none text-xs">
                  <pre className="whitespace-pre-wrap font-sans text-neutral-200 leading-relaxed text-xs">
                    {intelligenceResult}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Model telemetry bar at bottom */}
          <div className="pt-4 border-t border-[#21262d] flex items-center justify-between text-[11px] text-neutral-500 font-mono">
            <span>Security Framework: HackerOne Vulnerability Taxonomy & CVSS 3.1</span>
            <span>Target: {currentProgram.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
