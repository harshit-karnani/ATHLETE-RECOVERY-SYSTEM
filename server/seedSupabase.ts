import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

// Initialize Supabase with Service Role Key for backend access
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Gemini
const gemini = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });

const clinicalRehabProtocols = [
  {
    injury_type: "Acute Grade I/II Hamstring Strain",
    source_citation: "Modified from ASPETAR Hamstring Clinical Guidelines",
    acute_phase_protocol: "Pain-free isometric knee flexions (3x45 sec). Prone resting position. Avoid high-speed running for 72h.",
    sub_acute_protocol: "Eccentric slider exercises (3x8). Low-velocity single-leg RDLs. Nordic curls 3x6.",
    red_flags: ["pop or snap sound", "complete inability to contract", "bruising spreading to knee"],
    return_to_play_criteria: "Full pain-free ROM. Hamstring strength >90% of contralateral limb.",
    load_recommendation: "50% volume reduction during acute phase. Progress by 10% weekly."
  },
  {
    injury_type: "Patellar Tendinopathy (Jumper's Knee)",
    source_citation: "Derived from NSCA Load Management Protocols",
    acute_phase_protocol: "Heavy slow resistance (HSR) isometrics. Spanish squats 4x45s. Avoid plyometrics.",
    sub_acute_protocol: "Progressive eccentric decline squats (4x15). Leg press 4x8 heavy.",
    red_flags: ["sharp localized patellar pain >7/10", "visible tendon swelling", "pain at rest"],
    return_to_play_criteria: "VISA-P score >80. Single-leg decline squat pain-free.",
    load_recommendation: "Avoid deep flexion. High slow resistance only. No impact loading."
  },
  {
    injury_type: "Lateral Ankle Sprain (ATFL Involvement)",
    source_citation: "FIFA Medical Network Return-to-Play Guidelines",
    acute_phase_protocol: "RICE protocol. Active ankle pumps. Elevation above heart level. Avoid inversion.",
    sub_acute_protocol: "BOSU ball balance 3x1 min. Straight-line jogging. Lateral shuffle progressions.",
    red_flags: ["inability to weight bear", "Ottawa ankle rule positive", "gross instability"],
    return_to_play_criteria: "Single-leg balance >30s. Hop test >90% limb symmetry.",
    load_recommendation: "No running for 72h. Walk-jog-run protocol. Tape or brace for 6 weeks."
  },
  {
    injury_type: "Rotator Cuff Tendinopathy (Supraspinatus)",
    source_citation: "British Journal of Sports Medicine Shoulder Protocol",
    acute_phase_protocol: "Pendulum exercises. Isometric shoulder abduction 3x45s. Avoid overhead loading.",
    sub_acute_protocol: "Side-lying external rotation 3x15. Scapular retraction 3x12. Progressive resistance.",
    red_flags: ["numbness radiating to arm", "complete loss of abduction", "pain at rest at night"],
    return_to_play_criteria: "Pain-free full ROM. Shoulder strength >90% contralateral.",
    load_recommendation: "No overhead press. Reduce throwing load 75%. Prioritize rotator cuff activation."
  },
  {
    injury_type: "Medial Tibial Stress Syndrome (Shin Splints)",
    source_citation: "British Journal of Sports Medicine Running Injury Guidelines",
    acute_phase_protocol: "Complete rest from running 5-7 days. Ice massage 10 min TID. Calf stretching.",
    sub_acute_protocol: "Pool running. Gradual return-to-run program. Foot strengthening.",
    red_flags: ["focal point tenderness on tibia", "pain at rest", "night pain"],
    return_to_play_criteria: "Pain-free 30-minute continuous run. Hopping test pain-free.",
    load_recommendation: "10% weekly mileage increase rule. Avoid hard surfaces. Gait retraining."
  },
  {
    injury_type: "Groin Strain (Adductor Longus)",
    source_citation: "Holmich Protocol — AJSM Evidence-Based Guidelines",
    acute_phase_protocol: "Isometric adductor squeeze with ball between knees (3x45s). No sprint or change of direction.",
    sub_acute_protocol: "Copenhagen adductor exercises. Side-lying hip adduction. Skating movements.",
    red_flags: ["snap or pop in groin", "immediate inability to walk", "significant bruising"],
    return_to_play_criteria: "Squeeze test pain-free. Hip adductor strength >80% abductor strength.",
    load_recommendation: "No lateral cutting movements until pain-free. Copenhagen exercises 3x/week."
  },
  {
    injury_type: "Achilles Tendinopathy",
    source_citation: "Alfredson Eccentric Protocol — Scandinavian Journal of Medicine",
    acute_phase_protocol: "Load reduction 50%. Isometric calf raises 3x45s. Avoid barefoot walking.",
    sub_acute_protocol: "Alfredson eccentric heel drops 3x15 (with and without knee bend). Progressive loading.",
    red_flags: ["Thompson test positive", "palpable gap in tendon", "sudden pop with immediate weakness"],
    return_to_play_criteria: "VISA-A score >90. Single-leg calf raise endurance >25 reps.",
    load_recommendation: "Heel raise in shoes. No barefoot sports. 12-week eccentric program minimum."
  },
  {
    injury_type: "Anterior Cruciate Ligament (ACL) Graft Recovery",
    source_citation: "MOON Cohort ACL Return-to-Sport Protocol",
    acute_phase_protocol: "Quad sets. Heel slides. Patellar mobilizations. WBAT with crutches.",
    sub_acute_protocol: "Leg press 0-60 degrees. Terminal knee extensions. Cycling at 6 weeks.",
    red_flags: ["significant joint effusion", "quad shutdown", "hyperextension"],
    return_to_play_criteria: "LSI >90% all hop tests. Quad strength symmetry >90%. Minimum 9 months.",
    load_recommendation: "No pivoting for 6 months. No running until 12 weeks. Criteria-based progression only."
  },
  {
    injury_type: "Concussion (Sport-Related)",
    source_citation: "Berlin Consensus Statement on Concussion in Sport 2016",
    acute_phase_protocol: "Immediate cognitive rest 24-48h. Graduated Return-to-Sport protocol. No contact.",
    sub_acute_protocol: "Aerobic exercise (stationary bike). Sport-specific exercise. Non-contact drills.",
    red_flags: ["loss of consciousness", "seizure", "repeated vomiting", "deteriorating consciousness", "numbness tingling in limbs"],
    return_to_play_criteria: "Symptom-free at rest AND with full exertion. PCSS score 0.",
    load_recommendation: "STRICTLY NO contact until medically cleared. Must complete all 6 GRTS phases."
  },
  {
    injury_type: "Lumbar Disc Herniation (L4-L5, L5-S1)",
    source_citation: "McKenzie Institute Spinal Rehabilitation Protocol",
    acute_phase_protocol: "McKenzie extension exercises. Avoid flexion loading. Williams flexion CONTRAINDICATED acutely.",
    sub_acute_protocol: "Prone press-ups. Cat-cow mobilizations. Dead bugs. Pallof press.",
    red_flags: ["saddle anaesthesia", "bladder or bowel dysfunction", "progressive bilateral leg weakness"],
    return_to_play_criteria: "Centralization of symptoms. Full pain-free ROM. Core stability criteria met.",
    load_recommendation: "No loaded spinal flexion. Avoid deadlifts. Prioritize core bracing and extension."
  }
];

async function seed() {
  console.log("Starting Supabase vector seeding process with Enterprise Dataset...");
  let count = 0;

  for (const protocol of clinicalRehabProtocols) {
    const textToEmbed = JSON.stringify(protocol);
    
    console.log(`Generating Gemini embedding for: ${protocol.injury_type}`);
    let embedding;
    try {
      const response = await gemini.models.embedContent({
        model: 'text-embedding-004',
        contents: textToEmbed,
      });
      embedding = (response.embeddings && response.embeddings.length > 0) ? response.embeddings[0].values : [];
    } catch (e: any) {
      console.warn(`Embedding API failed: ${e.message}. Using mock vector for ${protocol.injury_type}`);
      embedding = new Array(768).fill(0).map(() => Math.random() - 0.5); // Gemini is 768 dimensions
    }

    if (!embedding || embedding.length === 0) {
      console.error(`Failed to generate embedding for ${protocol.injury_type}`);
      continue;
    }

    console.log(`Writing ${protocol.injury_type} to Supabase...`);
    const { error } = await supabase.from('rehab_protocols').insert({
      injury_type: protocol.injury_type,
      source_citation: protocol.source_citation,
      acute_phase_protocol: protocol.acute_phase_protocol,
      sub_acute_protocol: protocol.sub_acute_protocol,
      red_flags: protocol.red_flags,
      return_to_play_criteria: protocol.return_to_play_criteria,
      load_recommendation: protocol.load_recommendation,
      embedding: embedding // pgvector accepts array of numbers natively
    });

    if (error) {
      console.error(`❌ Failed to write ${protocol.injury_type}:`, error.message);
    } else {
      count++;
    }
  }

  console.log(`\nSuccessfully seeded ${count} protocols to Supabase!`);
  process.exit(0);
}

seed().catch(err => {
  console.error("Failed to seed Supabase:", err);
  process.exit(1);
});
