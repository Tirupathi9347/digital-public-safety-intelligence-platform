# CYBERSHIELD – National Public Safety & Cyber Crime Intelligence Platform
## Master Technical Project Documentation & System Specifications

---

### Executive Metadata
- **Target Organization**: National Cyber Crime Division, Ministry of Home Affairs (MHA), Govt. of India
- **Nodal Operational Body**: Indian Cyber Crime Coordination Centre (I4C) & State Cyber Police Cells
- **System Architecture**: Full-Stack React 19 + Node.js Express (TypeScript 5.8) + Gemini 3.6 Flash + Firebase Firestore
- **Compliance Standard**: Section 65B Indian Evidence Act 1872, IT Act 2000 (2008 Amend), MHA NCRP Guidelines

---

## 1. Executive Summary & Project Title

The rapid digitization of financial infrastructure in India—driven by Unified Payments Interface (UPI), digital banking, and widespread smartphone adoption—has brought unprecedented convenience to over 1.4 billion citizens. However, this transformation has concurrently exposed vulnerabilities exploited by sophisticated cybercrime syndicates. The CyberShield platform represents a state-of-the-art, production-grade intelligence and emergency defense infrastructure engineered specifically for the National Cyber Crime Division (Ministry of Home Affairs, Government of India) and the Indian Cyber Crime Coordination Centre (I4C).

CyberShield serves as a unified digital fortress uniting four critical defense vectors into a single, cohesive command environment:

1. **Digital Arrest Defense & Citizen Shield**: Provides real-time conversational analysis, risk scoring, and psychological counter-measures against video-call house arrest demands, fake CBI/ED/Customs warrants, and high-coercion extortion schemes.
2. **Crowdsourced Fraud Blacklist**: Establishes a crowdsourced yet Law Enforcement Agency (LEA) verified registry targeting scammer UPI Handles, phone numbers, phishing URLs, mule bank accounts, and crypto wallets.
3. **Counterfeit Currency Vision Analyzer**: Employs advanced computer vision algorithms to evaluate Reserve Bank of India (RBI) security parameters across Mahatma Gandhi banknote series, identifying Fake Indian Currency Notes (FICN).
4. **Money Mule Network Graph & Intelligence**: Traces complex, multi-tiered fund movements from victim origin accounts across Layer-1/Layer-2 mule networks to peer-to-peer (P2P) crypto gateways and hawala off-ramps.

> [!IMPORTANT]
> **Key Strategic Objective**: CyberShield bridges the critical gap between immediate citizen emergency response and courtroom prosecution. It empowers citizens to detect and survive cyber attacks in real time, enables police investigators to intercept frozen funds within the golden window, and automatically compiles court-admissible evidence certificates adhering strictly to Section 65B of the Indian Evidence Act, 1872.

---

## 2. Problem Statement & Need Analysis

### 2.1 Threat Vector 1: Digital Arrest & Psychological Extortion
Digital Arrest is a modern form of psychological cyber extortion wherein fraudsters impersonate senior officials from police departments, Central Bureau of Investigation (CBI), Enforcement Directorate (ED), Narcotics Control Bureau (NCB), or Telecom Regulatory Authority of India (TRAI). Scammers contact victims via video calls (Skype or WhatsApp), displaying fake police uniforms, courtroom backdrops, and forged digital arrest warrants carrying official government seals.

Victims are informed that a parcel containing illegal narcotics, fake passports, or compromised SIM cards has been confiscated in their name. Under extreme psychological pressure, victims are confined to their homes under 'virtual custody' for hours or days and coerced into liquidating fixed deposits, savings, and assets into so-called 'RBI Escrow Verification Accounts'—which are in reality controlled by money mule rings.

### 2.2 Threat Vector 2: Money Mule Layering Networks & Rapid Cash-Out
Once stolen funds enter the banking ecosystem, cybercriminals exploit automated fund-transfer channels to bypass traditional freeze mechanisms. The illicit funds move rapidly through a structured, multi-tier money mule architecture:
- **Layer 1 (Primary Mules)**: Accounts rented from unsuspecting individuals, students, or shell entities. Funds are split into smaller amounts within 3 to 10 minutes of initial victim transfer.
- **Layer 2 (Secondary Mules)**: Secondary accounts used to further obscure the audit trail by executing cross-bank IMPS/NEFT transfers.
- **Layer 3 (Crypto Gateways & Hawala)**: Conversion of layered fiat currency into tethered stablecoins (USDT) on P2P crypto exchanges or foreign hawala channels, rendering recovery nearly impossible after 30 minutes.

### 2.3 Threat Vector 3: Counterfeit Currency (FICN) Circulation
Despite strict RBI security measures, Fake Indian Currency Notes (FICN) continue to circulate in semi-urban and rural commerce. Citizens and small business owners frequently lack the technical knowledge required to inspect micro-printing, optically variable inks, and latent images, leading to financial losses and unrecorded fraudulent circulation.

### 2.4 Threat Vector 4: Legal Evidence Bottlenecks & Low Conviction Rates
A major obstacle in prosecuting cybercriminals in Indian courts is the strict evidentiary standard mandated by Section 65B of the Indian Evidence Act, 1872. Electronic records (chat logs, server transaction records, network graphs) are frequently rejected by magistrates due to improper hash generation, missing device custodian declarations, or incomplete chain-of-custody logging.

---

## 3. System Architecture & Tech Stack Breakdown

### 3.1 Core Technology Stack & Versions

| Layer / Domain | Technology & Version | Role in CyberShield | Technical Justification |
| :--- | :--- | :--- | :--- |
| **Frontend Core** | React 19.0.0 + Vite 6.2.0 | Declarative UI rendering & fast HMR bundle | Component modularity and lightning-fast client execution |
| **Type System** | TypeScript 5.8 | Strict end-to-end static type enforcement | Eliminates runtime type errors across complex domain models |
| **Styling System** | Tailwind CSS v4.0.9 | Responsive design system & dark mode UI | Utility-first CSS ensuring sleek, government-grade UX |
| **Data Visualization** | Recharts 2.15.1 | Statistical dashboards & trend charts | High-performance SVG charting for crime analytics |
| **Graph Visualization**| D3.js v7 | Interactive money mule node-link diagrams | Custom force-directed graph rendering for complex fund flows |
| **UI Motion** | Motion 12.4.7 (`motion/react`) | Smooth tab transitions & micro-animations | Enhances user experience during high-stress interactions |
| **Backend Server** | Node.js Express 4.21.2 | Modular REST API endpoints (TypeScript) | Lightweight, non-blocking I/O routing for high concurrency |
| **AI Core** | `@google/genai` 0.2.2 | Gemini 3.6 Flash & Multi-Key Rotation | Multi-key key rotation, JSON cleaning & high-speed reasoning |
| **Database / State** | Firebase Firestore 12.16.0 | Real-time sync DB with offline fallback | Instant state sync across police consoles and citizen apps |
| **Production Bundler** | esbuild 0.25 / tsx 4.21 | CJS server compilation & TS execution | Bundles backend into optimized dist/server.cjs in milliseconds |

### 3.2 Backend Modular Architecture (`/server`)

The backend is structured into decoupled modules under `server/` to ensure maintainability and high availability:
- **`server/index.ts`**: Main Express server running on port 3000 handling Vite middleware integration & API routing.
- **`server/geminiClient.ts`**: Multi-key rotation system (`GEMINI_API_KEY`, `GEMINI_API_KEY_2`, `GEMINI_API_KEY_3`) with automatic model fallback (`gemini-3.6-flash` -> `gemini-2.5-flash` -> `gemini-2.0-flash`) and `cleanAndParseJSON` recovery parser to strip markdown fence blocks and parse structured responses.
- **`server/routes/geospatial.ts`**: Hotspots data, tactical dispatch (`/api/dispatch-alert`), and citizen reports (`/api/report-incident`).
- **`server/routes/scam.ts`**: AI scam call analysis (`/api/analyze-scam-call`), citizen chat advisor (`/api/citizen-shield-chat`), and multi-modal scanner (`/api/analyze-citizen-multi-scam`).
- **`server/routes/currency.ts`**: Banknote security vision analysis (`/api/analyze-currency`).
- **`server/routes/network.ts`**: Money mule network graph intelligence & Section 65B legal package generator (`/api/fraud-network-query`).
- **`server/data/incidentsData.ts`**: In-memory seeded cybercrime hubs (Jamtara, Mewat, Cyberabad, NCR) and fraud graph fallback datasets.

### 3.3 Hybrid Persistence & Offline Resilience
CyberShield implements a hybrid database model (`src/firebase.ts`) that guarantees 100% operational uptime even during cloud connectivity losses or server outages:
- **Live Cloud Mode**: When network connectivity is established, CyberShield synchronizes incident reports, fraud blacklist entries, and investigation updates directly with Firebase Firestore.
- **Fallback Sandbox Mode**: If Firestore is unreachable or credentials are unconfigured, the application gracefully switches to an internal sandbox state using seeded localized data, notifying the user via UI alert banners while maintaining full feature functionality.

---

## 4. Comprehensive Feature Matrix

### 4.1 Citizen Shield & Multi-Input Emergency Scanner
- **Multi-Modal Input**: Supports raw text (transcript/SMS), URL domain analysis, image/document upload (forged warrants), and audio file analysis.
- **12 Regional Languages**: Provides guidance in 12 major Indian regional languages (Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, and Urdu) to ensure rural accessibility.
- **AI Risk Gauge & Score**: Evaluates threat levels on a scale from 0 to 100, categorizing risks into LEGIT, SUSPECT, HIGH RISK, and CRITICAL THREAT.
- **Step-by-Step Counter-Measures**: Provides immediate, actionable steps (e.g., 'Do not disconnect call', 'Do not transfer funds', 'Report to 1930 Helpline', 'File complaint on cybercrime.gov.in').

### 4.2 Crowdsourced Fraud Blacklist
- **5 Entity Registry**: Instant lookup across Scammer UPI VPAs, Phone Numbers, Phishing URLs, Bank Mule Account Numbers (with IFSC), and Crypto Wallet Addresses.
- **Live Warning Banners**: Searching an entity already flagged displays a prominent red warning banner detailing its report history and threat status.
- **LEA Verification Badges**: Verified entries receive an official LEA badge. Citizens can increment report counters (+1 Report) to express community consensus.
- **Role-Based Management**: Police and Admin roles possess dedicated controls to add, edit, flag, or remove blacklist entries.

### 4.3 Digital Arrest & Extortion Classifier
- **Pattern Recognition**: Identifies key phrases such as 'ED Seizure', 'CBI Custody', 'Customs MDMA Parcel', 'TRAI SIM Disconnection', and 'RBI Verification Escrow Account'.
- **Psychological Counter-Framing**: Protects victims from panic-induced compliance by explaining that genuine Indian law enforcement agencies never issue arrest warrants over Skype/WhatsApp or demand money transfers for verification.

### 4.4 Counterfeit Currency Scanner (FICN Vision)
An AI vision inspection module evaluating ₹500 and ₹2000 denomination banknotes against Reserve Bank of India (RBI) standards across 7 security landmarks:

| Security Landmark | RBI Standard Specification | CyberShield Vision Check |
| :--- | :--- | :--- |
| **Latent Image** | Latent numeral 500/2000 visible when note is tilted at 45-degree angle | Inspects contrast gradients and edge angles at lower right band |
| **Micro-printing** | Micro letters 'RBI' and '500/2000' between portrait and decorative band | High-resolution OCR verifying character clarity and sharpness |
| **Security Thread** | Windowed thread with color shift from green to blue when tilted with 'Bharat' & 'RBI' | Evaluates color spectrum shift and embedded text continuity |
| **Gandhi Watermark** | Portrait of Mahatma Gandhi with electrotype 500/2000 shadow mark | Analyzes opacity levels and tonal depth of portrait watermark |
| **Optically Variable Ink**| Denomination numeral 500/2000 printed in green-to-blue color shifting ink | Inspects RGB color hue transition under light simulation |
| **Bleed Lines** | Angular bleed lines on left and right borders (5 for ₹500, 7 for ₹2000) | Counts and verifies raised tactile print edge marks |
| **See-Through Register** | Numeral 500/2000 printed half on front and half on back aligned perfectly | Evaluates geometric alignment and backlight transparency match |

### 4.5 Geospatial Cyber Crime Hotspot Map
Interactive spatial map plotting real-time cybercrime incidents across Indian states and union territories. Investigators can filter incidents by severity (High, Medium, Low), view nearest cyber police stations, and execute tactical unit dispatch (`handleDispatch`) with real-time status transitions (`ACTIVE` -> `DISPATCHED` -> `RESOLVED`).

### 4.6 Money Mule Network Graph & Section 65B Intelligence
An interactive D3 force-directed visualizer mapping money flow networks. Nodes represent victims, Layer-1 mule accounts, Layer-2 mule accounts, P2P crypto exchanges, and VoIP gateways. Clicking a node opens an intelligence panel revealing account numbers, bank IFSC codes, total transacted volume, and risk score.

With a single click, the platform generates a Section 65B Court-Admissible Intelligence Package containing cryptographic hash signatures, system custodian declarations, and transaction lineage formatted for judicial submission.

### 4.7 Police Command Suite & Admin Incident Manager
- **Police Command Suite**: Allows investigators to manage incident lifecycles, assign lead officers, record evidence links, and update operational status.
- **Admin Incident Manager**: Provides MHA administrators with complete CRUD controls over incidents and blacklist records, global system health monitoring, and API quota tracking.
- **Cyber Safety Quiz & ATDS Library**: Gamified educational module with 10 situational scenarios testing citizen digital hygiene and promoting the 1930 Helpline.

---

## 5. Security, Compliance & Legal Standards

### 5.1 Section 65B of the Indian Evidence Act, 1872
Under Section 65B of the Indian Evidence Act, secondary electronic evidence is admissible in court only if accompanied by a certificate satisfying strict legal parameters. CyberShield automates compliance with these requirements:
1. **Cryptographic Hash Validation**: Generates a SHA-256 cryptographic checksum for all incident text, visual screenshots, and network graph logs at the exact millisecond of ingestion.
2. **System Custodian Metadata**: Logs device IP address, server timestamp (IST), operating system environment, host node ID, and database transaction UUID.
3. **Certificate Auto-Generation**: Auto-generates a standardized legal certificate formatted according to judicial precedents set by the Supreme Court of India (e.g., *Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal*).

> [!NOTE]
> **Section 65B Certificate Template**:
> `CERTIFICATE UNDER SECTION 65B OF THE INDIAN EVIDENCE ACT, 1872`  
> `I, [Officer Name / Custodian], Cyber Cell Command, do hereby certify that the electronic record detailing Money Mule Account [Account No] (SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855) was produced by CyberShield Server (Node ID: CYBER-NODE-DELHI-01) operating under normal conditions without unauthorized interference.`

### 5.2 Information Technology Act, 2000 (2008 Amendments)
CyberShield directly supports law enforcement action under key sections of the IT Act:
- **Section 43**: Enables police to document unauthorized data access and extortion attempts.
- **Section 66C (Identity Theft)**: Tracks stolen identity details, fake government logos, and spoofed phone VPAs.
- **Section 66D (Cheating by Personation)**: Facilitates investigation into scammers impersonating law enforcement officers via computer resources.
- **Section 69A (URL & Handle Blocking)**: Streamlines submission of threat URLs and fraudulent VPAs to MHA / CERT-In for emergency blocking.

---

## 6. API Endpoints & Data Schemas

### 6.1 REST API Endpoints Table

| Endpoint Route | HTTP Method | Payload Summary | Primary Function / Output |
| :--- | :--- | :--- | :--- |
| `/api/health` | `GET` | None | Returns Gemini AI availability status and server uptime |
| `/api/geospatial-data` | `GET` | None | Returns list of active India-wide cybercrime incidents |
| `/api/dispatch-alert` | `POST` | `{ incidentId, assignedUnit }` | Updates tactical unit dispatch status for police dashboard |
| `/api/report-incident` | `POST` | `Partial<GeoIncident>` | Logs new citizen incident report into state database / Firestore |
| `/api/analyze-scam-call` | `POST` | `{ text, language, type }` | Executes Gemini 3.6 Flash risk analysis & counter-measures |
| `/api/citizen-shield-chat` | `POST` | `{ prompt, conversation }` | Provides conversational AI emergency defense advice |
| `/api/analyze-citizen-multi-scam` | `POST` | `{ inputType, text, imageBase64, fileBase64, fileName, language }` | Executes Gemini 3.6 Flash analysis across text, URLs, PDF warrants, and screenshots in 12 regional languages |
| `/api/analyze-currency` | `POST` | `{ imageBase64, noteType }` | Vision analysis evaluating RBI security features on banknotes |
| `/api/fraud-network-query` | `POST` | `{ nodeId }` | Generates Section 65B court-admissible legal intelligence brief |

### 6.2 Production Data Schemas (`src/types.ts`)

```typescript
export interface BlacklistEntry {
  id: string;
  identifier: string; // e.g. "scammer@ybl", "+91 9876543210", "HDFC 0123..."
  category: 'UPI' | 'PHONE' | 'URL' | 'BANK_ACCOUNT' | 'CRYPTO_WALLET';
  scamType: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'VERIFIED_FRAUD' | 'UNDER_INVESTIGATION' | 'MULE_ACCOUNT_FROZEN' | 'ACTIVE_WARNING';
  reportCount: number;
  firstReportedDate: string;
  lastReportedDate: string;
  leaReferenceId?: string;
  description: string;
  reportedByRoles: ('POLICE' | 'ADMIN' | 'CITIZEN')[];
  verifiedByLea: boolean;
  associatedLocation?: string;
}

export interface GeoIncident {
  id: string;
  type: 'digital_arrest' | 'counterfeit_currency' | 'money_mule' | 'cyber_fraud';
  title: string;
  location: string;
  coordinates: { lat: number; lng: number };
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  timestamp: string;
  status: 'ACTIVE' | 'DISPATCHED' | 'RESOLVED';
  details: string;
  involvedAmount: string;
  callerNumber?: string;
  assignedUnit?: string;
  isCitizenReport?: boolean;
}
```

---

## 7. Future Implementations & Scale Roadmap

### 7.1 Phase 1: Short-Term Enhancements (Months 0 - 6)
- **NPCI CPFR Integration**: Direct API integration with NPCI Centralized Payment Fraud Registry (CPFR) to enable automated freeze requests for flagged UPI VPAs within 60 seconds.
- **Native Mobile Apps**: Develop lightweight native Android and iOS applications using React Native, featuring push notifications for regional cyber warnings.
- **Edge Vision Models**: Deploy on-device TensorFlow Lite / ONNX vision models to enable offline banknote inspection in remote rural areas without active internet connection.

### 7.2 Phase 2: Medium-Term Scaling (Months 6 - 12)
- **DoT CEIR IMEI Blocking**: Integration with Department of Telecommunications (DoT) Central Equipment Identity Register (CEIR) to automatically block IMEI numbers associated with extortion calls.
- **Automated 1930 Helpline IVR Integration**: Automate 1930 helpline IVR call transcript ingestion directly into the Citizen Shield AI classifier.
- **Automated Legal Notice Generation**: Implement auto-generated bank freeze mandate PDFs pre-filled with transaction IDs and magistrate order templates.

### 7.3 Phase 3: Long-Term Vision (Months 12 - 24)
- **Deepfake Video & Audio Detection Pipeline**: Deploy real-time spectral audio analysis and facial landmark flicker detection to identify AI deepfake video calls used in digital arrest scams.
- **Federated Cyber Threat Intelligence Network**: Establish privacy-preserving federated learning across state cyber police nodes to train local AI threat models without centralizing sensitive citizen PII.
- **Predictive Crime Forecasting**: Utilize historical spatial-temporal incident data to forecast emerging cybercrime hubs before large-scale extortion campaigns launch.
