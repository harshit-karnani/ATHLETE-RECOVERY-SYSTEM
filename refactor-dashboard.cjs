const fs = require('fs');
let content = fs.readFileSync('src/components/AthleteDashboard.tsx', 'utf8');

// The user wants clean professional white/black with teal/blue accents.
// Remove all the pink textures.

// Backgrounds
content = content.replace(/bg-\[#FCF5F5\]/g, 'bg-slate-50');
content = content.replace(/bg-\[#FCF0F0\]/g, 'bg-white');
content = content.replace(/bg-\[#FFF0F0\]/g, 'bg-teal-50');

// Borders
content = content.replace(/border-\[#EEDADA\]/g, 'border-slate-200');

// Text Colors
content = content.replace(/text-\[#1A1A1A\]/g, 'text-slate-900');

// The main brand color was B03030 (dark red). We change it to a professional Teal / Black
// Logo PUNARVA
content = content.replace(/text-\[#B03030\] tracking-tight">PUNARVA/g, 'text-slate-900 tracking-tighter">PUNARVA');

// Active tabs and buttons currently using text-[#B03030] -> text-teal-600
content = content.replace(/text-\[#B03030\]/g, 'text-teal-600');
content = content.replace(/border-\[#B03030\]/g, 'border-teal-600');
content = content.replace(/bg-\[#B03030\]/g, 'bg-teal-600');

// Additional UI fixes for "fake" or "slop" feel:
// Update font families. Currently it might use font-serif or something for standard text.
content = content.replace(/font-serif text-2xl font-black/g, 'font-serif text-3xl font-black tracking-tighter text-slate-900');

// Change avatar background color from B03030 to teal
content = content.replace(/background=B03030/g, 'background=0F766E'); // tailwind teal-700

// In overview tab, there is a "View Daily Protocol" button.
content = content.replace(/bg-\[#B03030\] hover:bg-\[#8A2525\]/g, 'bg-slate-900 hover:bg-slate-800');

// Change "100 RECOVERY" colors if they are weird. Currently they are probably green.
content = content.replace(/border-emerald-500/g, 'border-teal-500');
content = content.replace(/text-emerald-700/g, 'text-teal-700');
content = content.replace(/text-emerald-500/g, 'text-teal-600');
content = content.replace(/bg-emerald-100/g, 'bg-teal-50');

// Let's refine the specific left sidebar highlighting. 
// Right now it's "bg-blue-500" for the active button.
content = content.replace(/bg-blue-500/g, 'bg-slate-900');
content = content.replace(/bg-blue-50/g, 'bg-slate-100');
content = content.replace(/text-blue-600/g, 'text-slate-900');

// Save the file
fs.writeFileSync('src/components/AthleteDashboard.tsx', content, 'utf8');
console.log('Dashboard colors refactored successfully.');
