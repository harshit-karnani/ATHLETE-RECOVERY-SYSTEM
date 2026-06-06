const fs = require('fs');

// 1. App.tsx
let appC = fs.readFileSync('src/App.tsx', 'utf8');
// Fix array indexing for logPresets
appC = appC.replace(/const log = logPresets\[currentAthlete\.id\];/g, "const log = logPresets[currentAthlete.id]?.[0]?.log || logPresets['marcus-vance'][0].log;");
appC = appC.replace(/logPresets\[a\.id\]/g, "(logPresets[a.id]?.[0]?.log || logPresets['marcus-vance'][0].log)");
// Fix unused useEffect
appC = appC.replace(/import \{ useState, useEffect \} from 'react';/, "import { useState } from 'react';");
// Fix unused TodayLog
appC = appC.replace(/import type \{ TodayLog, RecoveryReport \} from '\.\/types';/, "import type { RecoveryReport } from './types';");
fs.writeFileSync('src/App.tsx', appC, 'utf8');

// 2. CoachPortal.tsx
let cpC = fs.readFileSync('src/components/CoachPortal.tsx', 'utf8');
// Fix unused log
cpC = cpC.replace(/const log = athleteLogs\[currentAthlete\.id\];\n/g, "");
fs.writeFileSync('src/components/CoachPortal.tsx', cpC, 'utf8');

// 3. server/routes/athlete.ts
let arC = fs.readFileSync('server/routes/athlete.ts', 'utf8');
arC = arC.replace(/const athlete_id = req\.body\.athlete_id;/g, "");
fs.writeFileSync('server/routes/athlete.ts', arC, 'utf8');

// 4. server/seedSupabase.ts
let ssC = fs.readFileSync('server/seedSupabase.ts', 'utf8');
ssC = ssC.replace(/const embedding = response\.embeddings\[0\];/g, "const embedding = response.embeddings?.[0] || [];");
fs.writeFileSync('server/seedSupabase.ts', ssC, 'utf8');

// 5. services/analysisService.ts
let asC = fs.readFileSync('src/services/analysisService.ts', 'utf8');
asC = asC.replace(/const risk = /g, "// const risk = ");
fs.writeFileSync('src/services/analysisService.ts', asC, 'utf8');

console.log('Fixed more TS errors!');
