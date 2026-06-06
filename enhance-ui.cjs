const fs = require('fs');
let content = fs.readFileSync('src/components/AthleteDashboard.tsx', 'utf8');

// 1. Ensure all tabs have animations
// Scans tab
content = content.replace(
  /<div className="max-w-4xl mx-auto space-y-6">/g,
  '<div className="max-w-4xl mx-auto space-y-6 opacity-0 animate-reveal-up">'
);
// But wait, the first one is the overview tab which doesn't have that exact div (it's max-w-6xl). Let's fix that.
content = content.replace(
  /<div className="max-w-6xl mx-auto space-y-6">/,
  '<div className="max-w-6xl mx-auto space-y-6">'
);

// Add animations to individual items in Protocol tab
content = content.replace(
  /<div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-none space-y-6">/,
  '<div className="bg-white p-8 rounded-xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6 opacity-0 animate-reveal-up">'
);
content = content.replace(
  /<div className="grid grid-cols-1 md:grid-cols-2 gap-6">/,
  '<div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-0 animate-reveal-up animation-delay-200">'
);
content = content.replace(
  /<div className="bg-\[#FAFAFA\] p-6 rounded-xl border border-neutral-200">/,
  '<div className="bg-[#FAFAFA] p-6 rounded-xl border border-neutral-200 shadow-inner">'
);
content = content.replace(
  /<div className="bg-white p-6 rounded-xl border border-neutral-200">/,
  '<div className="bg-white p-6 rounded-xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">'
);

// 2. Enhance Buttons
// Sidebar buttons hover
content = content.replace(
  /hover:-translate-y-1 active:scale-95 transition-all duration-200/g,
  'hover:translate-x-1 hover:shadow-sm active:scale-95 transition-all duration-300 ease-out'
);

// Active sidebar buttons
content = content.replace(
  /bg-black text-white shadow-\[0_8px_20px_rgb\(0,0,0,0\.15\)\]/g,
  'bg-black text-white shadow-[0_4px_14px_0_rgb(0,0,0,0.39)] ring-1 ring-black/5 hover:translate-x-1 transition-all duration-300'
);

// "View Daily Protocol" button
content = content.replace(
  /bg-black hover:bg-neutral-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-none transition-colors/,
  'bg-black hover:bg-neutral-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-[0_4px_14px_0_rgb(0,0,0,0.39)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)] transition-all duration-300 active:scale-95'
);

// 3. Enhance the 7-Day Trend Graph
// Currently: <div className="w-full rounded-t-sm transition-all bg-white group-hover:bg-[#EEDADA]" style={{ height: `${val}%` }}></div>
// For the 6th index (Today): bg-[#0A0A0A]
content = content.replace(
  /className=\{`w-full rounded-t-sm transition-all \$\{i === 6 \? 'bg-\[#0A0A0A\]' : 'bg-white group-hover:bg-\[#EEDADA\]'\} `\}/g,
  "className={`w-full rounded-t-sm transition-all duration-500 ease-out ${i === 6 ? 'bg-gradient-to-t from-[#00C9A7] to-[#047857] shadow-[0_0_15px_rgba(0,201,167,0.4)]' : 'bg-gradient-to-t from-neutral-200 to-neutral-300 group-hover:from-neutral-300 group-hover:to-neutral-400'} `}"
);

// Make the graph bars grow on load by utilizing a slight trick or just making them look better
// Add a subtle grid behind the graph
content = content.replace(
  /<div className="flex items-end justify-between h-32 gap-2">/,
  '<div className="flex items-end justify-between h-32 gap-3 relative border-b border-neutral-200 pb-2 bg-[linear-gradient(to_bottom,transparent_0px,transparent_calc(100%-1px),#f5f5f5_calc(100%-1px))] bg-[length:100%_25%]">'
);

// 4. Floating Action Button
content = content.replace(
  /className="fixed bottom-8 right-8 w-14 h-14 bg-black hover:bg-neutral-800 text-white rounded-xl shadow-none flex items-center justify-center transition-transform hover:scale-105 z-50"/,
  'className="fixed bottom-8 right-8 w-14 h-14 bg-black hover:bg-neutral-800 text-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-50"'
);

// 5. Ensure the circle stroke animates in from 0
content = content.replace(
  /strokeDasharray=\{`\$\{score \* 2\.82\} 282`\} strokeLinecap="round" className="transition-all duration-1000 ease-out"/,
  'strokeDasharray={`${score * 2.82} 282`} strokeDashoffset="282" strokeLinecap="round" className="transition-all duration-[1500ms] ease-out animate-draw-check"'
);

fs.writeFileSync('src/components/AthleteDashboard.tsx', content, 'utf8');
console.log('Enhanced buttons, graphs, and animations.');
