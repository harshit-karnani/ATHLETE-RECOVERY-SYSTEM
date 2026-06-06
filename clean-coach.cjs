const fs = require('fs');
let content = fs.readFileSync('src/components/CoachPortal.tsx', 'utf8');

// Remove the `score` references
content = content.replace(/const score = report \? report\.score : 84;/g, '');

// The coach portal has a circular score:
// <circle cx="50" cy="50" r="45" fill="none" stroke="#047857" strokeWidth="6" strokeDasharray={`${score * 2.82} 282`} strokeLinecap="round" />
// <span className="block text-4xl font-serif font-bold text-[#047857]">{score}</span>
// Let's replace it with a Risk Badge.

const startSearch = `<div className="flex-shrink-0 relative w-32 h-32 flex items-center justify-center">`;
const endSearch = `</div>\n                    <div className="flex-1">`;

const startIndex = content.indexOf(startSearch);
const endIndex = content.indexOf(endSearch);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `<div className="flex-shrink-0 flex items-center justify-center">\n                      <div className="px-6 py-3 bg-red-100 text-red-800 rounded-full font-bold text-xl">\n                        {report ? report.riskLevel : 'CRITICAL'}\n                      </div>\n                    </div>\n                    `;
  content = content.slice(0, startIndex) + replacement + content.slice(endIndex + 6);
}

fs.writeFileSync('src/components/CoachPortal.tsx', content, 'utf8');
console.log('Cleaned CoachPortal.');
