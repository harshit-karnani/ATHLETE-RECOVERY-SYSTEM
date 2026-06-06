import 'dotenv/config';
import { runFullAnalysis } from './src/services/analysisService';
import { mockAthletes, logPresets } from './src/mockData';

// Polyfill fetch and import.meta.env for the Node environment
global.fetch = fetch;
(global as any).import = { meta: { env: { VITE_GEMINI_API_KEY: process.env.VITE_GEMINI_API_KEY } } };

async function test() {
  console.log("Running full analysis...");
  const athlete = mockAthletes[0];
  const log = logPresets[athlete.id][0].log;
  const result = await runFullAnalysis(athlete, log);
  console.log("Source:", result.source);
  console.log("Fallback Reason:", result.fallbackReason);
  console.log("Raw AI:", JSON.stringify(result.aiRaw).substring(0, 200));
}

test();
