const fs = require('fs');

const content = \`import { useState } from 'react';
import { Bell, Settings, Plus, Calendar, History, User, HelpCircle, LogOut, FileUp, ShieldCheck, Loader2 } from 'lucide-react';
import type { Athlete, TodayLog, RecoveryReport } from '../types';
import { analyzeMedicalScan } from '../services/aiPipeline';

interface Props {
  athlete: Athlete;
  log: TodayLog;
  report: RecoveryReport | null;
  onLogout: () => void;
  activeTab: 'overview' | 'checkin' | 'history' | 'profile' | 'scans' | 'protocol';
  setActiveTab: (tab: 'overview' | 'checkin' | 'history' | 'profile' | 'scans' | 'protocol') => void;
}

export function AthleteDashboard({ athlete, log, report, onLogout, activeTab, setActiveTab }: Props) {
  const score = report ? report.score : 84;
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [medicalReportData, setMedicalReportData] = useState<any>(null);

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    setUploadSuccess(false);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        try {
          const res = await analyzeMedicalScan(base64Data);
          setMedicalReportData(res);
          setUploadSuccess(true);
        } catch (err) {
          console.error(err);
        } finally {
          setUploadLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setUploadLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#FCF5F5] font-sans text-[#1A1A1A] flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 bg-[#FCF5F5] border-b border-[#EEDADA] px-8 flex items-center justify-between shrink-0">
        <div className="flex-1">
          <span className="font-serif text-2xl font-black text-[#B03030] tracking-tight">PUNARVA</span>
        </div>
        
        <nav className="flex-1 flex justify-center gap-8 text-sm font-medium">
          <button 
            onClick={() => setActiveTab('overview')}
            className={\`pb-4 pt-4 border-b-2 px-2 transition-colors \${activeTab === 'overview' ? 'border-[#B03030] text-[#B03030]' : 'border-transparent text-neutral-500 hover:text-[#1A1A1A]'}\`}
          >
            Today
          </button>
          <button 
            onClick={() => setActiveTab('scans')}
            className={\`pb-4 pt-4 border-b-2 px-2 transition-colors \${activeTab === 'scans' ? 'border-[#B03030] text-[#B03030]' : 'border-transparent text-neutral-500 hover:text-[#1A1A1A]'}\`}
          >
            Uploads
          </button>
          <button 
            onClick={() => setActiveTab('protocol')}
            className={\`pb-4 pt-4 border-b-2 px-2 transition-colors \${activeTab === 'protocol' ? 'border-[#B03030] text-[#B03030]' : 'border-transparent text-neutral-500 hover:text-[#1A1A1A]'}\`}
          >
            Protocol
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={\`pb-4 pt-4 border-b-2 px-2 transition-colors \${activeTab === 'history' ? 'border-[#B03030] text-[#B03030]' : 'border-transparent text-neutral-500 hover:text-[#1A1A1A]'}\`}
          >
            History
          </button>
        </nav>
        
        <div className="flex-1 flex items-center justify-end gap-4 text-neutral-500">
          <button className="hover:text-[#1A1A1A]"><Bell size={20} /></button>
          <button className="hover:text-[#1A1A1A]"><Settings size={20} /></button>
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden ml-2 border border-[#EEDADA]">
            <img src={\`https://ui-avatars.com/api/?name=\${encodeURIComponent(athlete.name)}&background=B03030&color=fff\`} alt={athlete.name} className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-[#FCF0F0] border-r border-[#EEDADA] flex flex-col p-6 shrink-0 hidden lg:flex">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-[#B03030] rounded-[10px] flex items-center justify-center text-white shadow-sm">
              <User size={20} />
            </div>
            <div>
              <h2 className="font-bold text-sm text-[#1A1A1A]">Athlete Hub</h2>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Peak Readiness</p>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            <button 
              onClick={() => setActiveTab('overview')}
              className={\`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-sm font-medium transition-all \${activeTab === 'overview' ? 'bg-[#3B82F6] text-white shadow-md shadow-blue-500/20' : 'text-neutral-600 hover:bg-white/50'}\`}
            >
              <Calendar size={18} /> Today
            </button>
            <button 
              onClick={() => setActiveTab('scans')}
              className={\`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-sm font-medium transition-all \${activeTab === 'scans' ? 'bg-[#3B82F6] text-white shadow-md shadow-blue-500/20' : 'text-neutral-600 hover:bg-white/50'}\`}
            >
              <FileUp size={18} /> Report Uploads
            </button>
            <button 
              onClick={() => setActiveTab('protocol')}
              className={\`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-sm font-medium transition-all \${activeTab === 'protocol' ? 'bg-[#3B82F6] text-white shadow-md shadow-blue-500/20' : 'text-neutral-600 hover:bg-white/50'}\`}
            >
              <ShieldCheck size={18} /> Recovery System
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={\`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-sm font-medium transition-all \${activeTab === 'history' ? 'bg-[#3B82F6] text-white shadow-md shadow-blue-500/20' : 'text-neutral-600 hover:bg-white/50'}\`}
            >
              <History size={18} /> History
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={\`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-sm font-medium transition-all \${activeTab === 'profile' ? 'bg-[#3B82F6] text-white shadow-md shadow-blue-500/20' : 'text-neutral-600 hover:bg-white/50'}\`}
            >
              <User size={18} /> Profile
            </button>
          </nav>

          <div className="mt-auto space-y-2 pt-6 border-t border-[#EEDADA]">
            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-neutral-600 hover:text-[#1A1A1A]">
              <HelpCircle size={18} /> Help
            </button>
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-neutral-600 hover:text-[#1A1A1A]">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-12">
          {activeTab === 'overview' && (
            <div className="max-w-6xl mx-auto space-y-6">
              
              {/* Top Row: Score + Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* Circular Score */}
                <div className="lg:col-span-2 bg-white rounded-[24px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-[#EEDADA] flex flex-col items-center justify-center">
                  <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#FCF0F0" strokeWidth="8" />
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#047857" strokeWidth="8" strokeDasharray={\`\${score * 2.82} 282\`} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                    </svg>
                    <div className="text-center">
                      <span className="block text-4xl font-serif font-bold text-[#047857]">{score}</span>
                      <span className="block text-[10px] font-bold tracking-widest text-neutral-400 uppercase mt-1">RECOVERY</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-4 py-1.5 bg-[#D1FAE5] text-[#047857] rounded-full text-[10px] font-bold uppercase tracking-wider">Optimal</span>
                    <span className="px-4 py-1.5 bg-[#FCF0F0] text-[#B03030] rounded-full text-[10px] font-bold uppercase tracking-wider">+4 vs Yesterday</span>
                  </div>
                </div>

                {/* AI Insights */}
                <div className="lg:col-span-3 bg-white rounded-[24px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-[#EEDADA] border-l-4 border-l-[#047857] flex flex-col">
                  <h3 className="font-sans font-bold text-[#1A1A1A] mb-4">AI Coach Insights</h3>
                  <p className="text-sm leading-relaxed text-neutral-600 flex-1">
                    "{report?.athleteMessage || \`You've balanced yesterday's high-intensity block perfectly with deep sleep, \${athlete.name.split(' ')[0]}. Your heart rate variability is trending up, showing great nervous system resilience. While your legs feel heavy, the data suggests you're ready for a technical session today—just keep the impact low. How about a focused mobility flow before your workout?\`}"
                  </p>
                  <button onClick={() => setActiveTab('protocol')} className="self-start mt-6 bg-[#B03030] hover:bg-[#8A2525] text-white px-6 py-2.5 rounded-[8px] font-bold text-sm shadow-md transition-colors">
                    View Daily Protocol
                  </button>
                </div>
              </div>

              {/* Pill Tags */}
              <div className="flex flex-wrap gap-4">
                <div className="bg-white px-5 py-2.5 rounded-full border border-[#EEDADA] flex items-center gap-3 text-sm font-medium shadow-sm">
                  <span className="text-[#3B82F6]">🌙</span> Sleep: {log.sleepHours}h <div className="w-2 h-2 rounded-full bg-[#047857]"></div>
                </div>
                <div className="bg-white px-5 py-2.5 rounded-full border border-[#EEDADA] flex items-center gap-3 text-sm font-medium shadow-sm">
                  <span className="text-[#B03030]">🧠</span> CNS: Restored <div className="w-2 h-2 rounded-full bg-[#047857]"></div>
                </div>
                <div className="bg-white px-5 py-2.5 rounded-full border border-[#EEDADA] flex items-center gap-3 text-sm font-medium shadow-sm">
                  <span className="text-[#047857]">🍴</span> Nutrition: Balanced <div className="w-2 h-2 rounded-full bg-[#047857]"></div>
                </div>
                <div className="bg-white px-5 py-2.5 rounded-full border border-[#EEDADA] flex items-center gap-3 text-sm font-medium shadow-sm">
                  <span className="text-[#3B82F6]">💧</span> Hydration: Optimal <div className="w-2 h-2 rounded-full bg-[#047857]"></div>
                </div>
              </div>

              {/* 6 Grid Metrics & 3D Body */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 6 Cards */}
                <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Physio Load */}
                  <div className="bg-white p-5 rounded-[20px] border border-[#EEDADA] shadow-sm flex flex-col justify-between aspect-square">
                    <div className="flex justify-between items-start">
                      <div className="w-8 h-8 rounded-full bg-[#FCF0F0] flex items-center justify-center text-[#B03030]">📈</div>
                      <span className="font-bold text-lg">92</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Physio Load</p>
                      <div className="h-1.5 w-full bg-[#FCF0F0] rounded-full overflow-hidden">
                        <div className="h-full bg-[#B03030] w-[92%] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  {/* Sleep Quality */}
                  <div className="bg-white p-5 rounded-[20px] border border-[#EEDADA] shadow-sm flex flex-col justify-between aspect-square">
                    <div className="flex justify-between items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#3B82F6]">🌙</div>
                      <span className="font-bold text-lg">88</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Sleep Quality</p>
                      <div className="h-1.5 w-full bg-blue-50 rounded-full overflow-hidden">
                        <div className="h-full bg-[#3B82F6] w-[88%] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  {/* HRV Readiness */}
                  <div className="bg-white p-5 rounded-[20px] border border-[#EEDADA] shadow-sm flex flex-col justify-between aspect-square">
                    <div className="flex justify-between items-start">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-[#047857]">⚡</div>
                      <span className="font-bold text-lg">76</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">HRV Readiness</p>
                      <div className="h-1.5 w-full bg-emerald-50 rounded-full overflow-hidden">
                        <div className="h-full bg-[#047857] w-[76%] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  {/* Muscle Fatigue */}
                  <div className="bg-white p-5 rounded-[20px] border border-[#EEDADA] shadow-sm flex flex-col justify-between aspect-square">
                    <div className="flex justify-between items-start">
                      <div className="w-8 h-8 rounded-full bg-[#FCF0F0] flex items-center justify-center text-[#B03030]">🦾</div>
                      <span className="font-bold text-lg">45</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Muscle Fatigue</p>
                      <div className="h-1.5 w-full bg-[#FCF0F0] rounded-full overflow-hidden">
                        <div className="h-full bg-[#B03030] w-[45%] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  {/* Mental Clarity */}
                  <div className="bg-white p-5 rounded-[20px] border border-[#EEDADA] shadow-sm flex flex-col justify-between aspect-square">
                    <div className="flex justify-between items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#3B82F6]">🧘</div>
                      <span className="font-bold text-lg">94</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Mental Clarity</p>
                      <div className="h-1.5 w-full bg-blue-50 rounded-full overflow-hidden">
                        <div className="h-full bg-[#3B82F6] w-[94%] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  {/* Cell Hydration */}
                  <div className="bg-white p-5 rounded-[20px] border border-[#EEDADA] shadow-sm flex flex-col justify-between aspect-square">
                    <div className="flex justify-between items-start">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-[#047857]">💧</div>
                      <span className="font-bold text-lg">82</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Cell Hydration</p>
                      <div className="h-1.5 w-full bg-emerald-50 rounded-full overflow-hidden">
                        <div className="h-full bg-[#047857] w-[82%] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 7-Day Recovery Trend Chart (Spans 3 cols) */}
                  <div className="col-span-2 md:col-span-3 bg-white p-6 rounded-[20px] border border-[#EEDADA] shadow-sm mt-2">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-medium text-[#1A1A1A]">7-Day Recovery Trend</h3>
                      <span className="text-xs text-neutral-500">Last Week</span>
                    </div>
                    <div className="flex items-end justify-between h-32 gap-2">
                      {[40, 60, 50, 80, 65, 85, score].map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                          <div 
                            className={\`w-full rounded-t-sm transition-all \${i === 6 ? 'bg-[#047857]' : 'bg-[#FCF0F0] group-hover:bg-[#EEDADA]'}\`} 
                            style={{ height: \`\${val}%\` }}
                          ></div>
                          {i === 6 && (
                            <div className="absolute -top-8 bg-[#1A1A1A] text-white text-[9px] px-2 py-1 rounded font-mono">
                              Sun: {val}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Muscular Tension 3D Card */}
                <div className="bg-white rounded-[24px] p-6 border border-[#EEDADA] shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-medium text-[#1A1A1A] w-24 leading-tight">Muscular Tension</h3>
                    <div className="flex bg-[#FCF5F5] rounded-full p-1 text-[10px] font-bold">
                      <button className="px-3 py-1 bg-white rounded-full shadow-sm text-[#1A1A1A]">Front</button>
                      <button className="px-3 py-1 text-neutral-500">Back</button>
                    </div>
                  </div>

                  <div className="flex-1 bg-[#F5F5F5] rounded-[16px] flex items-center justify-center relative overflow-hidden mb-6">
                    {/* Placeholder for 3D body image */}
                    <img src="https://images.unsplash.com/photo-1532384816664-01b8b7238c8d?q=80&w=400&auto=format&fit=crop" alt="Muscles" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-20" />
                    
                    {log.symptomLocation && log.symptomLocation !== 'None' && (
                      <div className="absolute z-10 p-2 rounded-full bg-[#B03030]/20 border border-[#B03030]/40 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#B03030]"></div>
                      </div>
                    )}
                  </div>

                  <div className="bg-[#FCF5F5] rounded-[16px] p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-sm text-[#1A1A1A]">{log.symptomLocation !== 'None' ? log.symptomLocation : 'No localized pain'}</h4>
                      <span className="bg-[#FCF0F0] text-[#B03030] text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {log.painLevel > 0 ? 'Moderate Tension' : 'Clear'}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {log.painLevel > 0 ? \`Consistent with yesterday's volume. Apply foam rolling for 5 minutes.\` : 'No structural issues detected. Proceed with normal load.'}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'scans' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="font-serif text-3xl font-black tracking-tight text-[#1A1A1A]">Report Uploads</h2>
              <p className="text-neutral-600">Securely upload your MRI, X-Ray, or clinician reports for AI parsing.</p>
              
              <div className="bg-white p-8 rounded-[24px] border border-[#EEDADA] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                <div className="border-2 border-dashed border-[#EEDADA] rounded-[16px] p-12 text-center hover:bg-[#FCF5F5] transition-colors relative">
                  <input 
                    type="file" 
                    accept="image/*,.pdf" 
                    onChange={handleDocumentUpload} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {uploadLoading ? (
                    <div className="flex flex-col items-center gap-4 text-[#B03030]">
                      <Loader2 className="animate-spin w-8 h-8" />
                      <p className="font-mono text-xs font-bold uppercase tracking-widest">Analyzing Medical Scan OCR...</p>
                    </div>
                  ) : uploadSuccess ? (
                    <div className="flex flex-col items-center gap-4 text-[#047857]">
                      <ShieldCheck className="w-8 h-8" />
                      <p className="font-mono text-xs font-bold uppercase tracking-widest">Scan Successfully Parsed & Added</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-neutral-500">
                      <FileUp className="w-8 h-8" />
                      <p className="font-sans font-medium text-sm text-[#1A1A1A]">Click or drag file to upload</p>
                      <p className="font-mono text-[10px] tracking-widest uppercase">Supports DICOM, PDF, JPEG</p>
                    </div>
                  )}
                </div>

                {medicalReportData && (
                  <div className="mt-8 p-6 bg-[#FCF0F0] border border-[#EEDADA] rounded-[16px]">
                    <h3 className="font-bold text-[#1A1A1A] mb-4">Extracted Medical Data</h3>
                    <div className="space-y-3 font-mono text-xs">
                      <div><span className="text-neutral-500">Diagnosis:</span> <span className="font-bold text-[#B03030]">{medicalReportData.diagnosis || 'N/A'}</span></div>
                      <div><span className="text-neutral-500">Focus Area:</span> <span className="font-bold text-[#1A1A1A]">{medicalReportData.anatomical_focus || 'N/A'}</span></div>
                      <div><span className="text-neutral-500">Restrictions:</span> <span className="font-bold text-[#1A1A1A]">{medicalReportData.restricted_movements?.join(', ') || 'None'}</span></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'protocol' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="font-serif text-3xl font-black tracking-tight text-[#1A1A1A]">Recovery System</h2>
              <p className="text-neutral-600">Your personalized, AI-generated physiological recovery protocol.</p>

              {report ? (
                <div className="space-y-6">
                  {/* Directives */}
                  <div className="bg-white p-8 rounded-[24px] border border-[#EEDADA] shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-6">
                    <h3 className="font-bold text-[#1A1A1A] flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-[#FCF0F0] text-[#B03030] flex items-center justify-center text-xs">1</span> Training Adjustment</h3>
                    <p className="text-sm text-neutral-600">{report.directives.trainingAdjustment}</p>

                    <h3 className="font-bold text-[#1A1A1A] flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-[#FCF0F0] text-[#B03030] flex items-center justify-center text-xs">2</span> Recovery Protocol</h3>
                    <p className="text-sm text-neutral-600">{report.directives.recoveryProtocol}</p>

                    <h3 className="font-bold text-[#1A1A1A] flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-[#FCF0F0] text-[#B03030] flex items-center justify-center text-xs">3</span> Nutrition Focus</h3>
                    <p className="text-sm text-neutral-600">{report.directives.nutritionFocus}</p>
                  </div>

                  {/* Deductions & Risks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#FCF5F5] p-6 rounded-[20px] border border-[#EEDADA]">
                      <h4 className="font-bold text-sm text-[#1A1A1A] mb-4">Score Deductions</h4>
                      <ul className="space-y-3">
                        {report.deductions.map((d, i) => (
                          <li key={i} className="flex items-start gap-3 text-xs text-neutral-600">
                            <span className="font-mono text-[#B03030] bg-white px-2 py-0.5 rounded border border-[#EEDADA]">{d.points}</span>
                            {d.reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white p-6 rounded-[20px] border border-[#EEDADA]">
                      <h4 className="font-bold text-sm text-[#1A1A1A] mb-4">Historical Risk Pattern</h4>
                      {report.patternMatch.isMatch ? (
                        <div className="space-y-2">
                          <span className="inline-block px-3 py-1 bg-[#FCF0F0] text-[#B03030] text-[10px] font-bold uppercase tracking-wider rounded-full">High Correlation</span>
                          <p className="text-sm font-medium text-[#1A1A1A]">Matches conditions preceding {report.patternMatch.injuryName}.</p>
                          <p className="text-xs text-neutral-600">{report.riskExplanation}</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-24 text-neutral-400">
                          <ShieldCheck size={24} className="mb-2 text-[#047857]" />
                          <span className="text-xs">No concerning historical patterns detected.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-[24px] border border-[#EEDADA] text-center">
                  <p className="text-neutral-500">No protocol available today.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="font-serif text-3xl font-black tracking-tight text-[#1A1A1A]">History</h2>
              <div className="bg-white p-8 rounded-[24px] border border-[#EEDADA] text-center">
                <p className="text-neutral-500">Historical logs will be shown here.</p>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="font-serif text-3xl font-black tracking-tight text-[#1A1A1A]">Athlete Profile</h2>
              <div className="bg-white p-8 rounded-[24px] border border-[#EEDADA] text-center">
                <p className="text-neutral-500">Athlete details will be shown here.</p>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Floating FAB for Action */}
      <button 
        onClick={() => setActiveTab('checkin')}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#B03030] hover:bg-[#8A2525] text-white rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-105 z-50"
      >
        <Plus size={24} />
      </button>

    </div>
  );
}
\`;

fs.writeFileSync('src/components/AthleteDashboard.tsx', content, 'utf8');
console.log('Successfully rebuilt AthleteDashboard.tsx');
