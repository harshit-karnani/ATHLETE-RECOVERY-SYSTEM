const fs = require('fs');

let content = fs.readFileSync('src/components/sections/hero-section.tsx', 'utf8');

// Fix 'easeOut'
content = content.replace(/ease: "easeOut"/g, 'ease: "easeOut" as any');
// Fix 'spring'
content = content.replace(/type: "spring",/g, 'type: "spring" as any,');
// Let's just fix it by casting transition object to any for simplicity, or just change "easeOut" to "easeOut" as any
// Wait, I can just write a replace for ease: "easeOut"
// Let's run this.

fs.writeFileSync('src/components/sections/hero-section.tsx', content, 'utf8');
console.log("Done");
