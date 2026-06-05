import { useState, useCallback, useEffect, useRef } from 'react';
import { mockAthletes, logPresets } from './mockData';
import { generateRecoveryReport } from './engine';
import { runFullAnalysis, extractSymptoms, analyzeImage } from './services/analysisService';
import { saveCoachOverride } from './services/db';
import { LandingPage } from './components/LandingPage';
import type { TodayLog, RecoveryReport, Athlete } from './types';
import {
  Flame,
  Loader2,
  Mic,
  MicOff,
  FileUp,
  Home,
  CheckSquare,
  FolderOpen,
  TrendingDown,
  Cpu,
  FileText,
  Clock,
  X
} from 'lucide-react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'athlete' | 'coach' | null>(null);
  const [coachActiveTab, setCoachActiveTab] = useState<'action-center' | 'roster-matrix' | 'medical-escalations'>('action-center');
  const [coachOverrides, setCoachOverrides] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('coachOverrides');
    return saved ? JSON.parse(saved) : {};
  });
  const [approvedAthletes, setApprovedAthletes] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('approvedAthletes');
    return saved ? JSON.parse(saved) : {};
  });
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [modalAthleteId, setModalAthleteId] = useState<string | null>(null);
  const [overrideText, setOverrideText] = useState('');

  // Roster table filters
  const [filterPosition, setFilterPosition] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterRehabPhase, setFilterRehabPhase] = useState<string>('All');

  const [athletes, setAthletes] = useState<Athlete[]>(() => {
    const saved = localStorage.getItem('athletes');
    return saved ? JSON.parse(saved) : mockAthletes;
  });
  const [selectedAthleteId, setSelectedAthleteId] = useState<string>(athletes[0].id);
  const [activeTab, setActiveTab] = useState<'overview' | 'checkin' | 'recovery' | 'archive'>('overview');

  const [athleteLogs, setAthleteLogs] = useState<Record<string, TodayLog>>(() => {
    const saved = localStorage.getItem('athleteLogs');
    if (saved) return JSON.parse(saved);
    const initialLogs: Record<string, TodayLog> = {};
    mockAthletes.forEach(ath => {
      if (ath.id === 'marcus-vance') {
        initialLogs[ath.id] = logPresets['marcus-vance'][2].log;
      } else if (ath.id === 'elena-rostova') {
        initialLogs[ath.id] = logPresets['elena-rostova'][1].log;
      } else if (ath.id === 'kofi-mensah') {
        initialLogs[ath.id] = logPresets['kofi-mensah'][1].log;
      } else if (ath.id === 'maya-lin') {
        initialLogs[ath.id] = logPresets['maya-lin'][1].log;
      } else {
        initialLogs[ath.id] = logPresets[ath.id]?.[0]?.log || logPresets['marcus-vance'][0].log;
      }
    });
    return initialLogs;
  });

  const currentAthlete = athletes.find(a => a.id === selectedAthleteId) || athletes[0];
  const log = athleteLogs[selectedAthleteId] || logPresets[selectedAthleteId]?.[0]?.log || logPresets['marcus-vance'][0].log;

  // AI analysis state
  const [aiReport, setAiReport] = useState<RecoveryReport | null>(() => {
    const saved = localStorage.getItem('aiReport');
    return saved ? JSON.parse(saved) : null;
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [analysisSource, setAnalysisSource] = useState<'local' | 'ai'>('local');
  const [aiError, setAiError] = useState<string | null>(null);

  // Voice Speech Recognition State
  const [isRecording, setIsRecording] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Document Upload State
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Local engine runs every render
  const localReport = generateRecoveryReport(currentAthlete, log);

  // Active report logic
  const baseReport = aiReport ?? localReport;
  const activeOverride = coachOverrides[currentAthlete.id];
  
  const report = activeOverride
    ? {
        ...baseReport,
        directives: {
          ...baseReport.directives,
          trainingAdjustment: activeOverride,
          recoveryProtocol: "Custom coach protocol active. Refer to override command."
        }
      }
    : baseReport;

  // Run AI analysis (Prompt B)
  const handleRunAI = useCallback(async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const result = await runFullAnalysis(currentAthlete, log);
      setAiReport(result.report);
      setAnalysisSource(result.source);
      if (result.fallbackReason) {
        setAiError(result.fallbackReason);
      }
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'AI analysis failed');
      setAnalysisSource('local');
    } finally {
      setAiLoading(false);
    }
  }, [currentAthlete, log]);

  // Reset AI report when logs change
  useEffect(() => { localStorage.setItem('coachOverrides', JSON.stringify(coachOverrides)); }, [coachOverrides]);
  useEffect(() => { localStorage.setItem('approvedAthletes', JSON.stringify(approvedAthletes)); }, [approvedAthletes]);
  useEffect(() => { localStorage.setItem('athletes', JSON.stringify(athletes)); }, [athletes]);
  useEffect(() => { localStorage.setItem('athleteLogs', JSON.stringify(athleteLogs)); }, [athleteLogs]);
  useEffect(() => { localStorage.setItem('aiReport', JSON.stringify(aiReport)); }, [aiReport]);

  const handleLogChange = (newLog: TodayLog) => {
    setAthleteLogs(prev => ({
      ...prev,
      [selectedAthleteId]: newLog
    }));
    setAiReport(null);
    setAnalysisSource('local');
  };

  const formatTimeUTC = (date: Date) => {
    const hh = String(date.getUTCHours()).padStart(2, '0');
    const mm = String(date.getUTCMinutes()).padStart(2, '0');
    const ss = String(date.getUTCSeconds()).padStart(2, '0');
    return `${hh}:${mm}:${ss} UTC`;
  };

  const [lastSync, setLastSync] = useState(formatTimeUTC(new Date()));
  useEffect(() => {
    const timer = setInterval(() => {
      setLastSync(formatTimeUTC(new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRecording) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;
        
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        sourceRef.current = source;
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        const draw = () => {
          if (!canvasRef.current) return;
          animationFrameRef.current = requestAnimationFrame(draw);
          analyser.getByteFrequencyData(dataArray);
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          const barWidth = (canvas.width / bufferLength) * 2;
          let barHeight;
          let x = 0;
          
          for(let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2.5; // Scale height down slightly
            ctx.fillStyle = `#6DA398`; // Using the #6DA398 theme color
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 2;
          }
        };
        draw();
      }).catch(err => {
        console.warn('Audio stream error for waveform', err);
      });
    } else {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (sourceRef.current) sourceRef.current.disconnect();
      if (audioContextRef.current) audioContextRef.current.close();
    }
    
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isRecording]);

  const handlePushOverride = (athleteId: string, text: string) => {
    setCoachOverrides(prev => ({
      ...prev,
      [athleteId]: text
    }));
    setApprovedAthletes(prev => ({
      ...prev,
      [athleteId]: false
    }));
    setIsOverrideModalOpen(false);

    // Save to Firebase (Step 6)
    const todayStr = new Date().toISOString().split('T')[0];
    saveCoachOverride(athleteId, todayStr, text);
  };

  const handleApproveProtocol = (athleteId: string) => {
    setApprovedAthletes(prev => ({
      ...prev,
      [athleteId]: true
    }));
    setCoachOverrides(prev => {
      const copy = { ...prev };
      delete copy[athleteId];
      return copy;
    });
  };

  // ----------------------------------------------------
  // SPEECH RECOGNITION (Voice check-in)
  // ----------------------------------------------------
  const localSymptomParser = (text: string) => {
    const t = text.toLowerCase();
    let location = 'None';
    let pain = 0;

    if (t.includes('hamstring')) location = 'Right Hamstring';
    else if (t.includes('achilles')) location = 'Left Achilles Tendon';
    else if (t.includes('knee')) location = 'Left Knee';
    else if (t.includes('back')) location = 'Lower Back';
    else if (t.includes('shoulder')) location = 'Right Shoulder';

    const numbers: Record<string, number> = {
      'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
      '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10
    };
    for (const [key, val] of Object.entries(numbers)) {
      if (t.includes(`pain ${key}`) || t.includes(`pain of ${key}`) || t.includes(`${key}/10`)) {
        pain = val;
        break;
      }
    }
    if (pain === 0) {
      if (t.includes('severe') || t.includes('hurts a lot')) pain = 7;
      else if (t.includes('tight') || t.includes('stiff')) pain = 3;
    }
    return { location, pain };
  };

  const handleStartVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError('SpeechRecognition not supported. Use Google Chrome or Microsoft Edge.');
      return;
    }

    setSpeechError(null);
    setIsRecording(true);
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';

    rec.onresult = async (e: any) => {
      const transcript = e.results[0][0].transcript;
      setIsRecording(false);
      
      const updatedLog = { ...log, symptomTranscript: transcript };
      
      // Auto-extract symptoms
      try {
        const knownSites = currentAthlete.injuryHistory.map(i => i.anatomicalSite);
        const result = await extractSymptoms(transcript, currentAthlete.name, knownSites);
        const sym = result.structured_symptoms;
        updatedLog.symptomLocation = sym.primary_location === 'none' ? 'None' : sym.primary_location;
        updatedLog.painLevel = sym.pain_level;
      } catch (err) {
        console.warn('AI symptom parser failed, using local parser:', err);
        const parsed = localSymptomParser(transcript);
        updatedLog.symptomLocation = parsed.location;
        updatedLog.painLevel = parsed.pain;
      }

      handleLogChange(updatedLog);

      // Auto-run Prompt B
      setAiLoading(true);
      try {
        const result = await runFullAnalysis(currentAthlete, updatedLog);
        setAiReport(result.report);
        setAnalysisSource(result.source);
      } catch (err) {
        console.error(err);
      } finally {
        setAiLoading(false);
      }
    };

    rec.onerror = (e: any) => {
      console.error(e);
      setIsRecording(false);
      setSpeechError(`Voice Error: ${e.error || 'Failed to detect speech.'}`);
    };

    rec.onend = () => {
      setIsRecording(false);
    };

    rec.start();
  };

  // ----------------------------------------------------
  // CLAUDE VISION (Medical upload)
  // ----------------------------------------------------
  const loadPdfJs = async () => {
    if ((window as any).pdfjsLib) return (window as any).pdfjsLib;
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
      script.onload = () => {
        const pdfjs = (window as any).pdfjsLib;
        pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
        resolve(pdfjs);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    setUploadSuccess(null);

    const isPdf = file.type === 'application/pdf';

    const processBase64AndSubmit = async (base64Image: string) => {
      try {
        const imageType = isPdf ? 'medical_report_pdf' : 'injury_photo';
        const parsed = await analyzeImage(base64Image, imageType, currentAthlete.id, currentAthlete.injuryHistory);

        const newInjury = {
          id: `inj-report-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          anatomicalSite: parsed.anatomical_site || 'Unspecified Site',
          severity: parsed.severity ? `${parsed.severity.toUpperCase()} Report` : 'Clinical Report',
          leadUpConditions: {},
          resolved: parsed.prescribed_rest_days ? new Date(Date.now() + parsed.prescribed_rest_days * 24*60*60*1000).toISOString().split('T')[0] : 'Pending',
          description: `${parsed.diagnosis}. Restrictions: ${parsed.restricted_movements?.join(', ') || 'None'}. Meds: ${parsed.medications?.join(', ') || 'None'}.`,
          source: 'medical_report' as const
        };

        setAthletes(prev => prev.map(ath => {
          if (ath.id === currentAthlete.id) {
            return {
              ...ath,
              injuryHistory: [newInjury, ...ath.injuryHistory]
            };
          }
          return ath;
        }));

        setUploadSuccess(`Successfully parsed: ${parsed.diagnosis}`);
      } catch (err) {
        console.warn('AI vision scan failed, using local mockup simulation:', err);
        const fileName = file.name;
        let mockResult;
        if (fileName.toLowerCase().includes('mri') || fileName.toLowerCase().includes('scan')) {
          mockResult = {
            diagnosis: "Grade II Hamstring Tendon Tear",
            anatomical_site: "Right Hamstring",
            severity: "moderate" as const,
            prescribed_rest_days: 14,
            cleared_movements: ["static stretches", "swimming"],
            restricted_movements: ["sprinting", "heavy squatting"],
            medications: ["Ibuprofen 400mg twice daily"],
            follow_up_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          };
        } else {
          mockResult = {
            diagnosis: "Achilles Tendinopathy insertion strain",
            anatomical_site: "Left Achilles Tendon",
            severity: "mild" as const,
            prescribed_rest_days: 7,
            cleared_movements: ["flat cycling", "heel raises"],
            restricted_movements: ["jumping", "sprinting"],
            medications: ["Collagen Peptides 15g daily"],
            follow_up_date: null
          };
        }

        const newInjury = {
          id: `inj-report-mock-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          anatomicalSite: mockResult.anatomical_site,
          severity: `${mockResult.severity.toUpperCase()} Report`,
          leadUpConditions: {},
          resolved: mockResult.prescribed_rest_days ? new Date(Date.now() + mockResult.prescribed_rest_days * 24*60*60*1000).toISOString().split('T')[0] : 'Pending',
          description: `${mockResult.diagnosis}. Restrictions: ${mockResult.restricted_movements.join(', ')}. Meds: ${mockResult.medications.join(', ')}.`,
          source: 'medical_report' as const
        };

        setAthletes(prev => prev.map(ath => {
          if (ath.id === currentAthlete.id) {
            return {
              ...ath,
              injuryHistory: [newInjury, ...ath.injuryHistory]
            };
          }
          return ath;
        }));

        setUploadSuccess(`[LOCAL_MOCK] Parsed: ${mockResult.diagnosis}`);
      } finally {
        setUploadLoading(false);
      }
    };

    if (isPdf) {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const typedarray = new Uint8Array(reader.result as ArrayBuffer);
          const pdfjs = await loadPdfJs();
          const pdf = await pdfjs.getDocument({ data: typedarray }).promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 1.2 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({ canvasContext: context, viewport }).promise;
          const base64Image = canvas.toDataURL('image/png');
          await processBase64AndSubmit(base64Image);
        } catch (err) {
          console.error(err);
          setUploadLoading(false);
          setUploadSuccess('Error reading PDF pages.');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        processBase64AndSubmit(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderCoachView = () => {
    // 1. Calculate Team Readiness
    const totalScore = athletes.reduce((sum, a) => {
      const aLog = athleteLogs[a.id] || logPresets[a.id]?.[0]?.log;
      return sum + generateRecoveryReport(a, aLog).score;
    }, 0);
    const teamReadiness = Math.round(totalScore / athletes.length);

    // 2. Critical Flags (High Risk athletes)
    const flaggedAthletes = athletes.map(a => {
      const aLog = athleteLogs[a.id] || logPresets[a.id]?.[0]?.log;
      const aReport = generateRecoveryReport(a, aLog);
      return { athlete: a, report: aReport };
    });

    const criticalFlagsCount = flaggedAthletes.filter(fa => fa.report.riskLevel === 'High').length;

    // 3. Missing Data (e.g. 2 athletes)
    const missingDataCount = 2;

    // 4. Priority Intervention Queue (High and Medium Risk)
    // Sort High first
    const triageQueue = flaggedAthletes
      .filter(fa => fa.report.riskLevel === 'High' || fa.report.riskLevel === 'Medium')
      .sort((a, b) => {
        if (a.report.riskLevel === 'High' && b.report.riskLevel !== 'High') return -1;
        if (a.report.riskLevel !== 'High' && b.report.riskLevel === 'High') return 1;
        return b.report.score - a.report.score; // secondary sort by score descending
      });

    // 5. Full Roster Matrix Filtering
    const filteredRoster = flaggedAthletes.filter(fa => {
      // Sport/Position filter
      if (filterPosition !== 'All') {
        const query = filterPosition.toLowerCase();
        if (!fa.athlete.sport.toLowerCase().includes(query) && !fa.athlete.position.toLowerCase().includes(query)) {
          return false;
        }
      }
      // Risk Status filter
      if (filterStatus !== 'All') {
        if (filterStatus === 'High Risk' && fa.report.riskLevel !== 'High') return false;
        if (filterStatus === 'Medium Risk' && fa.report.riskLevel !== 'Medium') return false;
        if (filterStatus === 'Stable/Cleared' && fa.report.riskLevel !== 'Low') return false;
      }
      // Rehab Phase filter
      if (filterRehabPhase !== 'All') {
        const phase = fa.report.rehabilitationPlan?.phase;
        if (filterRehabPhase === 'Acute' && phase !== 'acute') return false;
        if (filterRehabPhase === 'Sub-Acute' && phase !== 'sub_acute') return false;
        if (filterRehabPhase === 'Return to Sport' && phase !== 'return_to_sport') return false;
        if (filterRehabPhase === 'None' && phase !== undefined) return false;
      }
      return true;
    });

    // 6. Medical Escalations (Ledger of all medical reports/uploads)
    const medicalEscalations = athletes
      .filter(a => a.injuryHistory.some(inj => inj.source === 'medical_report' || inj.source === 'clinical' || inj.id.includes('report')))
      .flatMap(a => {
        const medicalInjuries = a.injuryHistory.filter(inj => inj.source === 'medical_report' || inj.source === 'clinical' || inj.id.includes('report'));
        return medicalInjuries.map(inj => ({
          athlete: a,
          injury: inj
        }));
      });

    return (
      <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[280px] bg-white border-r border-slate-200 flex flex-col justify-between shrink-0">
          <div>
            {/* Header */}
            <div className="p-8 border-b border-slate-200 flex flex-col gap-1">
              <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">PUNARVA</span>
              <span className="font-mono text-[9px] tracking-widest text-slate-400 uppercase">COACH.COMMAND // v3.0</span>
            </div>
            
            {/* Navigation */}
            <nav className="p-6 space-y-2">
              {[
                { id: 'action-center', label: '[1] ACTION CENTER', count: triageQueue.length },
                { id: 'roster-matrix', label: '[2] FULL ROSTER MATRIX', count: athletes.length },
                { id: 'medical-escalations', label: '[3] MEDICAL ESCALATIONS', count: medicalEscalations.length }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setCoachActiveTab(t.id as any)}
                  className={`w-full text-left px-4 py-3 text-xs font-mono font-bold tracking-wider transition-all duration-150 flex justify-between items-center ${
                    coachActiveTab === t.id
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <span>{t.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 font-mono ${
                    coachActiveTab === t.id ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {t.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Footer of sidebar */}
          <div className="p-6 border-t border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs font-mono">
                CH
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800">Coach Harrington</span>
                <span className="text-[9px] text-slate-400 font-mono font-bold">DR. OF PHYSIOTHERAPY</span>
              </div>
            </div>
            <button
              onClick={() => {
                setIsLoggedIn(false);
                setUserRole(null);
              }}
              className="w-full text-center py-2 border border-slate-200 text-xs font-mono font-bold hover:bg-slate-50 transition-colors"
            >
              [ DISCONNECT ]
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden text-left">
          {/* Top Bar */}
          <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
            <div>
              <h1 className="text-sm font-mono font-bold text-slate-900 uppercase tracking-widest">
                {coachActiveTab.replace('-', ' ')} // SYSTEM CONTROL
              </h1>
            </div>
            <div className="flex items-center gap-6 text-xs text-slate-500">
              <span className="font-mono">{new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
              <span className="font-mono text-slate-400">|</span>
              <div className="flex items-center gap-1.5 font-mono text-emerald-600">
                <Clock size={12} />
                <span>LAST SYNC: {lastSync}</span>
              </div>
            </div>
          </header>

          {/* Body Content */}
          <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
            {coachActiveTab === 'action-center' && (
              <div className="space-y-8 max-w-5xl">
                {/* Macro Summary Strip */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Team Readiness */}
                  <div className="bg-white border border-slate-200 p-6 flex flex-col justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">TEAM READINESS</span>
                    <div className="my-2">
                      <span className="text-4xl font-mono font-bold text-slate-900">{teamReadiness}%</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">AVG OVER {athletes.length} ACTIVE SUBJECTS</span>
                  </div>

                  {/* Critical Flags */}
                  <div className="bg-white border border-slate-200 p-6 flex flex-col justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">CRITICAL FLAGS</span>
                    <div className="my-2">
                      <span className="text-4xl font-mono font-bold text-red-600">{criticalFlagsCount}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">SUBJECTS IN HIGH RISK THRESHOLD</span>
                  </div>

                  {/* Missing Data */}
                  <div className="bg-white border border-slate-200 p-6 flex flex-col justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">MISSING DATA</span>
                    <div className="my-2">
                      <span className="text-4xl font-mono font-bold text-amber-600">{missingDataCount}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">LOG DEVIATIONS PENDING SUBMISSION</span>
                  </div>
                </div>

                {/* Priority Intervention Queue */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <h2 className="text-xs font-mono font-bold text-slate-900 tracking-wider">PRIORITY INTERVENTION QUEUE</h2>
                    <span className="text-[10px] text-slate-500 font-mono">SHOWING {triageQueue.length} OUT OF {athletes.length} SUBJECTS</span>
                  </div>

                  {triageQueue.length > 0 ? (
                    <div className="space-y-4">
                      {triageQueue.map(({ athlete, report }) => {
                        const hasOverride = coachOverrides[athlete.id];
                        const isApproved = approvedAthletes[athlete.id];
                        return (
                          <div key={athlete.id} className="bg-white border border-slate-200 p-6 space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{athlete.name}</h3>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                                  {athlete.sport} // ID: {athlete.id}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                {isApproved && (
                                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 font-mono text-[9px] font-bold uppercase">
                                    AI PROTOCOL APPROVED
                                  </span>
                                )}
                                {hasOverride && (
                                  <span className="bg-slate-900 text-white border border-slate-900 px-2 py-0.5 font-mono text-[9px] font-bold uppercase">
                                    OVERRIDE PUSHED
                                  </span>
                                )}
                                <span className={`px-3 py-1 font-mono text-xs font-bold uppercase border ${
                                  report.riskLevel === 'High'
                                    ? 'bg-red-50 text-red-700 border-red-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}>
                                  {report.riskLevel} Risk
                                </span>
                              </div>
                            </div>

                            {/* AI Diagnostics Panel */}
                            <div className="bg-slate-50 border border-slate-200 p-4 font-mono text-xs text-slate-700 leading-relaxed">
                              <span className="text-[10px] font-bold text-slate-900 block mb-1">AI DIAGNOSTICS DETECTED:</span>
                              {report.patternMatch.isMatch ? report.patternMatch.reason : report.riskExplanation}
                            </div>

                            {/* Pushed Override Details */}
                            {hasOverride && (
                              <div className="bg-slate-100 border border-slate-300 p-4 font-mono text-xs text-slate-800 leading-relaxed">
                                <span className="text-[10px] font-bold text-slate-950 block mb-1">COACH OVERRIDE SENT:</span>
                                "{hasOverride}"
                              </div>
                            )}

                            {/* Action Row */}
                            <div className="flex justify-end items-center gap-3 pt-2">
                              <button
                                onClick={() => handleApproveProtocol(athlete.id)}
                                className={`font-mono text-xs uppercase px-4 py-2 border transition-colors ${
                                  isApproved
                                    ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                                    : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                                }`}
                                disabled={isApproved}
                              >
                                [ APPROVE AI PROTOCOL ]
                              </button>
                              <button
                                onClick={() => {
                                  setModalAthleteId(athlete.id);
                                  setOverrideText(coachOverrides[athlete.id] || '');
                                  setIsOverrideModalOpen(true);
                                }}
                                className="bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs uppercase px-4 py-2 border border-slate-900 transition-colors"
                              >
                                [ REVIEW & OVERRIDE ]
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200 p-12 text-center">
                      <p className="font-mono text-slate-500 text-xs uppercase tracking-widest">
                        Zero flagged subjects. Team status optimal.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {coachActiveTab === 'roster-matrix' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <h2 className="text-xs font-mono font-bold text-slate-900 tracking-wider">FULL ROSTER MATRIX</h2>
                  <span className="text-[10px] text-slate-500 font-mono">TOTAL ROSTER: {athletes.length} PLAYERS</span>
                </div>

                {/* Filters */}
                <div className="bg-white border border-slate-200 p-4 flex flex-wrap gap-6 items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">POSITION:</span>
                    <select
                      className="bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-none font-mono text-xs focus:outline-none focus:border-slate-400"
                      value={filterPosition}
                      onChange={e => setFilterPosition(e.target.value)}
                    >
                      <option value="All">All Positions</option>
                      <option value="Point Guard">Point Guard</option>
                      <option value="Sprinter">Sprinters</option>
                      <option value="Distance">Distance Runners</option>
                      <option value="Weightlifter">Weightlifters</option>
                      <option value="Swimmer">Swimmers</option>
                      <option value="Rowing">Rowers</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">STATUS:</span>
                    <select
                      className="bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-none font-mono text-xs focus:outline-none focus:border-slate-400"
                      value={filterStatus}
                      onChange={e => setFilterStatus(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="High Risk">High Risk</option>
                      <option value="Medium Risk">Medium Risk</option>
                      <option value="Stable/Cleared">Stable / Cleared</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">REHAB PHASE:</span>
                    <select
                      className="bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-none font-mono text-xs focus:outline-none focus:border-slate-400"
                      value={filterRehabPhase}
                      onChange={e => setFilterRehabPhase(e.target.value)}
                    >
                      <option value="All">All Phases</option>
                      <option value="Acute">Acute Phase</option>
                      <option value="Sub-Acute">Sub-Acute Phase</option>
                      <option value="Return to Sport">Return to Sport</option>
                      <option value="None">None (Uninjured)</option>
                    </select>
                  </div>

                  {(filterPosition !== 'All' || filterStatus !== 'All' || filterRehabPhase !== 'All') && (
                    <button
                      onClick={() => {
                        setFilterPosition('All');
                        setFilterStatus('All');
                        setFilterRehabPhase('All');
                      }}
                      className="font-mono text-[9px] uppercase px-3 py-1.5 border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      [ RESET FILTERS ]
                    </button>
                  )}
                </div>

                {/* Table */}
                <div className="bg-white border border-slate-200 overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs text-slate-800">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-mono border-b border-slate-200">
                        <th className="px-6 py-4 uppercase font-bold tracking-wider">ATHLETE</th>
                        <th className="px-6 py-4 uppercase font-bold tracking-wider">RECOVERY SCORE</th>
                        <th className="px-6 py-4 uppercase font-bold tracking-wider">HRV DELTA</th>
                        <th className="px-6 py-4 uppercase font-bold tracking-wider">SLEEP</th>
                        <th className="px-6 py-4 uppercase font-bold tracking-wider">RPE LOG</th>
                        <th className="px-6 py-4 uppercase font-bold tracking-wider">SYSTEM STATUS</th>
                        <th className="px-6 py-4 uppercase font-bold tracking-wider text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {filteredRoster.map(({ athlete, report }) => {
                        const aLog = athleteLogs[athlete.id] || logPresets[athlete.id]?.[0]?.log;
                        const isApproved = approvedAthletes[athlete.id];
                        const isOverridden = coachOverrides[athlete.id];
                        return (
                          <tr 
                            key={athlete.id} 
                            className="hover:bg-slate-50/80 cursor-pointer group"
                            onClick={() => {
                              setModalAthleteId(athlete.id);
                              setOverrideText(coachOverrides[athlete.id] || '');
                              setIsOverrideModalOpen(true);
                            }}
                          >
                            <td className="px-6 py-4">
                              <div className="font-sans font-bold text-slate-900 text-sm">{athlete.name}</div>
                              <div className="text-[10px] text-slate-500 uppercase tracking-widest">{athlete.sport}</div>
                            </td>
                            <td className="px-6 py-4 font-bold text-sm">
                              {report.score}/100
                            </td>
                            <td className={`px-6 py-4 font-bold ${aLog.hrvDelta < -10 ? 'text-red-600' : 'text-slate-700'}`}>
                              {aLog.hrvDelta > 0 ? '+' : ''}{aLog.hrvDelta} ms
                            </td>
                            <td className="px-6 py-4">
                              {aLog.sleepHours.toFixed(1)} hrs <span className="text-[10px] text-slate-400">({athlete.baseline.sleep}h bl)</span>
                            </td>
                            <td className="px-6 py-4">
                              {aLog.rpePrevious}/10
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 border text-[10px] font-bold uppercase ${
                                report.riskLevel === 'High'
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : report.riskLevel === 'Medium'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}>
                                {isOverridden ? 'OVERRIDDEN' : isApproved ? 'APPROVED' : report.riskLevel}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                              <button
                                onClick={() => {
                                  setModalAthleteId(athlete.id);
                                  setOverrideText(coachOverrides[athlete.id] || '');
                                  setIsOverrideModalOpen(true);
                                }}
                                className="opacity-0 group-hover:opacity-100 font-mono text-[10px] text-slate-500 hover:text-slate-900 underline uppercase"
                              >
                                OVERRIDE
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {filteredRoster.length === 0 && (
                    <div className="p-12 text-center">
                      <p className="font-mono text-slate-400 text-xs uppercase">No athletes match the current filters.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {coachActiveTab === 'medical-escalations' && (
              <div className="space-y-8 max-w-5xl">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <h2 className="text-xs font-mono font-bold text-slate-900 tracking-wider">MEDICAL ESCALATIONS & FILES</h2>
                  <span className="text-[10px] text-slate-500 font-mono">{medicalEscalations.length} RECORDED FILES</span>
                </div>

                <div className="bg-white border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-200 bg-slate-50">
                    <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">SYSTEM LEDGER ARCHIVE</span>
                    <h3 className="font-sans text-sm font-bold text-slate-800 mt-1">Uploaded Clinical Documents & MRI Scan Reports</h3>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {medicalEscalations.map(({ athlete, injury }) => (
                      <div key={injury.id} className="p-6 flex flex-col md:flex-row md:items-start gap-6 hover:bg-slate-50/50 transition-all">
                        {/* Athlete Context */}
                        <div className="w-full md:w-1/4 shrink-0 space-y-1">
                          <span className="font-mono text-[9px] text-slate-400 block uppercase font-bold">ATHLETE REFERENCE</span>
                          <span className="font-sans font-bold text-sm text-slate-900 block">{athlete.name}</span>
                          <span className="font-mono text-[10px] text-slate-500 block">{athlete.sport}</span>
                        </div>

                        {/* File Details */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[10px] text-slate-400 uppercase">FILE DETAILS:</span>
                            <span className="font-mono text-xs font-bold text-slate-950 underline cursor-pointer hover:text-slate-600 flex items-center gap-1">
                              <FileText size={12} />
                              {injury.anatomicalSite.toUpperCase().replace(/\s+/g, '_')}_SCAN.PDF
                            </span>
                            <span className="font-mono text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 border border-slate-200 font-bold uppercase">
                              {injury.severity}
                            </span>
                            <span className="font-mono text-[9px] text-slate-400">{injury.date}</span>
                          </div>

                          <div className="bg-slate-50 border border-slate-200 p-4 font-mono text-xs text-slate-700 space-y-2 leading-relaxed">
                            <div>
                              <span className="font-bold text-slate-900 uppercase tracking-widest block text-[9px] mb-0.5">DIAGNOSTIC ARCHIVAL TRANSLATION:</span>
                              "{injury.description}"
                            </div>
                            {injury.resolved !== 'Pending' && (
                              <div className="pt-2 border-t border-slate-200 flex justify-between text-[10px]">
                                <span>STATUS: <span className="text-emerald-700 font-bold">CLEARED / RESOLVED ({injury.resolved})</span></span>
                                <span>SOURCE: CLINICAL CLINIC</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {medicalEscalations.length === 0 && (
                      <div className="p-12 text-center font-mono text-xs text-slate-400 uppercase">
                        No medical reports currently uploaded or archived.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Review & Override Modal */}
        {isOverrideModalOpen && modalAthleteId && (() => {
          const ath = athletes.find(a => a.id === modalAthleteId);
          if (!ath) return null;
          const athLog = athleteLogs[ath.id] || logPresets[ath.id]?.[0]?.log;
          const athReport = generateRecoveryReport(ath, athLog);
          return (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
              <div className="bg-white border border-slate-200 max-w-4xl w-full p-8 grid grid-cols-1 md:grid-cols-2 gap-8 relative rounded-none shadow-2xl animate-scale-in">
                {/* Close Button */}
                <button
                  onClick={() => setIsOverrideModalOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-200 p-1 cursor-pointer"
                >
                  <X size={18} />
                </button>

                {/* Left Column: Athlete Context */}
                <div className="space-y-6 pr-0 md:pr-4 md:border-r md:border-slate-200 text-left">
                  <div>
                    <span className="font-mono text-[9px] text-slate-400 uppercase font-bold tracking-widest block">SUBJECT CONTEXT</span>
                    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{ath.name}</h2>
                    <p className="text-[10px] text-slate-500 uppercase font-mono tracking-widest">{ath.sport}</p>
                  </div>

                  {/* Raw Biometrics Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="border border-slate-200 p-3 text-center">
                      <span className="text-[8px] font-mono text-slate-400 block uppercase font-bold">RECOVERY INDEX</span>
                      <span className="font-mono text-xl font-bold text-slate-900">{athReport.score}</span>
                    </div>
                    <div className="border border-slate-200 p-3 text-center">
                      <span className="text-[8px] font-mono text-slate-400 block uppercase font-bold">HRV DELTA</span>
                      <span className="font-mono text-xl font-bold text-slate-900">{athLog.hrvDelta > 0 ? '+' : ''}{athLog.hrvDelta}ms</span>
                    </div>
                    <div className="border border-slate-200 p-3 text-center">
                      <span className="text-[8px] font-mono text-slate-400 block uppercase font-bold">SLEEP</span>
                      <span className="font-mono text-xl font-bold text-slate-900">{athLog.sleepHours.toFixed(1)}h</span>
                    </div>
                  </div>

                  {/* Symptom Focus & Soreness Body Outline */}
                  <div className="border border-slate-200 p-4 space-y-3">
                    <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">SORENESS MAP & FOCUS</span>
                    
                    <div className="flex gap-4 items-center">
                      {/* Expanded vector body sketch matching Check-in tab */}
                      <div className="relative w-full max-w-[120px] h-[180px] border border-slate-100 flex flex-col items-center justify-center bg-slate-50/50 p-2">
                        <svg viewBox="0 0 100 200" className="h-full w-full object-contain filter opacity-60">
                          {/* Head */}
                          <circle cx="50" cy="22" r="10" fill="none" stroke="#64748b" strokeWidth="2" />
                          {/* Spine */}
                          <line x1="50" y1="32" x2="50" y2="105" stroke="#64748b" strokeWidth="2" />
                          {/* Shoulders */}
                          <line x1="32" y1="44" x2="68" y2="44" stroke="#64748b" strokeWidth="2" />
                          {/* Arms */}
                          <line x1="32" y1="44" x2="24" y2="88" stroke="#64748b" strokeWidth="2" />
                          <line x1="68" y1="44" x2="76" y2="88" stroke="#64748b" strokeWidth="2" />
                          {/* Hips */}
                          <line x1="38" y1="105" x2="62" y2="105" stroke="#64748b" strokeWidth="2" />
                          {/* Legs */}
                          <line x1="38" y1="105" x2="38" y2="165" stroke="#64748b" strokeWidth="2" />
                          <line x1="62" y1="105" x2="62" y2="165" stroke="#64748b" strokeWidth="2" />
                        </svg>

                        {/* Red hotspot for localized injury */}
                        {athLog.symptomLocation !== 'None' && (
                          <div 
                            className="absolute w-3 h-3 rounded-full bg-red-600 border-2 border-white shadow-[0_0_8px_#dc2626] animate-pulse"
                            style={{
                              top: athLog.symptomLocation.includes('Hamstring') ? '65%' :
                                   athLog.symptomLocation.includes('Achilles') ? '88%' :
                                   athLog.symptomLocation.includes('Knee') ? '74%' :
                                   athLog.symptomLocation.includes('Back') ? '43%' : '20%',
                              left: athLog.symptomLocation.includes('Hamstring') || athLog.symptomLocation.includes('Shoulder') ? '56%' : '33%'
                            }}
                          />
                        )}
                      </div>

                      <div className="space-y-1 font-mono text-[11px] text-slate-700">
                        <div>LOCALIZATION: <span className="font-bold text-slate-900 uppercase">{athLog.symptomLocation}</span></div>
                        <div>PAIN LEVEL: <span className="font-bold text-red-600">{athLog.painLevel}/10</span></div>
                        <div className="text-[10px] text-slate-500">TRANSCRIPT: <span className="italic">"{athLog.symptomTranscript.substring(0, 50)}..."</span></div>
                      </div>
                    </div>
                  </div>

                  {/* AI Proposed Protocol */}
                  <div className="space-y-3">
                    <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">AI PROPOSED RECOVERY PLAN</span>
                    <div className="space-y-2 font-mono text-[10px]">
                      <div className="bg-slate-50 border border-slate-200 p-3 text-slate-700">
                        <span className="font-bold text-slate-900 block mb-0.5">TRAINING ADJUSTMENT:</span>
                        {athReport.directives.trainingAdjustment}
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-3 text-slate-700">
                        <span className="font-bold text-slate-900 block mb-0.5">RECOVERY PROTOCOL:</span>
                        {athReport.directives.recoveryProtocol}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Override Interface */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handlePushOverride(ath.id, overrideText);
                  }}
                  className="flex flex-col justify-between space-y-6 text-left"
                >
                  <div className="space-y-4 flex-1 flex flex-col">
                    <div>
                      <span className="font-mono text-[9px] text-slate-400 uppercase font-bold tracking-widest block">CONTROL OVERRIDE</span>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">COACH DIRECTIVE OVERRIDE</h3>
                    </div>

                    <div className="border border-slate-200 p-4 bg-slate-50/50 flex-1 flex flex-col space-y-3">
                      <p className="text-[10px] font-mono text-slate-500 uppercase leading-relaxed">
                        Input direct coaching instructions for {ath.name}. This text will replace the AI proposed training load adjustments and alert the athlete immediately on their personal dashboard.
                      </p>

                      <textarea
                        required
                        className="w-full flex-1 min-h-[160px] bg-white border border-slate-200 p-3 font-mono text-xs focus:outline-none focus:border-slate-400 text-slate-800 placeholder:text-slate-400"
                        placeholder="Ignore AI protocol. Execute 20 mins light stationary bike and deep tissue massage."
                        value={overrideText}
                        onChange={(e) => setOverrideText(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs uppercase py-3 border border-slate-900 transition-colors tracking-widest font-bold cursor-pointer"
                    >
                      [ OVERRIDE & PUSH TO ATHLETE DASHBOARD ]
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsOverrideModalOpen(false)}
                      className="w-full bg-transparent hover:bg-slate-50 text-slate-500 font-mono text-xs uppercase py-2 border border-slate-200 transition-colors cursor-pointer"
                    >
                      [ CANCEL ]
                    </button>
                  </div>
                </form>
              </div>
            </div>
          );
        })()}
      </div>
    );
  };

  const hasMedicalReport = currentAthlete.injuryHistory.some(inj => inj.source === 'medical_report');

  if (!isLoggedIn) {
    return (
      <LandingPage
        onLoginSuccess={(role, athleteId) => {
          setIsLoggedIn(true);
          setUserRole(role);
          if (role === 'athlete' && athleteId) {
            setSelectedAthleteId(athleteId);
          }
        }}
      />
    );
  }

  if (userRole === 'coach') {
    return renderCoachView();
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#0B1210] text-[#E5E5E5] font-sans relative overflow-hidden">
      
      {/* ── TOPOGRAPHICAL / PAPER TEXTURE BACKGROUND OVERLAY ── */}
      <svg className="pointer-events-none fixed inset-0 opacity-[0.04] z-0" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.1 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
        <path d="M 0,150 C 400,200 800,100 1200,180 C 1600,260 1800,140 2000,190" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="6,4" opacity="0.35" />
        <path d="M 0,350 C 300,320 700,420 1100,340 C 1500,260 1700,380 2000,330" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.25" />
        <path d="M 0,650 C 600,700 900,550 1400,680 C 1800,810 1900,700 2000,740" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="12,6" opacity="0.2" />
      </svg>

      {/* ── GLOBAL LEFT SIDEBAR (NAVIGATION ONLY) ── */}
      <aside className="w-full lg:w-[260px] bg-[#070C0A] border-b lg:border-b-0 lg:border-r border-[#23352F]/70 flex flex-col justify-between shrink-0 z-10 relative">
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="p-8 border-b border-[#23352F]/40 flex flex-col gap-1">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#D4AF37]">PUNARVA</span>
            <span className="font-mono text-[9px] tracking-widest text-[#6DA398] uppercase">RECOVERY.OS v3.0</span>
          </div>

          {/* Navigation Links */}
          <nav className="p-6 space-y-3">
            {[
              { id: 'overview', label: 'OVERVIEW', icon: <Home size={16} /> },
              { id: 'checkin', label: 'DAILY CHECK-IN', icon: <CheckSquare size={16} /> },
              { id: 'recovery', label: 'RECOVERY HUB', icon: <Flame size={16} /> },
              { id: 'archive', label: 'MEDICAL ARCHIVE', icon: <FolderOpen size={16} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-4 px-4 py-3 text-xs font-bold tracking-widest transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-[#13201C] border border-[#D4AF37]/50 text-[#D4AF37]'
                    : 'text-neutral-400 hover:text-white hover:bg-[#13201C]/40 border border-transparent'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Selected Athlete display & Logout */}
        <div className="p-6 border-t border-[#23352F]/40 space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-bold tracking-widest text-neutral-500 block">AUTHENTICATED ATHLETE</label>
            <div className="w-full bg-[#13201C] border border-[#23352F]/30 py-1.5 px-3 font-mono text-xs text-[#D4AF37] uppercase">
              {currentAthlete.name}
            </div>
          </div>

          <button
            onClick={() => setIsLoggedIn(false)}
            className="w-full text-center py-2 border border-[#23352F]/70 text-xs font-bold tracking-widest text-neutral-400 hover:text-white hover:border-[#D4AF37]/50 transition-all duration-300"
          >
            DISCONNECT
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT LAYER ── */}
      <main className="flex-grow p-8 md:p-12 space-y-10 overflow-y-auto z-10 relative max-w-[1200px] w-full mx-auto">
        
        {/* Banner details: status check */}
        <div className="flex justify-between items-center pb-6 border-b border-[#23352F]/30">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#13201C] border border-[#23352F]/70 text-[#D4AF37] flex items-center justify-center font-serif text-lg font-bold">
              {currentAthlete.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-white leading-tight uppercase tracking-tight">{currentAthlete.name}</h2>
              <p className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                {currentAthlete.sport} // AGE_{currentAthlete.age} // {currentAthlete.weightKg}KG
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunAI}
              disabled={aiLoading}
              className={`px-4 py-1.5 flex items-center gap-2 font-mono text-[10px] tracking-widest border uppercase transition-all duration-300 ${
                aiLoading 
                  ? 'bg-neutral-800 border-neutral-700 text-neutral-500' 
                  : 'bg-[#13201C] border-[#23352F]/70 text-[#D4AF37] hover:border-[#D4AF37]'
              }`}
            >
              {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Cpu size={12} />}
              {aiLoading ? 'ANALYZING...' : 'RUN_AI_REPORT'}
            </button>

            <span className="font-mono text-[9px] text-[#6DA398] border border-[#6DA398]/30 px-2 py-1 uppercase tracking-wider">
              {analysisSource === 'ai' ? 'AI_ENGINE' : 'LOCAL_ENGINE'}
            </span>

            {hasMedicalReport && (
              <span className="font-mono text-[9px] bg-[#6DA398]/10 text-[#6DA398] border border-[#6DA398]/30 px-2 py-1 uppercase tracking-widest">
                MEDICAL_CLEARANCE_ON_FILE
              </span>
            )}
            <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest ml-4">
              LAST SYNC: {lastSync}
            </span>
          </div>
        </div>

        {/* Error banners */}
        {aiError && (
          <div className="bg-[#E26D5A]/10 border border-[#E26D5A]/30 p-4 font-mono text-xs text-[#E26D5A] flex justify-between items-center mb-6">
            <span>{aiError}</span>
            <button onClick={() => setAiError(null)} className="underline font-bold uppercase tracking-wider text-[10px]">DISMISS</button>
          </div>
        )}
        {speechError && (
          <div className="bg-[#E26D5A]/10 border border-[#E26D5A]/30 p-4 font-mono text-xs text-[#E26D5A] flex justify-between items-center mb-6">
            <span>{speechError}</span>
            <button onClick={() => setSpeechError(null)} className="underline font-bold uppercase tracking-wider text-[10px]">DISMISS</button>
          </div>
        )}

        {/* ── TAB CONTENT ROUTING ── */}
        
        {/* TAB 1: OVERVIEW SCREEN */}
        {activeTab === 'overview' && (
          <div className="space-y-10 animate-fade-in">
            {/* Coach Override Alert Banner */}
            {activeOverride && (
              <div className="bg-amber-950/20 border border-[#D4AF37] border-l-4 border-l-[#D4AF37] p-8 md:p-10">
                <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold block mb-3">⚠️ COACH DIRECTIVE OVERRIDE ACTIVE</span>
                <p className="font-serif text-xl md:text-2xl text-white leading-relaxed italic">
                  "{activeOverride}"
                </p>
                <span className="text-[9px] font-mono text-neutral-500 uppercase block mt-3">PUSHED BY COACH HARRINGTON AT {lastSync} // INTEGRATED PROTOCOL RX</span>
              </div>
            )}

            {/* The Athlete Message Banner */}
            <div className="bg-[#13201C]/40 border-l-2 border-[#D4AF37] p-8 md:p-10">
              <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block mb-3">CLINICAL ATHLETE BRIEFING</span>
              <p className="font-serif text-xl md:text-2xl text-white leading-relaxed italic">
                "{report.athleteMessage || "Your HRV has dropped 18ms over four days. Skip high-velocity sprint work today and focus on isometric hamstring loading."}"
              </p>
            </div>

            {/* Core Metric Matrix (3 Smoked Glass Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card A: Recovery Score */}
              <div className="bg-[#13201C] backdrop-blur-2xl border border-[#23352F]/70 p-8 flex flex-col justify-between min-h-[180px] shadow-xl">
                <span className="text-[10px] font-mono tracking-widest text-[#6DA398] uppercase font-bold">RECOVERY INDEX</span>
                <div className="my-4">
                  <span className="font-serif text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#FFF] to-[#D4AF37] drop-shadow-md select-none">
                    {report.score}
                  </span>
                </div>
                <span className="text-[10px] font-mono tracking-widest text-[#6DA398] uppercase">SYS_OPTIMAL</span>
              </div>

              {/* Card B: Injury Risk */}
              <div className="bg-[#13201C] backdrop-blur-2xl border border-[#23352F]/70 p-8 flex flex-col justify-between min-h-[180px] shadow-xl">
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase font-bold">INJURY PROBABILITY</span>
                <div className="my-4">
                  <span className="font-serif text-3xl md:text-4xl font-bold text-[#E26D5A] uppercase tracking-tight">
                    {report.riskLevel.toUpperCase()}_RISK
                  </span>
                </div>
                <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase leading-snug">{report.riskExplanation}</span>
              </div>

              {/* Card C: Sleep */}
              <div className="bg-[#13201C] backdrop-blur-2xl border border-[#23352F]/70 p-8 flex flex-col justify-between min-h-[180px] shadow-xl">
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase font-bold">REST DURATION</span>
                <div className="my-4 flex items-baseline gap-2">
                  <span className="font-serif text-5xl font-bold text-white">
                    {log.sleepHours.toFixed(1)}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono tracking-widest">HOURS</span>
                  <TrendingDown className="text-[#E26D5A] ml-2 animate-bounce" size={18} />
                </div>
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">BASELINE: {currentAthlete.baseline.sleep}H</span>
              </div>

            </div>

            {/* Trend Graph Section */}
            <div className="bg-[#13201C] backdrop-blur-2xl border border-[#23352F]/70 p-8 shadow-xl">
              <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase font-bold block mb-6">7_DAY_RECOVERY_VS_LOAD_SPLINE</span>
              
              <div className="relative w-full h-[240px] flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 800 240" preserveAspectRatio="none">
                  {/* Ultra faint grid lines */}
                  <line x1="0" y1="40" x2="800" y2="40" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="5 5" />
                  <line x1="0" y1="100" x2="800" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="5 5" />
                  <line x1="0" y1="160" x2="800" y2="160" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="5 5" />
                  <line x1="0" y1="220" x2="800" y2="220" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                  {/* Vertical coordinate indicators */}
                  {[0, 1, 2, 3, 4, 5, 6].map((day, idx) => (
                    <line key={day} x1={idx * 115 + 40} y1="40" x2={idx * 115 + 40} y2="220" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  ))}

                  {/* Gradients */}
                  <defs>
                    <linearGradient id="splineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6DA398" />
                      <stop offset="100%" stopColor="#E26D5A" />
                    </linearGradient>
                  </defs>

                  {/* Recovery Spline (Bezier curve) */}
                  <path
                    d={`M 40,${220 - (currentAthlete.history7Days[0] || 70) * 1.6} 
                        C 155,${220 - (currentAthlete.history7Days[1] || 65) * 1.6} 
                          270,${220 - (currentAthlete.history7Days[2] || 80) * 1.6} 
                          385,${220 - (currentAthlete.history7Days[3] || 75) * 1.6} 
                        S 615,${220 - (currentAthlete.history7Days[5] || 62) * 1.6} 
                          760,${220 - report.score * 1.6}`}
                    fill="none"
                    stroke="url(#splineGradient)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Load / RPE Spline (Faint white) */}
                  <path
                    d="M 40,160 C 155,140 270,190 385,120 S 615,80 760,150"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="4 4"
                  />

                  {/* Graph Data Points */}
                  {currentAthlete.history7Days.concat([report.score]).map((scoreVal, index) => {
                    const x = index * 102 + 40;
                    const y = 220 - scoreVal * 1.6;
                    return (
                      <g key={index}>
                        <circle cx={x} cy={y} r="5" fill="#13201C" stroke="#D4AF37" strokeWidth="1.5" />
                        <text x={x} y={y - 12} fontSize="8" fontFamily="monospace" fill="#D4AF37" textAnchor="middle">{scoreVal}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Graph Legend */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#23352F]/40 font-mono text-[9px] text-neutral-400">
                <div className="flex gap-6">
                  <span className="flex items-center gap-2"><span className="w-3 h-0.5 bg-gradient-to-r from-[#6DA398] to-[#E26D5A]"></span> RECOVERY INDEX</span>
                  <span className="flex items-center gap-2"><span className="w-3 h-0.5 bg-neutral-600 border-dashed border-t"></span> BIOMETRIC TRAINING LOAD</span>
                </div>
                <span>7-DAY RANGE // SCALE: 0 - 100</span>
              </div>
            </div>

            {/* Sub-components: Bio Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'NEURAL SYSTEM', val: `${log.hrvDelta > 0 ? '+' : ''}${log.hrvDelta}ms`, desc: report.nervousSystemStatus },
                { label: 'PROTEIN INDEX', val: `${log.protein}g`, desc: 'OPTIMAL FUEL' },
                { label: 'SYSTEM STRESS', val: `${log.mentalStress}/10`, desc: report.mentalLoadStatus },
                { label: 'HYDRATION VOL', val: `${log.hydration.toFixed(1)}L`, desc: report.nutritionStatus },
              ].map((item, idx) => (
                <div key={idx} className="bg-[#13201C] border border-[#23352F]/70 p-6 flex flex-col justify-between shadow-md">
                  <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase font-bold">{item.label}</span>
                  <span className="text-xl font-serif text-white font-bold my-2">{item.val}</span>
                  <span className={`text-[9px] font-mono tracking-widest uppercase ${
                    item.desc === 'Optimal' || item.desc === 'Adequate' || item.desc === 'OPTIMAL FUEL' 
                      ? 'text-[#6DA398]' 
                      : 'text-[#E26D5A]'
                  }`}>{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: DAILY CHECK-IN ZONE */}
        {activeTab === 'checkin' && (
          <div className="space-y-10 animate-fade-in">
            {/* The Voice Log Capsule */}
            <div className="bg-[#13201C] border border-[#23352F]/70 p-10 flex flex-col items-center justify-center text-center space-y-6 shadow-xl relative overflow-hidden">
              <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold">SPEECH TO BIOMETRIC PIPELINE</span>
              
              {/* Central Mic Pill */}
              <button 
                onClick={handleStartVoice}
                className={`w-20 h-20 rounded-full flex items-center justify-center border transition-all duration-500 ${
                  isRecording 
                    ? 'bg-[#E26D5A]/20 border-[#E26D5A] text-[#E26D5A] shadow-[0_0_24px_rgba(226,109,90,0.4)] animate-pulse'
                    : 'bg-[#13201C] border-[#D4AF37]/50 text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#13201C]/80'
                }`}
              >
                {isRecording ? <MicOff size={28} /> : <Mic size={28} />}
              </button>

              {/* Animated Waveform Canvas */}
              {isRecording ? (
                <div className="flex h-12 w-full max-w-xs items-center justify-center relative">
                  <canvas ref={canvasRef} width="300" height="48" className="absolute inset-0" />
                </div>
              ) : (
                <div className="h-12 flex items-center justify-center text-neutral-600 font-mono text-[9px] uppercase tracking-widest">
                  WAVEFORM READY // BUFFER CLEARED
                </div>
              )}

              <p className="font-serif text-lg text-white max-w-md">
                "Speak to log your daily biometrics and symptoms."
              </p>
              
              {log.symptomTranscript && (
                <div className="w-full max-w-xl space-y-3">
                  <div className="bg-black/40 border border-[#23352F]/40 p-4 font-mono text-xs text-left leading-relaxed">
                    <span className="text-[#D4AF37] font-bold block mb-1">CAPTURED TRANSCRIPT:</span>
                    "{log.symptomTranscript}"
                  </div>
                  {log.symptomLocation !== 'None' && (
                    <div className="bg-[#13201C] border border-[#6DA398]/30 p-3 font-mono text-[10px] text-left text-[#6DA398] flex justify-between items-center animate-pulse">
                      <span>✓ AI SYMPTOM EXTRACTION SUCCESSFUL</span>
                      <span className="uppercase font-bold text-white">LOC: {log.symptomLocation} // PAIN: {log.painLevel}/10</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Manual Entry Form */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Sliders and fields */}
              <div className="lg:col-span-7 bg-[#13201C] border border-[#23352F]/70 p-8 shadow-xl space-y-8">
                <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold block pb-4 border-b border-[#23352F]/40">
                  MANUAL PARAMETER CHECK
                </span>

                {/* Editorial input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono tracking-widest text-neutral-400 block uppercase">ATHLETE COMPLIANCE NOTES</label>
                  <input 
                    type="text" 
                    placeholder="Enter notes manually..." 
                    className="w-full bg-transparent border-b border-[#23352F]/70 focus:border-[#D4AF37] text-white py-2 focus:outline-none transition-all duration-300 font-serif text-lg italic placeholder:text-neutral-600"
                    value={log.symptomTranscript}
                    onChange={e => handleLogChange({ ...log, symptomTranscript: e.target.value })}
                  />
                </div>

                {/* Sleep Hours Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-neutral-400">SLEEP DURATION</span>
                    <span className="text-[#D4AF37] font-bold">{log.sleepHours.toFixed(1)}H</span>
                  </div>
                  <input 
                    type="range" 
                    min="4" 
                    max="12" 
                    step="0.1" 
                    value={log.sleepHours} 
                    onChange={e => handleLogChange({ ...log, sleepHours: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-[#23352F] appearance-none accent-[#D4AF37]" 
                  />
                </div>

                {/* HRV Delta Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-neutral-400">HRV VARIATION (DELTA)</span>
                    <span className={`font-bold ${log.hrvDelta < -10 ? 'text-[#E26D5A]' : 'text-[#6DA398]'}`}>
                      {log.hrvDelta > 0 ? '+' : ''}{log.hrvDelta}ms
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="-40" 
                    max="30" 
                    value={log.hrvDelta} 
                    onChange={e => handleLogChange({ ...log, hrvDelta: parseInt(e.target.value) })}
                    className="w-full h-1 bg-[#23352F] appearance-none accent-[#D4AF37]" 
                  />
                </div>

                {/* RPE & Stress Sliders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <div className="flex justify-between font-mono text-xs">
                      <span className="text-neutral-400">TRAINING RPE</span>
                      <span className="text-[#D4AF37] font-bold">{log.rpePrevious}/10</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={log.rpePrevious} 
                      onChange={e => handleLogChange({ ...log, rpePrevious: parseInt(e.target.value) })}
                      className="w-full h-1 bg-[#23352F] appearance-none accent-[#D4AF37]" 
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between font-mono text-xs">
                      <span className="text-neutral-400">MENTAL STRESS</span>
                      <span className="text-[#D4AF37] font-bold">{log.mentalStress}/10</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={log.mentalStress} 
                      onChange={e => handleLogChange({ ...log, mentalStress: parseInt(e.target.value) })}
                      className="w-full h-1 bg-[#23352F] appearance-none accent-[#D4AF37]" 
                    />
                  </div>
                </div>

                {/* Nutrition Sliders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <div className="flex justify-between font-mono text-xs">
                      <span className="text-neutral-400">HYDRATION TARGET</span>
                      <span className="text-[#D4AF37] font-bold">{log.hydration.toFixed(1)}L</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="6" 
                      step="0.1" 
                      value={log.hydration} 
                      onChange={e => handleLogChange({ ...log, hydration: parseFloat(e.target.value) })}
                      className="w-full h-1 bg-[#23352F] appearance-none accent-[#D4AF37]" 
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between font-mono text-xs">
                      <span className="text-neutral-400">PROTEIN INTAKE</span>
                      <span className="text-[#D4AF37] font-bold">{log.protein}g</span>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="250" 
                      step="5" 
                      value={log.protein} 
                      onChange={e => handleLogChange({ ...log, protein: parseInt(e.target.value) })}
                      className="w-full h-1 bg-[#23352F] appearance-none accent-[#D4AF37]" 
                    />
                  </div>
                </div>
              </div>

              {/* Minimalist vector body outline */}
              <div className="lg:col-span-5 bg-[#13201C] border border-[#23352F]/70 p-8 shadow-xl flex flex-col justify-between items-center text-center">
                <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold block w-full text-left pb-4 border-b border-[#23352F]/40 mb-6">
                  SYMPTOM LOCALIZATION
                </span>

                <div className="relative w-full max-w-[180px] h-[280px]">
                  <svg viewBox="0 0 100 200" className="h-full w-full object-contain filter drop-shadow-md">
                    {/* Head */}
                    <circle cx="50" cy="22" r="10" fill="none" stroke="#23352F" strokeWidth="1.5" />
                    {/* Spine */}
                    <line x1="50" y1="32" x2="50" y2="105" stroke="#23352F" strokeWidth="1.5" />
                    {/* Shoulders */}
                    <line x1="32" y1="44" x2="68" y2="44" stroke="#23352F" strokeWidth="1.5" />
                    {/* Arms */}
                    <line x1="32" y1="44" x2="24" y2="88" stroke="#23352F" strokeWidth="1.5" />
                    <line x1="68" y1="44" x2="76" y2="88" stroke="#23352F" strokeWidth="1.5" />
                    {/* Hips */}
                    <line x1="38" y1="105" x2="62" y2="105" stroke="#23352F" strokeWidth="1.5" />
                    {/* Legs */}
                    <line x1="38" y1="105" x2="38" y2="165" stroke="#23352F" strokeWidth="1.5" />
                    <line x1="62" y1="105" x2="62" y2="165" stroke="#23352F" strokeWidth="1.5" />
                  </svg>

                  {/* Hotspots */}
                  {[
                    { name: 'Lower Back', top: '43%', left: '46%' },
                    { name: 'Right Hamstring', top: '65%', left: '56%' },
                    { name: 'Left Knee', top: '74%', left: '33%' },
                    { name: 'Left Achilles Tendon', top: '88%', left: '33%' },
                    { name: 'Right Shoulder', top: '20%', left: '60%' }
                  ].map(pt => {
                    const isActive = log.symptomLocation === pt.name;
                    return (
                      <button
                        key={pt.name}
                        onClick={() => handleLogChange({ ...log, symptomLocation: isActive ? 'None' : pt.name })}
                        className={`absolute w-3 h-3 rounded-full border transition-all duration-300 ${
                          isActive 
                            ? 'bg-[#E26D5A] border-white scale-125 shadow-[0_0_8px_#E26D5A]' 
                            : 'bg-[#13201C] border-[#D4AF37]/50 hover:bg-[#D4AF37]/20'
                        }`}
                        style={{ top: pt.top, left: pt.left }}
                        title={pt.name}
                      />
                    );
                  })}
                </div>

                <div className="mt-6 p-4 bg-black/40 border border-[#23352F]/40 w-full font-mono text-[10px]">
                  <span className="text-[#6DA398] font-bold block mb-1">LOCALIZED INJURY FOCUS:</span>
                  {log.symptomLocation.toUpperCase() || 'NONE TARGETED'}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: RECOVERY HUB */}
        {activeTab === 'recovery' && (
          <div className="space-y-10 animate-fade-in">
            {/* Today's Protocol Prescription Card */}
            <div className="bg-[#13201C] border-t-4 border-[#D4AF37] border-x border-b border-[#23352F]/70 p-10 shadow-xl relative">
              <div className="flex justify-between items-start pb-6 border-b border-[#23352F]/40 mb-8">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold block">PUNARVA PROTOCOL // RX_CARD</span>
                  <h3 className="font-serif text-2xl text-white mt-1">Daily Rehabilitation Modality</h3>
                </div>
                <span className="font-mono text-[9px] text-[#6DA398] border border-[#6DA398]/30 px-2 py-0.5 uppercase tracking-wider">
                  STATUS: CLEARED
                </span>
              </div>

              {/* Checklist */}
              <div className="space-y-6">
                {activeOverride ? (
                  <div className="p-6 bg-black/40 border border-[#23352F]/40">
                    <span className="font-mono text-[10px] text-[#D4AF37] uppercase block mb-2 font-bold">COACH OVERRIDE PROTOCOL DIRECTIVE:</span>
                    <p className="font-serif text-lg text-white leading-relaxed italic mb-4">
                      "{activeOverride}"
                    </p>
                    <label className="flex items-center gap-3 cursor-pointer group select-none">
                      <input type="checkbox" className="w-4 h-4 bg-transparent border-[#23352F] text-[#D4AF37] focus:ring-0 cursor-pointer" />
                      <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest group-hover:text-[#D4AF37]">MARK AS EXECUTED & COMPLETED</span>
                    </label>
                  </div>
                ) : (
                  [
                    { label: "15-Min Contrast Bath (Cryotherapy cycle)", timing: "Pre-warmup phase" },
                    { label: "Eccentric Hamstring Drills (4 sets x 8 reps)", timing: "Post-activation session" },
                    { label: "Static stretching & active tissue release therapy", timing: "Post-session cooldown" },
                    { label: "Hydration check (minimum 3.5 liters target)", timing: "Continuous diurnal check" }
                  ].map((item, idx) => (
                    <label key={idx} className="flex items-start gap-4 cursor-pointer group select-none">
                      <input 
                        type="checkbox" 
                        defaultChecked={idx < 2} 
                        className="w-4 h-4 rounded-none bg-transparent border-[#23352F] text-[#D4AF37] focus:ring-0 cursor-pointer mt-1" 
                      />
                      <div>
                        <span className="font-serif text-base text-white group-hover:text-[#D4AF37] transition-colors">{item.label}</span>
                        <span className="font-mono text-[9px] text-neutral-500 block uppercase tracking-wider">{item.timing}</span>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Nutritional Prescription */}
            <div className="bg-[#13201C] border border-[#23352F]/70 p-10 shadow-xl space-y-6">
              <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold block border-b border-[#23352F]/40 pb-4">
                BIO-ENERGETIC DIETARY METRIC
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h4 className="font-serif text-xl text-white">Target Calorie & Protein Adjustments</h4>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    Based on today's localized tissue repair indicators and systemic load levels, your metabolic targets have been computed using standard clinical algorithms.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/30 border border-[#23352F]/50 p-6 text-center">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase block tracking-wider">DAILY CALORIE BUDGET</span>
                    <span className="text-2xl font-serif text-[#D4AF37] font-bold block mt-2">2,850 kcal</span>
                  </div>
                  <div className="bg-black/30 border border-[#23352F]/50 p-6 text-center">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase block tracking-wider">PROTEIN INTENSIFIER</span>
                    <span className="text-2xl font-serif text-[#6DA398] font-bold block mt-2">+{log.protein}g target</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MEDICAL REPORTS & ARCHIVE */}
        {activeTab === 'archive' && (
          <div className="space-y-10 animate-fade-in">
            {/* Upload Dropzone */}
            <div className="border border-dashed border-[#D4AF37]/50 bg-[#13201C]/40 p-12 text-center shadow-xl relative hover:border-[#D4AF37] transition-all duration-300">
              <label className="flex flex-col items-center justify-center cursor-pointer space-y-4">
                <FileUp className="text-[#D4AF37] mb-2" size={32} />
                <h3 className="font-serif text-xl text-white">
                  Drop Medical Reports, X-Rays, or Clearance Documents Here.
                </h3>
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">
                  SUPPORTS PDF SCAN REPORTS / IMAGING FILES (MAX 10MB)
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,application/pdf"
                  onChange={handleDocumentUpload}
                  disabled={uploadLoading}
                />
              </label>

              {uploadLoading && (
                <div className="absolute inset-0 bg-[#0B1210]/85 flex items-center justify-center gap-3">
                  <Loader2 className="animate-spin text-[#D4AF37]" size={20} />
                  <span className="font-mono text-xs text-[#D4AF37] tracking-widest uppercase">PROCESSING MEDICAL DATA...</span>
                </div>
              )}

              {uploadSuccess && (
                <div className="mt-6 p-3 bg-[#6DA398]/10 border border-[#6DA398]/30 text-[#6DA398] font-mono text-xs uppercase tracking-wider">
                  {uploadSuccess}
                </div>
              )}
            </div>

            {/* AI Summary Box */}
            <div className="bg-[#13201C] border border-[#23352F]/70 p-10 shadow-xl space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-[#23352F]/40">
                <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold">AI CLINICAL ARCHIVAL TRANSLATION</span>
                <span className="text-[9px] font-mono text-neutral-500">FORMAT: CLINICAL_SUMMARY</span>
              </div>

              <div className="space-y-4 font-serif text-neutral-300 italic text-base leading-relaxed p-6 bg-black/20 border border-[#23352F]/30">
                {currentAthlete.injuryHistory.length > 0 ? (
                  currentAthlete.injuryHistory.map((inj, idx) => (
                    <div key={idx} className="pb-4 border-b border-[#23352F]/20 last:border-b-0 space-y-1">
                      <span className="font-mono text-[9px] text-[#D4AF37] uppercase block tracking-wider font-bold">
                        {inj.date} — {inj.anatomicalSite} // {inj.severity}
                      </span>
                      <p className="text-white text-sm">
                        "{inj.description}"
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-neutral-500 py-10 font-mono text-xs uppercase tracking-widest">
                    No clinical logs or reports stored in history.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* CSS keyframe overrides inside body */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes wave {
          0% { transform: scaleY(0.4); }
          100% { transform: scaleY(1.4); }
        }
      `}} />
    </div>
  );
}

export default App;
