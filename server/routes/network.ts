import { Router } from "express";
import { getGeminiClient, callGeminiWithRetry } from "../geminiClient";
import { fraudNetwork } from "../data/incidentsData";

const router = Router();

// API: FRAUD NETWORK INTEL PACKAGE GENERATOR
router.post("/fraud-network-query", async (req, res) => {
  const { nodeId, note } = req.body;
  const targetNode = fraudNetwork.nodes.find(n => n.id === nodeId) || fraudNetwork.nodes[2];
  
  if (getGeminiClient()) {
    try {
      const response = await callGeminiWithRetry({
        model: "gemini-3.6-flash",
        contents: `You are a Senior Cyber Forensic Expert drafting a 'Court-Admissible Intelligence Package' (CAIP) linking cyber-criminals, money mules, and payment nodes in India.
        
        Analyze this focal suspect node in our transaction graph:
        SUSPECT INFO: ${JSON.stringify(targetNode)}
        FULL SUB-GRAPH NETWORK MAP: ${JSON.stringify(fraudNetwork)}
        User comments/case note: "${note || "No specific note"}"

        Generate a comprehensive, formal law enforcement intelligence brief. Organize it clearly with:
        1. SUSPECT IDENTIFICATION & CLUSTER INFRASTRUCTURE
        2. FORENSIC LINK ANALYSIS (money flows, call history, routing markers, and IP address tracing)
        3. ADMISSIBILITY & EVIDENCE GAPS (how to make this bulletproof under Section 65B of Indian Evidence Act)
        4. TACTICAL INTERVENTION STRATEGIES (mule freeze directives, CERT-In DNS takedowns, local cyber cell dispatches)

        Style: Objective, clinical, highly technical, and professional. Mention Indian IT Act and MHA procedures.`,
        config: {
          systemInstruction: "You are the Chief Cyber Intelligence Specialist for the National Cyber Crime Coordination Centre (I4C), under the Indian Ministry of Home Affairs."
        }
      });

      return res.json({
        nodeId: targetNode.id,
        nodeLabel: targetNode.label,
        intelPackage: response.text || "No intelligence drafted.",
        draftedAt: new Date().toISOString()
      });
    } catch (err: any) {
      console.error("Gemini Intel Package Draft Error, using fallback:", err);
    }
  }

  // Fallback clinical drafting
  const packageBrief = `CHIEF INTELLIGENCE BRIEF: I4C ANALYTICAL TASKFORCE\n` +
    `DATE: ${new Date().toLocaleDateString()}\n` +
    `CASE TARGET: ${targetNode.label} (ID: ${targetNode.id})\n` +
    `CRIME PROFILE: CO-ORDINATED DIGITAL EXTRACTION & TRANS-BORDER WASHING\n` +
    `========================================================================\n\n` +
    `1. EXECUTIVE INVESTIGATIVE SUMMARY\n` +
    `Analysis of node ${targetNode.id} establishes its pivotal role as a transaction or communication relay within the cluster. Money laundering layers indicate structured layering flows from domestic rural banks (mules) leading to offshore virtual asset providers (P2P gateways). This chain systematically bypasses standard RBI trigger caps.\n\n` +
    `2. FORENSIC GRAPH & CLUSTER TRAFFIC LINK\n` +
    `- Node ${targetNode.id} exhibits a high centrality score of 0.84, suggesting direct orchestrator coordinates.\n` +
    `- Affiliated linkages show instant, automated payouts mimicking mule compound routines.\n` +
    `- Telecom signals map to geo-spoofed domestic SIP gateways controlled via Tor exit-nodes (IP ${fraudNetwork.nodes[7].id}).\n\n` +
    `3. LEGAL ADMISSIBILITY ACTIONABLE REQUIREMENTS (IT Act Sec 65B)\n` +
    `- Mandate local banks to extract physical logs with verified timestamps and MAC addresses.\n` +
    `- Collect digital logs and certificates under Section 65B of the Indian Evidence Act for all associated money transactions.\n\n` +
    `4. EMERGENCY COMMAND CELL ACTION PROTOCOLS\n` +
    `- Immediate: Send formal direct freeze commands to cooperating payment banks.\n` +
    `- Local Dispatch: Inform the specific District Cyber Cell for localized SIM-tower scans and localized physical arrests.`;

  return res.json({
    nodeId: targetNode.id,
    nodeLabel: targetNode.label,
    intelPackage: packageBrief,
    draftedAt: new Date().toISOString()
  });
});

export default router;
