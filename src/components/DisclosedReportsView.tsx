import React, { useState } from 'react';
import { DisclosedReport, DISCLOSED_REPORTS } from '../data/reports';
import {
  Search,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  Filter,
  ShieldAlert,
  ArrowUpRight,
  Code2,
  Bug,
  CheckCircle,
  HelpCircle,
  AlertOctagon,
  Copy,
  Check
} from 'lucide-react';

interface DisclosedReportsViewProps {
  onAnalyzeReportWithAi: (report: DisclosedReport) => void;
}

export const DisclosedReportsView: React.FC<DisclosedReportsViewProps> = ({
  onAnalyzeReportWithAi
}) => {
  const [reports, setReports] = useState<DisclosedReport[]>(DISCLOSED_REPORTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'cve' | 'cwe'>('overview');
  const [filterType, setFilterType] = useState<'disclosed' | 'undisclosed'>('disclosed');
  const [selectedWeakness, setSelectedWeakness] = useState<string>('all');
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [expandedReportId, setExpandedReportId] = useState<string | null>('rep-r3-artifactory');
  const [upvotedMap, setUpvotedMap] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extract unique weaknesses and programs
  const weaknesses = Array.from(new Set(DISCLOSED_REPORTS.map((r) => r.weaknessCwe))).filter(Boolean);
  const programs = Array.from(new Set(DISCLOSED_REPORTS.map((r) => r.programName)));

  const handleUpvote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUpvotedMap((prev) => {
      const isUpvoted = !!prev[id];
      setReports((currentReports) =>
        currentReports.map((rep) =>
          rep.id === id ? { ...rep, upvotes: rep.upvotes + (isUpvoted ? -1 : 1) } : rep
        )
      );
      return { ...prev, [id]: !isUpvoted };
    });
  };

  const handleCopy = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredReports = reports.filter((rep) => {
    if (filterType === 'undisclosed') return false; // currently viewing disclosed repository
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        rep.title.toLowerCase().includes(q) ||
        rep.programName.toLowerCase().includes(q) ||
        rep.reporter.toLowerCase().includes(q) ||
        rep.weaknessCwe.toLowerCase().includes(q) ||
        rep.summary.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedWeakness !== 'all' && rep.weaknessCwe !== selectedWeakness) {
      return false;
    }
    if (selectedProgram !== 'all' && rep.programName !== selectedProgram) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#161b22] via-[#0e1117] to-[#121620] border border-[#21262d] rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#00b87c]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Sub-nav */}
        <div className="flex items-center gap-6 border-b border-[#21262d] pb-4 mb-6 text-sm font-semibold">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`transition-colors pb-1 flex items-center gap-2 ${
              activeSubTab === 'overview'
                ? 'text-emerald-400 border-b-2 border-emerald-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSubTab('cve')}
            className={`transition-colors pb-1 flex items-center gap-2 ${
              activeSubTab === 'cve'
                ? 'text-emerald-400 border-b-2 border-emerald-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            CVE discovery
          </button>
          <button
            onClick={() => setActiveSubTab('cwe')}
            className={`transition-colors pb-1 flex items-center gap-2 ${
              activeSubTab === 'cwe'
                ? 'text-emerald-400 border-b-2 border-emerald-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            CWE discovery
          </button>
        </div>

        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            The world's best dynamic repository
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">
              for security vulnerabilities.
            </span>
          </h1>
          <p className="text-sm text-neutral-400 mt-2">
            Explore verified, audit-grade vulnerability disclosures from leading programs. Dissect real-world exploits, CVEs, and CVSS calculations with AI Thinking Mode.
          </p>
        </div>

        {/* Search & Query bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-2xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for reports (e.g. artifactory, mariaDB, curl, RCE)..."
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-mono shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-xs text-neutral-500 hover:text-neutral-300"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-2 bg-[#1f2937] border border-[#30363d] rounded-xl text-xs font-mono text-emerald-400">
              disclosed:true
            </span>
          </div>
        </div>
      </div>

      {/* Disclosed / Undisclosed Filter Strip & Dropdowns */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#161b22] border border-[#21262d] rounded-xl p-4 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('disclosed')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterType === 'disclosed'
                ? 'bg-emerald-500 text-black shadow'
                : 'text-neutral-400 hover:text-white bg-[#0d1117]'
            }`}
          >
            Disclosed ({filteredReports.length})
          </button>
          <button
            onClick={() => setFilterType('undisclosed')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterType === 'undisclosed'
                ? 'bg-emerald-500 text-black shadow'
                : 'text-neutral-400 hover:text-white bg-[#0d1117]'
            }`}
          >
            Undisclosed (0)
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Weakness filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400">Weakness:</span>
            <select
              value={selectedWeakness}
              onChange={(e) => setSelectedWeakness(e.target.value)}
              className="bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All CWEs ({weaknesses.length})</option>
              {weaknesses.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          {/* Program filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400">Program:</span>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Vendors ({programs.length})</option>
              {programs.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="text-center py-16 bg-[#161b22] border border-[#21262d] rounded-2xl p-6">
            <Bug className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No disclosed reports match your criteria</h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
              Try adjusting your query or resetting the weakness and vendor dropdowns.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedWeakness('all');
                setSelectedProgram('all');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredReports.map((report) => {
            const isExpanded = expandedReportId === report.id;
            const isUpvoted = !!upvotedMap[report.id];

            return (
              <div
                key={report.id}
                className="bg-[#161b22] hover:bg-[#191f28] border border-[#21262d] hover:border-[#30363d] rounded-xl p-5 transition-all duration-150 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  {/* Upvote Button */}
                  <button
                    onClick={(e) => handleUpvote(report.id, e)}
                    className={`flex flex-col items-center justify-center min-w-12 py-2 px-1 rounded-xl border transition-colors shrink-0 ${
                      isUpvoted
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-[#0d1117] border-[#30363d] text-neutral-400 hover:text-white hover:border-neutral-500'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 mb-1 ${isUpvoted ? 'fill-emerald-400' : ''}`} />
                    <span className="font-bold font-mono text-sm">{report.upvotes}</span>
                  </button>

                  {/* Main Report Body */}
                  <div className="flex-1 min-w-0">
                    {/* Top Meta Line */}
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        @{report.programHandle}
                      </span>
                      <span className="text-xs font-semibold text-neutral-300">
                        {report.programName}
                      </span>

                      {/* State badge */}
                      {report.state === 'Resolved' && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Resolved
                        </span>
                      )}
                      {report.state === 'Informative' && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-sky-950/60 text-sky-400 border border-sky-800/40 flex items-center gap-1">
                          <HelpCircle className="w-3 h-3" />
                          Informative
                        </span>
                      )}
                      {report.state === 'Not-applicable' && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700 flex items-center gap-1">
                          <AlertOctagon className="w-3 h-3" />
                          Not-applicable
                        </span>
                      )}

                      {/* Payout amount if present */}
                      {report.bountyAmount && (
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#00b87c]/20 text-[#00b87c] border border-[#00b87c]/30">
                          ${report.bountyAmount}
                        </span>
                      )}

                      {report.cvssScore && (
                        <span
                          className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                            report.cvssScore >= 9.0
                              ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                              : report.cvssScore >= 7.0
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                              : 'bg-sky-950/60 text-sky-300 border border-sky-800/40'
                          }`}
                        >
                          CVSS {report.cvssScore}
                        </span>
                      )}
                    </div>

                    {/* Report Title */}
                    <h2
                      onClick={() => setExpandedReportId(isExpanded ? null : report.id)}
                      className="text-base sm:text-lg font-bold text-white hover:text-emerald-300 transition-colors cursor-pointer leading-snug mb-2"
                    >
                      {report.title}
                    </h2>

                    {/* Reporter & Disclosure date */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 mb-2">
                      <span>
                        Bug reported by{' '}
                        <span className="text-neutral-200 font-mono font-semibold">
                          {report.reporter}
                        </span>
                      </span>
                      <span>•</span>
                      <span>disclosed {report.disclosedAgo}</span>
                      {report.weaknessCwe && (
                        <>
                          <span>•</span>
                          <span className="text-amber-400/90 font-medium">
                            {report.weaknessCwe}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Report Summary Preview or Full */}
                    <div className="text-xs text-neutral-300 leading-relaxed bg-[#0d1117] p-3.5 rounded-lg border border-[#21262d]">
                      <div className={isExpanded ? '' : 'line-clamp-2'}>
                        <p className="whitespace-pre-line">{report.summary}</p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2 border-t border-[#21262d]">
                        {report.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161b22] text-neutral-400 border border-[#30363d]"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between gap-3 mt-3 pt-2">
                      <button
                        onClick={() => setExpandedReportId(isExpanded ? null : report.id)}
                        className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 font-medium transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5" />
                            Collapse summary
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5" />
                            Read full technical summary
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleCopy(report.id, report.summary, e)}
                          className="px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-neutral-300 text-xs flex items-center gap-1 transition-colors"
                        >
                          {copiedId === report.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>Copy</span>
                        </button>

                        <button
                          onClick={() => onAnalyzeReportWithAi(report)}
                          className="px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                          <span>AI Exploit Dissection (Thinking Mode)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Footer */}
      <div className="p-4 bg-[#161b22] border border-[#21262d] rounded-xl flex items-center justify-between text-xs text-neutral-400">
        <span>Showing 1–{filteredReports.length} of {filteredReports.length} reports</span>
        <span className="font-mono text-neutral-500">Repository indexed: 10,000+ total disclosures</span>
      </div>
    </div>
  );
};
