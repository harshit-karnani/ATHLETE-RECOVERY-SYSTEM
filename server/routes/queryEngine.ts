import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';
import { supabaseAdmin } from '../supabaseClient.ts';
import { syncDeviceData } from '../services/wearableSync.ts';

const router = Router();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Embedding models in priority order (fallback chain)
const EMBED_MODELS = ['gemini-embedding-001', 'gemini-embedding-2'];

async function generateEmbedding(text: string): Promise<number[]> {
  let lastError: any = null;
  for (const model of EMBED_MODELS) {
    try {
      const response = await ai.models.embedContent({
        model,
        contents: text,
        config: { outputDimensionality: 768 }
      });
      const values = response.embeddings?.[0]?.values;
      if (values && values.length === 768) {
        console.log(`[Embed] Success with ${model}`);
        return values;
      }
    } catch (err: any) {
      console.warn(`[Embed] ${model} failed: ${err.message}`);
      lastError = err;
    }
  }
  throw lastError || new Error('All embedding models failed');
}

// Retry wrapper for transient 503 errors
async function retryGenerate(fn: () => Promise<any>, maxRetries = 3): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      const is503 = err.status === 503 || err.message?.includes('503') || err.message?.includes('UNAVAILABLE');
      if (is503 && attempt < maxRetries) {
        const delay = attempt * 2000;
        console.warn(`[Retry] Attempt ${attempt}/${maxRetries} failed (503). Waiting ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      throw err;
    }
  }
}

router.post('/', async (req, res) => {
  try {
    const { athleteId, parsedData, queryText } = req.body;

    if (!athleteId) {
      return res.status(400).json({ error: 'athleteId is required' });
    }

    // Phase 3: Wearable Sync Injection
    const wearableData = await syncDeviceData(athleteId);

    const dailyBundle = {
      parsedData,
      wearableData,
      queryText: queryText || ''
    };

    const searchString = JSON.stringify(dailyBundle);

    // Generate 768-dim embedding with model fallback
    const query_embedding = await generateEmbedding(searchString);

    // Retrieve from Supabase using the ACTUAL RPC functions defined in supabase_schema.sql:
    //   1. match_protocols  — searches rehab_protocols table
    //   2. match_inferences — searches historical_inferences table (semantic cache)
    const [protocolsRes, inferencesRes] = await Promise.all([
      supabaseAdmin.rpc('match_protocols', {
        query_embedding,
        match_threshold: 0.1,
        match_count: 3
      }),
      supabaseAdmin.rpc('match_inferences', {
        query_embedding,
        match_threshold: 0.1,
        match_count: 3
      })
    ]);

    if (protocolsRes.error) console.error("match_protocols error:", protocolsRes.error);
    if (inferencesRes.error) console.error("match_inferences error:", inferencesRes.error);

    const chunks = {
      clinical_protocols: protocolsRes.data || [],
      historical_inferences: inferencesRes.data || []
    };

    // Master Inference with Gemini 2.5 Flash (with retry on 503)
    const systemPrompt = `You are the PUNARVA Master Inference Engine.
Evaluate the athlete's daily bundle against the retrieved clinical RAG chunks.
Nutrition Logic Rules:
- Tendon/Tendinopathy: "15g Collagen + 500mg Vit C, 45 mins before loading."
- Strain/Muscle: "35g Whey Isolate + 5g Tart Cherry Juice."
- Sprain/Ligament: "3g EPA/DHA Omega-3 + 500mg Bromelain."
- Blood/Systemic: Base recommendation on flagged biomarkers.

Constraint: Force a structured JSON output exactly matching this schema:
{
  "risk_level": "CRITICAL" | "HIGH_RISK" | "MODERATE" | "STABLE",
  "suggestions": string[],
  "drills": string[],
  "nutrition": string,
  "citation": string
}
Do NOT output markdown wrappers like \`\`\`json. Return only minified JSON.`;

    const promptText = `
Daily Bundle:
${JSON.stringify(dailyBundle, null, 2)}

Retrieved Clinical Protocols:
${JSON.stringify(chunks, null, 2)}
    `;

    const inferenceResponse = await retryGenerate(() =>
      ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptText,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.0,
          responseMimeType: "application/json"
        }
      })
    );

    const rawOutput = inferenceResponse.text || '';
    const cleanOutput = rawOutput.replace(/```json|```/g, '').trim();

    try {
      const parsedOutput = JSON.parse(cleanOutput);

      // Save this inference to historical_inferences for future semantic cache hits
      const inferenceEmbedding = await generateEmbedding(cleanOutput);
      await supabaseAdmin.from('historical_inferences').insert({
        parsed_symptoms: dailyBundle,
        generated_response: parsedOutput,
        embedding: inferenceEmbedding
      });

      res.json(parsedOutput);
    } catch (err) {
      console.error("Master inference JSON parse error", cleanOutput);
      res.status(500).json({ error: 'Failed to parse inference output' });
    }

  } catch (error: any) {
    console.error("QueryEngine Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
