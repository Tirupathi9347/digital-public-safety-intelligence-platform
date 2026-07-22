import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, query, orderBy, deleteDoc, getDocFromServer } from "firebase/firestore";
import { GeoIncident, BlacklistEntry } from "./types";

// Default initial dataset for Fraud Blacklist
export const INITIAL_BLACKLIST_DATA: BlacklistEntry[] = [
  {
    id: "blk-01",
    identifier: "cbi.extortion.mha@ybl",
    category: "UPI",
    scamType: "Digital Arrest & Fake Police Extortion",
    severity: "CRITICAL",
    status: "VERIFIED_FRAUD",
    reportCount: 42,
    firstReportedDate: "2026-05-10",
    lastReportedDate: "2026-07-20",
    leaReferenceId: "FIR-2026-DEL-8942",
    description: "Impersonates MHA & CBI officers threatening digital arrest over alleged drug parcel. Demands immediate UPI transfers to 'clear bail'.",
    reportedByRoles: ["CITIZEN", "POLICE"],
    verifiedByLea: true,
    associatedLocation: "New Delhi & NCR"
  },
  {
    id: "blk-02",
    identifier: "+91 98712 34567",
    category: "PHONE",
    scamType: "Digital Arrest & Spoofed Customs Call",
    severity: "CRITICAL",
    status: "UNDER_INVESTIGATION",
    reportCount: 28,
    firstReportedDate: "2026-06-01",
    lastReportedDate: "2026-07-21",
    leaReferenceId: "FIR-2026-BLR-4012",
    description: "Calls victims pretending to be Mumbai Customs / ED Officer stating passports found with illegal contraband. Uses coercion tactics.",
    reportedByRoles: ["CITIZEN"],
    verifiedByLea: true,
    associatedLocation: "Bengaluru, Karnataka"
  },
  {
    id: "blk-03",
    identifier: "https://parttime-pm-jobs-india.xyz",
    category: "URL",
    scamType: "Fake Work-From-Home Job Trap",
    severity: "HIGH",
    status: "ACTIVE_WARNING",
    reportCount: 35,
    firstReportedDate: "2026-06-15",
    lastReportedDate: "2026-07-19",
    leaReferenceId: "CYBER-REPORT-2026-098",
    description: "Fake Telegram job portal promising Rs 5000/day for rating YouTube videos. Demands 'security deposit' before withdrawal.",
    reportedByRoles: ["CITIZEN"],
    verifiedByLea: false,
    associatedLocation: "Pan-India"
  },
  {
    id: "blk-04",
    identifier: "HDFC 50100293847561",
    category: "BANK_ACCOUNT",
    scamType: "Money Mule & Cyber Fraud",
    severity: "CRITICAL",
    status: "MULE_ACCOUNT_FROZEN",
    reportCount: 19,
    firstReportedDate: "2026-04-20",
    lastReportedDate: "2026-07-15",
    leaReferenceId: "LEGAL-FREEZE-2026-HDFC-991",
    description: "Layer-1 mule account used to aggregate ransomware and digital arrest extortion funds. Account frozen under Section 102 CrPC.",
    reportedByRoles: ["POLICE", "ADMIN"],
    verifiedByLea: true,
    associatedLocation: "Kolkata, West Bengal"
  },
  {
    id: "blk-05",
    identifier: "pay.customs.clearance@axl",
    category: "UPI",
    scamType: "Courier Parcel Customs Extortion",
    severity: "HIGH",
    status: "VERIFIED_FRAUD",
    reportCount: 14,
    firstReportedDate: "2026-07-02",
    lastReportedDate: "2026-07-21",
    leaReferenceId: "FIR-2026-HYD-5510",
    description: "Fake FedEx / DHL customs penalty payment gateway demanding instant clearance fees for intercepted international shipments.",
    reportedByRoles: ["CITIZEN", "POLICE"],
    verifiedByLea: true,
    associatedLocation: "Hyderabad, Telangana"
  },
  {
    id: "blk-06",
    identifier: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    category: "CRYPTO_WALLET",
    scamType: "Ransomware & Illegal Extortion",
    severity: "CRITICAL",
    status: "UNDER_INVESTIGATION",
    reportCount: 9,
    firstReportedDate: "2026-05-28",
    lastReportedDate: "2026-07-18",
    leaReferenceId: "INTERPOL-NOTICE-2026-CR",
    description: "USDT Tron/Ethereum wallet linked to international fake arrest coercion rings operating across Southeast Asia.",
    reportedByRoles: ["ADMIN"],
    verifiedByLea: true,
    associatedLocation: "International / Cyber Cell"
  }
];

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
}

// Key for localStorage
const LOCAL_STORAGE_KEY = "aegis_firebase_config";

// Read from Env variables or localStorage
export function getSavedFirebaseConfig(): FirebaseConfig | null {
  try {
    // 1. Check LocalStorage
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.apiKey && parsed.projectId) {
        return parsed as FirebaseConfig;
      }
    }
  } catch (e) {
    console.error("Failed to parse stored Firebase config:", e);
  }

  // 2. Fallback to Vite env variables or user's official config
  const metaEnv = (import.meta as any).env || {};
  const envConfig: FirebaseConfig = {
    apiKey: metaEnv.VITE_FIREBASE_API_KEY || "AIzaSyCUV9p-Ditc80UlleY_40ylnvbKCt3cM58",
    authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "public-safety-platform.firebaseapp.com",
    projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "public-safety-platform",
    storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "public-safety-platform.firebasestorage.app",
    messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "777742294528",
    appId: metaEnv.VITE_FIREBASE_APP_ID || "1:777742294528:web:bd4d8ef3efe4052d2502e5",
  };

  if (envConfig.apiKey && envConfig.projectId) {
    return envConfig;
  }

  return null;
}

export function saveFirebaseConfig(config: FirebaseConfig | null) {
  if (config) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
  } else {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
}

// Graceful dynamic initialization
let dbInstance: any = null;

export function getFirebaseDB() {
  if (dbInstance) return dbInstance;

  const config = getSavedFirebaseConfig();
  if (!config) return null;

  try {
    const app = getApps().length === 0 ? initializeApp(config) : getApp();
    dbInstance = getFirestore(app);
    return dbInstance;
  } catch (err) {
    console.error("Firebase Initialization Error:", err);
    return null;
  }
}

export function isFirebaseConnected(): boolean {
  return getFirebaseDB() !== null;
}

export async function verifyFirestoreConnection(): Promise<boolean> {
  const db = getFirebaseDB();
  if (!db) return false;

  try {
    // Attempt to get a test document from the server to check connectivity
    await getDocFromServer(doc(db, "test", "connection"));
    return true;
  } catch (error: any) {
    // If we received an error from the server (e.g. permission-denied or not-found),
    // it means the client WAS able to reach the server, so connection is active!
    if (error && typeof error === 'object' && 'code' in error) {
      const code = error.code;
      if (code === 'permission-denied' || code === 'not-found' || code === 'failed-precondition') {
        return true;
      }
    }
    console.warn("Please check your Firebase configuration or network status.", error);
    return false;
  }
}

// Helper function to sanitize objects for Firestore (removes undefined values)
function sanitizeForFirestore(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeForFirestore);
  const result: any = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val !== undefined) {
      result[key] = sanitizeForFirestore(val);
    }
  }
  return result;
}

// Dynamic helper to save incident
export async function saveIncidentToFirebase(incident: GeoIncident): Promise<boolean> {
  const db = getFirebaseDB();
  if (!db) return false;

  try {
    // Save to 'incidents' collection, using custom doc ID or generating a doc
    const docRef = doc(db, "incidents", incident.id);
    const data = sanitizeForFirestore({
      ...incident,
      syncedAt: new Date().toISOString(),
    });
    await setDoc(docRef, data);
    return true;
  } catch (err) {
    console.error("Failed to save incident to Firestore:", err);
    return false;
  }
}

// Dynamic helper to fetch incidents
export async function fetchIncidentsFromFirebase(): Promise<GeoIncident[] | null> {
  const db = getFirebaseDB();
  if (!db) return null;

  try {
    const q = query(collection(db, "incidents"), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    const incidents: GeoIncident[] = [];
    snapshot.forEach((docSnap) => {
      incidents.push(docSnap.data() as GeoIncident);
    });
    return incidents;
  } catch (err) {
    console.error("Failed to fetch incidents from Firestore:", err);
    return null;
  }
}

// Dynamic helper to log feedback / shield assessments
export async function saveAssessmentToFirebase(assessment: any): Promise<boolean> {
  const db = getFirebaseDB();
  if (!db) return false;

  try {
    const data = sanitizeForFirestore({
      ...assessment,
      timestamp: new Date().toISOString(),
    });
    await addDoc(collection(db, "shield_assessments"), data);
    return true;
  } catch (err) {
    console.error("Failed to save citizen shield assessment to Firestore:", err);
    return false;
  }
}

// Dynamic helper to delete incident
export async function deleteIncidentFromFirebase(incidentId: string): Promise<boolean> {
  const db = getFirebaseDB();
  if (!db) return false;

  try {
    const docRef = doc(db, "incidents", incidentId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error("Failed to delete incident from Firestore:", err);
    return false;
  }
}

// Dynamic helper to fetch Blacklist Entries from Firestore
export async function fetchBlacklistFromFirebase(): Promise<BlacklistEntry[] | null> {
  const db = getFirebaseDB();
  if (!db) return null;

  try {
    const q = query(collection(db, "fraud_blacklist"), orderBy("lastReportedDate", "desc"));
    const snapshot = await getDocs(q);
    const entries: BlacklistEntry[] = [];
    snapshot.forEach((docSnap) => {
      entries.push(docSnap.data() as BlacklistEntry);
    });
    return entries;
  } catch (err: any) {
    console.warn("Firestore fetchBlacklist warning (using fallback data if unavailable):", err?.message || err);
    return null;
  }
}

// Dynamic helper to save or update Blacklist Entry in Firestore
export async function saveBlacklistEntryToFirebase(entry: BlacklistEntry): Promise<boolean> {
  const db = getFirebaseDB();
  if (!db) return false;

  try {
    const docRef = doc(db, "fraud_blacklist", entry.id);
    const data = sanitizeForFirestore({
      ...entry,
      updatedAt: new Date().toISOString(),
    });
    await setDoc(docRef, data);
    return true;
  } catch (err) {
    console.error("Failed to save fraud blacklist entry to Firestore:", err);
    return false;
  }
}

// Dynamic helper to delete Blacklist Entry from Firestore
export async function deleteBlacklistEntryFromFirebase(entryId: string): Promise<boolean> {
  const db = getFirebaseDB();
  if (!db) return false;

  try {
    const docRef = doc(db, "fraud_blacklist", entryId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error("Failed to delete fraud blacklist entry from Firestore:", err);
    return false;
  }
}
