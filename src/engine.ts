import type { 
  Athlete, 
  TodayLog, 
  RecoveryReport, 
  ScoreDeduction, 
  PatternMatchResult, 
  MultiDimensionScores,
  ReferralFlag,
  RehabilitationPlan,
  ExtendedNutrition
} from './types';

// Helper to determine nutrition requirements based on sport
export function getNutritionRequirements(sport: string) {
  const normalized = sport.toLowerCase();
  if (normalized.includes('runner') || normalized.includes('marathon') || normalized.includes('endurance') || normalized.includes('cyclist')) {
    return { hydration: 3.5, protein: 140 };
  } else if (normalized.includes('weightlift') || normalized.includes('power') || normalized.includes('strength') || normalized.includes('sprinter')) {
    return { hydration: 3.0, protein: 160 };
  } else if (normalized.includes('basket') || normalized.includes('soccer') || normalized.includes('football') || normalized.includes('guard')) {
    return { hydration: 3.2, protein: 150 };
  }
  return { hydration: 3.0, protein: 130 }; // Default
}

// Helper to generate Rehabilitation plans locally
function generateLocalRehabPlan(location: string, painLevel: number): RehabilitationPlan | undefined {
  if (location === 'None') return undefined;

  const loc = location.toLowerCase();
  let phase: 'acute' | 'sub_acute' | 'return_to_sport' = 'return_to_sport';
  if (painLevel >= 5) phase = 'acute';
  else if (painLevel >= 2) phase = 'sub_acute';

  if (loc.includes('hamstring')) {
    if (phase === 'acute') {
      return {
        phase,
        exercises: [
          { name: 'Isometric Hamstring Bridge Holds', sets: 3, reps: 30, notes: 'Hold bridge with feet slightly extended. No pain above 2/10.', avoidIf: 'Active cramping' },
          { name: 'Double-Leg Glute Bridges', sets: 3, reps: 15, notes: 'Focus on posterior tilt and glute squeeze.' }
        ],
        progressionTrigger: 'Ability to hold hamstring bridge for 45s without pain.'
      };
    } else if (phase === 'sub_acute') {
      return {
        phase,
        exercises: [
          { name: 'Eccentric Slider Leg Curls', sets: 3, reps: 8, notes: 'Slow extension on slider, pull back with two legs.', avoidIf: 'Sharp pain during elongation' },
          { name: 'Single-Leg Romanian Deadlifts (RDL)', sets: 3, reps: 10, notes: 'Dumbbell in opposite hand. Maintain neutral spine.' }
        ],
        progressionTrigger: 'Completing 3x10 single-leg RDLs with 10kg dumbbell and zero pain.'
      };
    } else {
      return {
        phase,
        exercises: [
          { name: 'Nordic Hamstring Curls', sets: 3, reps: 5, notes: 'Slow eccentric fall, push up with hands.', avoidIf: 'Fatigue' },
          { name: 'High-Velocity Running Repetitions', sets: 5, reps: 60, notes: 'Perform at 85% max effort. Walk back recovery.' }
        ],
        progressionTrigger: 'Full sprint capacity at 95%+ max velocity with no post-session soreness.'
      };
    }
  }

  if (loc.includes('achilles') || loc.includes('calf')) {
    if (phase === 'acute') {
      return {
        phase,
        exercises: [
          { name: 'Isometric Single-Leg Heel Raises', sets: 5, reps: 45, notes: 'Hold single-leg heel raise at mid-height on flat ground.', avoidIf: 'Active pulsing pain' }
        ],
        progressionTrigger: 'Hold 45s single leg for 5 reps with zero pain.'
      };
    } else if (phase === 'sub_acute') {
      return {
        phase,
        exercises: [
          { name: 'Heavy Slow Resistance Calf Raises', sets: 3, reps: 10, notes: '3s up, 2s hold, 3s down. Use loaded step.', avoidIf: 'Sudden acceleration' }
        ],
        progressionTrigger: 'Lifting 50% bodyweight extra in slow calf raises.'
      };
    } else {
      return {
        phase,
        exercises: [
          { name: 'Double-Leg Ankle Hops (Plyometrics)', sets: 3, reps: 20, notes: 'Focus on stiffness and short ground contact time.', avoidIf: 'Cold joints' }
        ],
        progressionTrigger: 'Completion of bounding drills with no pain or morning stiffness.'
      };
    }
  }

  if (loc.includes('knee') || loc.includes('patellar') || loc.includes('quad')) {
    if (phase === 'acute') {
      return {
        phase,
        exercises: [
          { name: 'Isometric Spanish Squats', sets: 5, reps: 45, notes: 'Use thick band around poles. Sit back to 70 deg. Hold.', avoidIf: 'Knee extension pinching' }
        ],
        progressionTrigger: 'Hold Spanish squat for 45s with no pain.'
      };
    } else if (phase === 'sub_acute') {
      return {
        phase,
        exercises: [
          { name: 'Slow Tempo Leg Press', sets: 3, reps: 8, notes: '4s down, 4s up. Avoid sudden reversals.', avoidIf: 'Sharp patellar pain' },
          { name: 'Weighted Goblet Squats', sets: 3, reps: 10, notes: 'Squat to parallel. Focus on quad loading.' }
        ],
        progressionTrigger: 'Squatting 80% bodyweight for 10 reps with slow tempo.'
      };
    } else {
      return {
        phase,
        exercises: [
          { name: 'Depth Jumps & Soft Landings', sets: 3, reps: 6, notes: 'Drop from 30cm box and land softly with good mechanics.', avoidIf: 'Valgus knee collapse' }
        ],
        progressionTrigger: 'Completion of lateral deceleration drills without discomfort.'
      };
    }
  }

  if (loc.includes('back')) {
    if (phase === 'acute') {
      return {
        phase,
        exercises: [
          { name: 'Cat-Cow Stretch', sets: 2, reps: 10, notes: 'Gentle mobilization within pain-free range.' },
          { name: 'Bird-Dog Holds', sets: 3, reps: 10, notes: 'Hold for 5s each side. Keep hips square.', avoidIf: 'Extended extension pinch' }
        ],
        progressionTrigger: 'Ability to perform bird-dogs with no spinal pain.'
      };
    } else if (phase === 'sub_acute') {
      return {
        phase,
        exercises: [
          { name: 'Light Kettlebell Romanian Deadlifts', sets: 3, reps: 12, notes: 'Focus on hip hinge. Maintain flat back.', avoidIf: 'Rounding lumbar spine' },
          { name: 'Deadbug Holds', sets: 3, reps: 30, notes: 'Press lower back flat into the ground.' }
        ],
        progressionTrigger: 'Hip hinging with 24kg kettlebell for 12 reps pain-free.'
      };
    } else {
      return {
        phase,
        exercises: [
          { name: 'Barbell Deadlifts (Light)', sets: 3, reps: 8, notes: 'Progress weight slowly. Focus on brace.', avoidIf: 'Spinal flexion under load' },
          { name: 'Kettlebell Swings', sets: 3, reps: 15, notes: 'Snap hips, keep core locked.' }
        ],
        progressionTrigger: 'Lifting 1.2x bodyweight in deadlift with zero stiffness.'
      };
    }
  }

  // Default fallback plan if location is not recognized but pain is non-zero
  return {
    phase,
    exercises: [
      { name: 'Active Mobility Stretches', sets: 2, reps: 10, notes: 'Work within pain-free ranges.' },
      { name: 'Bodyweight Glute Bridges', sets: 3, reps: 12, notes: 'General hip and core activation.' }
    ],
    progressionTrigger: 'Pain level resolves below 2/10.'
  };
}

export function generateRecoveryReport(athlete: Athlete, log: TodayLog): RecoveryReport {
  const baseline = athlete.baseline;
  const deductions: ScoreDeduction[] = [];
  
  // ----------------------------------------------------
  // NUTRITION STATUS & FLAGS
  // ----------------------------------------------------
  const requirements = getNutritionRequirements(athlete.sport);
  let nutritionStatus: 'Adequate' | 'Deficit' | 'Critical Deficit' = 'Adequate';
  
  if (log.hydration < 1.5 || log.protein < 70) {
    nutritionStatus = 'Critical Deficit';
  } else if (log.hydration < requirements.hydration || log.protein < requirements.protein) {
    nutritionStatus = 'Deficit';
  }

  // ----------------------------------------------------
  // SLEEP STATUS & FLAGS
  // ----------------------------------------------------
  const sleepDifference = baseline.sleep - log.sleepHours;
  let sleepStatus: 'Optimal' | 'Sub-optimal' | 'Critical Risk' = 'Optimal';
  if (sleepDifference > 2.0) {
    sleepStatus = 'Critical Risk';
  } else if (sleepDifference > 0.5) {
    sleepStatus = 'Sub-optimal';
  }

  // ----------------------------------------------------
  // NERVOUS SYSTEM STATUS & FLAGS
  // ----------------------------------------------------
  let nervousSystemStatus: 'Recovered' | 'Suppressed' | 'Stressed' = 'Recovered';
  if (log.hrvDelta < -15) {
    nervousSystemStatus = 'Stressed';
  } else if (log.hrvDelta < -5) {
    nervousSystemStatus = 'Suppressed';
  }

  // ----------------------------------------------------
  // MENTAL LOAD STATUS & FLAGS
  // ----------------------------------------------------
  let mentalLoadStatus: 'Low' | 'Moderate' | 'High' = 'Low';
  if (log.mentalStress >= 8) {
    mentalLoadStatus = 'High';
  } else if (log.mentalStress >= 5) {
    mentalLoadStatus = 'Moderate';
  }

  // ----------------------------------------------------
  // PATTERN MATCH DETECTION
  // ----------------------------------------------------
  let patternMatch: PatternMatchResult = { isMatch: false };
  
  if (athlete.injuryHistory && athlete.injuryHistory.length > 0 && log.symptomLocation !== 'None') {
    for (const injury of athlete.injuryHistory) {
      const locationMatches = log.symptomLocation.toLowerCase().includes(injury.anatomicalSite.toLowerCase()) ||
                              injury.anatomicalSite.toLowerCase().includes(log.symptomLocation.toLowerCase());
      
      if (locationMatches) {
        // Evaluate fatigue conditions specified in the injury's lead-up
        const conditions = injury.leadUpConditions;
        let sleepMatches = true;
        let hrvMatches = true;
        let rpeMatches = true;
        let mentalMatches = true;

        if (conditions.sleepBelowBaseline !== undefined) {
          sleepMatches = (baseline.sleep - log.sleepHours) >= conditions.sleepBelowBaseline;
        }
        if (conditions.hrvDeltaBelow !== undefined) {
          hrvMatches = log.hrvDelta <= conditions.hrvDeltaBelow;
        }
        if (conditions.rpeAbove !== undefined) {
          rpeMatches = log.rpePrevious >= conditions.rpeAbove;
        }
        if (conditions.mentalStressAbove !== undefined) {
          mentalMatches = log.mentalStress >= conditions.mentalStressAbove;
        }

        // If location matches and all defined fatigue indicators align
        if (sleepMatches && hrvMatches && rpeMatches && mentalMatches) {
          patternMatch = {
            isMatch: true,
            injuryName: injury.severity + " of " + injury.anatomicalSite,
            injuryDate: injury.date,
            reason: `Current symptom at ${log.symptomLocation} paired with elevated systemic fatigue (${(baseline.sleep - log.sleepHours).toFixed(1)}h sleep deficit, HRV delta ${log.hrvDelta}ms, RPE ${log.rpePrevious}) matches the exact precursor conditions of the ${injury.severity} suffered on ${injury.date}.`
          };
          break; // Found a confirmed pattern match
        }
      }
    }
  }

  // ----------------------------------------------------
  // RECOVERY SCORE CALCULATIONS (Layer 1)
  // ----------------------------------------------------
  let rawScore = 100;

  // Sleep deductions (larger deduction only)
  if (sleepDifference > 2.0) {
    deductions.push({ reason: 'Sleep > 2.0 hours below baseline', points: 25 });
    rawScore -= 25;
  } else if (sleepDifference > 1.0) {
    deductions.push({ reason: 'Sleep > 1.0 hour below baseline', points: 15 });
    rawScore -= 15;
  }

  // HRV deductions (larger deduction only)
  if (log.hrvDelta < -20) {
    deductions.push({ reason: 'HRV delta < -20 ms', points: 20 });
    rawScore -= 20;
  } else if (log.hrvDelta < -10) {
    deductions.push({ reason: 'HRV delta < -10 ms', points: 10 });
    rawScore -= 10;
  }

  // Pattern Match deduction
  if (patternMatch.isMatch) {
    deductions.push({ reason: 'Injury Pattern Match Confirmed', points: 20 });
    rawScore -= 20;
  }

  // Mental Stress deduction
  if (log.mentalStress >= 7) {
    deductions.push({ reason: 'High Mental Stress (7+)', points: 8 });
    rawScore -= 8;
  }

  // Nutrition deficit deduction
  if (nutritionStatus !== 'Adequate') {
    deductions.push({ reason: 'Nutrition Deficit', points: 7 });
    rawScore -= 7;
  }

  // RPE previous session deduction
  if (log.rpePrevious >= 9 && !log.restDayBetween) {
    deductions.push({ reason: 'High RPE (9-10) with no rest day', points: 10 });
    rawScore -= 10;
  }

  // Localized Pain deduction
  if (log.painLevel >= 5) {
    deductions.push({ reason: `Localized pain (Level ${log.painLevel}) >= 5`, points: 10 });
    rawScore -= 10;
  }

  // Apply floor rules:
  let finalScore = Math.max(5, rawScore);
  if (rawScore < 5) {
    if (log.painLevel >= 8 && patternMatch.isMatch) {
      finalScore = Math.max(0, rawScore); // Let it fall below 5
    }
  }

  // ----------------------------------------------------
  // INJURY RISK ASSESSMENT (Layer 2)
  // ----------------------------------------------------
  const cond1_sleep = sleepDifference > 1.5;
  const cond2_hrv = log.hrvDelta < -15;
  const cond3_prev_site_symptom = log.symptomLocation !== 'None' && athlete.injuryHistory.some(inj => 
    log.symptomLocation.toLowerCase().includes(inj.anatomicalSite.toLowerCase()) ||
    inj.anatomicalSite.toLowerCase().includes(log.symptomLocation.toLowerCase())
  );
  const cond4_rpe = log.rpePrevious >= 8;

  let trueCount = 0;
  if (cond1_sleep) trueCount++;
  if (cond2_hrv) trueCount++;
  if (cond3_prev_site_symptom) trueCount++;
  if (cond4_rpe) trueCount++;

  let riskLevel: 'High' | 'Medium' | 'Low';
  let riskExplanation: string;

  if (trueCount >= 2) {
    riskLevel = 'High';
    riskExplanation = `High risk flagged due to multiple coinciding factors: ` +
      [
        cond1_sleep ? 'consecutive acute sleep deficit (>1.5h below baseline)' : '',
        cond2_hrv ? `suppressed nervous system (HRV delta of ${log.hrvDelta}ms)` : '',
        cond3_prev_site_symptom ? `discomfort localized at a previous injury site (${log.symptomLocation})` : '',
        cond4_rpe ? `high training load (RPE ${log.rpePrevious} in yesterday's session)` : ''
      ].filter(Boolean).join(', ') + '.';
  } else if (trueCount === 1) {
    riskLevel = 'Medium';
    const activeCondition = 
      cond1_sleep ? 'acute sleep deficit' :
      cond2_hrv ? `suppressed autonomic recovery (HRV delta ${log.hrvDelta}ms)` :
      cond3_prev_site_symptom ? `symptom located at previous injury site (${log.symptomLocation})` :
      `high training intensity (RPE ${log.rpePrevious} from yesterday)`;
    riskExplanation = `Medium risk assigned because a single major risk factor is present: ${activeCondition}.`;
  } else {
    // Check if recovery score has dropped more than 10 points across 3 consecutive days
    const scores = athlete.history7Days;
    const isScoreDrop = scores.length >= 3 && (scores[scores.length - 3] - finalScore) > 10;
    
    if (isScoreDrop) {
      riskLevel = 'Medium';
      riskExplanation = `Medium risk assigned due to a recovery score drop of more than 10 points over three consecutive days (${scores[scores.length - 3]} down to ${finalScore}) without a matching training load explanation.`;
    } else {
      riskLevel = 'Low';
      riskExplanation = `All physiological indicators are within normal personal baseline ranges. No current injury precursors are active.`;
    }
  }

  // Handle case where athlete has no injury history
  if (!athlete.injuryHistory || athlete.injuryHistory.length === 0) {
    if (riskLevel !== 'Medium' && riskLevel !== 'High') {
      riskLevel = 'Low';
    }
    riskExplanation += ` No documented injury history exists; baseline and predictive pattern recognition will improve as data accumulates.`;
  }

  // ----------------------------------------------------
  // MULTI-DIMENSION ANALYSIS (Layer 3)
  // ----------------------------------------------------
  const rpeLoad = log.rpePrevious * 9;
  const restModifier = log.restDayBetween ? 0 : 12;
  const physiologicalLoad = Math.min(100, Math.max(10, Math.round(rpeLoad + restModifier)));

  const sleepQuality = Math.max(0, Math.min(100, Math.round(100 - Math.max(0, sleepDifference) * 22)));

  let muscleSoreness = log.painLevel * 10;
  if (log.symptomTranscript.toLowerCase().includes('tight') || log.symptomTranscript.toLowerCase().includes('sore') || log.symptomTranscript.toLowerCase().includes('stiff')) {
    muscleSoreness = Math.min(100, muscleSoreness + 15);
  }
  if (log.symptomLocation !== 'None' && muscleSoreness === 0) {
    muscleSoreness = 25; // Base soreness if location mentioned but 0 pain
  }
  muscleSoreness = 100 - muscleSoreness; // invert: 100 = no soreness, 0 = maximum soreness

  const mentalStress = 100 - Math.min(100, log.mentalStress * 10); // invert: 100 = no stress, 0 = maximum stress

  const hydrationPct = (log.hydration / requirements.hydration) * 100;
  const proteinPct = (log.protein / requirements.protein) * 100;
  const nutritionScore = Math.min(100, Math.round((hydrationPct + proteinPct) / 2));

  let historicalRisk = 100;
  if (patternMatch.isMatch) {
    historicalRisk = 0; // active match
  } else if (cond3_prev_site_symptom) {
    historicalRisk = 50;
  } else if (cond2_hrv || cond1_sleep) {
    historicalRisk = 80;
  }

  const dimensions: MultiDimensionScores = {
    physiologicalLoad,
    sleepQuality,
    muscleSoreness,
    mentalStress,
    nutritionStatus: nutritionScore,
    historicalRisk
  };

  // ----------------------------------------------------
  // MIFFLIN-ST JEOR NUTRITION CALCULATION & INJURY NUTRIENTS
  // ----------------------------------------------------
  // BMR
  const weight = athlete.weightKg;
  const height = athlete.heightCm;
  const age = athlete.age;
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  if (athlete.gender === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }

  // Multiplier by training phase
  let multiplier = 1.5; // in_season default
  // RPE adjustment
  let rpeAdj = 0.0;
  if (log.rpePrevious >= 8) rpeAdj = 0.2;
  else if (log.rpePrevious >= 5) rpeAdj = 0.1;

  // Injury modifier
  const hasPostInjuryActive = cond3_prev_site_symptom || (athlete.injuryHistory && athlete.injuryHistory.some(inj => !inj.resolved));
  const tissueModifier = hasPostInjuryActive ? 1.12 : 1.0;

  const dailyCalorieTarget = Math.round(bmr * (multiplier + rpeAdj) * tissueModifier);

  // Priority nutrients list
  const priorityNutrients: ExtendedNutrition['priorityNutrients'] = [];
  const siteLower = log.symptomLocation.toLowerCase();

  if (siteLower !== 'none') {
    if (siteLower.includes('hamstring') || siteLower.includes('quad') || siteLower.includes('calf') || siteLower.includes('shoulder') || siteLower.includes('back')) {
      priorityNutrients.push(
        { nutrient: 'Whey/Plant Protein', reason: 'Supports muscle protein synthesis & myofibrillar repair', dosage: `${(athlete.weightKg * 2.0).toFixed(0)}g daily (split into 30g servings)` },
        { nutrient: 'Leucine', reason: 'Triggers the mTOR pathway to accelerate skeletal muscle hypertrophy', dosage: '3–5g post-training' },
        { nutrient: 'Creatine Monohydrate', reason: 'Maintains muscular cell hydration & limits atrophy during modified volume', dosage: '5g daily' }
      );
    } else if (siteLower.includes('achilles') || siteLower.includes('knee') || siteLower.includes('patellar') || siteLower.includes('ankle')) {
      priorityNutrients.push(
        { nutrient: 'Collagen Peptides', reason: 'Crucial structural building block for tendon and ligament ECM remodelling', dosage: '10–15g consumed 40 min before rehab' },
        { nutrient: 'Vitamin C', reason: 'Essential co-factor in collagen cross-linking and fibroblast activation', dosage: '1000mg daily' },
        { nutrient: 'Zinc', reason: 'Aids nucleic acid synthesis and cell division necessary for connective tissue repair', dosage: '20mg daily' }
      );
    } else {
      priorityNutrients.push(
        { nutrient: 'Omega-3 Fatty Acids (EPA/DHA)', reason: 'Strong anti-inflammatory properties to calm localized soft tissue irritation', dosage: '3g daily' },
        { nutrient: 'Glucosamine & Chondroitin', reason: 'Promotes glycosaminoglycan synthesis and joint fluid viscosity', dosage: '1500mg / 1200mg daily' }
      );
    }
  } else {
    // General Fatigue / recovery
    priorityNutrients.push(
      { nutrient: 'Electrolyte Complex (Na/K/Mg)', reason: 'Restores nervous system signaling and offsets peripheral fatigue', dosage: '1 tablet in 750ml water' },
      { nutrient: 'Vitamin B12 & Iron', reason: 'Essential for red blood cell formation and cellular energy oxygen transport', dosage: '2.4mcg / 18mg daily' }
    );
  }

  const extendedNutrition: ExtendedNutrition = {
    dailyCalorieTarget,
    priorityNutrients
  };

  // ----------------------------------------------------
  // DOCTOR REFERRAL WARNING ESCALATION (Layer 4)
  // ----------------------------------------------------
  let referralFlag: ReferralFlag = {
    required: false,
    urgency: 'routine',
    reason: '',
    suggestedSpecialist: 'GP',
    whatToTellThem: ''
  };

  const transcriptLower = log.symptomTranscript.toLowerCase();
  const hasNeuro = transcriptLower.includes('numbness') || 
                    transcriptLower.includes('tingling') || 
                    transcriptLower.includes('weakness') || 
                    transcriptLower.includes('pins and needles') || 
                    transcriptLower.includes('shooting');

  const hasMatchingHistory = athlete.injuryHistory && athlete.injuryHistory.some(inj => 
    log.symptomLocation.toLowerCase().includes(inj.anatomicalSite.toLowerCase()) ||
    inj.anatomicalSite.toLowerCase().includes(log.symptomLocation.toLowerCase())
  );

  if (log.painLevel >= 7 && log.symptomLocation !== 'None' && !hasMatchingHistory) {
    referralFlag = {
      required: true,
      urgency: log.painLevel >= 9 ? 'immediate' : 'within_48h',
      reason: `Acute unrecognised pain (level ${log.painLevel}/10) localized at ${log.symptomLocation} with no matching injury history.`,
      suggestedSpecialist: 'orthopedist',
      whatToTellThem: `I have developed sudden, sharp pain of level ${log.painLevel} in my ${log.symptomLocation}. I do not have a prior injury at this site, and it is limiting my daily mobility and athletic capacity.`
    };
  } else if (hasNeuro && log.symptomLocation !== 'None') {
    referralFlag = {
      required: true,
      urgency: 'immediate',
      reason: `Neurological descriptors ("numbness/tingling/weakness") reported in the voice check-in transcript.`,
      suggestedSpecialist: 'neurologist',
      whatToTellThem: `I am experiencing training-induced physical loads alongside neurological signs including numbness, tingling, and local weakness in my limbs. I require a standard neurological screen.`
    };
  } else if (log.painLevel >= 6 && hasMatchingHistory && sleepDifference > 1.5 && log.hrvDelta < -15) {
    referralFlag = {
      required: true,
      urgency: 'within_48h',
      reason: `Worsening clinical pattern at a previous injury site (${log.symptomLocation}) accompanied by severe sleep and autonomic suppression.`,
      suggestedSpecialist: 'physiotherapist',
      whatToTellThem: `I have been experiencing a recurrence of my previous injury symptoms at my ${log.symptomLocation} for three straight days. Despite lowering load, pain is worsening alongside persistent fatigue.`
    };
  }

  // ----------------------------------------------------
  // REHABILITATION PLAN
  // ----------------------------------------------------
  const rehabilitationPlan = generateLocalRehabPlan(log.symptomLocation, log.painLevel);

  // ----------------------------------------------------
  // COACH DIRECTIVES (Layer 5)
  // ----------------------------------------------------
  let trainingAdjustment: string;
  let recoveryProtocol: string;
  let nutritionFocus: string;
  let mentalRecovery: string | undefined = undefined;

  const site = log.symptomLocation.toLowerCase();
  if (riskLevel === 'High') {
    if (site.includes('hamstring')) {
      trainingAdjustment = "Remove all explosive acceleration drills, sprint intervals, and high-velocity hamstring extensions. Substitute with low-velocity mobility circuits, core stability work, and isometric hamstring loading at 50% maximum contraction effort.";
    } else if (site.includes('achilles') || site.includes('ankle') || site.includes('calf')) {
      trainingAdjustment = "Remove all plyometric bounding, jumping, and high-impact running drills. Substitute today's session with non-weight-bearing cardiovascular work (e.g., stationary cycling) and straight-line flat ground walk-throughs.";
    } else if (site.includes('knee') || site.includes('quad') || site.includes('patellar')) {
      trainingAdjustment = "Remove all deep squats, heavy lunges, and jump-landing activities today. Substitute with terminal knee extensions (TKEs) using resistance bands, glute bridge variations, and upper body hypertrophic loading.";
    } else {
      trainingAdjustment = "Remove all high-intensity conditioning, sprint efforts, and heavy compound lifting. Substitute today's session with an active recovery mobility circuit and light aerobic training, capping heart rate at Zone 2.";
    }
  } else if (riskLevel === 'Medium') {
    if (site.includes('hamstring')) {
      trainingAdjustment = "Limit maximum running velocity to 80%. Avoid eccentric hamstring loading or rapid deceleration work. Focus on progressive hamstring activation during warm-up.";
    } else if (site.includes('achilles') || site.includes('ankle') || site.includes('calf')) {
      trainingAdjustment = "Reduce running volume by 40%. Avoid incline sprinting or stair workouts. Substitute explosive footwork drills with light straight-line technique work.";
    } else if (site.includes('knee') || site.includes('quad') || site.includes('patellar')) {
      trainingAdjustment = "Modify squatting depth to parallel only. Limit quad-dominant jumping drills and replace them with hip-dominant loading exercises (e.g., Romanian deadlifts).";
    } else {
      trainingAdjustment = "Reduce overall training volume by 30%. Cap session RPE at 6. Substitute heavy compound lifts with machine-based isolated movements.";
    }
  } else {
    trainingAdjustment = "Proceed with scheduled training volume and intensity. Monitor movement patterns during warm-up and report any sudden tightness or pain immediately.";
  }

  if (log.symptomLocation !== 'None') {
    if (site.includes('hamstring')) {
      recoveryProtocol = "Perform 3 sets of 30-second submaximal isometric hamstring holds (glute bridge with extended heels). Apply contrast water therapy (ice 1 min / heat 2 mins) to the right hamstring for 15 minutes, followed by light manual therapy.";
    } else if (site.includes('achilles') || site.includes('ankle') || site.includes('calf')) {
      recoveryProtocol = "Implement 3 sets of 15 bilateral flat-ground calf raises with slow eccentric descent (3 seconds). Apply cold compression to the left Achilles for 15 minutes and perform myofascial release on the gastrocnemius muscle.";
    } else if (site.includes('knee') || site.includes('quad') || site.includes('patellar')) {
      recoveryProtocol = "Perform 3 sets of 20 straight leg raises. Apply a compression sleeve to the left knee post-session and ice for 15 minutes. Spend 10 minutes on soft-tissue mobilization of the quad tendon.";
    } else {
      recoveryProtocol = `Apply focal cold therapy to the ${log.symptomLocation} for 15 minutes. Conduct 10 minutes of active stretching targeting the affected kinetic chain.`;
    }
  } else {
    recoveryProtocol = "Nervous system recovery focus. Complete a 15-minute box breathing protocol (4s inhale, 4s hold, 4s exhale, 4s hold) immediately post-training. Prescribe 9.5 hours of sleep tonight with a strict digital wind-down 1 hour before bed.";
  }

  // Nutrition directives
  if (nutritionStatus === 'Critical Deficit') {
    nutritionFocus = `Urgent nutrition correction required: consume target ${dailyCalorieTarget} kcal. Consume 40g of whey protein within 30 mins of today's session given high training strain.`;
  } else if (nutritionStatus === 'Deficit') {
    nutritionFocus = `Target calorie intake is ${dailyCalorieTarget} kcal. Increase hydration by 1.5L and protein by 30g post-workout to support tissue synthesis.`;
  } else {
    nutritionFocus = `Calorie target: ${dailyCalorieTarget} kcal. Drink 500ml electrolyte fluid during exercise, and ingest 30g protein + 60g carbs post-training.`;
  }

  if (mentalLoadStatus === 'High') {
    mentalRecovery = "Omit the scheduled afternoon video analysis and coach feedback review today. Schedule a 20-minute guided Non-Sleep Deep Rest (NSDR) or mindfulness protocol prior to the evening meal.";
  } else if (mentalLoadStatus === 'Moderate') {
    mentalRecovery = "Replace the post-training debrief with 15 minutes of unstructured quiet time or sensory reduction before starting the coach review session.";
  }

  // ----------------------------------------------------
  // ATHLETE MESSAGE (Layer 6)
  // ----------------------------------------------------
  let athleteMessage: string;
  if (riskLevel === 'High') {
    if (patternMatch.isMatch) {
      athleteMessage = `Your body is showing the exact biometric deviations and muscle tightness that preceded your ${patternMatch.injuryName} in ${patternMatch.injuryDate?.split('-')[0]}. Today is a critical risk day; we are adjusting your training to protect your ${log.symptomLocation}. Focus exclusively on performing your isometric loading and getting a full 9 hours of sleep tonight.`;
    } else {
      if (log.symptomLocation !== 'None') {
        athleteMessage = `Your sleep and nervous system metrics are heavily suppressed today alongside localized tightness in your ${log.symptomLocation}. To prevent a training setback, we are pulling back on high-velocity work today. Focus on active mobility drills and hit your protein target immediately after training.`;
      } else {
        athleteMessage = `Your sleep and nervous system metrics are heavily suppressed today — multiple systemic fatigue signals are firing simultaneously. We are pulling back to protected recovery work only. Prioritize sleep extension tonight and consume your full hydration target before 3pm.`;
      }
    }
  } else if (riskLevel === 'Medium') {
    athleteMessage = `Autonomic recovery is slightly suppressed today and your sleep was below baseline. We've dialed back today's training intensity slightly to keep you moving safely. Focus on the hydration protocol and completing your calf/hamstring activation exercises before starting your main block.`;
  } else {
    athleteMessage = `Your recovery metrics are tracking beautifully along your personal baselines today. You are fully cleared to execute today's session at high intensity. Ensure you consume a high-protein recovery meal within two hours of finishing your final drills.`;
  }

  // ----------------------------------------------------
  // SEVEN-DAY TREND INTERPRETATION (Layer 7)
  // ----------------------------------------------------
  const scores = athlete.history7Days;
  let direction: 'Improving' | 'Stable' | 'Declining' | 'Volatile' = 'Stable';
  let trendInterpretationText: string;

  if (scores && scores.length >= 3) {
    const last3 = scores.slice(-3);
    const diff1 = last3[1] - last3[0];
    const diff2 = last3[2] - last3[1];
    
    if (diff1 > 3 && diff2 > 3) {
      direction = 'Improving';
    } else if (diff1 < -3 && diff2 < -3) {
      direction = 'Declining';
    } else {
      const min = Math.min(...scores);
      const max = Math.max(...scores);
      if (max - min > 15) {
        direction = 'Volatile';
      } else {
        direction = 'Stable';
      }
    }
  }

  if (direction === 'Declining') {
    let consecutiveDays = 1;
    for (let i = scores.length - 1; i > 0; i--) {
      if (scores[i] < scores[i-1]) {
        consecutiveDays++;
      } else {
        break;
      }
    }
    trendInterpretationText = `Your recovery trend is declining over the past ${consecutiveDays} consecutive days, indicating a compounding fatigue curve.`;
    if (riskLevel === 'High') {
      trendInterpretationText += ` Combined with high risk flags, this indicates an urgent need to reduce load immediately to prevent an overuse injury.`;
    } else {
      trendInterpretationText += ` Autonomic reserves are depleting, so monitor today's load carefully.`;
    }
  } else if (direction === 'Improving') {
    trendInterpretationText = `Your recovery trend is improving over the past 3 days, showing positive adaptation to the training load.`;
    if (riskLevel === 'High' || riskLevel === 'Medium') {
      trendInterpretationText += ` Despite today's acute flags, you are recovering well from the weekly cycle, so remain disciplined with the adjustments.`;
    } else {
      trendInterpretationText += ` You are in a strong physiological window to absorb higher training stimulus.`;
    }
  } else if (direction === 'Volatile') {
    trendInterpretationText = `Your recovery scores are volatile, fluctuating significantly day-to-day. This indicates unstable adaptation, likely driven by irregular sleep and high mental stress.`;
  } else {
    trendInterpretationText = `Your recovery trend is stable, showing consistent autonomic regulation. Your training load matches your current adaptive capacity.`;
  }

  return {
    score: finalScore,
    deductions,
    sleepStatus,
    nervousSystemStatus,
    nutritionStatus,
    mentalLoadStatus,
    riskLevel,
    patternMatch,
    riskExplanation,
    dimensions,
    directives: {
      trainingAdjustment,
      recoveryProtocol,
      nutritionFocus,
      mentalRecovery
    },
    athleteMessage,
    trendInterpretation: {
      direction,
      interpretation: trendInterpretationText
    },
    referralFlag,
    rehabilitationPlan,
    extendedNutrition
  };
}
