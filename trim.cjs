const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

const splitToken = '// ── ATHLETE VIEW ROUTING ──';
if (c.includes(splitToken)) {
  c = c.split(splitToken)[0] + splitToken + `
  if (activeTab === 'checkin') {
    return (
      <div className="min-h-screen bg-[#FCF5F5] font-sans text-[#1A1A1A] p-4 lg:p-12">
        <header className="mb-12 flex justify-center lg:justify-start">
          <span className="font-serif text-2xl font-black text-[#B03030] tracking-tight">PuNarva</span>
        </header>
        <DailyCheckin 
          athlete={currentAthlete}
          log={log}
          isRecording={isRecording}
          onStartVoice={handleStartVoice}
          onStopVoice={handleStopVoice}
          speechError={speechError}
          onComplete={() => setActiveTab('overview')}
        />
      </div>
    );
  }

  return (
    <AthleteDashboard
      athlete={currentAthlete}
      log={log}
      report={report}
      onLogout={() => setIsLoggedIn(false)}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
  );
}

export default App;
`;
  fs.writeFileSync('src/App.tsx', c, 'utf8');
  console.log('Trimmed successfully');
} else {
  console.log('Split token not found');
}
