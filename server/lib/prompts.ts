/**
 * Prompt builder functions for the four PuNarva prompt types.
 * Each function serialises its input into the JSON format
 * expected by the system prompt.
 */

// ─── Type Definitions ──────────────────────────────────────────

export interface StructuredSymptoms {
  primary_location: string;
  secondary_locations: string[];
  pain_level: number;
  pain_type: 'tightness' | 'sharp' | 'dull' | 'fatigue' | 'none';
  duration_days: number | null;
  functional_impact: 'none' | 'minor' | 'significant';
  athlete_language: string;
}

export interface InjuryRecord {
  injury_id: string;
  site: string;
  grade: 'mild' | 'moderate' | 'severe';
  date_of_injury: string;
  resolution_date: string | null;
  post_injury_window_active: boolean;
  weeks_post_return: number | null;
  source?: 'clinical' | 'medical_report';
  lead_up_fingerprint: {
    sleep_deficit_days: number;
    hrv_drop_ms: number;
    avg_rpe: number;
    site_mentioned_days: number;
  };
}

export interface DailyBundle {
  athlete: {
    id: string;
    name: string;
    sport: string;
    position: string;
    age: number;
    gender: 'male' | 'female';
    weight_kg: number;
    height_cm: number;
    days_of_data: number;
    training_phase: 'pre_season' | 'in_season' | 'off_season' | 'rehabilitation';
    baseline_mode: 'population' | 'personal';
  };
  today: {
    date: string;
    structured_symptoms: StructuredSymptoms;
    sleep_hours: number;
    resting_hr: number;
    hrv_ms: number;
    rpe_yesterday: number | null;
    mental_stress: number;
    mood: number;
    hydration_litres: number;
    protein_grams: number;
    nutrition_notes: string;
    data_completeness: 'full' | 'partial' | 'passive_only';
  };
  baseline: {
    sleep_30day_avg: number;
    resting_hr_30day_avg: number;
    hrv_30day_avg: number;
    hrv_delta_today: number;
    sleep_deficit_today: number;
  };
  last_7_days: Array<{
    date: string;
    recovery_score: number;
    rpe: number | null;
    risk_level: 'Low' | 'Medium' | 'High';
  }>;
  injury_history: InjuryRecord[];
}

export interface AthleteAnalysis {
  athlete_id: string;
  athlete_name: string;
  metrics_analysis: { calculated_recovery_score: number };
  injury_risk: { risk_level: string; flag_reason: string };
  trend_summary: { direction: string };
}

// ─── Prompt Builders ────────────────────────────────────────────

/**
 * Prompt A — Symptom extraction from voice transcript.
 * Returns the JSON input string that Claude expects.
 */
export function buildPromptA(transcript: string): string {
  return JSON.stringify({
    prompt_type: 'symptom_extraction',
    transcript,
  });
}

/**
 * Prompt B — Full daily recovery analysis.
 * The bundle must already contain structured_symptoms from Prompt A.
 */
export function buildPromptB(bundle: DailyBundle): string {
  return JSON.stringify({
    prompt_type: 'full_analysis',
    ...bundle,
  });
}

/**
 * Prompt C — Coach team summary.
 * Takes the array of individual athlete analyses from Prompt B.
 */
export function buildPromptC(
  team: AthleteAnalysis[],
  coach_id: string,
  date: string
): string {
  return JSON.stringify({
    prompt_type: 'team_summary',
    team,
    coach_id,
    date,
  });
}

/**
 * Prompt D — Medical report or scan image analysis (Claude Vision).
 */
export function buildPromptD(
  imageType: 'injury_photo' | 'mri_scan' | 'medical_report_pdf',
  athleteId: string,
  injuryHistory: InjuryRecord[]
): string {
  return JSON.stringify({
    prompt_type: 'image_analysis',
    image_type: imageType,
    athlete_id: athleteId,
    injury_history: injuryHistory,
  });
}
