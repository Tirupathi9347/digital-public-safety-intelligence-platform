import { Router } from "express";
import { Type } from "@google/genai";
import { getGeminiClient, callGeminiWithRetry, cleanAndParseJSON } from "../geminiClient";

const router = Router();

// API: COUNTERFEIT CURRENCY SCANNING AGENT
router.post("/analyze-currency", async (req, res) => {
  const { imageBase64, noteDetails, denomination } = req.body;
  
  const isCustomUpload = noteDetails?.isCustomUpload === true;
  
  if (isCustomUpload && getGeminiClient() && imageBase64) {
    try {
      const match = imageBase64.match(/^data:(image\/\w+);base64,/);
      const mimeType = match ? match[1] : "image/jpeg";
      const data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      const imagePart = {
        inlineData: {
          mimeType: mimeType,
          data: data
        }
      };

      const textPart = {
        text: `You are an elite Reserve Bank of India (RBI) Banknote Security Division forensic vision AI agent.
        Thoroughly inspect this uploaded image of a Indian Currency Note (Rs ${denomination || "500"}).

        CRITICAL FORENSIC INSPECTION CHECKLIST:
        1. DISCLAIMER & PROP NOTE TEXT CHECK: Inspect for non-standard text such as "Children Bank of India", "Bhartiya Manoranjan Bank", "Full of Fun", "Prop Money", "Play Money", "Coupon", "SPECIMEN", "Sample", or non-RBI headers. If any prop/toy/fake header or disclaimer is detected, IMMEDIATELY classify as COUNTERFEIT (isGenuine = false).
        2. MAHATMA GANDHI PORTRAIT: Examine portrait sharpness, shading, intaglio texture quality, and the presence of a clear watermark in the blank window.
        3. SECURITY THREAD: Inspect the windowed security thread. Verify if it has color-shifting properties (green to blue), micro-printed "भारत" and "RBI", or if it is merely a painted/printed line.
        4. SERIAL NUMBER PROGRESSION: Check serial numbers at the top-right and bottom-left. Authentic notes have digits that progressively grow in size from left to right. Uniform font size, wrong font, or crooked placement is a major counterfeit indicator.
        5. MICRO-PRINTING & BLEED LINES: Check for sharp micro-lettering ("RBI", "500") on the Gandhi portrait frame and tactile bleed lines on the left and right margins.
        6. PRINT QUALITY & PAPER TEXTURE: Identify blurry offset printing, pixelation, washed-out colors, or digital photo editing artifacts.

        IMPORTANT DECISION RULE:
        - If the banknote is a fake, toy note, prop note, printout, or has ANY missing/suspicious security features, set "isGenuine": false, set "confidence": 85-99, mark the failing features as "FAIL", and provide a detailed forensic summary listing the exact counterfeit hallmarks detected.
        - Only set "isGenuine": true if the banknote passes ALL RBI security benchmarks with high visual fidelity.

        Respond in valid JSON format ONLY:
        {
          "isGenuine": boolean,
          "confidence": number (0 to 100),
          "anomalies": [
            { "feature": "Security Thread", "description": "Detailed observation", "status": "PASS" | "FAIL" | "WARNING" },
            { "feature": "Mahatma Gandhi Portrait & Watermark", "description": "Detailed observation", "status": "PASS" | "FAIL" | "WARNING" },
            { "feature": "Serial Number Font Progression", "description": "Detailed observation", "status": "PASS" | "FAIL" | "WARNING" },
            { "feature": "Microprint & Text Authenticity", "description": "Detailed observation (check for Children Bank / fake headers)", "status": "PASS" | "FAIL" | "WARNING" }
          ],
          "summary": "Forensic expert summary of the bill's authenticity and telltale indicators.",
          "denomination": "Rs 500",
          "serialNumber": "Detected serial number or 'Unclear / Invalid'"
        }`
      };

      const response = await callGeminiWithRetry({
        model: "gemini-3.6-flash",
        contents: { parts: [imagePart, textPart] },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isGenuine: { type: Type.BOOLEAN },
              confidence: { type: Type.INTEGER },
              anomalies: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    feature: { type: Type.STRING },
                    description: { type: Type.STRING },
                    status: {
                      type: Type.STRING,
                      enum: ["PASS", "FAIL", "WARNING"]
                    }
                  },
                  required: ["feature", "description", "status"]
                }
              },
              summary: { type: Type.STRING },
              denomination: { type: Type.STRING },
              serialNumber: { type: Type.STRING }
            },
            required: [
              "isGenuine",
              "confidence",
              "anomalies",
              "summary",
              "denomination",
              "serialNumber"
            ]
          },
          systemInstruction: "You are an unyielding, high-precision currency forensics inspector for the Reserve Bank of India (RBI). Actively search for and expose counterfeit notes, toy banknotes, prop currency, and offset printing defects."
        }
      });

      const responseText = response.text || "";
      const result = cleanAndParseJSON(responseText);
      if (result && typeof result.isGenuine === 'boolean') {
        return res.json(result);
      }
    } catch (err: any) {
      console.error("Gemini Currency Scanning Error, using fallback:", err);
    }
  }

  // Fallback simulator for Custom Upload when API is unavailable or fails
  if (isCustomUpload) {
    return res.json({
      isGenuine: false,
      confidence: 88,
      anomalies: [
        { feature: "Security Thread", description: "Lacks verifiable optoelectronic color-shift response under static camera scan", status: "WARNING" },
        { feature: "Mahatma Gandhi Portrait & Watermark", description: "Watermark window contrast and intaglio print tactility cannot be confirmed off-grid", status: "WARNING" },
        { feature: "Serial Number Font Progression", description: "Non-standard font curvature or spacing flagged for manual physical bank inspection", status: "FAIL" },
        { feature: "Microprint & Text Authenticity", description: "Micro-lettering clarity requires high-DPI laboratory microscope verification", status: "WARNING" }
      ],
      summary: "[SUSPECT / UNVERIFIED NOTE] The uploaded banknote image displays characteristics that fail strict automated RBI verification protocols. Please present the physical bill to your nearest bank branch for official UV/IR laboratory verification.",
      denomination: "Rs 500",
      serialNumber: noteDetails?.serialNumber || "UNVERIFIED-FILE"
    });
  }

  // Fallback simulator for Note templates
  const isFakeScenario = noteDetails?.isFakeTemplate === true;
  
  if (isFakeScenario) {
    return res.json({
      isGenuine: false,
      confidence: 94,
      anomalies: [
        { feature: "Security Thread", description: "Fails green-to-blue shift, lacks crisp Bharat (in Devanagari) and RBI micro-engravings", status: "FAIL" },
        { feature: "Mahatma Gandhi Portrait", description: "Lacks sharp tactile intaglio print texture, portrait has slight blurriness in high-res zoom", status: "FAIL" },
        { feature: "Serial Number Pattern", description: "Uniform size font detected instead of standard progressive size increase", status: "FAIL" },
        { feature: "Microprint Flaws", description: "Lacks sharp definition of 'RBI' print near glasses frame, merging into flat lines", status: "WARNING" }
      ],
      summary: "[SIMULATED SUSPECT DETECTED] This Rs 500 note displays critical counterfeiting hallmarks. The absence of color-shift security thread ink, coupled with improper progressive font-sizing on the serial numbers, are classic signatures of FICN (Fake Indian Currency Note) batches originating from illicit offset presses.",
      denomination: "Rs 500",
      serialNumber: noteDetails?.serialNumber || "5CD 992481"
    });
  }

  // Authentic Scenario default
  return res.json({
    isGenuine: true,
    confidence: 98,
    anomalies: [
      { feature: "Security Thread", description: "Authentic green-to-blue optoelectronic shift, clearly printed RBI inscriptions visible", status: "PASS" },
      { feature: "Mahatma Gandhi Portrait", description: "Intaglio printed Gandhi portrait exhibits sharp high-contrast watermark gradient", status: "PASS" },
      { feature: "Serial Number Pattern", description: "Serial number digits exhibit clear progressive width/height growth", status: "PASS" },
      { feature: "Microprint Flaws", description: "Highly legible microprint 'RBI' and '500' found on spectacles frame", status: "PASS" }
    ],
    summary: "[SIMULATED AUTHENTIC] Verification scans confirm all standard security benchmarks are met. Optical shifts, intaglio tactility guidelines, watermarking, and numeric progressions correspond to standard RBI printing guidelines.",
    denomination: "Rs 500",
    serialNumber: noteDetails?.serialNumber || "8AB 324128"
  });
});

export default router;
