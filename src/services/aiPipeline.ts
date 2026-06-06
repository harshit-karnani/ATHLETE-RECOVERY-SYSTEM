import { GoogleGenAI } from '@google/genai';

// ─── Web Speech API ─────────────────────────────────────────────
export async function recordSpeech(): Promise<string> {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) {
    throw new Error("SpeechRecognition API not supported in this browser. Use Chrome or Edge.");
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  return new Promise<string>((resolve, reject) => {
    let handled = false;
    recognition.onresult = (event: any) => {
      handled = true;
      resolve(event.results[0][0].transcript);
    };
    recognition.onerror = (event: any) => {
      handled = true;
      reject(new Error("Speech recognition error: " + event.error));
    };
    recognition.onnomatch = () => {
      handled = true;
      reject(new Error("No speech recognized. Please try again."));
    };
    recognition.onend = () => {
      if (!handled) {
        reject(new Error("Microphone closed before detecting speech."));
      }
    };
    recognition.start();
  });
}

// ─── Symptom Extraction (Voice/Text → JSON) ─────────────────────
export async function extractSymptoms(text: string): Promise<{ site: string | null; pain_level: number; transcript: string }> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing VITE_GEMINI_API_KEY");

  const ai = new GoogleGenAI({ apiKey });
  const cleanedText = text.trim();
  if (!cleanedText) return { site: null, pain_level: 0, transcript: '' };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: cleanedText,
    config: {
      systemInstruction: 'Output ONLY minified JSON: {"site": string|null, "pain_level": int}. No markdown.',
      temperature: 0.0,
      maxOutputTokens: 50,
      responseMimeType: "application/json"
    }
  });

  const raw = response.text || '';
  const clean = raw.replace(/```json|```/g, '').trim();

  try {
    const json = JSON.parse(clean);
    return { ...json, transcript: text };
  } catch {
    console.error("Failed to parse symptom JSON:", clean);
    return { site: null, pain_level: 0, transcript: text };
  }
}

// ─── PDF.js Loader ──────────────────────────────────────────────
export const loadPdfJs = async () => {
  if ((window as any).pdfjsLib) return (window as any).pdfjsLib;
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
    script.onload = () => {
      const pdfjs = (window as any).pdfjsLib;
      if (!pdfjs) return reject(new Error('pdfjsLib not found on window'));
      pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
      resolve(pdfjs);
    };
    script.onerror = () => reject(new Error('Failed to load pdf.js from CDN'));
    document.head.appendChild(script);
    setTimeout(() => {
      if (!(window as any).pdfjsLib) reject(new Error('pdf.js load timed out'));
    }, 15000);
  });
};

// ─── Medical Scan / Report Analyzer ─────────────────────────────
export async function analyzeMedicalScan(file: File) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing VITE_GEMINI_API_KEY");

  const ai = new GoogleGenAI({ apiKey });

  let base64Image = '';
  let mimeType = 'image/jpeg';

  // ── Convert PDF to image via canvas ──
  if (file.type === 'application/pdf') {
    console.log('[analyzeMedicalScan] Loading pdf.js for PDF file...');
    const pdfjs = await loadPdfJs() as any;
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);
    
    const scale = 2.0; // Higher resolution for better OCR
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport }).promise;
    
    const dataUrl = canvas.toDataURL('image/png', 1.0); // PNG for sharper text
    base64Image = dataUrl.split(',')[1];
    mimeType = 'image/png';
    console.log(`[analyzeMedicalScan] PDF rendered to ${canvas.width}x${canvas.height} PNG`);

  } else if (file.type.startsWith('image/')) {
    mimeType = file.type;
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    base64Image = window.btoa(binary);
    console.log(`[analyzeMedicalScan] Image loaded, type: ${mimeType}`);

  } else {
    throw new Error("Unsupported file type: " + file.type);
  }

  if (!base64Image) {
    throw new Error("Failed to extract image data from file");
  }

  console.log(`[analyzeMedicalScan] Sending to Gemini Vision (${(base64Image.length / 1024).toFixed(0)}KB base64)...`);

  // ── Send to Gemini Vision with proper multimodal format ──
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Image
            }
          },
          {
            text: `You are an elite sports medicine AI. Analyze this medical document thoroughly.
            
This could be a blood report, MRI, X-Ray, DEXA scan, or clinician notes.

For blood reports: identify ALL out-of-range biomarkers (hemoglobin, RBC, WBC, platelets, iron, vitamin D, B12, etc.)
For imaging: identify the anatomical finding, severity, and any restrictions.
For clinical notes: extract the diagnosis, treatment plan, and contraindications.

Output ONLY valid minified JSON using this exact schema:
{"diagnosis": "Primary finding", "focus_area": "Body part or Systemic/Blood", "flags": ["Each out-of-range value or restriction as a separate item"]}

Examples:
- Blood: {"diagnosis": "Iron deficiency anemia", "focus_area": "Systemic/Blood", "flags": ["Hemoglobin: 10.2 g/dL (LOW)", "Serum Iron: 35 mcg/dL (LOW)", "Ferritin: 8 ng/mL (LOW)"]}
- MRI: {"diagnosis": "Grade II ACL sprain", "focus_area": "Left Knee", "flags": ["Avoid pivoting movements", "No full extension under load"]}

Return ONLY the JSON object, nothing else.`
          }
        ]
      }
    ],
    config: {
      temperature: 0.1,
      maxOutputTokens: 500,
      responseMimeType: "application/json"
    }
  });

  const raw = response.text || '';
  console.log('[analyzeMedicalScan] Raw Gemini response:', raw);
  
  const clean = raw.replace(/```json|```/g, '').trim();

  try {
    const parsed = JSON.parse(clean);
    console.log('[analyzeMedicalScan] Parsed result:', parsed);
    return parsed;
  } catch (err) {
    console.error("[analyzeMedicalScan] JSON parse failed. Raw:", clean);
    return { diagnosis: 'Parse error - see console', focus_area: 'Unknown', flags: [clean.substring(0, 200)] };
  }
}
