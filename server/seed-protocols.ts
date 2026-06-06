import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '',
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// ─── Clinical Rehabilitation Protocols ──────────────────────────
const PROTOCOLS = [
  {
    injury_type: "Hamstring Strain (Grade I-II)",
    source_citation: "British Journal of Sports Medicine, 2023; FIFA Medical Assessment & Research Centre",
    acute_phase_protocol: "RICE protocol for 48-72h. Isometric holds at pain-free range. No sprinting or explosive movements. Gentle walking permitted after 24h if pain-free. Consider compression shorts.",
    sub_acute_protocol: "Nordic hamstring curls (3x8, eccentric focus). Single-leg Romanian deadlifts. Progressive running program: jog → tempo → sprint over 2-3 weeks. Hip hinge pattern retraining.",
    red_flags: ["Sudden pop sound during activity", "Bruising spreading down the leg", "Inability to bear weight", "Pain persists beyond 2 weeks despite rest", "Recurrent strain within 6 months"],
    return_to_play_criteria: "Pain-free full ROM. Strength within 10% of uninjured side on dynamometer. Complete sport-specific drills at full intensity without pain.",
    load_recommendation: "Week 1: 0% running. Week 2: 40% volume walk/jog. Week 3: 70% tempo runs. Week 4: Full return if criteria met.",
    doctor_referral: "CONSULT DOCTOR IF: Grade II+ suspected (>50% fiber disruption), pain persists beyond 14 days, recurrent injury within same season, palpable defect in muscle belly."
  },
  {
    injury_type: "ACL Sprain / Partial Tear",
    source_citation: "American Academy of Orthopaedic Surgeons (AAOS); Knee Surgery, Sports Traumatology, Arthroscopy Journal",
    acute_phase_protocol: "Immediate immobilization with knee brace locked at 0°. RICE protocol. Crutches for ambulation. Quad sets and straight leg raises from Day 1. NO pivoting or lateral movements.",
    sub_acute_protocol: "Closed-chain exercises (wall sits, leg press). Balance board proprioception. Stationary cycling. Progressive ROM exercises. Neuromuscular re-education.",
    red_flags: ["Knee giving way during daily activities", "Significant swelling within 2 hours of injury", "Mechanical locking of the knee", "Unable to fully extend the knee", "Instability during single-leg stance"],
    return_to_play_criteria: "Full ROM. Quad/ham strength >90% of contralateral. Hop test >90% symmetry. No apprehension on pivot shift test. Minimum 9 months post-reconstruction.",
    load_recommendation: "Non-surgical: 6-12 weeks progressive rehab. Surgical (reconstruction): 9-12 month return timeline. No cutting/pivoting sports until cleared.",
    doctor_referral: "IMMEDIATE REFERRAL: All suspected ACL injuries require MRI and orthopedic consultation within 48-72 hours. Surgical candidacy depends on activity level, age, and associated injuries."
  },
  {
    injury_type: "Achilles Tendinopathy",
    source_citation: "Alfredson Protocol; Scandinavian Journal of Medicine & Science in Sports; NICE Clinical Guidelines",
    acute_phase_protocol: "Relative rest (avoid hill running and plyometrics). Heel raises in shoes to offload tendon. Ice after activity. Isometric calf holds (45s x 5 reps) for pain management.",
    sub_acute_protocol: "Alfredson eccentric heel drops: 3x15, twice daily, both straight-knee and bent-knee. Progressive heavy slow resistance (HSR) training. Gradual return to running on flat surfaces only.",
    red_flags: ["Sudden sharp pain with audible snap (possible rupture)", "Palpable gap in tendon", "Inability to perform single-leg calf raise", "Morning stiffness lasting >30 minutes", "Pain escalating despite 6 weeks of conservative treatment"],
    return_to_play_criteria: "Pain-free single-leg heel raise x25. VISA-A score >80. No morning stiffness. Tolerate sport-specific loading without flare-up within 24h.",
    load_recommendation: "Maintain below pain threshold (max 3/10 during exercise, returns to baseline within 24h). Avoid complete rest — load management is key.",
    doctor_referral: "CONSULT DOCTOR IF: Suspected complete rupture (Thompson test positive), pain >6 weeks despite rehab, bilateral tendinopathy, or steroid injection is being considered."
  },
  {
    injury_type: "Ankle Sprain (Lateral - Grade I-II)",
    source_citation: "Ottawa Ankle Rules; Journal of Athletic Training; International Ankle Consortium",
    acute_phase_protocol: "POLICE protocol (Protection, Optimal Loading, Ice, Compression, Elevation). Avoid anti-inflammatories in first 48h (may impair healing). Weight-bearing as tolerated with support.",
    sub_acute_protocol: "Alphabet ankle ROM exercises. Single-leg balance (eyes open → closed). Resistance band eversion/inversion. Proprioceptive training on unstable surfaces. Progressive hopping drills.",
    red_flags: ["Inability to bear weight for 4+ steps", "Bony tenderness at posterior edge of malleoli", "Severe swelling with ecchymosis within 1 hour", "Suspected syndesmosis injury (squeeze test positive)", "Numbness or tingling in foot"],
    return_to_play_criteria: "Full pain-free ROM. Single-leg balance >30 seconds. Hop test without apprehension. Completed agility ladder and cutting drills.",
    load_recommendation: "Grade I: 1-2 weeks return. Grade II: 3-6 weeks. Tape/brace for 6 months post-return.",
    doctor_referral: "CONSULT DOCTOR IF: Ottawa Ankle Rules positive (possible fracture), unable to weight-bear after 72h, Grade III suspected (complete ligament tear), chronic instability (>3 sprains in 12 months)."
  },
  {
    injury_type: "Shoulder Impingement / Rotator Cuff Tendinopathy",
    source_citation: "Journal of Shoulder and Elbow Surgery; JOSPT Clinical Practice Guidelines",
    acute_phase_protocol: "Avoid overhead activities. Scapular retraction exercises. Pendulum exercises for pain-free ROM. Ice after activity. Sleep positioning: avoid lying on affected side.",
    sub_acute_protocol: "Rotator cuff strengthening (external rotation with band, prone Y-T-W). Scapular stabilization exercises. Progressive overhead loading. Thoracic spine mobility work.",
    red_flags: ["Traumatic onset with inability to raise arm (possible tear)", "Night pain that disrupts sleep consistently", "Weakness in external rotation", "Symptoms lasting >12 weeks", "History of shoulder dislocation"],
    return_to_play_criteria: "Pain-free overhead activity. Strength within 15% of uninvolved side. Full sport-specific movements without compensation.",
    load_recommendation: "Avoid bench press and overhead press initially. Progress from isometric → concentric → eccentric → sport-specific over 6-8 weeks.",
    doctor_referral: "CONSULT DOCTOR IF: Acute traumatic onset (possible rotator cuff tear), persistent night pain, weakness in specific planes, failed 8-week conservative management, age >50 with acute onset."
  },
  {
    injury_type: "Patellar Tendinopathy (Jumper's Knee)",
    source_citation: "VISA-P Guidelines; British Journal of Sports Medicine; Malliaras et al., 2015",
    acute_phase_protocol: "Reduce jumping/landing volume by 50%. Isometric quad contractions (45s holds at 70° knee flexion, 5 reps x 4/day). Spanish squat holds. Ice post-activity.",
    sub_acute_protocol: "Heavy slow resistance: leg press and hack squat (4x8 at 4s eccentric). Decline single-leg squats. Progressive plyometric loading. Avoid sudden spikes in jump training volume.",
    red_flags: ["Pain during daily activities (stairs, sitting)", "Visible swelling at inferior pole of patella", "Pain >5/10 during loading exercises", "Bilateral tendinopathy in young athlete", "Complete inability to jump"],
    return_to_play_criteria: "VISA-P score >80. Pain-free single-leg decline squat. Tolerate sport-specific jump volume without 24h flare-up.",
    load_recommendation: "In-season management: maintain 3/10 pain ceiling during activity. Never spike weekly jump count by >15%. Avoid complete rest.",
    doctor_referral: "CONSULT DOCTOR IF: Persistent pain >3 months despite structured rehab, inability to perform daily activities, suspected patellar tendon rupture (unable to extend knee against gravity)."
  },
  {
    injury_type: "Concussion / Head Injury",
    source_citation: "Berlin Consensus Statement on Concussion in Sport (2023); NCAA Concussion Safety Protocol",
    acute_phase_protocol: "IMMEDIATE removal from play. Physical and cognitive rest for 24-48h. No screens, reading, or bright lights in acute phase. Symptom monitoring every 4 hours.",
    sub_acute_protocol: "Graduated Return to Play (GRTP) protocol: Stage 1: Symptom-limited activity. Stage 2: Light aerobic (walking, cycling <70% max HR). Stage 3: Sport-specific drills. Stage 4: Non-contact training. Stage 5: Full contact (medical clearance required). Stage 6: Return to competition. Minimum 24h between each stage.",
    red_flags: ["Loss of consciousness", "Worsening headache", "Repeated vomiting", "Seizure", "Confusion lasting >30 minutes", "One pupil larger than the other", "Slurred speech", "Weakness or numbness in limbs"],
    return_to_play_criteria: "Asymptomatic at rest and exertion. Cleared by medical professional trained in concussion management. Completed all 6 GRTP stages without symptom recurrence.",
    load_recommendation: "ZERO physical/cognitive exertion until symptom-free for 24h. Each GRTP stage = minimum 24h. Typical full return: 7-14 days minimum.",
    doctor_referral: "IMMEDIATE EMERGENCY REFERRAL: Any red flag symptoms. MANDATORY MEDICAL CLEARANCE: All concussions require physician sign-off before return to contact sport. Second concussion within 12 months requires specialist neurological assessment."
  },
  {
    injury_type: "Low Back Pain (Non-Specific / Muscular)",
    source_citation: "NICE Low Back Pain Guidelines (NG59); McGill Core Stability Protocol",
    acute_phase_protocol: "Stay active — avoid bed rest >24h. McGill Big 3: Curl-up, side plank, bird-dog. Walking 20-30 minutes daily. Heat for muscle spasm. Avoid loaded spinal flexion (sit-ups, heavy deadlifts).",
    sub_acute_protocol: "Progressive core stability: dead bugs, pallof press, farmer's carries. Hip hinge pattern retraining with dowel rod. Gradual return to compound lifts with reduced load. Glute activation drills.",
    red_flags: ["Numbness in saddle area (cauda equina syndrome)", "Progressive leg weakness", "Bladder or bowel dysfunction", "Night pain unrelated to position", "Unexplained weight loss", "History of cancer", "Pain after significant trauma"],
    return_to_play_criteria: "Pain-free ADLs. Can maintain neutral spine under sport-specific loads. Core endurance tests within normative values.",
    load_recommendation: "Avoid axial loading >80% 1RM for 2 weeks. No ballistic rotational movements. Progress: bodyweight → bands → free weights → sport-specific.",
    doctor_referral: "EMERGENCY REFERRAL: Any cauda equina red flags. CONSULT DOCTOR IF: Radiculopathy (shooting leg pain), symptoms >6 weeks, progressive neurological deficit, pain following trauma."
  },
  {
    injury_type: "Muscle Soreness / DOMS (Delayed Onset Muscle Soreness)",
    source_citation: "ACSM Position Stand on Exercise Recovery; Sports Medicine Journal; Dupuy et al., 2018",
    acute_phase_protocol: "Active recovery: light cycling or swimming at 30-40% max effort. Foam rolling 10-15 minutes on affected areas. Adequate sleep (8+ hours). Hydration: 35-40ml per kg bodyweight.",
    sub_acute_protocol: "Continue normal training at reduced intensity (60-70% for 1-2 days). Cold water immersion (10-15°C for 10-15 minutes) if available. Massage or percussion therapy. Progressive return to full volume over 48-72h.",
    red_flags: ["Pain persists beyond 72 hours", "Dark or cola-colored urine (rhabdomyolysis)", "Extreme swelling in one limb", "Soreness is unilateral and localized to a specific point (may be strain, not DOMS)", "Accompanied by fever"],
    return_to_play_criteria: "Soreness reduced to <2/10. Full ROM restored. Can perform warm-up movements without significant discomfort.",
    load_recommendation: "Normal DOMS resolves in 24-72h. Do NOT take complete rest — active recovery accelerates healing. Avoid NSAIDs regularly as they may impair adaptation.",
    doctor_referral: "CONSULT DOCTOR IF: Dark urine after intense exercise (rhabdomyolysis risk — EMERGENCY), soreness >5 days, localized pain suggesting structural injury, recurrent DOMS from normal training loads (may indicate overtraining syndrome)."
  },
  {
    injury_type: "Sleep Deprivation & Recovery Impact",
    source_citation: "Sleep Foundation; Mah et al., 2011 (Stanford Sleep Study); British Journal of Sports Medicine",
    acute_phase_protocol: "Prioritize sleep extension: aim for 9-10 hours for athletes. No caffeine after 2pm. Screen curfew 1 hour before bed. Cool bedroom (18-20°C). Consider 20-minute power naps before 3pm.",
    sub_acute_protocol: "Establish consistent sleep/wake schedule (even on weekends). Sleep hygiene checklist: dark room, no electronics, consistent pre-sleep routine. Consider magnesium glycinate (400mg before bed) and tart cherry juice (natural melatonin).",
    red_flags: ["Chronic sleep <6h per night for >2 weeks", "Daytime sleepiness affecting training safety", "Sleep apnea symptoms (snoring, gasping)", "Persistent insomnia despite good sleep hygiene", "Mood disturbances or cognitive decline"],
    return_to_play_criteria: "Consistently achieving 7.5+ hours for 5+ consecutive nights. Subjective sleep quality score improving. HRV trending upward.",
    load_recommendation: "If sleep <6h: reduce training intensity by 30% and eliminate high-risk movements (heavy lifts, plyometrics). Every hour of sleep debt = ~3% reduction in reaction time.",
    doctor_referral: "CONSULT DOCTOR IF: Insomnia >3 weeks, suspected sleep apnea, sleep medication dependency, sleep deprivation causing safety concerns during training."
  },
  {
    injury_type: "Iron Deficiency / Low Hemoglobin (Blood Work)",
    source_citation: "IOC Consensus Statement on Athlete Health; Sports Nutrition Handbook; Peeling et al., 2007",
    acute_phase_protocol: "Dietary iron optimization: lean red meat 3x/week, spinach + vitamin C pairing, avoid calcium/coffee with iron-rich meals. Consider ferrous sulfate supplement (325mg with orange juice on empty stomach).",
    sub_acute_protocol: "Recheck ferritin levels at 8-week mark. If ferritin <30ng/mL, continue supplementation. Monitor for GI side effects of iron supplements. Screen for non-dietary causes (menstrual loss, GI bleeding, foot-strike hemolysis in runners).",
    red_flags: ["Ferritin <15 ng/mL", "Hemoglobin <12 g/dL (female) or <13.5 g/dL (male)", "Unexplained fatigue lasting >2 weeks", "Rapid decline in aerobic performance", "Shortness of breath during moderate exercise"],
    return_to_play_criteria: "Ferritin >50 ng/mL. Hemoglobin within normal range. Subjective energy levels normalized. VO2max testing shows recovery to baseline.",
    load_recommendation: "If hemoglobin critically low (<10 g/dL): NO intense training until medically cleared. Moderate deficiency: reduce volume by 20%, avoid altitude training.",
    doctor_referral: "CONSULT DOCTOR: All athletes with ferritin <20 ng/mL. URGENT REFERRAL: Hemoglobin <10 g/dL, rapid unexplained drop in hemoglobin, suspected GI bleeding."
  },
  {
    injury_type: "Overtraining Syndrome / Burnout",
    source_citation: "European College of Sport Science; Meeusen et al., 2013; IOC Consensus Statement",
    acute_phase_protocol: "Mandatory rest period: minimum 2 weeks of active recovery only (walking, yoga, swimming). Sleep extension. Stress management techniques. Temporary removal from competitive environment.",
    sub_acute_protocol: "Gradual reintroduction: 50% volume for 2 weeks, then 70%, then full. Monitor HRV daily — should trend upward. Psychological support/counseling. Training diary to identify volume spikes that triggered overtraining.",
    red_flags: ["Persistent fatigue despite adequate rest (>2 weeks)", "Elevated resting heart rate (>10% above baseline)", "Suppressed HRV consistently below personal baseline", "Loss of motivation / apathy toward sport", "Recurrent illness or injury", "Unexplained weight loss", "Depression or mood disturbances"],
    return_to_play_criteria: "HRV returned to baseline. Resting HR normalized. Subjective motivation and enjoyment restored. Able to complete moderate training without disproportionate fatigue for 2+ weeks.",
    load_recommendation: "CRITICAL: Complete rest ≠ recovery for overtraining. Use active recovery. Full return may take 6-12 weeks. Never increase weekly volume by >10%.",
    doctor_referral: "CONSULT DOCTOR: All suspected overtraining cases for blood work (cortisol, testosterone, thyroid, iron). MENTAL HEALTH REFERRAL: If depression, anxiety, or disordered eating is present."
  }
];

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: text,
    config: { outputDimensionality: 768 }
  });
  return response.embeddings?.[0]?.values || [];
}

async function seed() {
  console.log('🌱 Seeding rehab_protocols with', PROTOCOLS.length, 'clinical protocols...\n');

  for (let i = 0; i < PROTOCOLS.length; i++) {
    const p = PROTOCOLS[i];
    console.log(`[${i + 1}/${PROTOCOLS.length}] ${p.injury_type}...`);

    // Generate embedding from the full protocol text
    const embeddingText = [
      p.injury_type,
      p.acute_phase_protocol,
      p.sub_acute_protocol,
      p.return_to_play_criteria,
      p.load_recommendation,
      (p as any).doctor_referral || '',
      ...(p.red_flags || [])
    ].join(' ');

    try {
      const embedding = await generateEmbedding(embeddingText);
      
      if (embedding.length !== 768) {
        console.error(`  ❌ Wrong embedding dimension: ${embedding.length}`);
        continue;
      }

      const { error } = await supabase
        .from('rehab_protocols')
        .insert({
          injury_type: p.injury_type,
          source_citation: p.source_citation,
          acute_phase_protocol: p.acute_phase_protocol,
          sub_acute_protocol: p.sub_acute_protocol,
          red_flags: p.red_flags,
          return_to_play_criteria: p.return_to_play_criteria,
          load_recommendation: p.load_recommendation + '\n\n' + ((p as any).doctor_referral || ''),
          embedding
        });

      if (error) {
        console.error(`  ❌ Supabase error:`, error.message);
      } else {
        console.log(`  ✅ Inserted`);
      }

      // Rate limit: wait 3 seconds between requests (free tier)
      if (i < PROTOCOLS.length - 1) {
        await new Promise(r => setTimeout(r, 3000));
      }
    } catch (err: any) {
      console.error(`  ❌ Error:`, err.message);
      // Wait longer on rate limit
      if (err.message?.includes('429')) {
        console.log('  ⏳ Rate limited, waiting 60s...');
        await new Promise(r => setTimeout(r, 60000));
        i--; // Retry this one
      }
    }
  }

  console.log('\n✅ Seeding complete!');
}

seed().catch(console.error);
