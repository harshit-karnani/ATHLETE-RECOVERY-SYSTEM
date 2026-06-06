const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(appPath, 'utf8');

// Global Dark Theme -> Light Clinical Theme mapping
// Backgrounds
content = content.replace(/bg-\[#0B1210\]/g, 'bg-white');
content = content.replace(/bg-\[#13201C\]\/40/g, 'bg-[#F4F6F8]');
content = content.replace(/bg-\[#13201C\]/g, 'bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] rounded-[16px]');
content = content.replace(/bg-black\/20/g, 'bg-[#F4F6F8]');
content = content.replace(/bg-black\/30/g, 'bg-[#F4F6F8]');
content = content.replace(/bg-black\/80/g, 'bg-[#0A1628]/80');
content = content.replace(/bg-\[#23352F\]/g, 'bg-[#E8ECF0]');

// Borders
content = content.replace(/border-\[#23352F\]\/70/g, 'border-[#E8ECF0]');
content = content.replace(/border-\[#23352F\]\/50/g, 'border-[#E8ECF0]');
content = content.replace(/border-\[#23352F\]\/40/g, 'border-[#E8ECF0]');
content = content.replace(/border-\[#23352F\]\/30/g, 'border-[#E8ECF0]');
content = content.replace(/border-\[#23352F\]\/20/g, 'border-[#E8ECF0]');
content = content.replace(/border-\[#23352F\]/g, 'border-[#E8ECF0]');
content = content.replace(/border-\[#D4AF37\]/g, 'border-[#00C9A7]');
content = content.replace(/border-white\/10/g, 'border-[#E8ECF0]');
content = content.replace(/border-white\/20/g, 'border-[#E8ECF0]');

// Texts
content = content.replace(/text-white/g, 'text-[#0A1628]');
content = content.replace(/text-\[#D4AF37\]/g, 'text-[#00C9A7]');
content = content.replace(/text-\[#6DA398\]/g, 'text-[#0A1628]'); // Used for labels
content = content.replace(/text-\[#E26D5A\]/g, 'text-[#FF4757]');
content = content.replace(/text-neutral-500/g, 'text-neutral-500');
content = content.replace(/text-neutral-400/g, 'text-neutral-500');
content = content.replace(/text-neutral-300/g, 'text-neutral-600');

// Gradients
content = content.replace(/from-\[#13201C\]/g, 'from-white');
content = content.replace(/to-\[#0B1210\]/g, 'to-[#F4F6F8]');
content = content.replace(/from-\[#0B1210\]/g, 'from-[#F4F6F8]');
content = content.replace(/to-transparent/g, 'to-transparent');

// Typography overrides
content = content.replace(/font-serif/g, 'font-serif'); // We mapped font-serif to Clash Display in CSS
content = content.replace(/font-sans/g, 'font-sans'); // Satoshi
content = content.replace(/font-mono/g, 'font-mono'); // JetBrains Mono

fs.writeFileSync(appPath, content);
console.log('Mass theme replacement complete.');
