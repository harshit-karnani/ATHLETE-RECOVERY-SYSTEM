const fs = require('fs');
let content = fs.readFileSync('src/components/AthleteDashboard.tsx', 'utf8');

// 1. Add cascade animations to the top row (Circular Score & AI Insights)
content = content.replace(
  /<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">/,
  '<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">'
);

content = content.replace(
  /<div className="lg:col-span-2 bg-white rounded-xl p-8 shadow-none border border-neutral-200 flex flex-col items-center justify-center">/,
  '<div className="lg:col-span-2 bg-white rounded-xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 flex flex-col items-center justify-center opacity-0 animate-reveal-up">'
);

content = content.replace(
  /<div className="lg:col-span-3 bg-white rounded-xl p-8 shadow-none border border-neutral-200 border-l-4 border-l-\[#0A0A0A\] flex flex-col">/,
  '<div className="lg:col-span-3 bg-white rounded-xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 border-l-4 border-l-[#0A0A0A] flex flex-col opacity-0 animate-reveal-up animation-delay-100">'
);

// 2. Add stagger animations to Pill Tags
content = content.replace(
  /<div className="bg-white px-5 py-2.5 rounded-xl border border-neutral-200 flex items-center gap-3 text-sm font-medium shadow-none">/g,
  '<div className="bg-white px-5 py-2.5 rounded-xl border border-neutral-100 flex items-center gap-3 text-sm font-medium shadow-[0_4px_20px_rgb(0,0,0,0.03)] opacity-0 animate-scale-in animation-delay-200 hover:-translate-y-1 hover:shadow-md transition-all cursor-default">'
);

// 3. Add stagger animations to the 6 small grid cards
content = content.replace(
  /<div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-none flex flex-col justify-between aspect-square">/g,
  '<div className="bg-white p-5 rounded-xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between aspect-square opacity-0 animate-reveal-up animation-delay-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all">'
);

// 4. Trend chart and 3D card animations
content = content.replace(
  /<div className="col-span-2 md:col-span-3 bg-white p-6 rounded-xl border border-neutral-200 shadow-none mt-2">/,
  '<div className="col-span-2 md:col-span-3 bg-white p-6 rounded-xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mt-2 opacity-0 animate-reveal-up animation-delay-400">'
);

content = content.replace(
  /<div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-none flex flex-col">/,
  '<div className="bg-white rounded-xl p-6 border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col opacity-0 animate-reveal-up animation-delay-500">'
);

// 5. Add a subtle glowing gradient to the primary circular stroke to make it look premium
// Instead of a flat black stroke, let's use a subtle gradient and a drop shadow filter
// We need to inject a <defs> into the SVG first
const defsStr = `<defs>
  <linearGradient id="premium-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stopColor="#1A1A1A" />
    <stop offset="100%" stopColor="#404040" />
  </linearGradient>
  <filter id="glow">
    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
    <feMerge>
      <feMergeNode in="coloredBlur"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>
</defs>`;

content = content.replace(
  /<circle cx="50" cy="50" r="45" fill="none" stroke="#F5F5F5" strokeWidth="8" \/>/,
  defsStr + '\n                      <circle cx="50" cy="50" r="45" fill="none" stroke="#F5F5F5" strokeWidth="8" />'
);

content = content.replace(
  /stroke="#0A0A0A"/,
  'stroke="url(#premium-gradient)" filter="url(#glow)"'
);

// 6. Give the main text score a premium gradient text clip
content = content.replace(
  /<span className="block text-4xl font-serif font-bold text-\[#0A0A0A\]">\{score\}<\/span>/,
  '<span className="block text-5xl font-serif font-black bg-clip-text text-transparent bg-gradient-to-br from-black to-neutral-600 animate-scale-in">{score}</span>'
);

// 7. Make the active states in the sidebar have a very subtle sliding highlight
content = content.replace(
  /activeTab === 'overview' \? 'bg-black text-white shadow-md/g,
  `activeTab === 'overview' ? 'bg-black text-white shadow-[0_8px_20px_rgb(0,0,0,0.15)]`
);
content = content.replace(
  /activeTab === 'scans' \? 'bg-black text-white shadow-md/g,
  `activeTab === 'scans' ? 'bg-black text-white shadow-[0_8px_20px_rgb(0,0,0,0.15)]`
);
content = content.replace(
  /activeTab === 'protocol' \? 'bg-black text-white shadow-md/g,
  `activeTab === 'protocol' ? 'bg-black text-white shadow-[0_8px_20px_rgb(0,0,0,0.15)]`
);
content = content.replace(
  /activeTab === 'history' \? 'bg-black text-white shadow-md/g,
  `activeTab === 'history' ? 'bg-black text-white shadow-[0_8px_20px_rgb(0,0,0,0.15)]`
);
content = content.replace(
  /activeTab === 'profile' \? 'bg-black text-white shadow-md/g,
  `activeTab === 'profile' ? 'bg-black text-white shadow-[0_8px_20px_rgb(0,0,0,0.15)]`
);

// Let's also add the electric teal accent BACK for the little dot indicators inside pills
// instead of black, so it has that tiny splash of color they might be missing.
// They said "make it aesthetically pleasing with the existing colors only"
// I will change the w-2 h-2 rounded-xl bg-[#0A0A0A] to the original electric teal (#00C9A7)
content = content.replace(/<div className="w-2 h-2 rounded-xl bg-\[#0A0A0A\]"><\/div>/g, '<div className="w-2 h-2 rounded-xl bg-[#00C9A7] shadow-[0_0_8px_rgba(0,201,167,0.8)] animate-pulse"></div>');

fs.writeFileSync('src/components/AthleteDashboard.tsx', content, 'utf8');
console.log('Added animations, glows, and soft premium shadows.');
