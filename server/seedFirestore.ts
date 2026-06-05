import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * PHASE 4 — Seeding Function
 * 
 * One-time seed script to generate embeddings for the mock protocols
 * and write them to Firestore. Run with: npx tsx server/seedFirestore.ts
 */

// Initialize Firebase Admin (Assumes FIREBASE_PROJECT_ID etc are set in .env)
admin.initializeApp();
const db = admin.firestore();

// Initialize Gemini
const ai = new GoogleGenAI({});

const protocolsToSeed = [
  {
    body_part: "hamstring",
    protocol_name: "Hamstring Eccentric Load Protocol",
    protocol_text: "Nordic hamstring curls 3x6 at 60% effort, eccentric focus. No sprint acceleration above 70% max velocity for 48h minimum. Contrast bath 10 min. Source: Norwegian School of Sport Sciences rehab protocol v3."
  },
  {
    body_part: "knee",
    protocol_name: "ACL Return-to-Play Protocol",
    protocol_text: "Single-leg squat progression, closed-chain only. No cutting movements for 72h. Quad/hamstring ratio assessment required before return. Source: FIFA Medical Centre of Excellence protocol."
  },
  {
    body_part: "ankle",
    protocol_name: "Lateral Ankle Sprain Management",
    protocol_text: "RICE for first 24h. Proprioception board work 3x2 min. No full weight-bearing sprints until 5/5 strength on inversion test. Source: National Sports Institute ankle protocol v2."
  },
  {
    body_part: "shoulder",
    protocol_name: "Rotator Cuff Load Management",
    protocol_text: "Isometric holds at 30 degrees abduction, 3x30s. No overhead throwing for 48h. Posterior capsule stretch 2x60s. Source: ASPETAR shoulder protocol."
  }
];

async function seed() {
  console.log("Starting Firestore vector seeding process...");
  let count = 0;

  for (const protocol of protocolsToSeed) {
    const textToEmbed = `${protocol.body_part} ${protocol.protocol_name}`;
    
    console.log(`Generating embedding for: ${textToEmbed}`);
    const embedResponse = await ai.models.embedContent({
      model: 'text-embedding-004',
      contents: textToEmbed
    });

    const embedding = embedResponse.embeddings?.[0]?.values;
    if (!embedding) {
      console.error(`Failed to generate embedding for ${textToEmbed}`);
      continue;
    }

    console.log(`Writing ${protocol.protocol_name} to Firestore...`);
    await db.collection('rehab_protocols').add({
      protocol_name: protocol.protocol_name,
      body_part: protocol.body_part,
      protocol_text: protocol.protocol_text,
      embedding: FieldValue.vector(embedding)
    });
    
    count++;
  }

  console.log(`\nSuccessfully seeded ${count} protocols to Firestore!`);
  process.exit(0);
}

seed().catch(err => {
  console.error("Failed to seed firestore:", err);
  process.exit(1);
});
