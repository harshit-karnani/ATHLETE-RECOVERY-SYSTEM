const fs = require('fs');

let content = fs.readFileSync('src/components/AthleteDashboard.tsx', 'utf8');

// Add import
if (!content.includes('import { AIAnalysisHub }')) {
  content = content.replace(
    /import \{ Activity, /g, 
    "import { AIAnalysisHub } from './AIAnalysisHub';\nimport { Activity, "
  );
}

// Remove the 100 RECOVERY circle and replace with AIAnalysisHub
// Currently it's a huge block of code
const targetRegex = /<div className="lg:col-span-2 bg-white rounded-xl p-8[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/;

// We need a safer replace because of nested divs.
// I will just use string replacement on a known chunk.

// Or we can just use another script to do it. Let's find the start of the 100 RECOVERY section.
const startSearch = `<div className="lg:col-span-2`;
// The next sibling is `<div className="lg:col-span-3`. 
const endSearch = `<div className="lg:col-span-3`;

const startIndex = content.indexOf(startSearch);
const endIndex = content.indexOf(endSearch);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `<div className="lg:col-span-5 mb-6">\n              <AIAnalysisHub athleteId={athlete.id} />\n            </div>\n            `;
  content = content.slice(0, startIndex) + replacement + content.slice(endIndex);
}

// Also remove `const score = report ? report.score : 84;`
content = content.replace(/const score = report \? report\.score : 84;/g, '');

fs.writeFileSync('src/components/AthleteDashboard.tsx', content, 'utf8');
console.log('Injected AIAnalysisHub into AthleteDashboard.');
