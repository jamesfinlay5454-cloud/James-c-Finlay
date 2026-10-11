import React, { useState } from 'react';
import { Calculator, Sparkles, Copy, Check, DollarSign } from 'lucide-react';
import { H1_PROGRAMS } from '../data/programs';

export const CvssCalculator: React.FC = () => {
  const [av, setAv] = useState<'N' | 'A' | 'L' | 'P'>('N'); // Network, Adjacent, Local, Physical
  const [ac, setAc] = useState<'L' | 'H'>('L'); // Low, High
  const [pr, setPr] = useState<'N' | 'L' | 'H'>('N'); // None, Low, High
  const [ui, setUi] = useState<'N' | 'R'>('N'); // None, Required
  const [s, setS] = useState<'U' | 'C'>('U'); // Unchanged, Changed
  const [c, setC] = useState<'H' | 'L' | 'N'>('H'); // High, Low, None
  const [i, setI] = useState<'H' | 'L' | 'N'>('H'); // High, Low, None
  const [a, setA] = useState<'H' | 'L' | 'N'>('N'); // High, Low, None

  const [selectedProgId, setSelectedProgId] = useState<string>('crypto');
  const [copied, setCopied] = useState(false);

  // Simple CVSS 3.1 calculation approximation
  const calculateScore = () => {
    let score = 0;
    if (av === 'N') score += 3.8;
    else if (av === 'A') score += 2.5;
    else if (av === 'L') score += 1.8;
    else score += 0.8;

    if (ac === 'L') score += 1.2;
    else score += 0.5;

    if (pr === 'N') score += 2.0;
    else if (pr === 'L') score += 1.2;
    else score += 0.5;

    if (ui === 'N') score += 1.5;
    else score += 0.6;

    if (s === 'C') score += 1.0;

    let impact = 0;
    if (c === 'H') impact += 2.0;
    else if (c === 'L') impact += 1.0;

    if (i === 'H') impact += 2.0;
    else if (i === 'L') impact += 1.0;

    if (a === 'H') impact += 2.0;
    else if (a === 'L') impact += 1.0;

    const finalRaw = Math.min(10.0, ((score + impact) / 13.5) * 10);
    return Math.round(finalRaw * 10) / 10;
  };

  const score = calculateScore();

  const getSeverity = (score: number) => {
    if (score >= 9.0) return { label: 'CRITICAL', color: 'text-rose-400 bg-rose-950/60 border-rose-800' };
    if (score >= 7.0) return { label: 'HIGH', color: 'text-amber-400 bg-amber-950/60 border-amber-800' };
    if (score >= 4.0) return { label: 'MEDIUM', color: 'text-sky-400 bg-sky-950/60 border-sky-800' };
    return { label: 'LOW', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' };
  };

  const severity = getSeverity(score);

  const vector = `CVSS:3.1/AV:${av}/AC:${ac}/PR:${pr}/UI:${ui}/S:${s}/C:${c}/I:${i}/A:${a}`;

  const selectedProgram = H1_PROGRAMS.find((p) => p.id === selectedProgId) || H1_PROGRAMS[0];

  const getEstimatedBounty = () => {
    if (score >= 9.0) {
      return `$${selectedProgram.rewards.critical.min.toLocaleString()} – $${selectedProgram.rewards.critical.max.toLocaleString()}`;
    }
    if (score >= 7.0) {
      return `$${selectedProgram.rewards.high.min.toLocaleString()} – $${selectedProgram.rewards.high.max.toLocaleString()}`;
    }
    if (score >= 4.0) {
      return `$${selectedProgram.rewards.medium.min.toLocaleString()} – $${selectedProgram.rewards.medium.max.toLocaleString()}`;
    }
    return `$${selectedProgram.rewards.low.min.toLocaleString()} – $${selectedProgram.rewards.low.max.toLocaleString()}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${vector} (Score: ${score} ${severity.label})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#161b22] border border-[#21262d] rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Calculator className="w-6 h-6 text-emerald-400" />
          CVSS v3.1 Calculator & Bounty Estimator
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Calculate standardized vulnerability scores and forecast expected bug bounty payouts for HackerOne targets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Metric Selectors: 8 cols */}
        <div className="lg:col-span-8 bg-[#161b22] border border-[#21262d] rounded-2xl p-6 space-y-5">
          <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">
            Base Metric Group
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Attack Vector */}
            <div className="p-3 bg-[#0d1117] rounded-xl border border-[#21262d]">
              <span className="text-neutral-300 font-semibold block mb-2">
                Attack Vector (AV)
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { key: 'N', label: 'Network' },
                  { key: 'A', label: 'Adjacent' },
                  { key: 'L', label: 'Local' },
                  { key: 'P', label: 'Physical' }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setAv(item.key as any)}
                    className={`py-1.5 px-2 rounded font-medium border text-center transition-colors ${
                      av === item.key
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-[#161b22] text-neutral-400 border-[#30363d]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Attack Complexity */}
            <div className="p-3 bg-[#0d1117] rounded-xl border border-[#21262d]">
              <span className="text-neutral-300 font-semibold block mb-2">
                Attack Complexity (AC)
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { key: 'L', label: 'Low' },
                  { key: 'H', label: 'High' }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setAc(item.key as any)}
                    className={`py-1.5 px-2 rounded font-medium border text-center transition-colors ${
                      ac === item.key
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-[#161b22] text-neutral-400 border-[#30363d]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Privileges Required */}
            <div className="p-3 bg-[#0d1117] rounded-xl border border-[#21262d]">
              <span className="text-neutral-300 font-semibold block mb-2">
                Privileges Required (PR)
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { key: 'N', label: 'None' },
                  { key: 'L', label: 'Low' },
                  { key: 'H', label: 'High' }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setPr(item.key as any)}
                    className={`py-1.5 px-2 rounded font-medium border text-center transition-colors ${
                      pr === item.key
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-[#161b22] text-neutral-400 border-[#30363d]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* User Interaction */}
            <div className="p-3 bg-[#0d1117] rounded-xl border border-[#21262d]">
              <span className="text-neutral-300 font-semibold block mb-2">
                User Interaction (UI)
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { key: 'N', label: 'None' },
                  { key: 'R', label: 'Required' }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setUi(item.key as any)}
                    className={`py-1.5 px-2 rounded font-medium border text-center transition-colors ${
                      ui === item.key
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-[#161b22] text-neutral-400 border-[#30363d]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scope */}
            <div className="p-3 bg-[#0d1117] rounded-xl border border-[#21262d]">
              <span className="text-neutral-300 font-semibold block mb-2">
                Scope (S)
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { key: 'U', label: 'Unchanged' },
                  { key: 'C', label: 'Changed' }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setS(item.key as any)}
                    className={`py-1.5 px-2 rounded font-medium border text-center transition-colors ${
                      s === item.key
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-[#161b22] text-neutral-400 border-[#30363d]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Confidentiality Impact */}
            <div className="p-3 bg-[#0d1117] rounded-xl border border-[#21262d]">
              <span className="text-neutral-300 font-semibold block mb-2">
                Confidentiality (C)
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { key: 'H', label: 'High' },
                  { key: 'L', label: 'Low' },
                  { key: 'N', label: 'None' }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setC(item.key as any)}
                    className={`py-1.5 px-2 rounded font-medium border text-center transition-colors ${
                      c === item.key
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-[#161b22] text-neutral-400 border-[#30363d]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Integrity Impact */}
            <div className="p-3 bg-[#0d1117] rounded-xl border border-[#21262d]">
              <span className="text-neutral-300 font-semibold block mb-2">
                Integrity (I)
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { key: 'H', label: 'High' },
                  { key: 'L', label: 'Low' },
                  { key: 'N', label: 'None' }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setI(item.key as any)}
                    className={`py-1.5 px-2 rounded font-medium border text-center transition-colors ${
                      i === item.key
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-[#161b22] text-neutral-400 border-[#30363d]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Impact */}
            <div className="p-3 bg-[#0d1117] rounded-xl border border-[#21262d]">
              <span className="text-neutral-300 font-semibold block mb-2">
                Availability (A)
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { key: 'H', label: 'High' },
                  { key: 'L', label: 'Low' },
                  { key: 'N', label: 'None' }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setA(item.key as any)}
                    className={`py-1.5 px-2 rounded font-medium border text-center transition-colors ${
                      a === item.key
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-[#161b22] text-neutral-400 border-[#30363d]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Output & Estimator: 4 cols */}
        <div className="lg:col-span-4 bg-[#161b22] border border-[#21262d] rounded-2xl p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">
              Score & Vector Summary
            </h2>

            {/* Big Score Box */}
            <div className="p-5 bg-[#0d1117] rounded-xl border border-[#21262d] text-center">
              <span className="text-xs font-mono text-neutral-400 block mb-1">
                CVSS v3.1 BASE SCORE
              </span>
              <div className="text-5xl font-black text-white font-mono tracking-tight my-2">
                {score.toFixed(1)}
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${severity.color}`}>
                {severity.label}
              </span>
            </div>

            {/* Vector String */}
            <div className="p-3 bg-[#0d1117] rounded-xl border border-[#21262d]">
              <span className="text-[10px] font-mono text-neutral-400 block mb-1">
                VECTOR STRING
              </span>
              <code className="text-xs font-mono text-sky-300 break-all block">
                {vector}
              </code>
              <button
                onClick={handleCopy}
                className="mt-2 w-full py-1.5 rounded bg-[#21262d] hover:bg-[#30363d] text-neutral-300 text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Vector'}</span>
              </button>
            </div>

            {/* Target Program Bounty Estimator */}
            <div className="p-4 bg-[#0d1117] rounded-xl border border-[#21262d] space-y-2">
              <span className="text-xs font-semibold text-neutral-300 block">
                Target Program Forecast
              </span>
              <select
                value={selectedProgId}
                onChange={(e) => setSelectedProgId(e.target.value)}
                className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                {H1_PROGRAMS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (@{p.handle})
                  </option>
                ))}
              </select>

              <div className="pt-2">
                <span className="text-[11px] text-neutral-400 block">Estimated Payout Tier:</span>
                <span className="text-lg font-bold text-emerald-400 font-mono">
                  {getEstimatedBounty()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
