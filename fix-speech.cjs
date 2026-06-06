const fs = require('fs');

let pipe = fs.readFileSync('src/services/aiPipeline.ts', 'utf8');

const correctFunc = `export async function extractSymptoms(): Promise<{ site: string | null; pain_level: number; transcript: string }> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing VITE_GEMINI_API_KEY");
  }

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) {
    throw new Error("SpeechRecognition API not supported in this browser.");
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  const transcript = await new Promise<string>((resolve, reject) => {
    recognition.onresult = (event: any) => {
      resolve(event.results[0][0].transcript);
    };
    recognition.onerror = (event: any) => {
      reject(new Error("Speech recognition error: " + event.error));
    };
    recognition.start();
  });

  const ai = new GoogleGenAI({ apiKey });

  const cleanedText = transcript.trim();
  if (!cleanedText) {
    return { site: null, pain_level: 0, transcript: '' };
  }

  const systemInstruction = \`Output ONLY minified JSON: {"site": string|null, "pain_level": int}. No markdown.\`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: cleanedText,
    config: {
      systemInstruction,
      temperature: 0.0,
      maxOutputTokens: 50,
      responseMimeType: "application/json"
    }
  });

  const raw = response.text || '';
  const clean = raw.replace(/\`\`\`json|\`\`\`/g, '').trim();

  try {
    const json = JSON.parse(clean);
    return { ...json, transcript };
  } catch (err) {
    console.error("Failed to parse JSON from Voice Check-in", clean);
    return { site: null, pain_level: 0, transcript };
  }
}`;

// Find start of extractSymptoms and end of it.
const startRegex = /export async function extractSymptoms.*\{/;
// We know it ends right before `export const loadPdfJs`
const endIndex = pipe.indexOf('export const loadPdfJs');
const startIndex = pipe.search(startRegex);

if (startIndex !== -1 && endIndex !== -1) {
  pipe = pipe.slice(0, startIndex) + correctFunc + '\n\n' + pipe.slice(endIndex);
}

fs.writeFileSync('src/services/aiPipeline.ts', pipe, 'utf8');

console.log('Fixed extractSymptoms');
