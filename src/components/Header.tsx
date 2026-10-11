import React from 'react';
import { Shield, Sparkles, FileText, Bookmark, Scale, Calculator, Search, ExternalLink } from 'lucide-react';

interface HeaderProps {
  activeTab: 'programs' | 'reports' | 'ai-studio' | 'comparator' | 'cvss' | 'watchlist';
  setActiveTab: (tab: 'programs' | 'reports' | 'ai-studio' | 'comparator' | 'cvss' | 'watchlist') => void;
  watchlistCount: number;
  programsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  watchlistCount,
  programsCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0e1117]/95 backdrop-blur border-b border-[#21262d] text-white">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-[#00b87c]/10 via-[#0e1117] to-[#38bdf8]/10 border-b border-[#21262d]/50 px-4 py-1 text-xs text-neutral-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#00b87c] animate-pulse"></span>
          <span className="font-medium text-neutral-300">HackerOne Directory & Hunter Intelligence</span>
          <span className="text-neutral-500">•</span>
          <span className="text-neutral-400">{programsCount}+ active programs & 10,000+ disclosed vulnerabilities</span>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <span className="bg-[#1f2937] text-[#00b87c] text-[10px] font-mono px-2 py-0.5 rounded border border-[#00b87c]/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#00b87c]" />
            AI High Thinking Mode: gemini-3.1-pro-preview
          </span>
          <a
            href="https://hackerone.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white flex items-center gap-1 text-[11px] text-neutral-400"
          >
            Learn more about HackerOne <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* HackerOne Logo */}
          <button
            onClick={() => setActiveTab('programs')}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00b87c] to-[#059669] flex items-center justify-center font-black text-xl text-black shadow-lg shadow-[#00b87c]/20 group-hover:scale-105 transition-transform">
              h<span className="text-white text-base font-extrabold">1</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-lg text-white">hackerone</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  Hunter
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 -mt-0.5">Program Directory & Scope Intelligence</p>
            </div>
          </button>

          {/* Navigation tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('programs')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'programs'
                  ? 'bg-[#1f293d] text-emerald-400 border border-emerald-500/30'
                  : 'text-neutral-300 hover:text-white hover:bg-[#161b22]'
              }`}
            >
              <Shield className="w-4 h-4" />
              All Programs
              <span className="ml-1 text-xs px-1.5 py-0.2 rounded-full bg-[#21262d] text-neutral-300 font-mono">
                {programsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'reports'
                  ? 'bg-[#1f293d] text-emerald-400 border border-emerald-500/30'
                  : 'text-neutral-300 hover:text-white hover:bg-[#161b22]'
              }`}
            >
              <FileText className="w-4 h-4" />
              Disclosed Reports
              <span className="ml-0.5 text-[10px] uppercase px-1 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Hacktivity
              </span>
            </button>

            <button
              onClick={() => setActiveTab('ai-studio')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'ai-studio'
                  ? 'bg-[#1f293d] text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/20'
                  : 'text-neutral-300 hover:text-white hover:bg-[#161b22]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              AI Hunter Thinking
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                3.1 Pro
              </span>
            </button>

            <button
              onClick={() => setActiveTab('comparator')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'comparator'
                  ? 'bg-[#1f293d] text-emerald-400 border border-emerald-500/30'
                  : 'text-neutral-300 hover:text-white hover:bg-[#161b22]'
              }`}
            >
              <Scale className="w-4 h-4" />
              Compare
            </button>

            <button
              onClick={() => setActiveTab('cvss')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'cvss'
                  ? 'bg-[#1f293d] text-emerald-400 border border-emerald-500/30'
                  : 'text-neutral-300 hover:text-white hover:bg-[#161b22]'
              }`}
            >
              <Calculator className="w-4 h-4" />
              CVSS 3.1
            </button>
          </nav>
        </div>

        {/* Right side Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'watchlist'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-neutral-300 hover:text-white bg-[#161b22] border border-[#30363d]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span>Target Watchlist</span>
            {watchlistCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black font-bold text-[10px]">
                {watchlistCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('ai-studio')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-[#00b87c] to-[#059669] text-black font-semibold text-xs hover:brightness-110 shadow-md shadow-[#00b87c]/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            Hunter Strategist
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-[#21262d] bg-[#161b22] py-2 px-1 text-xs">
        <button
          onClick={() => setActiveTab('programs')}
          className={`px-2 py-1 rounded ${activeTab === 'programs' ? 'text-emerald-400 font-bold bg-[#1f293d]' : 'text-neutral-400'}`}
        >
          Programs
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-2 py-1 rounded ${activeTab === 'reports' ? 'text-emerald-400 font-bold bg-[#1f293d]' : 'text-neutral-400'}`}
        >
          Disclosed
        </button>
        <button
          onClick={() => setActiveTab('ai-studio')}
          className={`px-2 py-1 rounded ${activeTab === 'ai-studio' ? 'text-emerald-400 font-bold bg-[#1f293d]' : 'text-neutral-400'}`}
        >
          AI Thinking
        </button>
        <button
          onClick={() => setActiveTab('comparator')}
          className={`px-2 py-1 rounded ${activeTab === 'comparator' ? 'text-emerald-400 font-bold bg-[#1f293d]' : 'text-neutral-400'}`}
        >
          Compare
        </button>
        <button
          onClick={() => setActiveTab('cvss')}
          className={`px-2 py-1 rounded ${activeTab === 'cvss' ? 'text-emerald-400 font-bold bg-[#1f293d]' : 'text-neutral-400'}`}
        >
          CVSS
        </button>
      </div>
    </header>
  );
};
