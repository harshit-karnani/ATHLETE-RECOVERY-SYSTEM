import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const gemini = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });

async function test() {
  console.log("Testing text-embedding-004...");
  try {
    const res1 = await gemini.models.embedContent({
      model: 'embedding-001',
      contents: "hello world"
    });
    console.log("embedding-001 SUCCESS");
  } catch (e: any) {
    console.error("embedding-001 FAILED:", e.message);
  }

  console.log("\nTesting gemini-2.5-flash...");
  try {
    const res3 = await gemini.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "hello world"
    });
    console.log("gemini-2.5-flash SUCCESS", res3.text);
  } catch (e: any) {
    console.error("gemini-2.5-flash FAILED:", e.message);
  }
}

test();
