import { Router } from "express";
import { Type } from "@google/genai";
import { getGeminiClient, callGeminiWithRetry, cleanAndParseJSON } from "../geminiClient";

const router = Router();

// API: DIGITAL ARREST SCAM ANALYSIS
router.post("/analyze-scam-call", async (req, res) => {
  const { callTranscript, metadata } = req.body;
  if (!callTranscript) {
    return res.status(400).json({ error: "No call transcript provided." });
  }

  if (getGeminiClient()) {
    try {
      const response = await callGeminiWithRetry({
        model: "gemini-3.6-flash",
        contents: `Analyze the following audio call transcript or verbal interaction sequence for 'Digital Arrest' cyber scam indicators. 
        Detect psychological coercion strategies, legal threats (CBI, Customs, ED, Narcotics, FedEx passport package drugs), fake arrest warnings, number spoofing indicators, demanding secrecy, and transferring to fake supervisors on camera.
        
        Transcript: "${callTranscript}"
        Metadata context: ${JSON.stringify(metadata || {})}

        Provide your feedback strictly in a JSON structure conforming to the following fields:
        {
          "isScam": boolean,
          "scamType": string (e.g. "Narcotics Trapping", "Customs Seizure", "Fake CBI Legal Notice"),
          "riskScore": number (0 to 100),
          "coercionTactics": string[] (tactics used, e.g., "Demanded room isolation", "Aggressive legal threats"),
          "mhaActionRequired": boolean,
          "alertPriority": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
          "recommendedActions": string[] (steps victim should take immediately),
          "generatedAlertDraft": string (formal MHA block/alert draft with numbers, IP, and key threat details),
          "analysisSummary": string (concise summary of why this is/is not a digital arrest scam)
        }
        
        Output must be valid JSON ONLY.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isScam: { type: Type.BOOLEAN },
              scamType: { type: Type.STRING },
              riskScore: { type: Type.INTEGER },
              coercionTactics: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              mhaActionRequired: { type: Type.BOOLEAN },
              alertPriority: { 
                type: Type.STRING,
                enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"]
              },
              recommendedActions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              generatedAlertDraft: { type: Type.STRING },
              analysisSummary: { type: Type.STRING }
            },
            required: [
              "isScam",
              "scamType",
              "riskScore",
              "coercionTactics",
              "mhaActionRequired",
              "alertPriority",
              "recommendedActions",
              "generatedAlertDraft",
              "analysisSummary"
            ]
          },
          systemInstruction: "You are an elite cyber forensics analyst for the Indian Ministry of Home Affairs (MHA) specializing in Digital Arrest scams, identifying high-pressure psychological traps and fake authorities."
        }
      });

      const responseText = response.text || "";
      const result = cleanAndParseJSON(responseText);
      return res.json(result);
    } catch (err: any) {
      console.error("Gemini Scam Call Analysis Error, using fallback:", err);
    }
  }

  // Fallback Rule-Based Analyser
  const isCBI = /cbi|customs|narco|police|arrest|jail|drug|passport|fedex|custom|court/i.test(callTranscript);
  const isThreat = /arrest|warrant|prison|illegal|authority|block|isolate|camera|skype|room/i.test(callTranscript);
  const score = isCBI && isThreat ? 95 : isCBI || isThreat ? 65 : 15;

  return res.json({
    isScam: score > 50,
    scamType: isCBI ? "Impersonating Law Enforcement (CBI/Customs)" : "High-Pressure Impersonation",
    riskScore: score,
    coercionTactics: [
      isCBI ? "Impersonation of elite state agency" : "Urgent action demand",
      isThreat ? "Imposing digital isolation via camera" : "Threat of physical detainment",
      "Demanded immediate transfer of funds for 'assets verification'"
    ].filter(Boolean),
    mhaActionRequired: score > 50,
    alertPriority: score > 80 ? "CRITICAL" : "HIGH",
    recommendedActions: [
      "HANG UP immediately. No real government officer will mandate a Skype/WhatsApp video call arrest.",
      "Inform local Cyber Crime station or call 1930 immediately.",
      "Do NOT transfer funds for 'court verification' under any circumstance."
    ],
    generatedAlertDraft: `MHA DIGITAL ARREST THREAT INTELLIGENCE ALERT\n=======================================\nIntercept / Victim Report details scam sequence imitating central police authorities. \nSpoofed source ID tracking. Requested telecom action to freeze active routing nodes and suspect's registered SIM cards.`,
    analysisSummary: "[SIMULATED ASSESSMENT] High indicators of psychological trapping and unauthorized authority claim detected in conversational patterns."
  });
});

// API: CITIZEN SHIELD CHATBOT
router.post("/citizen-shield-chat", async (req, res) => {
  const { message, history, language } = req.body;
  if (!message) {
    return res.status(400).json({ error: "No message provided." });
  }

  if (getGeminiClient()) {
    try {
      const response = await callGeminiWithRetry({
        model: "gemini-3.6-flash",
        contents: `Evaluate the user's situation described below. Respond as a trusted citizen-shield fraud risk adviser.
        Identify if they are in danger of a cyber fraud, phishing, digital arrest, online job trap, or fake lottery.
        Provide your response in the requested language: ${language || "English"}.
        
        Recent user input: "${message}"
        Chat context history: ${JSON.stringify(history || [])}

        Generate a JSON structured response with the keys:
        {
          "riskLevel": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "SAFE",
          "verdict": "A brief warning verdict statement summarizing if this is a scam, in the target language.",
          "language": "the language code used",
          "guidance": ["List step 1", "List step 2", "List step 3"] (practical, immediate advisory actions in the requested language),
          "emergencyContacts": [
            { "name": "National Cyber Crime Helpline", "contact": "1930" },
            { "name": "NCRB Portal Link", "contact": "cybercrime.gov.in" }
          ]
        }
        
        Respond ONLY with this JSON object.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              riskLevel: {
                type: Type.STRING,
                enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW", "SAFE"]
              },
              verdict: { type: Type.STRING },
              language: { type: Type.STRING },
              guidance: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              emergencyContacts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    contact: { type: Type.STRING }
                  },
                  required: ["name", "contact"]
                }
              }
            },
            required: [
              "riskLevel",
              "verdict",
              "language",
              "guidance",
              "emergencyContacts"
            ]
          },
          systemInstruction: "You are an empathetic yet highly analytical public safety citizen officer, guiding potential scam victims in India. You must write the output in the victim's chosen regional language so they can immediately understand the protective steps."
        }
      });

      const responseText = response.text || "";
      const result = cleanAndParseJSON(responseText);
      return res.json(result);
    } catch (err: any) {
      console.error("Gemini Citizen Shield Chat Error, using fallback:", err);
    }
  }

  // Fallback simulator based on keywords
  const lowerMsg = message.toLowerCase();
  const isDigitalArrest = /arrest|police|cbi|customs| narcotics|fedex|parcel|illegal/i.test(lowerMsg);
  const isJobScam = /job|part-time|like|youtube|telegram|deposit|earn|commission/i.test(lowerMsg);
  const isUrg = /otp|urgent|immediate|fast|click|link|freeze|expiry/i.test(lowerMsg);

  let risk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'SAFE' = 'MEDIUM';
  let verdict = "We have evaluated your concern. Please remain cautious.";
  let guidance = [
    "Do not click any suspicious links sent via SMS, WhatsApp, or Telegram.",
    "Do not share any bank PIN, UPI PIN, or SMS OTP with anyone calling.",
    "Report suspicious phone numbers to the national 'Chakshu' portal on Sanchar Saathi."
  ];

  if (isDigitalArrest) {
    risk = 'CRITICAL';
    verdict = "WARNING: This exhibits 100% characteristics of a 'Digital Arrest' Scam. No official agency will hold you hostage on camera!";
    guidance = [
      "Cut the call immediately. Do NOT enter or stay on any video calls.",
      "Real police or court officials will NEVER ask for money transfers for verification.",
      "Block the number on WhatsApp and notify your family. Call the helpline on 1930."
    ];
  } else if (isJobScam) {
    risk = 'HIGH';
    verdict = "WARNING: This resembles a viral 'Part-time Task/Mule account' scam. Do not pay money to unlock earnings!";
    guidance = [
      "Any job asking you to deposit money first to withdraw a 'commission' is a complete scam.",
      "Exit the Telegram/WhatsApp group immediately.",
      "Do not register your bank account or receive funds for other people."
    ];
  } else if (isUrg) {
    risk = 'HIGH';
    verdict = "WARNING: Phishing alert. Critical urgency cues found in your transaction request.";
    guidance = [
      "Never share the OTP. Banks do not ask for OTP over the phone to prevent 'freezes'.",
      "Login only on official mobile banking apps."
    ];
  }

  if (language === "Hindi") {
    verdict = isDigitalArrest 
      ? "चेतावनी: यह पूरी तरह से एक 'डिजिटल अरेस्ट' घोटाला है। कोई भी सरकारी अधिकारी आपको वीडियो कॉल पर बंधक नहीं बनाएगा!"
      : "चेतावनी: यह एक संदिग्ध गतिविधि है। कृपया किसी भी परिस्थिति में पैसे न भेजें।";
    guidance = isDigitalArrest ? [
      "तुरंत वीडियो कॉल काटें। किसी भी सरकारी अधिकारी द्वारा वीडियो कॉल पर गिरफ्तार करने का नियम नहीं है।",
      "बैंक खाता विवरण या पैसे कभी न भेजें।",
      "तुरंत साइबर अपराध राष्ट्रीय हेल्पलाइन नंबर 1930 पर शिकायत दर्ज करें।"
    ] : [
      "किसी भी अवांछित लिंक पर क्लिक न करें।",
      "अपना ओटीपी (OTP) या पिन किसी के साथ साझा न करें।"
    ];
  }

  return res.json({
    riskLevel: risk,
    verdict,
    language: language || "English",
    guidance,
    emergencyContacts: [
      { name: "National Cyber Fraud Helpline", contact: "1930" },
      { name: "MHA Cybercrime Registry Portal", contact: "cybercrime.gov.in" },
      { name: "MHA Chakshu (Report Spoofed Calls)", contact: "sancharsaathi.gov.in" }
    ]
  });
});

// API: CITIZEN MULTI-INPUT SCAM ANALYSER (TEXT, URL, IMAGE, FILE)
router.post("/analyze-citizen-multi-scam", async (req, res) => {
  const { inputType, text, imageBase64, fileBase64, fileName, language } = req.body;

  if (getGeminiClient()) {
    try {
      const parts: any[] = [];
      let promptText = `Analyze the following public safety risk asset submitted by a citizen.
      Input Channel Type: ${inputType}
      Language Preference: ${language || "English"}
      `;

      if (inputType === 'url') {
        promptText += `\nTarget URL / Phishing Link to scan: "${text}". Check if this link tries to mimic official government portals (like IndiaPost, NCRB, Ministry of Finance, state power boards, banks, or telecom giants). Detect suspicious subdomains, non-standard TLDs (.org, .net, .xyz, .cc, .info, .in-verify-security.org), and credential harvesting keywords.`;
      } else if (inputType === 'text') {
        promptText += `\nExtortion / Scam Transcript: "${text}". Inspect for high-pressure digital arrests, psychological trapping, police imposter threats, FedEx drug parcel schemes, part-time Telegram task deposits, or urgent electricity bill disconnection warnings.`;
      } else if (inputType === 'file') {
        promptText += `\nDocument / Warrant File Name: "${fileName}". User uploaded a suspect file (Base64 provided in parts if applicable). Analyze if this is a forged official judicial warrant, fictitious RBI clearance certification, fake income tax refund claim, or fake police summons designed to extort money.`;
      } else if (inputType === 'image') {
        promptText += `\nScreenshot Image: User uploaded a screenshot of a scam chat or message (Base64 provided in parts if applicable). Spot coercion patterns, fake bank transactions, UPI transfers, or WhatsApp threats.`;
      }

      promptText += `\n\nAnalyze these details and generate an expert public defense verdict in the requested language. Add supportive phrasing explaining exactly why this is a fraud and how to proceed.
      
      Respond strictly in JSON format matching the schema below:
      {
        "isScam": boolean,
        "riskLevel": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "SAFE",
        "scamType": "Digital Arrest Extortion" | "Part-time Job Trap" | "Phishing Gateway" | "Fictitious Legal Warrant" | "Fake Electricity bill" | "Safe",
        "verdict": "A powerful summary verdict in the requested language",
        "confidence": number (0 to 100),
        "coercionTactics": string[] (tactics used),
        "guidance": string[] (immediate defense instructions),
        "indicatorsFound": string[] (fake TLDs, wrong logos, demands for room isolation, payment key terms, etc),
        "phrasingOutput": "A highly descriptive, empathetic yet direct AI warning explaining the scam logic and why they should hang up or ignore, written beautifully with better phrasing in the user's language."
      }
      
      Output MUST be valid JSON ONLY.`;

      parts.push({ text: promptText });

      if (inputType === 'image' && imageBase64) {
        parts.push({
          inlineData: {
            mimeType: "image/jpeg",
            data: imageBase64.replace(/^data:image\/\w+;base64,/, "")
          }
        });
      }

      if (inputType === 'file' && fileBase64) {
        const mimeType = fileName?.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg';
        parts.push({
          inlineData: {
            mimeType,
            data: fileBase64.replace(/^data:\w+\/\w+;base64,/, "")
          }
        });
      }

      const response = await callGeminiWithRetry({
        model: "gemini-3.6-flash",
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isScam: { type: Type.BOOLEAN },
              riskLevel: { 
                type: Type.STRING, 
                enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW", "SAFE"] 
              },
              scamType: { type: Type.STRING },
              verdict: { type: Type.STRING },
              confidence: { type: Type.INTEGER },
              coercionTactics: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              guidance: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              indicatorsFound: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              phrasingOutput: { type: Type.STRING }
            },
            required: [
              "isScam", "riskLevel", "scamType", "verdict", 
              "confidence", "coercionTactics", "guidance", "indicatorsFound", "phrasingOutput"
            ]
          },
          systemInstruction: "You are the central AI Public Safety Shield for the Ministry of Home Affairs. Your job is to shield citizens from Digital Arrests and online scams by analyzing inputs in regional Indian languages with extreme precision and rendering supportive explanations."
        }
      });

      const responseText = response.text || "";
      const result = cleanAndParseJSON(responseText);
      return res.json(result);
    } catch (err: any) {
      console.error("Gemini Multi-Input Scam Analysis Error, using fallback:", err);
    }
  }

  // Robust Rule-based Fallback Analyser
  let isScam = false;
  let riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE' = 'LOW';
  let scamType = "Safe";
  let verdict = "Your submitted file or content does not exhibit critical threat vectors. Proceed with normal precautions.";
  let confidence = 85;
  let tactics: string[] = [];
  let guidance: string[] = [];
  let indicators: string[] = [];
  let phrasingOutput = "We scanned the submitted input. No critical fraud matching signatures were spotted. However, always verify caller IDs and avoid downloading third-party .apk files.";

  const lowerText = (text || "").toLowerCase();

  if (inputType === 'url') {
    const isPhish = /post|verify|india|pay|apk|login|update|electric|power|refund|complaint|bill|vpa/i.test(lowerText) || /\.(xyz|net|org|cc|info|tech|online|store|bid|top)$/i.test(lowerText);
    if (isPhish) {
      isScam = true;
      riskLevel = 'HIGH';
      scamType = "Phishing Gateway";
      verdict = "CRITICAL PHISHING LINK SPOTTED: This link attempts to mimic central services!";
      tactics = ["Using official government branding keywords", "Forcing urgency on unpaid fees", "Registering suspicious non-gov domain names"];
      guidance = [
        "DO NOT click or input any Aadhaar numbers or bank passwords.",
        "MHA or IndiaPost always sends alerts from verified SMS headers like 'JD-INDPOST', never numeric sender IDs.",
        "Report this domain to the national threat intelligence cell."
      ];
      indicators = ["Non-standard domain (.xyz / .cc)", "No SSL green-bar verification", "Preys on package or electricity bill urgency"];
      phrasingOutput = `This URL ("${text}") is a classic trap. Official central and state agencies exclusively use domains ending in '.gov.in' or '.nic.in'. Any website asking you to pay small registration fees on private domains like '.xyz' or '.net' to release a FedEx parcel, IndiaPost package, or to avoid an electricity cut is fraudulent. Immediately close the tab.`;
    }
  } else if (inputType === 'file') {
    const isForger = /warrant|arrest|cbi|rbi|police|court|narcotics|seizure|stamp|summons|court|judges|finance/i.test(lowerText) || (fileName && fileName.toLowerCase().includes('notice') || fileName?.toLowerCase().includes('warrant'));
    if (isForger) {
      isScam = true;
      riskLevel = 'CRITICAL';
      scamType = "Fictitious Legal Warrant";
      verdict = "WARNING: Highly suspicious forged digital legal warrant or summons detected!";
      tactics = ["Falsifying official emblems and stamps", "Imposing non-bailable arrest clauses", "Mandating digital secrecy and immediate Skype audits"];
      guidance = [
        "NO judicial court or law enforcement agency issues warrants via WhatsApp, Skype, or PDF.",
        "Never transfer security deposits to avoid arrest.",
        "Notify family or call the cybercrime helpline (1930) immediately."
      ];
      indicators = ["Suspicious layout stamps", "WhatsApp document delivery", "Incorrect penal codes or grammatical mistakes"];
      phrasingOutput = `The document "${fileName || "summons.pdf"}" is a fake legal notice. Cybercriminals routinely fabricate CBI, RBI, or Customs letterheads using Google Images to intimidate you. Under Indian law, no criminal summons is ever served over WhatsApp or resolved by online monetary deposits. This is 100% fake.`;
    }
  } else if (inputType === 'image' || inputType === 'text') {
    const isArrest = /arrest|customs|fedex|police|drugs|mdma|cbi|skype|room|camera|terror|laundering/i.test(lowerText);
    const isJob = /part-time|likes|youtube|telegram|deposit|earn|vip|task|commission/i.test(lowerText);
    
    if (isArrest) {
      isScam = true;
      riskLevel = 'CRITICAL';
      scamType = "Digital Arrest Extortion";
      verdict = "EMERGENCY: Digital Arrest extortive scenario identified!";
      tactics = ["Digital isolation demands", "Impersonating law enforcement", "Threat of immediate jail and social public shame"];
      guidance = [
        "Hang up immediately! Real CBI, ED, or custom officers do not perform video calls or make people stay on camera.",
        "Do not transfer any money for verification.",
        "Block the suspicious caller and lodge a complaint on cybercrime.gov.in."
      ];
      indicators = ["Caller demanding secrecy", "Skype call requested to CBI/Narcotics room", "Request to transfer funds to verify authenticity"];
      phrasingOutput = `This interaction displays clear patterns of a 'Digital Arrest' extortion ring. Scammers pose as police inspectors or customs officials, claiming you have illegal drugs in a FedEx parcel. They hold you hostage on a video call to drain your bank account. Real officers NEVER conduct arrests on video. You are completely safe—simply cut the call.`;
    } else if (isJob) {
      isScam = true;
      riskLevel = 'HIGH';
      scamType = "Part-time Job Trap";
      verdict = "ALERT: Suspected part-time job Telegram/WhatsApp investment trap!";
      tactics = ["Luring with small introductory payouts", "Demanding premium deposit to unlock commission", "Adding victim to hyped public chat groups"];
      guidance = [
        "Do not deposit any funds. Any job that requires you to 'pay money' to work is a complete fraud.",
        "Exit any Telegram channel claiming high VIP earnings.",
        "Block the handlers on all messaging apps."
      ];
      indicators = ["Pre-pay to earn commission", "WhatsApp recruitment from foreign country codes (+1, +63, etc)", "Tasks involving liking YouTube videos"];
      phrasingOutput = `This is a YouTube-liking/Telegram task scam. Scammers pay small sums initially to win your trust, then convince you to deposit thousands to unlock larger commissions. Once you pay, they block you. Avoid transfering money to any private UPI IDs.`;
    }
  }

  return res.json({
    isScam,
    riskLevel,
    scamType,
    verdict,
    confidence,
    coercionTactics: tactics,
    guidance,
    indicatorsFound: indicators,
    phrasingOutput
  });
});

export default router;
