export interface IncidentTimelineLog {
  id: string;
  timestamp: string;
  stage: 'REPORTED' | 'ASSIGNED' | 'DISPATCH' | 'MULE_FROZEN' | 'INVESTIGATION' | 'RESOLVED' | 'NOTE';
  title: string;
  description: string;
  author: string;
  badgeNumber?: string;
  statusBadge?: 'ACTIVE' | 'DISPATCHED' | 'RESOLVED' | 'NOT_RESOLVED';
}

export interface GeoIncident {
  id: string;
  type: 'digital_arrest' | 'counterfeit_currency' | 'money_mule' | 'cyber_fraud';
  title: string;
  location: string;
  coordinates: { lat: number; lng: number }; // Relative coordinates for our custom India SVG map
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  timestamp: string;
  status: 'ACTIVE' | 'DISPATCHED' | 'RESOLVED' | 'NOT_RESOLVED';
  details: string;
  involvedAmount: string;
  callerNumber?: string;
  assignedUnit?: string;
  isCitizenReport?: boolean;
  assignedOfficer?: string;
  assignedOfficerBadge?: string;
  assignedOfficerSector?: string;
  transferHistory?: { fromOfficer: string; toOfficer: string; timestamp: string }[];
  timelineLogs?: IncidentTimelineLog[];
}

export interface BanknoteAnalysisResult {
  isGenuine: boolean;
  confidence: number;
  anomalies: {
    feature: string;
    description: string;
    status: 'PASS' | 'FAIL' | 'WARNING';
  }[];
  summary: string;
  denomination: string;
  serialNumber?: string;
}

export interface ScamCallAnalysis {
  isScam: boolean;
  scamType: string;
  riskScore: number; // 0-100
  coercionTactics: string[];
  mhaActionRequired: boolean;
  alertPriority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedActions: string[];
  generatedAlertDraft: string;
  analysisSummary: string;
}

export interface Node {
  id: string;
  label: string;
  type: 'victim' | 'mule_l1' | 'mule_l2' | 'exchange' | 'scammer_ip' | 'phone_num';
  val: number;
  details: {
    holder?: string;
    bank?: string;
    location?: string;
    ip?: string;
    operator?: string;
    balance?: string;
    flagged?: boolean;
  };
}

export interface Link {
  source: string;
  target: string;
  amount?: string;
  frequency?: number;
  type: 'transfer' | 'call' | 'ip_resolve';
}

export interface FraudNetwork {
  nodes: Node[];
  links: Link[];
}

export interface CitizenAssessment {
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';
  verdict: string;
  language: string;
  guidance: string[];
  emergencyContacts: { name: string; contact: string }[];
}

export type UserRole = 'ADMIN' | 'POLICE' | 'CITIZEN';

export interface BlacklistEntry {
  id: string;
  identifier: string; // e.g. "cbi-extortion@ybl", "+91 9876543210", "https://fake-mha-arrest.org", "HDFC 012345678901"
  category: 'UPI' | 'PHONE' | 'URL' | 'BANK_ACCOUNT' | 'CRYPTO_WALLET';
  scamType: string; // e.g. 'Digital Arrest', 'Customs Extortion', 'Fake Job Portal', 'Loan App Threat', 'Counterfeit Currency'
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'VERIFIED_FRAUD' | 'UNDER_INVESTIGATION' | 'MULE_ACCOUNT_FROZEN' | 'ACTIVE_WARNING';
  reportCount: number;
  firstReportedDate: string;
  lastReportedDate: string;
  leaReferenceId?: string; // e.g. "FIR-2026-DEL-1092"
  description: string;
  reportedByRoles?: ('CITIZEN' | 'POLICE' | 'ADMIN')[];
  verifiedByLea?: boolean;
  associatedLocation?: string;
}

export interface UserSession {
  role: UserRole;
  username: string;
  fullName: string;
  badgeNumber?: string;
  sector?: string;
}

