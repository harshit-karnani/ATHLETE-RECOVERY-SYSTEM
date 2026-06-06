const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

// The block starts with `const renderCoachView = () => {`
// And we know the logic inside `if (userRole === 'coach') { return renderCoachView(); }`

// Let's just do a RegExp replace to remove the function definition and replace the call
c = c.replace(/const renderCoachView = \(\) => \{[\s\S]*?\};\n\n  const hasMedicalReport/g, 'const hasMedicalReport');

// Replace the return with the component
const newCoachReturn = `
  if (userRole === 'coach') {
    return (
      <CoachPortal 
        athletes={athletes} 
        athleteLogs={athleteLogs} 
        coachOverrides={coachOverrides} 
        onSaveOverride={(id, override) => {
          setCoachOverrides(prev => ({ ...prev, [id]: override }));
          alert('Override saved to local state');
        }}
        onLogout={() => setIsLoggedIn(false)} 
        selectedAthleteId={selectedAthleteId} 
        setSelectedAthleteId={setSelectedAthleteId} 
        reports={
          athletes.reduce((acc, a) => {
            acc[a.id] = aiReport || localReport; // Using the current base report for all in this prototype
            return acc;
          }, {})
        }
      />
    );
  }
`;

c = c.replace(/if \(userRole === 'coach'\) \{\s*return renderCoachView\(\);\s*\}/g, newCoachReturn);

// Also add import
if (!c.includes('import { CoachPortal }')) {
  c = c.replace("import { DailyCheckin }", "import { DailyCheckin }\nimport { CoachPortal }");
}

fs.writeFileSync('src/App.tsx', c, 'utf8');
console.log('App.tsx updated for CoachPortal');
