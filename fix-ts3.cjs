const fs = require('fs');

// 1. App.tsx
let appC = fs.readFileSync('src/App.tsx', 'utf8');
appC = appC.replace(/athleteLogs=\{logPresets\}/g, "");
appC = appC.replace(/athlete=\{currentAthlete\}/g, "");
fs.writeFileSync('src/App.tsx', appC, 'utf8');

// 2. CoachPortal.tsx
let cpC = fs.readFileSync('src/components/CoachPortal.tsx', 'utf8');
cpC = cpC.replace(/athleteLogs: Record<string, TodayLog>;/g, "");
cpC = cpC.replace(/athleteLogs, /g, "");
fs.writeFileSync('src/components/CoachPortal.tsx', cpC, 'utf8');

// 3. DailyCheckin.tsx
let dcC = fs.readFileSync('src/components/DailyCheckin.tsx', 'utf8');
dcC = dcC.replace(/athlete: Athlete;\n/g, "");
fs.writeFileSync('src/components/DailyCheckin.tsx', dcC, 'utf8');

// 4. server/routes/athlete.ts
let arC = fs.readFileSync('server/routes/athlete.ts', 'utf8');
arC = arC.replace(/const athlete_id = req\.body\.athlete_id;/g, "");
// wait, the error is line 51, "const athlete_id"
arC = arC.replace(/const athlete_id[\s\S]*?;/g, "");
fs.writeFileSync('server/routes/athlete.ts', arC, 'utf8');

// 5. server/seedSupabase.ts
let ssC = fs.readFileSync('server/seedSupabase.ts', 'utf8');
ssC = ssC.replace(/const embedding = response\.embeddings\[0\];/g, "const embedding = response.embeddings?.[0] || [];");
ssC = ssC.replace(/const embedding = response\.embeddings\?\.\[0\] \|\| \[\];/g, "const embedding = response?.embeddings?.[0] || [];");
fs.writeFileSync('server/seedSupabase.ts', ssC, 'utf8');

console.log('Fixed final TS errors!');
