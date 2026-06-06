const fs = require('fs');

// 1. Scrub src/types.ts
let typesContent = fs.readFileSync('src/types.ts', 'utf8');

// Remove score
typesContent = typesContent.replace(/\s*score: number;/g, '');
typesContent = typesContent.replace(/\s*deductions: ScoreDeduction\[\];/g, '');
typesContent = typesContent.replace(/\s*history7Days: number\[\];/g, "\n  history7Days: ('CRITICAL' | 'HIGH_RISK' | 'MODERATE' | 'STABLE')[];");
// Change riskLevel type in RecoveryReport to match the new string literal
typesContent = typesContent.replace(/riskLevel: 'High' \| 'Medium' \| 'Low';/, "riskLevel: 'CRITICAL' | 'HIGH_RISK' | 'MODERATE' | 'STABLE';");

fs.writeFileSync('src/types.ts', typesContent, 'utf8');

// 2. Scrub src/engine.ts
// Just a rudimentary scrub for now so TS doesn't complain as much, although we are replacing this engine.
let engineContent = fs.readFileSync('src/engine.ts', 'utf8');
engineContent = engineContent.replace(/history7Days: number\[\]/g, "history7Days: ('CRITICAL' | 'HIGH_RISK' | 'MODERATE' | 'STABLE')[]");
// I will actually just disable the score generation inside engine.ts, but let's just do a big replace or delete it.
// The user says "Eradicate the Numeric Recovery Index Score... Delete them."
// I will replace all assignments to `score` with 0 or delete them.

fs.writeFileSync('src/engine.ts', engineContent, 'utf8');
console.log('Scrubbed types.ts');
