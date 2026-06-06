const fs = require('fs');

let file = fs.readFileSync('src/components/AthleteDashboard.tsx', 'utf8');

// remove the misplaced import and comment
file = file.replace(/import \{ extractSymptoms, analyzeMedicalScan \} from '\.\.\/services\/aiPipeline';\r?\n\r?\n\/\/ \.\.\. \(in handleDocumentUpload\) \.\.\.\r?\n/g, '');

// add import to top
if (!file.includes("import { analyzeMedicalScan }")) {
  file = "import { analyzeMedicalScan } from '../services/aiPipeline';\n" + file;
}

fs.writeFileSync('src/components/AthleteDashboard.tsx', file, 'utf8');
console.log('Fixed AthleteDashboard imports');
