export type ProgramType = 'Bounty' | 'Response' | 'Private';

export type ProgramFeature =
  | 'Accepts applications'
  | 'High response efficiency'
  | 'Triaged by H1'
  | 'Triaged by HackerOne'
  | 'Offers retesting'
  | 'Retesting'
  | 'Gold standard'
  | 'Open for collaboration'
  | 'Collaboration'
  | 'Open Scope'
  | 'Fast Payment'
  | 'Active Campaign'
  | 'Credentials'
  | 'Private Disclosures'
  | 'ID Verification'
  | 'H1 Clear';

export type AssetType =
  | 'CIDR'
  | 'Domain'
  | 'iOS: App Store'
  | 'iOS: TestFlight'
  | 'iOS: .ipa'
  | 'Android: Play Store'
  | 'Android: .apk'
  | 'Windows: Microsoft Store'
  | 'Source Code'
  | 'Executable'
  | 'Smart Contract'
  | 'Wildcard'
  | 'IP Address'
  | 'Hardware'
  | 'Other Asset'
  | 'AI Model'
  | 'API'
  | 'AWS Account'
  | 'Azure Account'
  | 'Credentials';

export type Industry =
  | 'Technology'
  | 'Crypto & Web3'
  | 'E-Commerce & Retail'
  | 'Gaming & Entertainment'
  | 'Financial Services'
  | 'Travel & Hospitality'
  | 'Defense & Aerospace'
  | 'Healthcare & Biotech'
  | 'Telecommunications'
  | 'Enterprise Software'
  | 'Hardware & IoT';

export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface ScopeTarget {
  target: string;
  type: AssetType;
  eligibleForBounty: boolean;
  maxSeverity: SeverityLevel;
  instruction?: string;
}

export interface RewardTiers {
  critical: { min: number; max: number };
  high: { min: number; max: number };
  medium: { min: number; max: number };
  low: { min: number; max: number };
}

export interface H1Program {
  id: string;
  handle: string;
  name: string;
  tagline: string;
  type: ProgramType;
  minBounty: number;
  maxBounty: number;
  bountyRangeText: string;
  reportsResolved: number;
  hackersPaid: number;
  responseEfficiency: number; // percentage 0-100
  avgTriageHours: number;
  avgBountyPaid: number;
  features: ProgramFeature[];
  assetTypes: AssetType[];
  industries: Industry[];
  technologies: string[];
  tags: ('New' | 'Updated' | 'Popular' | 'Featured')[];
  inScopeTargets: ScopeTarget[];
  outOfScopeTargets: string[];
  rewards: RewardTiers;
  policySummary: string;
  safeHarbor: boolean;
  avatarColor: string;
  accentColor: string;
  joinedYear: number;
}

export interface FilterState {
  searchQuery: string;
  programTypes: ProgramType[];
  features: ProgramFeature[];
  assetTypes: AssetType[];
  industries: Industry[];
  tags: ('New' | 'Updated')[];
  minBountySeverity: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  minMaxBountyFilter: number;
  minResponseRate: number;
  sortBy: 'popular' | 'bounty_desc' | 'bounty_asc' | 'resolved_desc' | 'efficiency_desc' | 'newest' | 'name_asc';
}

export interface HunterNote {
  id: string;
  programId: string;
  title: string;
  content: string;
  targetScope: string;
  severity: SeverityLevel;
  status: 'Draft' | 'Testing' | 'Ready to Submit' | 'Submitted';
  createdAt: string;
  updatedAt: string;
}

export interface HunterWatchlistEntry {
  programId: string;
  addedAt: string;
  status: 'Hunting' | 'Watching' | 'Backlog' | 'Submitted';
  notesCount: number;
}
