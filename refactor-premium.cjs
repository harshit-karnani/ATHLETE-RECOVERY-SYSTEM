const fs = require('fs');
let content = fs.readFileSync('src/components/AthleteDashboard.tsx', 'utf8');

// The user wants a premium, completely monochrome (black/white) look that matches the "Zebra Synapse" reference image structurally.
// 1. Remove all lingering green/emerald colors
content = content.replace(/#047857/g, '#0A0A0A'); // Replace dark emerald with pure black/dark grey
content = content.replace(/#D1FAE5/g, '#F5F5F5'); // Replace light emerald with light grey
content = content.replace(/bg-emerald-50/g, 'bg-neutral-100');
content = content.replace(/text-\[#047857\]/g, 'text-black');
content = content.replace(/border-l-\[#047857\]/g, 'border-l-black');

// 2. Remove lingering blue colors (e.g. 🌙 emoji or icons currently using #3B82F6)
content = content.replace(/#3B82F6/g, '#0A0A0A');

// 3. Remove lingering red colors (like #8A2525 on hover)
content = content.replace(/hover:bg-\[#8A2525\]/g, 'hover:bg-neutral-800');

// 4. Emulate the structural card style from the reference:
// - Cards in reference: flat, no shadow, subtle border, rounded-2xl.
// However, the user complained about "rounded dashboards". So let's use rounded-xl with NO shadows.
content = content.replace(/shadow-sm/g, 'shadow-none');
content = content.replace(/shadow-\[0_4px_24px_rgba\(0,0,0,0.02\)\]/g, 'shadow-none');
content = content.replace(/rounded-sm/g, 'rounded-xl'); // Convert back to modern rounded-xl
content = content.replace(/rounded-md/g, 'rounded-xl');

// Ensure borders are very subtle to match reference
content = content.replace(/border-slate-200/g, 'border-neutral-200');

// Background adjustments
content = content.replace(/bg-slate-50/g, 'bg-[#FAFAFA]'); // Softer page background
content = content.replace(/bg-white/g, 'bg-white'); // Keep cards pure white

// Button styles (Primary)
content = content.replace(/bg-slate-900/g, 'bg-black');
content = content.replace(/text-slate-900/g, 'text-black');

// Tags/Labels typography to match reference (small caps, tracked out)
// e.g. "Optimal", "+4 vs Yesterday", "Peak Readiness"
content = content.replace(/text-\[10px\] font-bold uppercase tracking-wider/g, 'text-[10px] font-bold uppercase tracking-widest text-neutral-500');

// The big progress circle: 
// stroke="#FCF0F0" -> stroke="#F5F5F5"
content = content.replace(/stroke="#FCF0F0"/g, 'stroke="#F5F5F5"');

// Fix the hover transitions we added to make them smoother
content = content.replace(/hover:-translate-y-0.5/g, 'hover:-translate-y-1');

// Make the icon boxes like the reference (small rounded boxes)
content = content.replace(/w-10 h-10 bg-black rounded-xl/g, 'w-10 h-10 bg-white border border-neutral-200 rounded-lg');
content = content.replace(/w-8 h-8 rounded-xl bg-white/g, 'w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-100');
content = content.replace(/w-8 h-8 rounded-xl bg-neutral-100/g, 'w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-100');

// Final sweep of text colors
content = content.replace(/text-neutral-600/g, 'text-neutral-500');

fs.writeFileSync('src/components/AthleteDashboard.tsx', content, 'utf8');
console.log('Refactored to premium Zebra Synapse structural style in monochrome.');
