/**
 * Client-side API service for PuNarva AI analysis.
 *
 * Calls the Express backend which proxies to Claude.
 * Falls back to the local deterministic engine when the API is unavailable.
 */

import { generateRecoveryReport } from '../engine';
import type { Athlete, TodayLog, RecoveryReport } from '../types';
import { callGeminiAPI } from './api';
import { saveSessionData, saveInjuryRecord } from './db';


// ─── Types for AI response ──────────────────────────────────────

export interface AIAnalysisResult {
  /** Full AI response or adapted local engine report */
  report: RecoveryReport;
  /** Where the analysis came from */
  source: 'ai' | 'local';
  /** Raw AI response (null if local) */
  aiRaw: Record<string, unknown> | null;
  /** Error message if fallback was used */
  fallbackReason?: string;
}

export interface StructuredSymptoms {
  primary_location: string;
  secondary_locations: string[];
  pain_level: number;
  pain_type: 'tightness' | 'sharp' | 'dull' | 'fatigue' | 'none';
  duration_days: number | null;
  functional_impact: 'none' | 'minor' | 'significant';
  athlete_language: string;
}

// ─── Prompt A — Symptom Extraction ──────────────────────────────

export async function extractSymptoms(
  transcript: string,
  athleteName: string,
  knownInjurySites: string[]
): Promise<{ structured_symptoms: StructuredSymptoms }> {
  const payload = `MODE: SYMPTOM_EXTRACTION
Athlete: ${athleteName}
Known Injury Sites: ${knownInjurySites.length ? knownInjurySites.join(', ') : 'None'}
Raw Transcript: "${transcript}"`;

  const aiResult = await callGeminiAPI(payload);
  
  // The API returns the exact fields we asked for, we just wrap it in structured_symptoms for the frontend
  return {
    structured_symptoms: {
      primary_location: aiResult.primary_site || 'none',
      secondary_locations: aiResult.secondary_sites || [],
      pain_level: aiResult.pain_level || 0,
      pain_type: aiResult.pain_type || 'none',
      duration_days: null,
      functional_impact: aiResult.pain_level >= 5 ? 'significant' : aiResult.pain_level >= 2 ? 'minor' : 'none',
      athlete_language: aiResult.raw_quote || transcript.substring(0, 50)
    }
  };
}

// ─── Prompt B — Full Analysis with Fallback ─────────────────────

export async function runFullAnalysis(
  athlete: Athlete,
  log: TodayLog
): Promise<AIAnalysisResult> {
  const localReport = generateRecoveryReport(athlete, log);

  const payload = `MODE: FULL_RECOVERY_ANALYSIS

Athlete: ${athlete.name}, ${athlete.age}yo, ${athlete.sport}, ${athlete.position}
Training Phase: in_season
Date: ${new Date().toISOString().slice(0,10)}

Extracted Symptoms (from Mode A):
Primary: ${log.symptomLocation !== 'None' ? log.symptomLocation : 'none'}
Pain Level: ${log.painLevel}/10
Transcript: "${log.symptomTranscript}"

Biometrics:
- Sleep last night: ${log.sleepHours}h
- Resting HR: ${log.restingHeartRate} bpm
- HRV delta from personal baseline: ${log.hrvDelta}ms
- RPE yesterday: ${log.rpePrevious}/10
- Mental stress: ${log.mentalStress}/10
- Mood: ${log.mood}/10
- Hydration: ${log.hydration}L
- Protein: ${log.protein}g

Personal Baseline (30-day rolling averages):
- Sleep: ${athlete.baseline.sleep}h
- Resting HR: ${athlete.baseline.restingHeartRate} bpm
- HRV delta: 0ms

Last 7 Recovery Scores: [${athlete.history7Days.join(', ')}]

Injury History:
${athlete.injuryHistory.map(i =>
  `${i.date} — ${i.anatomicalSite}, ${severityToGrade(i.severity)}. Lead-up: ${i.leadUpConditions ? JSON.stringify(i.leadUpConditions) : 'N/A'}. Resolved: ${i.resolved || 'Pending'}`
).join('\n')}`;

  try {
    const aiResponse = await callGeminiAPI(payload);
    const adaptedReport = adaptAIResponse(aiResponse, localReport);

    // Save the fully structured session to Firebase (Step 2 integration)
    const todayStr = new Date().toISOString().split('T')[0];
    await saveSessionData(athlete.id, todayStr, {
      log: log,
      ai_analysis: aiResponse,
      timestamp: new Date().toISOString()
    });

    return {
      report: adaptedReport,
      source: 'ai',
      aiRaw: aiResponse,
    };
  } catch (err) {
    console.warn('AI analysis unavailable, using local engine:', err);
    return {
      report: localReport,
      source: 'local',
      aiRaw: null,
      fallbackReason: err instanceof Error ? err.message : 'Network error — AI unavailable',
    };
  }
}

// ─── Prompt C — Team Summary ────────────────────────────────────

export interface TeamSummaryResult {
  team_readiness_score: number;
  high_risk_count: number;
  not_logged_count: number;
  post_injury_window_count: number;
  flagged_athletes: Array<{
    athlete_id: string;
    athlete_name: string;
    risk_level: string;
    primary_flag: string;
    recommended_action: string;
  }>;
  team_pattern_note: string | null;
  week_on_week_change: 'Improving' | 'Stable' | 'Declining';
  coach_action_summary: string;
}

export async function getTeamSummary(
  teamAnalyses: Array<{
    athlete_id: string;
    athlete_name: string;
    metrics_analysis: { calculated_recovery_score: number };
    injury_risk: { risk_level: string; flag_reason: string };
    trend_summary: { direction: string };
  }>,
  coachId: string
): Promise<TeamSummaryResult> {
  const payload = `MODE: TEAM_SUMMARY

Team Name: Elite Track & Field
Date: ${new Date().toISOString().split('T')[0]}
Coach ID: ${coachId}

Roster Data:
${teamAnalyses.map(a => 
  `- ${a.athlete_name} (ID: ${a.athlete_id}): Score ${a.metrics_analysis.calculated_recovery_score}/100, Risk: ${a.injury_risk.risk_level}. Flag: ${a.injury_risk.flag_reason}. Trend: ${a.trend_summary.direction}`
).join('\n')}`;

  const aiResult = await callGeminiAPI(payload);
  
  return {
    team_readiness_score: aiResult.team_readiness_score || 0,
    high_risk_count: aiResult.high_risk_count || 0,
    not_logged_count: 0,
    post_injury_window_count: 0,
    flagged_athletes: (aiResult.flagged_athletes || []).map((f: any) => ({
      athlete_id: f.name.toLowerCase().replace(/ /g, '-'),
      athlete_name: f.name,
      risk_level: 'High',
      primary_flag: f.intervention_summary,
      recommended_action: f.session_modification
    })),
    team_pattern_note: aiResult.team_pattern || null,
    week_on_week_change: 'Stable',
    coach_action_summary: aiResult.coach_brief || 'Review flagged athletes.'
  };
}

// ─── Prompt D — Image & Report Vision Analysis ──────────────────

export interface ImageAnalysisResult {
  diagnosis: string;
  anatomical_site: string;
  severity: 'mild' | 'moderate' | 'severe';
  prescribed_rest_days: number;
  cleared_movements: string[];
  restricted_movements: string[];
  medications: string[];
  follow_up_date: string | null;
}

export async function analyzeImage(
  imageBase64: string | string[],
  imageType: 'injury_photo' | 'mri_scan' | 'medical_report_pdf',
  athleteId: string,
  injuryHistory: any[]
): Promise<ImageAnalysisResult> {
  const textPayload = `MODE: MEDICAL_DOCUMENT_ANALYSIS\n\nAthlete ID: ${athleteId}\nDocument Type: ${imageType}\nCurrent Injury History: ${injuryHistory.map(i => `${i.date} - ${i.anatomicalSite}`).join(', ') || 'None'}`;
  
  let payload: any = textPayload;
  
  if (imageBase64 && typeof imageBase64 === 'string' && imageBase64.startsWith('data:image')) {
    const base64Data = imageBase64.split(',')[1];
    const mediaType = imageBase64.split(';')[0].split(':')[1];
    payload = [
      { type: "image", source: { type: "base64", media_type: mediaType, data: base64Data } },
      { type: "text", text: textPayload }
    ];
  }

  const aiResult = await callGeminiAPI(payload);
  
  const record = aiResult.injury_records?.[0] || {};
  
  // Save the extracted injury record to Firebase (Step 5 integration)
  if (record.diagnosis) {
    await saveInjuryRecord(athleteId, record);
  }

  return {
    diagnosis: record.diagnosis || 'Unknown Condition',
    anatomical_site: record.anatomical_site || 'Unknown Site',
    severity: (record.grade_severity?.toLowerCase().includes('severe') ? 'severe' : record.grade_severity?.toLowerCase().includes('moderate') ? 'moderate' : 'mild') as any,
    prescribed_rest_days: record.recovery_duration_weeks ? record.recovery_duration_weeks * 7 : 7,
    cleared_movements: [],
    restricted_movements: record.restricted_movements || [],
    medications: [],
    follow_up_date: null
  };
}

// ─── Helpers ────────────────────────────────────────────────────


/**
 * Adapts the AI JSON response back into the RecoveryReport shape
 * that the existing UI components expect.
 */
function adaptAIResponse(
  ai: Record<string, any>,
  fallback: RecoveryReport
): RecoveryReport {
  try {
    // const risk = ai.injury_risk as Record<string, any> | undefined;
    const dims = ai.dimension_scores as Record<string, any> | undefined;

    return {
      sleepStatus: (ai.sleep_status as RecoveryReport['sleepStatus']) ?? fallback.sleepStatus,
      nervousSystemStatus: (ai.nervous_system_status as RecoveryReport['nervousSystemStatus']) ?? fallback.nervousSystemStatus,
      nutritionStatus: (ai.nutrition_status as RecoveryReport['nutritionStatus']) ?? fallback.nutritionStatus,
      mentalLoadStatus: (ai.mental_load_status as RecoveryReport['mentalLoadStatus']) ?? fallback.mentalLoadStatus,
      riskLevel: (ai.risk_level as RecoveryReport['riskLevel']) ?? fallback.riskLevel,
      patternMatch: {
        isMatch: (ai.pattern_matched as boolean) ?? fallback.patternMatch.isMatch,
        injuryName: (ai.matched_injury as string) ?? fallback.patternMatch.injuryName,
        injuryDate: fallback.patternMatch.injuryDate,
        reason: (ai.flag_reason as string) ?? fallback.patternMatch.reason,
      },
      riskExplanation: (ai.flag_reason as string) ?? fallback.riskExplanation,
      dimensions: {
        physiologicalLoad: (dims?.physiological_load as number) ?? fallback.dimensions.physiologicalLoad,
        sleepQuality: (dims?.sleep_quality as number) ?? fallback.dimensions.sleepQuality,
        muscleSoreness: (dims?.muscle_soreness as number) ?? fallback.dimensions.muscleSoreness,
        mentalStress: (dims?.mental_stress as number) ?? fallback.dimensions.mentalStress,
        nutritionStatus: (dims?.nutrition_status as number) ?? fallback.dimensions.nutritionStatus,
        historicalRisk: (dims?.historical_risk as number) ?? fallback.dimensions.historicalRisk,
      },
      directives: {
        trainingAdjustment: (ai.training_adjustment as string) ?? fallback.directives.trainingAdjustment,
        recoveryProtocol: (ai.recovery_protocol as string) ?? fallback.directives.recoveryProtocol,
        nutritionFocus: (ai.nutrition_focus as string) ?? fallback.directives.nutritionFocus,
        mentalRecovery: (ai.mental_recovery as string | undefined) ?? fallback.directives.mentalRecovery,
      },
      athleteMessage: (ai.athlete_message as string) ?? fallback.athleteMessage,
      trendInterpretation: {
        direction: (ai.trend_direction as RecoveryReport['trendInterpretation']['direction']) ?? fallback.trendInterpretation.direction,
        interpretation: (ai.trend_interpretation as string) ?? fallback.trendInterpretation.interpretation,
      },
      referralFlag: ai.referral_flag ? {
        required: !!ai.referral_flag.required,
        urgency: ai.referral_flag.urgency || 'routine',
        reason: ai.referral_flag.reason || '',
        suggestedSpecialist: ai.referral_flag.suggested_specialist || 'GP',
        whatToTellThem: ai.referral_flag.what_to_tell_them || '',
      } : fallback.referralFlag,
      rehabilitationPlan: ai.rehabilitation_plan ? {
        phase: ai.rehabilitation_plan.phase || 'acute',
        exercises: ai.rehabilitation_plan.exercises || [],
        progressionTrigger: ai.rehabilitation_plan.progression_trigger || '',
      } : fallback.rehabilitationPlan,
      extendedNutrition: ai.extended_nutrition ? {
        dailyCalorieTarget: ai.extended_nutrition.daily_calorie_target || 2000,
        priorityNutrients: ai.extended_nutrition.priority_nutrients || [],
      } : fallback.extendedNutrition,
      bodyRegionFlags: ai.body_region_flags ? (ai.body_region_flags as any[]).map(f => ({
        site: f.site || '',
        painLevel: f.pain_level || 0,
        riskContribution: f.risk_contribution || 'Low',
        note: f.note || ''
      })) : fallback.bodyRegionFlags,
    };
  } catch (err) {
    // If adaptation fails, return the local engine result
    console.warn('Failed to adapt AI response, using local engine result:', err);
    return fallback;
  }
}


function severityToGrade(severity: string): 'mild' | 'moderate' | 'severe' {
  const s = severity.toLowerCase();
  if (s.includes('grade ii') || s.includes('moderate')) return 'moderate';
  if (s.includes('grade iii') || s.includes('severe') || s.includes('rupture')) return 'severe';
  return 'mild';
}


