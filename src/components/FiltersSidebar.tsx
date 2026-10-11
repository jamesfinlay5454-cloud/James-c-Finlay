import React, { useState } from 'react';
import {
  FilterState,
  ProgramType,
  ProgramFeature,
  AssetType,
  Industry
} from '../types/hackerone';
import {
  ALL_PROGRAM_FEATURES,
  ALL_ASSET_TYPES,
  ALL_INDUSTRIES
} from '../data/programs';
import { X, ChevronDown, ChevronUp, RotateCcw, Check, Sparkles } from 'lucide-react';

interface FiltersSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalMatches: number;
}

export const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  filters,
  setFilters,
  totalMatches
}) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleProgramTypeToggle = (type: ProgramType) => {
    setFilters((prev) => {
      const exists = prev.programTypes.includes(type);
      return {
        ...prev,
        programTypes: exists
          ? prev.programTypes.filter((t) => t !== type)
          : [...prev.programTypes, type]
      };
    });
  };

  const handleFeatureToggle = (feature: ProgramFeature) => {
    setFilters((prev) => {
      const exists = prev.features.includes(feature);
      return {
        ...prev,
        features: exists
          ? prev.features.filter((f) => f !== feature)
          : [...prev.features, feature]
      };
    });
  };

  const handleAssetTypeToggle = (asset: AssetType) => {
    setFilters((prev) => {
      const exists = prev.assetTypes.includes(asset);
      return {
        ...prev,
        assetTypes: exists
          ? prev.assetTypes.filter((a) => a !== asset)
          : [...prev.assetTypes, asset]
      };
    });
  };

  const handleIndustryToggle = (ind: Industry) => {
    setFilters((prev) => {
      const exists = prev.industries.includes(ind);
      return {
        ...prev,
        industries: exists
          ? prev.industries.filter((i) => i !== ind)
          : [...prev.industries, ind]
      };
    });
  };

  const handleTagToggle = (tag: 'New' | 'Updated') => {
    setFilters((prev) => {
      const exists = prev.tags.includes(tag);
      return {
        ...prev,
        tags: exists ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag]
      };
    });
  };

  const handleMinBountyChange = (severity: 'low' | 'medium' | 'high' | 'critical', value: number) => {
    setFilters((prev) => ({
      ...prev,
      minBountySeverity: {
        ...prev.minBountySeverity,
        [severity]: Math.max(0, value)
      }
    }));
  };

  const handleClearAll = () => {
    setFilters((prev) => ({
      ...prev,
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
    }));
  };

  const activeFiltersCount =
    (filters.programTypes.length !== 1 || !filters.programTypes.includes('Bounty') ? filters.programTypes.length : 0) +
    filters.features.length +
    filters.assetTypes.length +
    filters.industries.length +
    filters.tags.length +
    (filters.minBountySeverity.low > 0 ? 1 : 0) +
    (filters.minBountySeverity.medium > 0 ? 1 : 0) +
    (filters.minBountySeverity.high > 0 ? 1 : 0) +
    (filters.minBountySeverity.critical > 0 ? 1 : 0);

  return (
    <aside className="w-full lg:w-72 shrink-0 bg-[#161b22] border border-[#21262d] rounded-xl p-4 text-neutral-300 text-sm select-none shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-base">Filter options</span>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs font-semibold">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      <div className="divide-y divide-[#21262d]">
        {/* Program Type */}
        <div className="py-3.5">
          <button
            onClick={() => toggleSection('type')}
            className="w-full flex items-center justify-between text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2"
          >
            <span>Program type</span>
            {collapsedSections['type'] ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
          {!collapsedSections['type'] && (
            <div className="space-y-1.5">
              {(['Bounty', 'Response', 'Private'] as ProgramType[]).map((type) => {
                const checked = filters.programTypes.includes(type);
                return (
                  <label
                    key={type}
                    onClick={() => handleProgramTypeToggle(type)}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-[#1f2937] cursor-pointer text-xs transition-colors"
                  >
                    <span className={checked ? 'text-white font-medium' : 'text-neutral-300'}>
                      {type}
                    </span>
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        checked
                          ? 'bg-emerald-500 border-emerald-500 text-black'
                          : 'border-neutral-600 bg-[#0d1117]'
                      }`}
                    >
                      {checked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Severity Min. Bounty ($) */}
        <div className="py-3.5">
          <button
            onClick={() => toggleSection('severity')}
            className="w-full flex items-center justify-between text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2"
          >
            <span>Min. Bounty ($)</span>
            {collapsedSections['severity'] ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
          {!collapsedSections['severity'] && (
            <div className="space-y-2 pt-1">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[11px] text-neutral-400 block mb-1">Low</span>
                  <div className="relative">
                    <span className="absolute left-2 top-1.5 text-neutral-500 text-xs">$</span>
                    <input
                      type="number"
                      min="0"
                      value={filters.minBountySeverity.low || ''}
                      placeholder="0"
                      onChange={(e) => handleMinBountyChange('low', Number(e.target.value))}
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded px-2 pl-5 py-1 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-neutral-400 block mb-1">Medium</span>
                  <div className="relative">
                    <span className="absolute left-2 top-1.5 text-neutral-500 text-xs">$</span>
                    <input
                      type="number"
                      min="0"
                      value={filters.minBountySeverity.medium || ''}
                      placeholder="0"
                      onChange={(e) => handleMinBountyChange('medium', Number(e.target.value))}
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded px-2 pl-5 py-1 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-neutral-400 block mb-1">High</span>
                  <div className="relative">
                    <span className="absolute left-2 top-1.5 text-neutral-500 text-xs">$</span>
                    <input
                      type="number"
                      min="0"
                      value={filters.minBountySeverity.high || ''}
                      placeholder="0"
                      onChange={(e) => handleMinBountyChange('high', Number(e.target.value))}
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded px-2 pl-5 py-1 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-neutral-400 block mb-1">Critical</span>
                  <div className="relative">
                    <span className="absolute left-2 top-1.5 text-neutral-500 text-xs">$</span>
                    <input
                      type="number"
                      min="0"
                      value={filters.minBountySeverity.critical || ''}
                      placeholder="0"
                      onChange={(e) => handleMinBountyChange('critical', Number(e.target.value))}
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded px-2 pl-5 py-1 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Program Features */}
        <div className="py-3.5">
          <button
            onClick={() => toggleSection('features')}
            className="w-full flex items-center justify-between text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2"
          >
            <span>Program features</span>
            {collapsedSections['features'] ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
          {!collapsedSections['features'] && (
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
              {ALL_PROGRAM_FEATURES.map((feature) => {
                const checked = filters.features.includes(feature as ProgramFeature);
                return (
                  <label
                    key={feature}
                    onClick={() => handleFeatureToggle(feature as ProgramFeature)}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-[#1f2937] cursor-pointer text-xs transition-colors"
                  >
                    <span className={checked ? 'text-white font-medium' : 'text-neutral-300'}>
                      {feature}
                    </span>
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                        checked
                          ? 'bg-emerald-500 border-emerald-500 text-black'
                          : 'border-neutral-600 bg-[#0d1117]'
                      }`}
                    >
                      {checked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Asset Type */}
        <div className="py-3.5">
          <button
            onClick={() => toggleSection('assetTypes')}
            className="w-full flex items-center justify-between text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2"
          >
            <span>Asset type</span>
            {collapsedSections['assetTypes'] ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
          {!collapsedSections['assetTypes'] && (
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
              {ALL_ASSET_TYPES.map((asset) => {
                const checked = filters.assetTypes.includes(asset as AssetType);
                return (
                  <label
                    key={asset}
                    onClick={() => handleAssetTypeToggle(asset as AssetType)}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-[#1f2937] cursor-pointer text-xs transition-colors"
                  >
                    <span className={checked ? 'text-white font-medium' : 'text-neutral-300'}>
                      {asset}
                    </span>
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                        checked
                          ? 'bg-emerald-500 border-emerald-500 text-black'
                          : 'border-neutral-600 bg-[#0d1117]'
                      }`}
                    >
                      {checked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="py-3.5">
          <button
            onClick={() => toggleSection('tags')}
            className="w-full flex items-center justify-between text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2"
          >
            <span>Tags</span>
            {collapsedSections['tags'] ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
          {!collapsedSections['tags'] && (
            <div className="flex gap-2">
              {(['New', 'Updated'] as ('New' | 'Updated')[]).map((tag) => {
                const active = filters.tags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors border ${
                      active
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-[#0d1117] text-neutral-400 border-[#30363d] hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Industries */}
        <div className="py-3.5">
          <button
            onClick={() => toggleSection('industries')}
            className="w-full flex items-center justify-between text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2"
          >
            <span>Industries</span>
            {collapsedSections['industries'] ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
          {!collapsedSections['industries'] && (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
              {ALL_INDUSTRIES.map((ind) => {
                const checked = filters.industries.includes(ind as Industry);
                return (
                  <label
                    key={ind}
                    onClick={() => handleIndustryToggle(ind as Industry)}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-[#1f2937] cursor-pointer text-xs transition-colors"
                  >
                    <span className={checked ? 'text-white font-medium' : 'text-neutral-300'}>
                      {ind}
                    </span>
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                        checked
                          ? 'bg-emerald-500 border-emerald-500 text-black'
                          : 'border-neutral-600 bg-[#0d1117]'
                      }`}
                    >
                      {checked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer matching result counter */}
      <div className="mt-4 pt-3 border-t border-[#21262d] text-center text-xs text-neutral-400">
        Found <span className="text-white font-bold">{totalMatches}</span> opportunities
      </div>
    </aside>
  );
};
