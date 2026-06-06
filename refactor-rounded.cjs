const fs = require('fs');
let content = fs.readFileSync('src/components/AthleteDashboard.tsx', 'utf8');

// Replace large rounded corners with sharper, professional ones
content = content.replace(/rounded-2xl/g, 'rounded-sm');
content = content.replace(/rounded-xl/g, 'rounded-sm');
content = content.replace(/rounded-\[16px\]/g, 'rounded-sm');
content = content.replace(/rounded-\[20px\]/g, 'rounded-sm');
content = content.replace(/rounded-\[12px\]/g, 'rounded-sm');
content = content.replace(/rounded-\[10px\]/g, 'rounded-sm');
content = content.replace(/rounded-\[8px\]/g, 'rounded-sm');
content = content.replace(/rounded-lg/g, 'rounded-sm');
content = content.replace(/rounded-md/g, 'rounded-sm');

// Replace pill shapes (rounded-full) on cards/buttons/tags with sharper ones
// Note: We might want to keep rounded-full for the user avatar. Let's be careful.
// Let's replace rounded-full on typical buttons/tags but maybe leave it on the avatar.
// The avatar in the header has `rounded-full bg-slate-200 overflow-hidden ml-2 border border-slate-200`
// So let's replace `rounded-full px-` or `rounded-full py-` or `rounded-full text-` or `rounded-full border`
// Actually, in Tailwind, `rounded-sm` is universally better for this premium look.
// But avatars are typically round. Let's do a global replace of rounded-full EXCEPT in the header avatar div.
content = content.replace(/rounded-full(?! bg-slate-200 overflow-hidden ml-2)/g, 'rounded-sm');

// Wait, the "100 RECOVERY" circle is probably made with `rounded-full`. 
// If it's a circle, it needs rounded-full. 
// Let's specifically target the pills and buttons.
// Usually pills are `px-4 py-2 rounded-full` or something.
// Let's just manually replace some known rounded classes.
// Let's re-read the file first to be safe. But I'll just restore the avatar and progress circle if I break them.

content = content.replace(/rounded-full/g, 'rounded-sm');

// Restore avatar's rounded-full
content = content.replace(/className="w-8 h-8 rounded-sm bg-slate-200/g, 'className="w-8 h-8 rounded-full bg-slate-200');

// Restore progress circle if it exists
// e.g., <div className="w-48 h-48 rounded-full border-8...
content = content.replace(/w-48 h-48 rounded-sm/g, 'w-48 h-48 rounded-full');
content = content.replace(/w-64 h-64 rounded-sm/g, 'w-64 h-64 rounded-full');

// Remove heavy drop shadows that look "AI generated"
content = content.replace(/shadow-lg/g, 'shadow-sm');
content = content.replace(/shadow-xl/g, 'shadow-sm');
content = content.replace(/shadow-2xl/g, 'shadow-sm');
content = content.replace(/shadow-md/g, 'shadow-sm');

// Make borders slightly sharper
// content = content.replace(/border-2/g, 'border'); // Maybe too destructive

fs.writeFileSync('src/components/AthleteDashboard.tsx', content, 'utf8');
console.log('Rounded corners and shadows refactored successfully.');
