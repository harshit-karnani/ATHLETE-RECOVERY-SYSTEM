import express from 'express';
import type { Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { PUNARVA_SYSTEM_PROMPT } from '../lib/systemPrompt.ts';
import { buildPromptA, buildPromptB, buildPromptC, buildPromptD } from '../lib/prompts.ts';
import type { DailyBundle, AthleteAnalysis, InjuryRecord } from '../lib/prompts.ts';

const router = express.Router();

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 2000;

// ─── POST /api/analysis/symptoms ────────────────────────────────
// Prompt A — extract symptoms from voice transcript
router.post('/symptoms', async (req: Request, res: Response): Promise<void> => {
  const { transcript } = req.body as { transcript?: string };

  if (!transcript) {
    res.status(400).json({ error: 'transcript required' });
    return;
  }

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: PUNARVA_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildPromptA(transcript) }],
    });

    const block = message.content[0];
    const text = block.type === 'text' ? block.text : '';
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (err) {
    console.error('Prompt A error:', err);
    res.status(500).json({ error: 'symptom_extraction_failed' });
  }
});

// ─── POST /api/analysis/daily ───────────────────────────────────
// Prompt B — full daily recovery analysis
router.post('/daily', async (req: Request, res: Response): Promise<void> => {
  const bundle = req.body as DailyBundle;

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: PUNARVA_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildPromptB(bundle) }],
    });

    const block = message.content[0];
    const text = block.type === 'text' ? block.text : '';
    const parsed = JSON.parse(text);

    // Validate critical fields before returning
    if (typeof parsed.metrics_analysis?.calculated_recovery_score !== 'number') {
      throw new Error('invalid_score_type: calculated_recovery_score is not a number');
    }
    if (!['Low', 'Medium', 'High'].includes(parsed.injury_risk?.risk_level)) {
      throw new Error('invalid_risk_level: ' + parsed.injury_risk?.risk_level);
    }

    res.json(parsed);
  } catch (err) {
    console.error('Prompt B error:', err);
    // Return fallback flag so client can use local engine
    res.status(500).json({ error: 'full_analysis_failed', use_fallback: true });
  }
});

// ─── POST /api/analysis/team ────────────────────────────────────
// Prompt C — coach team summary
router.post('/team', async (req: Request, res: Response): Promise<void> => {
  const { team, coach_id, date } = req.body as {
    team: AthleteAnalysis[];
    coach_id: string;
    date: string;
  };

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: PUNARVA_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildPromptC(team, coach_id, date) }],
    });

    const block = message.content[0];
    const text = block.type === 'text' ? block.text : '';
    res.json(JSON.parse(text));
  } catch (err) {
    console.error('Prompt C error:', err);
    res.status(500).json({ error: 'team_summary_failed' });
  }
});

// ─── POST /api/analysis/image ───────────────────────────────────
// Prompt D — image and PDF scan analysis using Claude Vision
router.post('/image', async (req: Request, res: Response): Promise<void> => {
  const { image_data, image_type, athlete_id, injury_history } = req.body as {
    image_data: string | string[];
    image_type: 'injury_photo' | 'mri_scan' | 'medical_report_pdf';
    athlete_id: string;
    injury_history: InjuryRecord[];
  };

  if (!image_data) {
    res.status(400).json({ error: 'image_data required' });
    return;
  }

  try {
    const contentBlocks: any[] = [];
    
    // 1. Text metadata block
    contentBlocks.push({
      type: 'text',
      text: buildPromptD(image_type, athlete_id, injury_history)
    });

    // 2. Image source blocks (handle single string or array of base64 strings)
    const images = Array.isArray(image_data) ? image_data : [image_data];
    
    for (const img of images) {
      const match = img.match(/^data:(image\/\w+);base64,(.+)$/);
      const media_type = match ? match[1] as any : 'image/png';
      const data = match ? match[2] : img;
      
      contentBlocks.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type,
          data
        }
      });
    }

    // Call Claude Vision
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: PUNARVA_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: contentBlocks }],
    });

    const block = message.content[0];
    const text = block.type === 'text' ? block.text : '';
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (err) {
    console.error('Prompt D error:', err);
    res.status(500).json({ error: 'image_analysis_failed' });
  }
});

export default router;
