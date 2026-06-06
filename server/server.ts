import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import analysisRouter from './routes/analysis.ts';
import athleteRouter from './routes/athlete.ts';
import queryRouter from './routes/queryEngine.ts';
// Firebase Admin has been replaced with Supabase in athlete.ts


const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// ─── Middleware ──────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// ─── Health check ───────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    engine: 'punarva',
    version: '2.4',
    timestamp: new Date().toISOString(),
    api_key_set: !!(process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY),
  });
});

import dbRouter from './routes/db.ts';

// ─── Routes ─────────────────────────────────────────────────────
app.use('/api/analysis', analysisRouter);
app.use('/api/athlete', athleteRouter);
app.use('/api/query', queryRouter);
app.use('/api/db', dbRouter);

// ─── Start ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  const hasKey = !!(process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY);
  console.log(`\n  ┌──────────────────────────────────────┐`);
  console.log(`  │  PUNARVA ENGINE SERVER               │`);
  console.log(`  │  Port: ${PORT}                          │`);
  console.log(`  │  API Key: ${hasKey ? '✓ loaded' : '✗ MISSING'}                │`);
  console.log(`  └──────────────────────────────────────┘\n`);
});
