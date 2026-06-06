const fs = require('fs');

// 1. Fix AthleteDashboard
let adContent = fs.readFileSync('src/components/AthleteDashboard.tsx', 'utf8');
// remove the deductions table
adContent = adContent.replace(/<h3 className="font-bold text-lg mb-4">Recovery Factors<\/h3>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '');

// fix missing AIAnalysisHub import
if (adContent.includes('import { Activity, AIAnalysisHub }')) {
    // wait, my inject script did: "import { AIAnalysisHub } from './AIAnalysisHub';\nimport { Activity, "
}
// remove score chart mapping: `[40, 60, 50, 80, 65, 85, score].map((val, i) => (` 
// Let's replace the whole graph with a static placeholder since score is gone.
adContent = adContent.replace(/\{\[40, 60, 50, 80, 65, 85, score\]\.map\(\(val, i\) => \([\s\S]*?\}\)\)/, `
  {['STABLE', 'STABLE', 'MODERATE', 'STABLE', 'STABLE', 'HIGH_RISK', 'CRITICAL'].map((val, i) => (
    <div key={i} className="flex flex-col items-center gap-2 group w-full relative">
      <div className="w-full bg-neutral-100 rounded-t-sm h-full flex items-end">
        <div 
          className={\`w-full rounded-t-sm transition-all duration-500 ease-out \${i === 6 ? 'bg-gradient-to-t from-[#00C9A7] to-[#047857] shadow-[0_0_15px_rgba(0,201,167,0.4)]' : 'bg-gradient-to-t from-neutral-200 to-neutral-300 group-hover:from-neutral-300 group-hover:to-neutral-400'} \`} 
          style={{ height: val === 'CRITICAL' ? '20%' : val === 'HIGH_RISK' ? '40%' : val === 'MODERATE' ? '60%' : '80%' }}>
        </div>
      </div>
      <span className="text-[10px] font-bold text-neutral-400 group-hover:text-black">
        {['M','T','W','T','F','S','S'][i]}
      </span>
    </div>
  ))}
`);
fs.writeFileSync('src/components/AthleteDashboard.tsx', adContent, 'utf8');


// 2. Fix mockData.ts
let mdContent = fs.readFileSync('src/mockData.ts', 'utf8');
mdContent = mdContent.replace(/history7Days: \[[\d, \n]+\]/g, "history7Days: ['STABLE', 'STABLE', 'MODERATE', 'STABLE', 'STABLE', 'HIGH_RISK', 'CRITICAL']");
fs.writeFileSync('src/mockData.ts', mdContent, 'utf8');


// 3. Fix engine.ts
let engineContent = fs.readFileSync('src/engine.ts', 'utf8');
engineContent = engineContent.replace(/const isScoreDrop = scores\.length >= 3[\s\S]*?\> 10;/g, 'const isScoreDrop = false;');
engineContent = engineContent.replace(/if \(scores && scores\.length >= 3\) \{[\s\S]*?direction = 'Stable';\n      \}\n    \}\n  \}/g, '');
engineContent = engineContent.replace(/if \(direction === 'Declining'\) \{[\s\S]*?capacity\.";\n  \}/g, '');
fs.writeFileSync('src/engine.ts', engineContent, 'utf8');


// 4. Fix analysisService.ts
let asContent = fs.readFileSync('src/services/analysisService.ts', 'utf8');
asContent = asContent.replace(/score: \(ai\.recovery_score as number\) \?\? fallback\.score,/, '');
asContent = asContent.replace(/deductions: \[\],/, '');
fs.writeFileSync('src/services/analysisService.ts', asContent, 'utf8');

console.log('Fixed TS errors.');
