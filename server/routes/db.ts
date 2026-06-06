import express from 'express';
import { supabaseAdmin } from '../supabaseClient';

const router = express.Router();

// Save daily check-in session and AI report
router.post('/session', async (req, res) => {
  try {
    const { athleteId, dateStr, sessionData } = req.body;
    
    if (!athleteId || !dateStr || !sessionData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabaseAdmin
      .from('daily_sessions')
      .upsert({
        athlete_id: athleteId,
        date_str: dateStr,
        session_data: sessionData,
        created_at: new Date().toISOString()
      }, { onConflict: 'athlete_id,date_str' });

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error('Server error saving session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Save coach manual override
router.post('/override', async (req, res) => {
  try {
    const { athleteId, dateStr, overrideText } = req.body;

    if (!athleteId || !dateStr || !overrideText) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabaseAdmin
      .from('coach_overrides')
      .upsert({
        athlete_id: athleteId,
        date_str: dateStr,
        override_text: overrideText,
        created_at: new Date().toISOString()
      }, { onConflict: 'athlete_id,date_str' });

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error('Server error saving override:', error);
    res.status(500).json({ error: error.message });
  }
});

// Save injury record
router.post('/injury', async (req, res) => {
  try {
    const { athleteId, injuryData } = req.body;

    if (!athleteId || !injuryData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabaseAdmin
      .from('injury_records')
      .insert({
        athlete_id: athleteId,
        injury_data: injuryData,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error('Server error saving injury:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
