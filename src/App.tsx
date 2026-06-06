import { useState, useEffect } from 'react';
import { mockAthletes, logPresets } from './mockData';
import { generateRecoveryReport } from './engine';
import { LandingPage } from './components/LandingPage';
import { AthleteDashboard } from './components/AthleteDashboard';
import { DailyCheckin } from './components/DailyCheckin';
import { CoachPortal } from './components/CoachPortal';
import type { RecoveryReport, TodayLog } from './types';

function App() {
  const [session, setSession] = useState<any>(null);
  const [userRole, setUserRole] = useState<'athlete' | 'coach' | null>(null);
  const [selectedAthleteId, setSelectedAthleteId] = useState<string>(mockAthletes[0].id);
  const [activeTab, setActiveTab] = useState<'overview' | 'checkin' | 'history' | 'profile' | 'scans' | 'protocol'>('overview');
  const [coachOverrides, setCoachOverrides] = useState<Record<string, string>>({});
  
  // Audio state
  const [isRecording, setIsRecording] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Initialize Auth from localStorage bypass
  useEffect(() => {
    const savedAuth = localStorage.getItem('punarva_auth');
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        setSession(parsed);
        if (parsed?.user?.user_metadata?.role) {
          setUserRole(parsed.user.user_metadata.role);
        } else {
          setUserRole('athlete');
        }
      } catch (e) {
        console.error('Failed to parse saved auth', e);
      }
    }
  }, []);
  
  // Dynamic Log State
  const defaultLog = logPresets['marcus-vance'][0].log;
  const [currentLog, setCurrentLog] = useState<TodayLog>(defaultLog);
  
  // Generate reports dynamically
  let currentAthlete = mockAthletes.find(a => a.id === selectedAthleteId) || mockAthletes[0];
  
  // Use the logged-in email for the Athlete's name to fix the avatar and profile!
  if (session?.user?.email) {
    const emailPrefix = session.user.email.split('@')[0];
    const capitalized = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
    currentAthlete = { ...currentAthlete, name: capitalized, id: session.user.email };
  }
  
  const report = generateRecoveryReport(currentAthlete, currentLog);

  const reports: Record<string, RecoveryReport | null> = mockAthletes.reduce((acc: any, a) => {
    // If we are generating the report for the current selected athlete, use their dynamic log, otherwise mock
    const logToUse = a.id === currentAthlete.id ? currentLog : (logPresets[a.id]?.[0]?.log || defaultLog);
    acc[a.id] = generateRecoveryReport(a, logToUse);
    return acc;
  }, {});

  const handleStartVoice = () => {
    setIsRecording(true);
    setSpeechError(null);
    setTimeout(() => {
      setIsRecording(false);
    }, 2000);
  };

  const handleStopVoice = () => {
    setIsRecording(false);
  };

  const handleLogout = async () => {
    localStorage.removeItem('punarva_auth');
    setSession(null);
    setUserRole(null);
  };

  if (!session) {
    return (
      <LandingPage
        onLoginSuccess={(session) => {
          setSession(session);
          if (session?.user?.user_metadata?.role) {
            setUserRole(session.user.user_metadata.role);
          } else {
            setUserRole('athlete');
          }
        }}
      />
    );
  }

  if (userRole === 'coach') {
    return (
      <CoachPortal 
        athletes={mockAthletes} 
        reports={reports}
        coachOverrides={coachOverrides}
        onSaveOverride={(id, override) => setCoachOverrides(prev => ({ ...prev, [id]: override }))}
        onLogout={handleLogout} 
        selectedAthleteId={selectedAthleteId} 
        setSelectedAthleteId={setSelectedAthleteId} 
      />
    );
  }

  if (activeTab === 'checkin') {
    return (
      <div className="min-h-screen bg-[#FAFAFA] font-sans text-black p-4 lg:p-12">
        <header className="mb-12 flex justify-center lg:justify-start">
          <span className="font-serif text-2xl font-black text-black tracking-tight">PUNARVA</span>
        </header>
        <DailyCheckin 
          log={currentLog}
          isRecording={isRecording}
          onStartVoice={handleStartVoice}
          onStopVoice={handleStopVoice}
          speechError={speechError}
          onComplete={(newLog: TodayLog) => {
            setCurrentLog(newLog);
            setActiveTab('overview');
          }}
        />
      </div>
    );
  }

  return (
    <AthleteDashboard 
      athlete={currentAthlete} 
      log={currentLog}
      report={report}
      onLogout={handleLogout}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
  );
}

export default App;
