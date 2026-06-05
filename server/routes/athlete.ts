import express from 'express';
import type { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const router = express.Router();

// Initialize Gemini client (assumes GEMINI_API_KEY is in env)
const ai = new GoogleGenAI({});

/**
 * PHASE 1 — Deterministic Red Flag Gateway
 * 
 * Deterministic Gateway — zero LLM cost, zero latency. 
 * Protects athlete safety and API budget. 
 * Judges: this fires before any AI inference.
 * 
 * Checks for high pain level or critical keywords in the transcript.
 */
function checkRedFlags(transcript: string, manualData: { pain_level: number }) {
  const criticalKeywords = ["pop", "snap", "numbness", "tingling", "cannot bear weight", "dizzy"];
  const transcriptLower = transcript.toLowerCase();
  
  let triggered = false;
  let flags: string[] = [];

  if (manualData.pain_level >= 8) {
    triggered = true;
    flags.push(`pain_level=${manualData.pain_level}`);
  }

  for (const kw of criticalKeywords) {
    if (transcriptLower.includes(kw)) {
      triggered = true;
      flags.push(`keyword="${kw}"`);
    }
  }

  if (triggered) {
    return {
      risk_level: "CRITICAL",
      medical_referral_required: true,
      training_adjustment: "IMMEDIATE CESSATION OF ALL ATHLETIC ACTIVITY. SEEK MEDICAL ATTENTION.",
      flags_triggered: flags,
      rag_used: false,
      llm_used: false
    };
  }

  return null;
}

/**
 * Mock Data Fallback
 * Used if the Firestore collection `rehab_protocols` is unseeded or empty.
 */
function getMockProtocol(primary_location: string) {
  const location = primary_location.toLowerCase();
  const protocols: Record<string, any> = {
    hamstring: {
      protocol_name: "Hamstring Eccentric Load Protocol",
      protocol_text: "Nordic hamstring curls 3x6 at 60% effort, eccentric focus. No sprint acceleration above 70% max velocity for 48h minimum. Contrast bath 10 min. Source: Norwegian School of Sport Sciences rehab protocol v3."
    },
    knee: {
      protocol_name: "ACL Return-to-Play Protocol",
      protocol_text: "Single-leg squat progression, closed-chain only. No cutting movements for 72h. Quad/hamstring ratio assessment required before return. Source: FIFA Medical Centre of Excellence protocol."
    },
    ankle: {
      protocol_name: "Lateral Ankle Sprain Management",
      protocol_text: "RICE for first 24h. Proprioception board work 3x2 min. No full weight-bearing sprints until 5/5 strength on inversion test. Source: National Sports Institute ankle protocol v2."
    },
    shoulder: {
      protocol_name: "Rotator Cuff Load Management",
      protocol_text: "Isometric holds at 30 degrees abduction, 3x30s. No overhead throwing for 48h. Posterior capsule stretch 2x60s. Source: ASPETAR shoulder protocol."
    }
  };
  const key = Object.keys(protocols).find(k => location.includes(k));
  return key ? protocols[key] : {
    protocol_name: "General Soft Tissue Protocol",
    protocol_text: "Active rest, avoid aggravating movements for 24h. Gentle range-of-motion work. Reassess in 48h. If pain persists, refer to physiotherapist."
  };
}

/**
 * PHASE 2 — RAG Context Fetcher
 * 
 * Step 2a: Symptom Parsing using Gemini structured output.
 * Step 2b: Generate embeddings and fetch top 2 vector matches from Firestore.
 */
async function fetchVectorContext(symptoms: { transcript: string }) {
  // Step 2a — Symptom Parsing via Prompt A (Gemini call #1)
  const promptA = `You are a clinical sports medicine intake parser. Extract structured symptom data from the athlete's transcript. Return ONLY a valid JSON object with exactly these fields:
{
  "primary_location": "anatomical location as a string",
  "pain_type": "one of: sharp, dull, aching, tightness, burning, throbbing",
  "onset": "one of: sudden, gradual",
  "duration_days": integer
}
Return nothing else. No explanation. No markdown. Raw JSON only.`;

  const parsingResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ role: 'user', parts: [{ text: symptoms.transcript }] }],
    config: {
      systemInstruction: promptA,
      responseMimeType: 'application/json',
    }
  });

  const parsedText = parsingResponse.text;
  if (!parsedText) throw new Error("Symptom parsing failed: No response text");
  
  const parsedSymptoms = JSON.parse(parsedText);

  // Step 2b — Firestore Vector Search
  const queryStr = `${parsedSymptoms.primary_location} ${parsedSymptoms.pain_type}`;
  let retrievedProtocols: any[] = [];

  try {
    const embedResponse = await ai.models.embedContent({
      model: 'text-embedding-004',
      contents: queryStr
    });
    
    // Check values from generated embeddings
    const embedding = embedResponse.embeddings?.[0]?.values;

    if (!embedding) {
      throw new Error("Failed to generate embedding");
    }

    const db = admin.firestore();
    const vectorQuery = db.collection('rehab_protocols')
      .findNearest('embedding', FieldValue.vector(embedding), {
        limit: 2,
        distanceMeasure: 'COSINE'
      });

    const snapshot = await vectorQuery.get();
    
    if (snapshot.empty) {
      console.log("Vector DB unseeded, falling back to mock protocol");
      retrievedProtocols.push(getMockProtocol(parsedSymptoms.primary_location));
    } else {
      snapshot.forEach(doc => {
        const data = doc.data();
        retrievedProtocols.push({
          protocol_name: data.protocol_name,
          protocol_text: data.protocol_text
        });
      });
    }
  } catch (err) {
    console.warn("RAG vector query failed — falling back to mock protocols", err);
    retrievedProtocols.push(getMockProtocol(parsedSymptoms.primary_location));
  }

  return { parsedSymptoms, retrievedProtocols };
}

/**
 * Step 2c — Build RAG Context String
 * Formats the retrieved protocols into a strict instruction set for the final prompt.
 */
function buildRAGContext(retrievedProtocols: any[]) {
  let contextStr = "RETRIEVED CLINICAL PROTOCOLS FROM LOCAL DATABASE — USE THESE EXCLUSIVELY FOR REHAB RECOMMENDATIONS:\n\n";
  retrievedProtocols.forEach((p, idx) => {
    contextStr += `Protocol ${idx + 1}: ${p.protocol_name}\n${p.protocol_text}\n\n`;
  });
  contextStr += "INSTRUCTION: Only recommend exercises and recovery methods explicitly stated in the above protocols. Do not generate medical advice beyond what is written here.";
  return contextStr;
}

/**
 * PHASE 3 — Master Inference (Gemini call #2)
 * Bundles the baseline data, parsed symptoms, and RAG context into a massive prompt.
 */
async function callGeminiInference(bundle: any) {
  const { athleteBaseline, transcript, manualData, parsedSymptoms, ragContext } = bundle;

  const userMessage = `ATHLETE BASELINE DATA:
Name: ${athleteBaseline?.name || 'Unknown'}
Sport: ${athleteBaseline?.sport || 'Unknown'}
Training Phase: ${athleteBaseline?.training_phase || 'Unknown'}
Recent HRV (7-day avg): ${athleteBaseline?.hrv_avg || 'N/A'}ms
Recent Sleep (7-day avg): ${athleteBaseline?.sleep_avg || 'N/A'}h
Recent RPE (7-day avg): ${athleteBaseline?.rpe_avg || 'N/A'}

TODAY'S CHECK-IN:
Raw Transcript: ${transcript}
Pain Level (self-reported): ${manualData.pain_level}/10
Parsed Primary Location: ${parsedSymptoms.primary_location}
Parsed Pain Type: ${parsedSymptoms.pain_type}
Onset: ${parsedSymptoms.onset}
Duration: ${parsedSymptoms.duration_days} days

${ragContext}`;

  const systemPrompt = `You are PUNARVA, an elite AI sports medicine analyst embedded in a professional athlete performance system. You receive athlete biometric baselines, today's symptoms, and pre-retrieved clinical protocols from a curated local database.

Your job is to produce a structured injury risk analysis and recovery plan.

CRITICAL RULE: The recovery_protocol and training_adjustment fields in your response MUST only contain exercises, methods, and recommendations that appear verbatim or near-verbatim in the RETRIEVED CLINICAL PROTOCOLS provided. Do not invent medical protocols. Do not generalize. If the protocol says "Nordic hamstring curls 3x6", you say "Nordic hamstring curls 3x6".

Return ONLY a valid JSON object with exactly these fields:
{
  "risk_level": "one of: LOW, MODERATE, HIGH",
  "injury_probability_score": float between 0.0 and 1.0,
  "primary_concern": "one sentence clinical summary",
  "contributing_factors": ["array of strings"],
  "recovery_protocol": "pulled directly from retrieved protocols",
  "training_adjustment": "specific load modification for next 24-48h",
  "monitoring_flags": ["array of symptoms to watch for"],
  "rag_used": true,
  "llm_used": true
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ role: 'user', parts: [{ text: userMessage }] }],
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: 'application/json',
    }
  });

  const parsedRes = JSON.parse(response.text || '{}');
  return parsedRes;
}

// ─── POST /api/athlete/daily-checkin ────────────────────────────────────
router.post('/daily-checkin', async (req: Request, res: Response): Promise<void> => {
  try {
    const { transcript, pain_level, athleteId } = req.body;

    if (!transcript || typeof pain_level !== 'number') {
      res.status(400).json({ error: 'transcript and pain_level required' });
      return;
    }

    // Phase 1: Deterministic Red Flag Gateway
    const redFlagResult = checkRedFlags(transcript, { pain_level });
    if (redFlagResult) {
      res.json(redFlagResult);
      return;
    }

    // Phase 2: RAG Pipeline Context Fetching
    const { parsedSymptoms, retrievedProtocols } = await fetchVectorContext({ transcript });
    
    // Phase 2c: Build RAG Context String
    const ragContext = buildRAGContext(retrievedProtocols);

    // Fetch athlete baseline from Firestore
    let athleteBaseline: any = null;
    try {
      if (athleteId) {
        const db = admin.firestore();
        const doc = await db.collection('athletes').doc(athleteId).get();
        if (doc.exists) {
          athleteBaseline = doc.data();
        }
      }
    } catch (err) {
      console.warn("Failed to fetch athlete baseline", err);
    }

    // Phase 3: Master Inference
    const bundle = {
      athleteBaseline,
      transcript,
      manualData: { pain_level },
      parsedSymptoms,
      ragContext
    };

    const finalAnalysis = await callGeminiInference(bundle);
    
    res.json(finalAnalysis);
  } catch (err) {
    console.error("Error in daily-checkin route:", err);
    res.status(500).json({ error: 'daily_checkin_failed', message: err instanceof Error ? err.message : String(err) });
  }
});

export default router;
