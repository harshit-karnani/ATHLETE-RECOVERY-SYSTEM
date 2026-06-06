const fs = require('fs');

let ad = fs.readFileSync('src/components/AthleteDashboard.tsx', 'utf8');

// The reason it crashes might be a syntax error or a missing import.
if (!ad.includes('import { AIAnalysisHub }')) {
  ad = "import { AIAnalysisHub } from './AIAnalysisHub';\n" + ad;
}

// Ensure `AIAnalysisHub` is actually injected.
// Let's just find where `100 RECOVERY` might be, or `score` and remove it.
ad = ad.replace(/<AIAnalysisHub athleteId=\{athlete\.id\} \/>/g, ''); // clear any previous broken injections

// The original area was:
// <div className="lg:col-span-2 bg-white rounded-xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 flex flex-col items-center justify-center opacity-0 animate-reveal-up">
// Let's find it.
const startArea = '<div className="lg:col-span-2 bg-white';
const endArea = '<div className="lg:col-span-3 bg-white';

const idxStart = ad.indexOf(startArea);
const idxEnd = ad.indexOf(endArea);

if (idxStart !== -1 && idxEnd !== -1) {
  // Replace the entire top left block with AIAnalysisHub
  ad = ad.slice(0, idxStart) + 
       '<div className="lg:col-span-5 mb-6"><AIAnalysisHub athleteId={athlete.id} /></div>\n' + 
       ad.slice(idxEnd);
} else {
  // If we already replaced it but it's malformed? 
  if (ad.indexOf('<div className="lg:col-span-5 mb-6">') !== -1) {
    // it is already there. Let's make sure it's correct.
  }
}

// Remove remaining `score` references
ad = ad.replace(/\{score\}/g, '');
ad = ad.replace(/const score = .*;/g, '');

// Clean up any remaining deductions block
ad = ad.replace(/<h3 className="font-bold text-lg mb-4">Recovery Factors<\/h3>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g, '');
ad = ad.replace(/\{\(\(report as any\)\.deductions \|\| \[\]\)\.map\(\(d: any, i: any\) => \([\s\S]*?\}\)\}/g, '');

// File mock issue
ad = ad.replace(/analyzeMedicalScan\('mock-base64'\)/g, "analyzeMedicalScan(new File([], 'mock'))");
ad = ad.replace(/report\.deductions\.map/g, "((report as any).deductions || []).map");

fs.writeFileSync('src/components/AthleteDashboard.tsx', ad, 'utf8');

// Fix CoachPortal TS error
let cp = fs.readFileSync('src/components/CoachPortal.tsx', 'utf8');
cp = cp.replace(/const score = .*;/g, '');
cp = cp.replace(/\{score\}/g, '');
cp = cp.replace(/strokeDasharray=\{\`\$\{score \* 2\.82\} 282\`\}/g, 'strokeDasharray="282 282"');
fs.writeFileSync('src/components/CoachPortal.tsx', cp, 'utf8');

// Fix engine.ts types
let eng = fs.readFileSync('src/engine.ts', 'utf8');
eng = eng.replace(/let riskLevel: 'High' \| 'Medium' \| 'Low';/g, "let riskLevel: 'CRITICAL' | 'HIGH_RISK' | 'MODERATE' | 'STABLE';");
eng = eng.replace(/let riskLevel: 'CRITICAL' \| 'HIGH_RISK' \| 'MODERATE' \| 'STABLE';/g, "let riskLevel: 'CRITICAL' | 'HIGH_RISK' | 'MODERATE' | 'STABLE';"); // ensure it's not duplicated
eng = eng.replace(/'Low' \| 'High' \| 'Medium'/g, "'CRITICAL' | 'HIGH_RISK' | 'MODERATE' | 'STABLE'");
fs.writeFileSync('src/engine.ts', eng, 'utf8');

// fix mockData.ts
let md = fs.readFileSync('src/mockData.ts', 'utf8');
md = md.replace(/history7Days: \[[\d\s,]+\]/g, "history7Days: ['STABLE', 'STABLE', 'MODERATE', 'STABLE', 'STABLE', 'HIGH_RISK', 'CRITICAL']");
fs.writeFileSync('src/mockData.ts', md, 'utf8');

console.log('Fixed React rendering issues and TS errors');
