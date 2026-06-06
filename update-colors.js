const fs = require('fs');
const path = require('path');

const filePaths = [
  path.join(__dirname, 'src', 'App.tsx'),
  path.join(__dirname, 'src', 'components', 'LandingPage.tsx')
];

for (const filePath of filePaths) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Navy to Dark Text
  content = content.replace(/#0A1628/g, '#1A1A1A');
  
  // Teal to Burgundy
  content = content.replace(/#00C9A7/g, '#B03030');
  
  // Off-white/Gray panels to Cream/Pink
  content = content.replace(/#F4F6F8/g, '#FFF8F8');
  content = content.replace(/#E8ECF0/g, '#EEDADA');
  
  // E5E5E5 to EEDADA
  content = content.replace(/#E5E5E5/g, '#EEDADA');
  
  // F5F5F5 to FCF0F0
  content = content.replace(/#F5F5F5/g, '#FCF0F0');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated colors in', filePath);
}
