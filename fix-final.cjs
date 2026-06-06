const fs = require('fs');

let ad = fs.readFileSync('src/components/AthleteDashboard.tsx', 'utf8');
ad = ad.replace(/import \{ analyzeMedicalScan \} from '\.\.\/services\/aiPipeline';/g, '');
ad = ad.replace(/const base64Data = reader\.result as string;/g, '');
fs.writeFileSync('src/components/AthleteDashboard.tsx', ad, 'utf8');

let aiHub = fs.readFileSync('src/components/AIAnalysisHub.tsx', 'utf8');
aiHub = aiHub.replace(/import React, \{ useState \} from 'react';/g, "import { useState } from 'react';");
fs.writeFileSync('src/components/AIAnalysisHub.tsx', aiHub, 'utf8');

let cp = fs.readFileSync('src/components/CoachPortal.tsx', 'utf8');
cp = cp.replace(/, report/g, ''); // remove unused report
fs.writeFileSync('src/components/CoachPortal.tsx', cp, 'utf8');

let md = fs.readFileSync('src/mockData.ts', 'utf8');
md = md.replace(/history7Days: \[75, 80, 85, 82, 88\]/g, "history7Days: ['STABLE', 'STABLE', 'MODERATE', 'STABLE', 'STABLE']");
fs.writeFileSync('src/mockData.ts', md, 'utf8');

let engine = fs.readFileSync('src/engine.ts', 'utf8');
engine = engine.replace(/score: 0,/g, '');
engine = engine.replace(/riskLevel === 'Medium'/g, "riskLevel === 'MODERATE'");
engine = engine.replace(/riskLevel === 'High'/g, "riskLevel === 'CRITICAL'");
fs.writeFileSync('src/engine.ts', engine, 'utf8');

let asService = fs.readFileSync('src/services/analysisService.ts', 'utf8');
asService = asService.replace(/deductions: \[\],/g, '');
fs.writeFileSync('src/services/analysisService.ts', asService, 'utf8');
