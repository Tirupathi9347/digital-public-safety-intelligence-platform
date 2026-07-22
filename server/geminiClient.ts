import { GoogleGenAI, Type } from "@google/genai";

// Helper to clean and parse JSON responses from Gemini to avoid SyntaxErrors
export function cleanAndParseJSON(text: string): any {
  let cleaned = text.trim();
  
  // Remove markdown codeblock wrappers if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "");
    cleaned = cleaned.replace(/\n?```$/, "");
    cleaned = cleaned.trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch (initialError: any) {
    // Attempt recovery by locating the first '{' and last '}'
    const startIdx = cleaned.indexOf('{');
    const endIdx = cleaned.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const jsonCandidate = cleaned.substring(startIdx, endIdx + 1);
      try {
        return JSON.parse(jsonCandidate);
      } catch (nestedError: any) {
        console.warn("Attempting second-level recovery for malformed JSON...");
        let recovered = jsonCandidate.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g, (match, p1) => {
          return '"' + p1.replace(/\n/g, "\\n").replace(/\r/g, "\\r") + '"';
        });
        try {
          return JSON.parse(recovered);
        } catch (finalError) {
          throw new Error(`JSON parsing failed. Original: ${text}. Error: ${initialError.message}`);
        }
      }
    }
    throw initialError;
  }
}

// Check if a string is a valid API key string
function isValidApiKey(key: string | undefined): key is string {
  if (!key) return false;
  const k = key.trim();
  if (k.length < 15) return false;
  if (k.startsWith("YOUR_") || k === "MY_GEMINI_API_KEY") return false;
  return true;
}

let aiClients: GoogleGenAI[] = [];
let initAttempted = false;

export function getGeminiClients(): GoogleGenAI[] {
  if (!initAttempted) {
    initAttempted = true;
    const rawKeys = [
      ...(process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.split(',') : []),
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.VITE_GEMINI_API_KEY,
    ];

    const validKeys = Array.from(new Set(rawKeys.map(k => k?.trim()).filter(isValidApiKey)));

    aiClients = [];
    for (const key of validKeys) {
      try {
        const client = new GoogleGenAI({ apiKey: key });
        aiClients.push(client);
      } catch (e) {
        console.error("Failed to initialize GoogleGenAI client for key:", e);
      }
    }

    if (aiClients.length > 0) {
      console.log(`GoogleGenAI initialized with ${aiClients.length} API key(s).`);
    } else {
      console.log("No valid GEMINI_API_KEY detected. Running in Sandbox AI Simulation mode.");
    }
  }
  return aiClients;
}

export function getGeminiClient(): GoogleGenAI | null {
  const clients = getGeminiClients();
  return clients.length > 0 ? clients[0] : null;
}

export async function callGeminiWithRetry(params: {
  model?: string;
  contents: any;
  config?: any;
}) {
  const clients = getGeminiClients();
  if (clients.length === 0) {
    throw new Error("No Gemini API key configured.");
  }

  // Model hierarchy for execution
  const primaryModel = params.model && params.model !== "gemini-3.6-flash" ? params.model : "gemini-2.0-flash";
  const modelChain = Array.from(new Set([
    primaryModel,
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash"
  ]));

  let lastError: any = null;

  for (const model of modelChain) {
    for (let keyIdx = 0; keyIdx < clients.length; keyIdx++) {
      const ai = clients[keyIdx];
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const msg = err?.message || String(err);
        const status = err?.status || err?.code;
        
        if (msg.includes("Quota exceeded") || msg.includes("RESOURCE_EXHAUSTED") || status === 429) {
          console.warn(`[Gemini API Warning] Key #${keyIdx + 1} quota exceeded (429: Rate Limit / Free Tier Limit Reached for '${model}').`);
        } else if (msg.includes("is no longer available") || msg.includes("not found") || status === 404) {
          console.warn(`[Gemini API Warning] Model '${model}' not available on Key #${keyIdx + 1}.`);
        } else {
          console.warn(`[Gemini API Warning] Call failed on Key #${keyIdx + 1} with model '${model}': ${msg}`);
        }
      }
    }
  }

  throw lastError || new Error("Gemini API calls exhausted. Activating fallback simulation engine.");
}
