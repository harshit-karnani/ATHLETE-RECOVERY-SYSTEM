import express from 'express';
import type { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();

// Initialize Supabase safely
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Gemini
const gemini = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });

// ==========================================
// PHASE 1: Deterministic Red Flag Gateway
// ==========================================
const checkRedFlags = (transcript: string, painLevel: number) => {
  const criticalKeywords = ["pop", "snap", "numbness", "cannot bear weight", "tingling"];
  const lowerTranscript = transcript.toLowerCase();
  
  const hasCriticalKeyword = criticalKeywords.some(kw => lowerTranscript.includes(kw));
  
  if (painLevel >= 8 || hasCriticalKeyword) {
    return {
      risk_level: "CRITICAL",
      injury_probability_score: 0.99,
      primary_concern: "Potential structural damage or severe acute injury detected.",
      recovery_protocol: "IMMEDIATE CESSATION OF ALL ACTIVITY. Please consult team medical staff or visit an emergency room immediately.",
      training_adjustment: "RESTRICTED (0% LOAD). Do not train until cleared by a physician.",
      monitoring_flags: ["Severe Pain", "Red Flag Symptoms"]
    };
  }
  return null;
};

// ==========================================
// PHASE 4 FALLBACK: Structural Mock Protocol
// ==========================================
const getMockProtocol = (location: string) => {
  const loc = location.toLowerCase();
  if (loc.includes('hamstring')) return "Nordic curls 3x6, avoid sprinting for 48h.";
  if (loc.includes('knee') || loc.includes('patella')) return "Heavy slow resistance leg press 3x10, avoid deep flexion.";
  if (loc.includes('ankle')) return "BOSU ball proprioception 3x1 min, strict RICE.";
  return "Standard load management: 50% volume reduction, active mobility.";
};

router.post('/daily-checkin', async (req: Request, res: Response): Promise<void> => {
  try {
    const { transcript, pain_level } = req.body;

    if (!transcript || pain_level === undefined) {
      res.status(400).json({ error: "Missing transcript or pain_level" });
      return;
    }

    // --- PHASE 1: Gateway (Latency: <5ms) ---
    const redFlagPayload = checkRedFlags(transcript, pain_level);
    if (redFlagPayload) {
      console.log("🚩 RED FLAG GATEWAY TRIGGERED - Short-circuiting LLM");
      res.json(redFlagPayload);
      return;
    }

    // --- PHASE 2: Feature Extraction & Vectorization ---
    const extractionPrompt = `Extract the primary injured body part and the pain type from this transcript. Return ONLY a JSON object like {"primary_location": "left hamstring", "pain_type": "sharp"}.\nTranscript: "${transcript}"`;
    
    let parsedSymptoms = { primary_location: "unknown", pain_type: "unknown" };
    try {
      const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: extractionPrompt,
        config: { responseMimeType: "application/json" }
      });
      const text = response.text || "{}";
      parsedSymptoms = JSON.parse(text);
    } catch (e: any) {
      console.warn("Failed to parse symptoms with Gemini, using defaults.", e.message);
    }

    // Generate Vector Embedding (Gemini text-embedding-004 uses 768 dims)
    let symptomVector: number[] = [];
    try {
      const embedResponse = await gemini.models.embedContent({
        model: 'text-embedding-004',
        contents: JSON.stringify(parsedSymptoms)
      });
      symptomVector = embedResponse.embeddings?.[0]?.values || new Array(768).fill(0.1);
    } catch (e: any) {
      console.warn("Embedding API failed, using mock vector.", e.message);
      symptomVector = new Array(768).fill(0.1);
    }

    // --- PHASE 3: Semantic Cache (Latency: ~50ms) ---
    if (symptomVector.length > 0) {
      try {
        const { data: cacheHits, error: cacheError } = await supabase.rpc('match_inferences', {
          query_embedding: symptomVector,
          match_threshold: 0.95, // 95% similarity match
          match_count: 1
        });

        if (!cacheError && cacheHits && cacheHits.length > 0) {
          console.log("⚡ SEMANTIC CACHE HIT! Bypassing Master LLM.");
          const cachedData = cacheHits[0].generated_response;
          res.json({
            ...cachedData,
            _metadata: { source: "historical_pattern_cache", latency_optimized: true, similarity: cacheHits[0].similarity }
          });
          return;
        }
      } catch (e: any) {
        console.warn("Cache search failed, proceeding to RAG.", e.message);
      }
    }

    // --- PHASE 4: RAG Context Retrieval ---
    let clinicalContext = "";
    if (symptomVector.length > 0) {
      try {
        const { data: ragHits, error: ragError } = await supabase.rpc('match_protocols', {
          query_embedding: symptomVector,
          match_threshold: 0.5,
          match_count: 2
        });
          
        if (!ragError && ragHits && ragHits.length > 0) {
          clinicalContext = ragHits.map((d: any) => JSON.stringify(d)).join("\n");
        }
      } catch (e: any) {
        console.warn("RAG query failed, falling back to structural mock protocol.", e.message);
      }
    }

    // Explicit Fallback if RAG is empty/failed
    if (!clinicalContext) {
      clinicalContext = getMockProtocol(parsedSymptoms.primary_location);
    }

    // --- PHASE 5: Master Inference & Cache Write ---
    const masterPrompt = `
      You are an elite sports medicine AI. Analyze the athlete's daily check-in.
      
      Athlete Symptoms: ${JSON.stringify(parsedSymptoms)}
      Raw Transcript: "${transcript}"
      Pain Level: ${pain_level}/10
      
      CLINICAL KNOWLEDGE BASE (RAG PROTOCOLS):
      ${clinicalContext}
      
      STRICT REQUIREMENT: Only recommend recovery methods explicitly stated in the Clinical Knowledge Base provided above. Do not hallucinate external medical advice.
      
      Return ONLY a JSON object with this exact structure:
      {
        "risk_level": "LOW|MODERATE|HIGH",
        "injury_probability_score": 0.0-1.0,
        "primary_concern": "string",
        "recovery_protocol": "string",
        "training_adjustment": "string",
        "monitoring_flags": ["string"]
      }
    `;

    let finalPayload: any;
    try {
      const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: masterPrompt,
        config: { responseMimeType: "application/json" }
      });
      const text = response.text || "{}";
      finalPayload = JSON.parse(text);
    } catch (e: any) {
      console.error("Master Inference LLM failed explicitly:", e);
      finalPayload = {
        risk_level: "MODERATE",
        injury_probability_score: 0.65,
        primary_concern: "Possible soft tissue strain based on fallback diagnosis.",
        recovery_protocol: clinicalContext,
        training_adjustment: "Reduce load by 50%. Proceed with caution.",
        monitoring_flags: ["Persistent Pain", "API Offline Mode"]
      };
    }

    // Send response to client instantly
    res.json(finalPayload);

    // THE LOOP BACK: Asynchronous Cache Write
    if (symptomVector.length > 0 && !finalPayload.error && !finalPayload.monitoring_flags?.includes("API Offline Mode")) {
      supabase.from('historical_inferences').insert({
        embedding: symptomVector,
        parsed_symptoms: parsedSymptoms,
        generated_response: finalPayload
      }).then(({ error }) => {
        if (error) console.warn("Background cache write failed:", error.message);
      });
    }

  } catch (error) {
    console.error('Error in daily-checkin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
