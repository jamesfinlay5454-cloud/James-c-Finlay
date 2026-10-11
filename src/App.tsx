import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { FiltersSidebar } from './components/FiltersSidebar';
import { ProgramCard } from './components/ProgramCard';
import { ProgramDetailModal } from './components/ProgramDetailModal';
import { DisclosedReportsView } from './components/DisclosedReportsView';
import { HunterIntelligenceStudio } from './components/HunterIntelligenceStudio';
import { ProgramComparator } from './components/ProgramComparator';
import { CvssCalculator } from './components/CvssCalculator';
import { HunterWatchlistView } from './components/HunterWatchlistView';
import { H1_PROGRAMS } from './data/programs';
import {
  H1Program,
  FilterState,
  HunterWatchlistEntry,
  HunterNote
} from './types/hackerone';
import { DisclosedReport } from './data/reports';
import {
  Search,
  ArrowUpDown,
  Filter,
  Sparkles,
  Shield,
  X,
  SlidersHorizontal
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'programs' | 'reports' | 'ai-studio' | 'comparator' | 'cvss' | 'watchlist'
  >('programs');

  const [selectedProgramForModal, setSelectedProgramForModal] = useState<H1Program | null>(null);

  // AI Studio prefill parameters
  const [aiStudioTargetProgram, setAiStudioTargetProgram] = useState<H1Program | null>(null);
  const [aiStudioScopeTarget, setAiStudioScopeTarget] = useState<string>('');
  const [aiStudioQueryType, setAiStudioQueryType] = useState<
    'attack-surface-strategy' | 'report-drafter' | 'scope-checker' | 'disclosed-report-breakdown' | 'free-query'
  >('attack-surface-strategy');
  const [aiStudioUserQuery, setAiStudioUserQuery] = useState<string>('');

  // Watchlist & Notes stored in localStorage
  const [watchlist, setWatchlist] = useState<HunterWatchlistEntry[]>(() => {
    try {
      const saved = localStorage.getItem('h1_hunter_watchlist');
      return saved ? JSON.parse(saved) : [{ programId: 'crypto', addedAt: new Date().toISOString(), status: 'Hunting', notesCount: 0 }];
    } catch {
      return [];
    }
  });

  const [notes, setNotes] = useState<HunterNote[]>(() => {
    try {
      const saved = localStorage.getItem('h1_hunter_notes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('h1_hunter_watchlist', JSON.stringify(watchlist));
    } catch (e) {
      console.error(e);
    }
  }, [watchlist]);

  useEffect(() => {
    try {
      localStorage.setItem('h1_hunter_notes', JSON.stringify(notes));
    } catch (e) {
      console.error(e);
    }
  }, [notes]);

  // Main filter state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    programTypes: ['Bounty'],
    features: [],
    assetTypes: [],
    industries: [],
    tags: [],
    minBountySeverity: {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    },
    minMaxBountyFilter: 0,
    minResponseRate: 0,
    sortBy: 'popular'
  });

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Watchlist toggle handler
  const handleToggleWatchlist = (programId: string) => {
    setWatchlist((prev) => {
      const exists = prev.some((w) => w.programId === programId);
      if (exists) {
        return prev.filter((w) => w.programId !== programId);
      } else {
        return [
          ...prev,
          {
            programId,
            addedAt: new Date().toISOString(),
            status: 'Watching',
            notesCount: 0
          }
        ];
      }
    });
  };

  const handleLaunchAiFromProgram = (program: H1Program, targetScope?: string) => {
    setAiStudioTargetProgram(program);
    setAiStudioScopeTarget(targetScope || program.inScopeTargets[0]?.target || '');
    setAiStudioQueryType('attack-surface-strategy');
    setAiStudioUserQuery('');
    setActiveTab('ai-studio');
  };

  const handleAnalyzeReportWithAi = (report: DisclosedReport) => {
    const matchedProg = H1_PROGRAMS.find((p) => p.handle === report.programHandle) || null;
    setAiStudioTargetProgram(matchedProg);
    setAiStudioScopeTarget(report.title);
    setAiStudioQueryType('disclosed-report-breakdown');
    setAiStudioUserQuery(`Analyze root cause and vulnerability chain for disclosed report #${report.reportNumber}: ${report.title} (${report.weaknessCwe}). Summary: ${report.summary}`);
    setActiveTab('ai-studio');
  };

  const handleSaveToNotes = (programHandle: string, title: string, content: string) => {
    const newNote: HunterNote = {
      id: `note-${Date.now()}`,
      programId: programHandle,
      title,
      content,
      targetScope: '',
      severity: 'High',
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  // Filtered & sorted programs calculation
  const filteredPrograms = useMemo(() => {
    return H1_PROGRAMS.filter((prog) => {
      // Search query (name, handle, technologies, industry, targets)
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = prog.name.toLowerCase().includes(q);
        const matchesHandle = prog.handle.toLowerCase().includes(q);
        const matchesTagline = prog.tagline.toLowerCase().includes(q);
        const matchesTech = prog.technologies.some((t) => t.toLowerCase().includes(q));
        const matchesTarget = prog.inScopeTargets.some((t) => t.target.toLowerCase().includes(q));
        if (!matchesName && !matchesHandle && !matchesTagline && !matchesTech && !matchesTarget) {
          return false;
        }
      }

      // Program Type
      if (filters.programTypes.length > 0 && !filters.programTypes.includes(prog.type)) {
        return false;
      }

      // Features filter
      if (filters.features.length > 0) {
        const hasAllFeatures = filters.features.every((f) => prog.features.includes(f));
        if (!hasAllFeatures) return false;
      }

      // Asset types filter
      if (filters.assetTypes.length > 0) {
        const hasAsset = filters.assetTypes.some((a) => prog.assetTypes.includes(a));
        if (!hasAsset) return false;
      }

      // Industries
      if (filters.industries.length > 0) {
        const hasIndustry = filters.industries.some((i) => prog.industries.includes(i));
        if (!hasIndustry) return false;
      }

      // Tags
      if (filters.tags.length > 0) {
        const hasTag = filters.tags.some((t) => prog.tags.includes(t as any));
        if (!hasTag) return false;
      }

      // Severity Min. Bounty filter
      if (filters.minBountySeverity.critical > 0 && prog.rewards.critical.max < filters.minBountySeverity.critical) {
        return false;
      }
      if (filters.minBountySeverity.high > 0 && prog.rewards.high.max < filters.minBountySeverity.high) {
        return false;
      }
      if (filters.minBountySeverity.medium > 0 && prog.rewards.medium.max < filters.minBountySeverity.medium) {
        return false;
      }
      if (filters.minBountySeverity.low > 0 && prog.rewards.low.max < filters.minBountySeverity.low) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'popular') {
        return b.reportsResolved - a.reportsResolved;
      }
      if (filters.sortBy === 'bounty_desc') {
        return b.maxBounty - a.maxBounty;
      }
      if (filters.sortBy === 'bounty_asc') {
        return a.minBounty - b.minBounty;
      }
      if (filters.sortBy === 'resolved_desc') {
        return b.reportsResolved - a.reportsResolved;
      }
      if (filters.sortBy === 'efficiency_desc') {
        return b.responseEfficiency - a.responseEfficiency;
      }
      if (filters.sortBy === 'newest') {
        return b.joinedYear - a.joinedYear;
      }
      if (filters.sortBy === 'name_asc') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-[#0e1117] text-white flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        watchlistCount={watchlist.length}
        programsCount={H1_PROGRAMS.length}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: ALL PROGRAMS DIRECTORY */}
        {activeTab === 'programs' && (
          <div className="space-y-6">
            {/* Top Search & Results Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#161b22] border border-[#21262d] rounded-2xl p-4 sm:p-5 shadow-sm">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={filters.searchQuery}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
                  }
                  placeholder="Search programs (e.g. apple, crypto, shopify, stripe, rust)..."
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-mono shadow-inner"
                />
                {filters.searchQuery && (
                  <button
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, searchQuery: '' }))
                    }
                    className="absolute right-3 top-3 text-xs text-neutral-500 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Sort selector & Mobile filter trigger */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-2 text-xs text-neutral-400 bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2">
                  <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline font-medium">Sort by:</span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))
                    }
                    className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="popular" className="bg-[#161b22]">Popular now</option>
                    <option value="bounty_desc" className="bg-[#161b22]">Highest max bounty</option>
                    <option value="bounty_asc" className="bg-[#161b22]">Lowest min bounty</option>
                    <option value="resolved_desc" className="bg-[#161b22]">Most reports resolved</option>
                    <option value="efficiency_desc" className="bg-[#161b22]">Response efficiency %</option>
                    <option value="newest" className="bg-[#161b22]">Newest programs</option>
                    <option value="name_asc" className="bg-[#161b22]">Alphabetical (A–Z)</option>
                  </select>
                </div>

                <button
                  onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                  className="lg:hidden p-2 rounded-xl bg-[#0d1117] border border-[#30363d] text-neutral-300 hover:text-white flex items-center gap-1.5 text-xs font-medium"
                >
                  <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {/* Opportunities Count Banner matching user prompt text */}
            <div className="flex items-center justify-between text-neutral-400 text-xs px-1">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">
                  We found {filteredPrograms.length} opportunities for you
                </span>
                {filters.searchQuery && (
                  <span className="text-emerald-400 font-mono font-medium">
                    matching "{filters.searchQuery}"
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-neutral-500 font-mono">
                Total program directory index: 448
              </span>
            </div>

            {/* 2-Column Layout: Sidebar Filters + Programs Grid */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Desktop Filters Sidebar */}
              <div className="hidden lg:block">
                <FiltersSidebar
                  filters={filters}
                  setFilters={setFilters}
                  totalMatches={filteredPrograms.length}
                />
              </div>

              {/* Mobile Filter Sheet */}
              {isMobileFilterOpen && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={() => setIsMobileFilterOpen(false)}
                      className="p-2 rounded-lg bg-[#21262d] text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <FiltersSidebar
                    filters={filters}
                    setFilters={setFilters}
                    totalMatches={filteredPrograms.length}
                  />
                </div>
              )}

              {/* Program Cards Grid */}
              <div className="flex-1 min-w-0 w-full space-y-4">
                {filteredPrograms.length === 0 ? (
                  <div className="p-16 text-center bg-[#161b22] border border-[#21262d] rounded-2xl space-y-3">
                    <Shield className="w-12 h-12 text-neutral-600 mx-auto" />
                    <h3 className="text-base font-bold text-white">No bug bounty programs match your filters</h3>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                      Try clearing some filter criteria, broadening your bounty range, or removing keyword search terms.
                    </p>
                    <button
                      onClick={() =>
                        setFilters({
                          searchQuery: '',
                          programTypes: ['Bounty'],
                          features: [],
                          assetTypes: [],
                          industries: [],
                          tags: [],
                          minBountySeverity: { low: 0, medium: 0, high: 0, critical: 0 },
                          minMaxBountyFilter: 0,
                          minResponseRate: 0,
                          sortBy: 'popular'
                        })
                      }
                      className="mt-3 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredPrograms.map((prog) => (
                      <ProgramCard
                        key={prog.id}
                        program={prog}
                        onSelect={(p) => setSelectedProgramForModal(p)}
                        onLaunchAi={(p) => handleLaunchAiFromProgram(p)}
                        isWatchlisted={watchlist.some((w) => w.programId === prog.id)}
                        onToggleWatchlist={handleToggleWatchlist}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DISCLOSED REPORTS / HACKTIVITY */}
        {activeTab === 'reports' && (
          <DisclosedReportsView
            onAnalyzeReportWithAi={handleAnalyzeReportWithAi}
          />
        )}

        {/* TAB 3: AI HUNTER THINKING STUDIO */}
        {activeTab === 'ai-studio' && (
          <HunterIntelligenceStudio
            initialProgram={aiStudioTargetProgram}
            initialScopeTarget={aiStudioScopeTarget}
            initialQueryType={aiStudioQueryType}
            initialUserQuery={aiStudioUserQuery}
            onSaveToNotes={handleSaveToNotes}
          />
        )}

        {/* TAB 4: PROGRAM COMPARATOR */}
        {activeTab === 'comparator' && (
          <ProgramComparator
            onSelectProgram={(p) => setSelectedProgramForModal(p)}
            onLaunchAi={(p) => handleLaunchAiFromProgram(p)}
          />
        )}

        {/* TAB 5: CVSS CALCULATOR */}
        {activeTab === 'cvss' && <CvssCalculator />}

        {/* TAB 6: WATCHLIST & NOTES */}
        {activeTab === 'watchlist' && (
          <HunterWatchlistView
            watchlist={watchlist}
            notes={notes}
            onRemoveWatchlist={handleToggleWatchlist}
            onSelectProgram={(p) => setSelectedProgramForModal(p)}
            onLaunchAi={(p) => handleLaunchAiFromProgram(p)}
            onDeleteNote={handleDeleteNote}
          />
        )}
      </main>

      {/* Program Detail Inspection Modal */}
      {selectedProgramForModal && (
        <ProgramDetailModal
          program={selectedProgramForModal}
          onClose={() => setSelectedProgramForModal(null)}
          onLaunchAi={(p, target) => handleLaunchAiFromProgram(p, target)}
          isWatchlisted={watchlist.some((w) => w.programId === selectedProgramForModal.id)}
          onToggleWatchlist={handleToggleWatchlist}
        />
      )}

      {/* HackerOne Footer matching prompt copy */}
      <footer className="mt-auto border-t border-[#21262d] bg-[#090d16] text-neutral-400 py-10 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-[#00b87c] flex items-center justify-center font-bold text-black text-sm">
              h1
            </div>
            <div>
              <span className="font-bold text-white">© HackerOne</span>
              <span className="text-neutral-500 ml-2">Bug Bounty Platform & Vulnerability Coordination</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-neutral-400">
            <button onClick={() => setActiveTab('programs')} className="hover:text-white transition-colors">
              Opportunities
            </button>
            <button onClick={() => setActiveTab('reports')} className="hover:text-white transition-colors">
              Security Disclosures
            </button>
            <button onClick={() => setActiveTab('ai-studio')} className="hover:text-white transition-colors">
              Hunter Intelligence
            </button>
            <a href="https://hackerone.com/leaderboard" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              Leaderboard
            </a>
            <a href="https://hackerone.com/blog" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              Blog
            </a>
            <a href="https://docs.hackerone.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              Docs
            </a>
            <a href="https://hackerone.com/disclosure-guidelines" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              Disclosure Guidelines
            </a>
            <span className="text-neutral-600">|</span>
            <span className="font-mono text-emerald-400/80">Thinking Mode: ThinkingLevel.HIGH</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
