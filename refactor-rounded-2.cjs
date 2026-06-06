const fs = require('fs');
let content = fs.readFileSync('src/components/AthleteDashboard.tsx', 'utf8');

content = content.replace(/rounded-\[24px\]/g, 'rounded-md');
content = content.replace(/rounded-\[32px\]/g, 'rounded-md');
content = content.replace(/rounded-3xl/g, 'rounded-md');

// The active tab highlight uses `#3B82F6` (blue-500) which the user didn't want either.
// Let's replace that with teal-600.
content = content.replace(/bg-\[#3B82F6\]/g, 'bg-teal-600');
content = content.replace(/shadow-blue-500\/20/g, 'shadow-teal-500/20');

fs.writeFileSync('src/components/AthleteDashboard.tsx', content, 'utf8');
console.log('Fixed remaining rounded classes and blue backgrounds.');
