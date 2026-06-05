import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import analysisRouter from './routes/analysis.ts';
import athleteRouter from './routes/athlete.ts';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp();
  } catch (err) {
    console.warn("Firebase Admin Initialization Warning:", err);
  }
}


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
    api_key_set: !!process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'sk-ant-REPLACE_WITH_YOUR_KEY',
  });
});

// ─── Routes ─────────────────────────────────────────────────────
app.use('/api/analysis', analysisRouter);
app.use('/api/athlete', athleteRouter);

// ─── Start ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  ┌──────────────────────────────────────┐`);
  console.log(`  │  PUNARVA ENGINE SERVER               │`);
  console.log(`  │  Port: ${PORT}                          │`);
  console.log(`  │  API Key: ${process.env.ANTHROPIC_API_KEY ? '✓ loaded' : '✗ MISSING'}                │`);
  console.log(`  └──────────────────────────────────────┘\n`);
});
