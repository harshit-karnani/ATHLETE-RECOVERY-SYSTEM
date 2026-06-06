const fs = require('fs');
let content = fs.readFileSync('src/components/AthleteDashboard.tsx', 'utf8');

// Replace Teal with Slate/Black
content = content.replace(/border-teal-600 text-teal-600/g, 'border-slate-900 text-slate-900');
content = content.replace(/bg-teal-600 text-white shadow-sm shadow-teal-500\/20/g, 'bg-slate-900 text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg active:scale-95 transition-all duration-200');
content = content.replace(/bg-teal-600/g, 'bg-slate-900');
content = content.replace(/text-teal-600/g, 'text-slate-900');
content = content.replace(/border-teal-500/g, 'border-slate-900');
content = content.replace(/text-teal-700/g, 'text-slate-900');
content = content.replace(/bg-teal-50/g, 'bg-slate-100');
content = content.replace(/0F766E/g, '0f172a'); // slate-900 avatar background

// Add pop-up hover effects to other buttons
// Sidebar inactive buttons
content = content.replace(/text-neutral-600 hover:bg-white\/50/g, 'text-neutral-600 hover:bg-slate-100 hover:-translate-y-0.5 active:scale-95 transition-all duration-200');

// Top nav buttons hover effect
content = content.replace(/border-transparent text-neutral-500 hover:text-slate-900/g, 'border-transparent text-neutral-500 hover:text-slate-900 hover:-translate-y-0.5 transition-all duration-200');

// The "View Daily Protocol" button or similar buttons
content = content.replace(/bg-slate-900 hover:bg-slate-800/g, 'bg-slate-900 hover:bg-black hover:-translate-y-0.5 hover:shadow-lg active:scale-95 transition-all duration-200');

fs.writeFileSync('src/components/AthleteDashboard.tsx', content, 'utf8');
console.log('Refactored to premium black/white and added hover animations.');
