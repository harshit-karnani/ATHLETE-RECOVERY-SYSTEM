const fs = require('fs');

// 1. App.tsx
let appC = fs.readFileSync('src/App.tsx', 'utf8');
appC = appC.replace(/<AthleteDashboard/g, "<AthleteDashboard athlete={currentAthlete} ");
fs.writeFileSync('src/App.tsx', appC, 'utf8');

// 2. CoachPortal.tsx
let cpC = fs.readFileSync('src/components/CoachPortal.tsx', 'utf8');
cpC = cpC.replace(/, TodayLog/g, "");
cpC = cpC.replace(/TodayLog, /g, "");
fs.writeFileSync('src/components/CoachPortal.tsx', cpC, 'utf8');

// 3. DailyCheckin.tsx
let dcC = fs.readFileSync('src/components/DailyCheckin.tsx', 'utf8');
dcC = dcC.replace(/Athlete, /g, "");
dcC = dcC.replace(/, Athlete/g, "");
fs.writeFileSync('src/components/DailyCheckin.tsx', dcC, 'utf8');

// 4. server/routes/athlete.ts
let arC = fs.readFileSync('server/routes/athlete.ts', 'utf8');
arC = arC.replace(/const athlete_id = (.*?);/g, "// const athlete_id = $1;");
fs.writeFileSync('server/routes/athlete.ts', arC, 'utf8');

// 5. server/seedSupabase.ts
let ssC = fs.readFileSync('server/seedSupabase.ts', 'utf8');
ssC = ssC.replace(/const embedding = response\?\.[a-zA-Z0-9_\.\?\^\[\]\|]*?;/g, "const embedding = response?.embeddings?.[0] || [];");
fs.writeFileSync('server/seedSupabase.ts', ssC, 'utf8');

console.log('Fixed TS errors 4!');
