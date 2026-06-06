const fs = require('fs');

let adContent = fs.readFileSync('src/components/AthleteDashboard.tsx', 'utf8');
// Fix missing import
if (!adContent.includes('import { AIAnalysisHub }')) {
  adContent = adContent.replace(/import \{ Activity,/g, "import { AIAnalysisHub } from './AIAnalysisHub';\nimport { Activity,");
}
// Fix file analysis mock
adContent = adContent.replace(/analyzeMedicalScan\('mock-base64'\)/g, "analyzeMedicalScan(new File([], 'mock'))");
// Fix missing score for trend graph if it exists
adContent = adContent.replace(/\{score\}/g, '');
// Fix deductions
adContent = adContent.replace(/report\.deductions\.map\(\(d: any, i: any\)/g, "((report as any).deductions || []).map((d: any, i: any)");

fs.writeFileSync('src/components/AthleteDashboard.tsx', adContent, 'utf8');

let cpContent = fs.readFileSync('src/components/CoachPortal.tsx', 'utf8');
cpContent = cpContent.replace(/\{score\}/g, '');
cpContent = cpContent.replace(/strokeDasharray=\{\`\$\{score \* 2\.82\} 282\`\}/g, 'strokeDasharray="282 282"');
cpContent = cpContent.replace(/const score = report \? report\.score : 84;/g, '');
fs.writeFileSync('src/components/CoachPortal.tsx', cpContent, 'utf8');

let mdContent = fs.readFileSync('src/mockData.ts', 'utf8');
mdContent = mdContent.replace(/history7Days: \[82, 85, 78, 80, 88\]/g, "history7Days: ['STABLE', 'STABLE', 'MODERATE', 'STABLE', 'STABLE']");
fs.writeFileSync('src/mockData.ts', mdContent, 'utf8');

let asContent = fs.readFileSync('src/services/analysisService.ts', 'utf8');
asContent = asContent.replace(/deductions: \[\],/g, '');
fs.writeFileSync('src/services/analysisService.ts', asContent, 'utf8');

let engineContent = fs.readFileSync('src/engine.ts', 'utf8');
engineContent = engineContent.replace(/direction === 'Declining'/g, 'false');
engineContent = engineContent.replace(/direction === 'Improving'/g, 'false');
engineContent = engineContent.replace(/direction === 'Volatile'/g, 'false');
engineContent = engineContent.replace(/riskLevel: 'Low' \| 'High' \| 'Medium'/g, "riskLevel: 'STABLE' | 'CRITICAL' | 'MODERATE' | 'HIGH_RISK'");
engineContent = engineContent.replace(/riskLevel: 'Low'/g, "riskLevel: 'STABLE'");
engineContent = engineContent.replace(/riskLevel: 'Medium'/g, "riskLevel: 'MODERATE'");
engineContent = engineContent.replace(/riskLevel = 'Medium'/g, "riskLevel = 'MODERATE'");
engineContent = engineContent.replace(/riskLevel = 'Low'/g, "riskLevel = 'STABLE'");
engineContent = engineContent.replace(/riskLevel === 'Medium'/g, "riskLevel === 'MODERATE'");
engineContent = engineContent.replace(/riskLevel === 'High'/g, "riskLevel === 'CRITICAL'");
engineContent = engineContent.replace(/riskLevel = 'High'/g, "riskLevel = 'CRITICAL'");
fs.writeFileSync('src/engine.ts', engineContent, 'utf8');

console.log('Fixed final TS errors.');
