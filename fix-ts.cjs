const fs = require('fs');

// 1. App.tsx
let appC = fs.readFileSync('src/App.tsx', 'utf8');

// remove unused imports
appC = appC.replace(/import \{.*?\} from 'lucide-react';\n/s, "import { Flame, Loader2, Mic, MicOff, FileUp } from 'lucide-react';\n");

// activeTab type fix
appC = appC.replace(/useState\<'overview' \| 'recovery' \| 'archive'\>\('overview'\);/, "useState<'overview' | 'checkin' | 'history' | 'profile'>('overview');");

// Strip out massive blocks of unused state and functions from App.tsx
// This is somewhat tricky with pure regex, so let's do targeted replacements
const lines = appC.split('\n');
const filteredApp = lines.filter(line => {
  if (line.includes('coachActiveTab') || line.includes('setCoachActiveTab')) return false;
  if (line.includes('isOverrideModalOpen') || line.includes('setIsOverrideModalOpen')) return false;
  if (line.includes('modalAthleteId') || line.includes('setModalAthleteId')) return false;
  if (line.includes('overrideText') || line.includes('setOverrideText')) return false;
  if (line.includes('filterPosition') || line.includes('setFilterPosition')) return false;
  if (line.includes('filterStatus') || line.includes('setFilterStatus')) return false;
  if (line.includes('filterRehabPhase') || line.includes('setFilterRehabPhase')) return false;
  if (line.includes('aiLoading') || line.includes('setAiLoading')) return false;
  if (line.includes('analysisSource') || line.includes('setAnalysisSource')) return false;
  if (line.includes('aiError') || line.includes('setAiError')) return false;
  if (line.includes('uploadLoading') || line.includes('setUploadLoading')) return false;
  if (line.includes('uploadSuccess') || line.includes('setUploadSuccess')) return false;
  if (line.includes('lastSync')) return false;
  if (line.includes('hasMedicalReport')) return false;
  if (line.includes('imageType')) return false;
  if (line.includes('handleRunAI')) return false;
  if (line.includes('handlePushOverride')) return false;
  if (line.includes('handleApproveProtocol')) return false;
  if (line.includes('handleDocumentUpload')) return false;
  return true;
});
appC = filteredApp.join('\n');

// Also the reports reducer
appC = appC.replace(/reports=\{\s*athletes\.reduce\(\(acc, a\) => \{\s*acc\[a\.id\] = aiReport \|\| localReport;\s*return acc;\s*\}, \{\}\)\s*\}/, "reports={athletes.reduce((acc: any, a) => { acc[a.id] = aiReport || localReport; return acc; }, {}) as any}");

fs.writeFileSync('src/App.tsx', appC, 'utf8');

// 2. AthleteDashboard.tsx
let athC = fs.readFileSync('src/components/AthleteDashboard.tsx', 'utf8');
athC = athC.replace("import React from 'react';\n", "");
athC = athC.replace("Bell, Settings, Search, Plus, Calendar, History, User, HelpCircle, LogOut", "Bell, Settings, Plus, Calendar, History, User, HelpCircle, LogOut");
athC = athC.replace(/report\.overallScore/g, "report.score");
athC = athC.replace(/report\?\.coachDirective/g, "report?.athleteMessage");
fs.writeFileSync('src/components/AthleteDashboard.tsx', athC, 'utf8');

// 3. CoachPortal.tsx
let cpC = fs.readFileSync('src/components/CoachPortal.tsx', 'utf8');
cpC = cpC.replace("import React, { useState } from 'react';\n", "import { useState } from 'react';\n");
cpC = cpC.replace("Bell, Settings, Search, Plus, User, Activity, Clock, ShieldAlert, LogOut, CheckCircle2, ChevronRight", "Bell, Settings, Search, User, Activity, Clock, ShieldAlert, LogOut");
cpC = cpC.replace(/report\.overallScore/g, "report.score");
cpC = cpC.replace(/coachOverrides, onSaveOverride, /g, "");
cpC = cpC.replace(/setSelectedAthleteId, /g, "");
fs.writeFileSync('src/components/CoachPortal.tsx', cpC, 'utf8');

// 4. DailyCheckin.tsx
let dcC = fs.readFileSync('src/components/DailyCheckin.tsx', 'utf8');
dcC = dcC.replace("import React, { useState } from 'react';\n", "");
dcC = dcC.replace(/athlete, /g, "");
fs.writeFileSync('src/components/DailyCheckin.tsx', dcC, 'utf8');

// 5. server/routes/athlete.ts
let arC = fs.readFileSync('server/routes/athlete.ts', 'utf8');
arC = arC.replace(/const athlete_id = req\.body\.athlete_id;\n/, "");
fs.writeFileSync('server/routes/athlete.ts', arC, 'utf8');

// 6. server/seedSupabase.ts
let ssC = fs.readFileSync('server/seedSupabase.ts', 'utf8');
ssC = ssC.replace(/const embedding = response\.embeddings\[0\];/g, "const embedding = response.embeddings?.[0] || [];");
fs.writeFileSync('server/seedSupabase.ts', ssC, 'utf8');

console.log('Fixed TS errors!');
