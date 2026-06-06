import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '',
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// CSV File configuration
const CSV_FILENAME = 'kaggle_data/sports_multimodal_data.csv'; 

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: text,
    config: { outputDimensionality: 768 }
  });
  return response.embeddings?.[0]?.values || [];
}

async function processCSV() {
  const filePath = path.resolve(process.cwd(), CSV_FILENAME);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ CSV File not found at: ${filePath}`);
    console.log(`Please paste your CSV file into the project folder and name it "${CSV_FILENAME}"`);
    return;
  }

  console.log(`📄 Reading CSV from ${filePath}...`);
  
  const records: any[] = [];
  const parser = fs.createReadStream(filePath).pipe(
    parse({
      columns: true, // Auto-detect headers
      skip_empty_lines: true,
      trim: true
    })
  );

  for await (const record of parser) {
    records.push(record);
  }

  // Only process the first 100 records for speed
  const limitedRecords = records.slice(0, 100);
  console.log(`✅ Loaded ${records.length} total records. Taking first 100. Starting Supabase upload...`);

  for (let i = 0; i < limitedRecords.length; i++) {
    const record = limitedRecords[i];
    console.log(`[${i + 1}/${limitedRecords.length}] Processing record...`);

    // Combine all columns into a single text block for the embedding
    // E.g. "Condition: Ankle Sprain. Symptoms: Swelling. Protocol: RICE."
    const embeddingChunks = Object.entries(record).map(([key, value]) => `${key}: ${value}`);
    const embeddingText = embeddingChunks.join('. ');

    try {
      const embedding = await generateEmbedding(embeddingText);
      
      if (embedding.length !== 768) {
        console.error(`  ❌ Wrong embedding dimension: ${embedding.length}`);
        continue;
      }

      // We map the raw CSV data into a JSON block and insert it as a generic "Medical Research Data"
      // Alternatively, if your CSV has specific columns like 'injury_type', you can map them directly.
      const { error } = await supabase
        .from('rehab_protocols')
        .insert({
          injury_type: record['Injury'] || record['Condition'] || 'NIH Clinical Data',
          source_citation: record['Source'] || record['Study'] || 'NIIHAMS Dataset',
          acute_phase_protocol: JSON.stringify(record, null, 2), // Storing full data as text
          sub_acute_protocol: 'Data uploaded via CSV batch import',
          red_flags: [],
          return_to_play_criteria: 'Refer to raw data',
          load_recommendation: embeddingText.substring(0, 500) + '...', // Preview
          embedding
        });

      if (error) {
        console.error(`  ❌ Supabase error:`, error.message);
      } else {
        console.log(`  ✅ Inserted successfully.`);
      }

      // Rate limit protection for free tier API keys (wait 2-3 seconds per row)
      if (i < records.length - 1) {
        await new Promise(r => setTimeout(r, 2500));
      }
    } catch (err: any) {
      console.error(`  ❌ Error processing row ${i + 1}:`, err.message);
      if (err.message?.includes('429')) {
        console.log('  ⏳ Rate limited. Waiting 60 seconds...');
        await new Promise(r => setTimeout(r, 60000));
        i--; // Retry this row
      }
    }
  }

  console.log('🎉 CSV Import Complete!');
}

processCSV().catch(console.error);
