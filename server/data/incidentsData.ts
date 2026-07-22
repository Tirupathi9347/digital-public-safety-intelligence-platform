// Global in-memory dataset of India-wide cybercrime and counterfeit hubs
export let geoIncidents = [
  {
    id: "INC-001",
    type: "digital_arrest",
    title: "Simulated Arrest: 'Customs Officer' Psychological hostage",
    location: "Mewat Sector, Haryana",
    coordinates: { lat: 28.14, lng: 77.01 },
    severity: "CRITICAL",
    timestamp: "2026-07-19T06:12:00",
    status: "DISPATCHED",
    details: "Victim isolated in room for 48 hours. Scammer demanded Rs 45 Lakhs on fake charges of MDMA trafficking in passport bundle. Scammers impersonating DCP Crime Branch.",
    involvedAmount: "₹45,00,000",
    callerNumber: "+91 98712 34212",
    assignedUnit: "Cyber Cell Unit Alpha (Delhi-NCR)"
  },
  {
    id: "INC-002",
    type: "counterfeit_currency",
    title: "FICN Outflow: Counterfeit High-Denomination Rs 500 Note",
    location: "Kolkata Border, West Bengal",
    coordinates: { lat: 22.57, lng: 88.36 },
    severity: "HIGH",
    timestamp: "2026-07-19T05:30:00",
    status: "ACTIVE",
    details: "Three high-quality fake Rs 500 bills discovered at retail banking counter. Anomalies spotted on Mahatma Gandhi's shadow microprint and security thread spacing. Sourced from Indo-Bangladesh border courier.",
    involvedAmount: "₹1,500",
    assignedUnit: "FICN Taskforce East"
  },
  {
    id: "INC-003",
    type: "money_mule",
    title: "Money Mule Cluster: 12 linked L1/L2 accounts identified",
    location: "Jamtara, Jharkhand",
    coordinates: { lat: 23.96, lng: 86.80 },
    severity: "CRITICAL",
    timestamp: "2026-07-19T04:45:00",
    status: "ACTIVE",
    details: "Rapid layering structure detected. Scammed funds from INC-001 routed into rural cooperative accounts, then immediately withdrawn from local ATMs within 8 minutes of transfer.",
    involvedAmount: "₹82,00,000",
    assignedUnit: "State Cyber Cell Jharkhand"
  },
  {
    id: "INC-004",
    type: "cyber_fraud",
    title: "Imposter Portal Scam: Fake NCRB Complaint Link",
    location: "Ahmedabad, Gujarat",
    coordinates: { lat: 23.02, lng: 72.57 },
    severity: "HIGH",
    timestamp: "2026-07-18T22:15:00",
    status: "RESOLVED",
    details: "Phishing site mimicking national cybercrime reporting portal (cybercrime.gov.in) with malicious .apk injection to read target OTPs. Server domain blocked by central CERT-In directive.",
    involvedAmount: "₹12,50,000",
    assignedUnit: "CERT-In Cyber Wing"
  },
  {
    id: "INC-005",
    type: "digital_arrest",
    title: "Active Digital Arrest Scammer Call Intercepted",
    location: "Bengaluru, Karnataka",
    coordinates: { lat: 12.97, lng: 77.59 },
    severity: "CRITICAL",
    timestamp: "2026-07-19T06:45:00",
    status: "ACTIVE",
    details: "Live metadata match on telecom tower signature. Scammer posing as CBI Inspector targeting senior citizen. Call routing spoofed through domestic VoIP gateway setup.",
    involvedAmount: "₹20,00,000",
    callerNumber: "+91 80234 11204",
    assignedUnit: "Bengaluru Central Cyber Cell"
  }
];

// Fraud Network in-memory static graph
export const fraudNetwork = {
  nodes: [
    { id: "V1", label: "Victim: Dr. Mehta", type: "victim", val: 15, details: { location: "Mumbai", flagged: false } },
    { id: "V2", label: "Victim: Priya S.", type: "victim", val: 15, details: { location: "Delhi", flagged: false } },
    { id: "P1", label: "+91 99991-88221 (CBI Imposter)", type: "phone_num", val: 20, details: { operator: "VoIP Spoofed", location: "Active Hub (Mewat)", flagged: true } },
    { id: "M1", label: "Mule L1: Gramin Rural A/C", type: "mule_l1", val: 25, details: { holder: "Ramesh Kumar", bank: "State Co-op Bank", location: "Jamtara", balance: "₹14,20,000", flagged: true } },
    { id: "M2", label: "Mule L1: Urban Saving A/C", type: "mule_l1", val: 25, details: { holder: "Anil Patel", bank: "National Bank", location: "Ahmedabad", balance: "₹28,50,000", flagged: true } },
    { id: "M3", label: "Mule L2: Layered Shell Account", type: "mule_l2", val: 22, details: { holder: "Apex Imports Ltd", bank: "Private Commercial Bank", location: "Kolkata", balance: "₹75,00,000", flagged: true } },
    { id: "E1", label: "Crypto Gateway Wallet (P2P)", type: "exchange", val: 30, details: { ip: "103.88.22.14", balance: "18.5 USDT", location: "Offshore Gateway", flagged: true } },
    { id: "IP1", label: "Proxy IP: 185.220.101.44", type: "scammer_ip", val: 18, details: { ip: "185.220.101.44 (VPN Tor Node)", location: "Scam Compound Border", flagged: true } }
  ],
  links: [
    { source: "V1", target: "M1", amount: "₹45,00,000", frequency: 1, type: "transfer" },
    { source: "V2", target: "M2", amount: "₹37,00,000", frequency: 1, type: "transfer" },
    { source: "P1", target: "V1", amount: "7 calls", frequency: 7, type: "call" },
    { source: "P1", target: "V2", amount: "4 calls", frequency: 4, type: "call" },
    { source: "M1", target: "M3", amount: "₹14,00,000", frequency: 2, type: "transfer" },
    { source: "M2", target: "M3", amount: "₹28,00,000", frequency: 3, type: "transfer" },
    { source: "M3", target: "E1", amount: "₹42,00,000", frequency: 5, type: "transfer" },
    { source: "IP1", target: "P1", amount: "VoIP Control", frequency: 1, type: "ip_resolve" },
    { source: "IP1", target: "E1", amount: "API Triggers", frequency: 1, type: "ip_resolve" }
  ]
};
