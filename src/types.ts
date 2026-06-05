export interface PersonalBaseline {
  sleep: number; // hours
  restingHeartRate: number; // bpm
  hrvDelta: number; // ms rolling average (often 0 as reference)
}

export interface InjuryLeadUpConditions {
  sleepBelowBaseline?: number; // hours below baseline, e.g. 1.5
  hrvDeltaBelow?: number; // hrv delta below, e.g. -15
  rpeAbove?: number; // RPE above, e.g. 8
  mentalStressAbove?: number; // mental stress score above, e.g. 7
  symptomLocationMatch?: boolean;
}

export interface Injury {
  id: string;
  date: string;
  anatomicalSite: string;
  severity: string; // e.g., "Grade II Strain", "Grade I Tendonitis"
  leadUpConditions: InjuryLeadUpConditions;
  resolved: string;
  description: string;
  source?: 'clinical' | 'medical_report';
}

export interface Athlete {
  id: string;
  name: string;
  age: number;
  sport: string;
  position: string;
  trackedDays: number;
  baseline: PersonalBaseline;
  injuryHistory: Injury[];
  history7Days: number[]; // past 7 days of recovery scores
  weightKg: number;
  heightCm: number;
  gender: 'male' | 'female';
}

export interface TodayLog {
  sleepHours: number;
  restingHeartRate: number;
  hrvDelta: number;
  rpePrevious: number;
  restDayBetween: boolean;
  mentalStress: number; // 1-10
  mood: number; // 1-10
  hydration: number; // Liters
  protein: number; // Grams
  symptomTranscript: string;
  painLevel: number; // 0-10
  symptomLocation: string; // "Right Hamstring", "Left Achilles Tendon", "Left Knee", "None", etc.
}

export interface ScoreDeduction {
  reason: string;
  points: number;
}

export interface PatternMatchResult {
  isMatch: boolean;
  injuryName?: string;
  injuryDate?: string;
  reason?: string;
}

export interface MultiDimensionScores {
  physiologicalLoad: number;
  sleepQuality: number;
  muscleSoreness: number;
  mentalStress: number;
  nutritionStatus: number;
  historicalRisk: number;
}

export interface ReferralFlag {
  required: boolean;
  urgency: 'routine' | 'within_48h' | 'immediate';
  reason: string;
  suggestedSpecialist: 'physiotherapist' | 'orthopedist' | 'neurologist' | 'GP';
  whatToTellThem: string;
}

export interface RehabilitationExercise {
  name: string;
  sets: number;
  reps: number;
  notes: string;
  avoidIf?: string;
}

export interface RehabilitationPlan {
  phase: 'acute' | 'sub_acute' | 'return_to_sport';
  exercises: RehabilitationExercise[];
  progressionTrigger: string;
}

export interface ExtendedNutrition {
  dailyCalorieTarget: number;
  priorityNutrients: Array<{
    nutrient: string;
    reason: string;
    dosage: string;
  }>;
}

export interface RecoveryReport {
  score: number;
  deductions: ScoreDeduction[];
  sleepStatus: 'Optimal' | 'Sub-optimal' | 'Critical Risk';
  nervousSystemStatus: 'Recovered' | 'Suppressed' | 'Stressed';
  nutritionStatus: 'Adequate' | 'Deficit' | 'Critical Deficit';
  mentalLoadStatus: 'Low' | 'Moderate' | 'High';
  riskLevel: 'High' | 'Medium' | 'Low';
  patternMatch: PatternMatchResult;
  riskExplanation: string;
  dimensions: MultiDimensionScores;
  directives: {
    trainingAdjustment: string;
    recoveryProtocol: string;
    nutritionFocus: string;
    mentalRecovery?: string; // Omitted when mental load is low
  };
  athleteMessage: string;
  trendInterpretation: {
    direction: 'Improving' | 'Stable' | 'Declining' | 'Volatile';
    interpretation: string;
  };
  referralFlag?: ReferralFlag;
  rehabilitationPlan?: RehabilitationPlan;
  extendedNutrition?: ExtendedNutrition;
  bodyRegionFlags?: Array<{
    site: string;
    painLevel: number;
    riskContribution: 'Low' | 'Medium' | 'High';
    note: string;
  }>;
}
