import { analyzeMedicalScan } from '../services/aiPipeline';
import { AIAnalysisHub } from './AIAnalysisHub';
import { useState } from 'react';
import { Bell, Settings, Plus, Calendar, History, User, HelpCircle, LogOut, FileUp, ShieldCheck, Loader2 } from 'lucide-react';
import type { Athlete, TodayLog, RecoveryReport } from '../types';


interface Props {
  athlete: Athlete;
  log: TodayLog;
  report: RecoveryReport | null;
  onLogout: () => void;
  activeTab: 'overview' | 'checkin' | 'history' | 'profile' | 'scans' | 'protocol';
  setActiveTab: (tab: 'overview' | 'checkin' | 'history' | 'profile' | 'scans' | 'protocol') => void;
}

export function AthleteDashboard({ athlete, log, report, onLogout, activeTab, setActiveTab }: Props) {
  
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [medicalReportData, setMedicalReportData] = useState<any>(null);
  const [linkedCoach, setLinkedCoach] = useState<string>(localStorage.getItem(`linked_coach_${athlete.id}`) || '');

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    setUploadSuccess(false);

    try {
      const res = await analyzeMedicalScan(file);
      setMedicalReportData(res);
      setUploadSuccess(true);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED') || err.message?.includes('quota')) {
        const retryMatch = err.message.match(/retry in ([\d.]+)s/);
        const secs = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 60;
        alert(`⏳ Rate limit hit (free tier: 20 requests/min).\nPlease wait ${secs} seconds and try again.`);
      } else {
        alert('Failed to analyze scan: ' + err.message);
      }
    } finally {
      setUploadLoading(false);
      e.target.value = '';
    }
  };
  
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-black flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 bg-[#FAFAFA] border-b border-neutral-200 px-4 md:px-8 flex items-center justify-between shrink-0">
        <div className="flex-none md:flex-1">
          <span className="font-serif text-xl md:text-3xl font-black tracking-tighter text-black">PUNARVA</span>
        </div>
        
        <nav className="flex-1 flex md:justify-center gap-4 lg:gap-8 text-sm font-medium overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap px-4 md:px-0">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`pb-4 pt-4 border-b-2 px-2 transition-colors shrink-0 ${activeTab === 'overview' ? 'border-slate-900 text-black' : 'border-transparent text-neutral-500 hover:text-black hover:-translate-y-1 transition-all duration-200'}`}
          >
            Today
          </button>
          <button 
            onClick={() => setActiveTab('scans')}
            className={`pb-4 pt-4 border-b-2 px-2 transition-colors shrink-0 ${activeTab === 'scans' ? 'border-slate-900 text-black' : 'border-transparent text-neutral-500 hover:text-black hover:-translate-y-1 transition-all duration-200'}`}
          >
            Uploads
          </button>
          <button 
            onClick={() => setActiveTab('protocol')}
            className={`pb-4 pt-4 border-b-2 px-2 transition-colors shrink-0 ${activeTab === 'protocol' ? 'border-slate-900 text-black' : 'border-transparent text-neutral-500 hover:text-black hover:-translate-y-1 transition-all duration-200'}`}
          >
            Protocol
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`pb-4 pt-4 border-b-2 px-2 transition-colors shrink-0 ${activeTab === 'history' ? 'border-slate-900 text-black' : 'border-transparent text-neutral-500 hover:text-black hover:-translate-y-1 transition-all duration-200'}`}
          >
            History
          </button>
        </nav>
        
        <div className="flex-none md:flex-1 flex items-center justify-end gap-2 md:gap-4 text-neutral-500">
          <button className="hover:text-black hidden sm:block"><Bell size={20} /></button>
          <button className="hover:text-black hidden sm:block"><Settings size={20} /></button>
          <button onClick={onLogout} className="hover:text-black sm:hidden" aria-label="Logout"><LogOut size={20} /></button>
          <button onClick={onLogout} className="hover:text-black hidden sm:flex items-center gap-2 text-sm font-bold ml-2"><LogOut size={18} /> Logout</button>
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden ml-2 border border-neutral-200">
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(athlete.name)}&background=0f172a&color=fff`} alt={athlete.name} className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col p-6 shrink-0 hidden lg:flex">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-white border border-neutral-200 rounded-lg flex items-center justify-center text-white shadow-none">
              <User size={20} />
            </div>
            <div>
              <h2 className="font-bold text-sm text-black">Athlete Hub</h2>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Peak Readiness</p>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-black text-white shadow-[0_4px_14px_0_rgb(0,0,0,0.39)] ring-1 ring-black/5 hover:translate-x-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95 transition-all duration-200' : 'text-neutral-500 hover:bg-slate-100 hover:translate-x-1 hover:shadow-sm active:scale-95 transition-all duration-300 ease-out'}`}
            >
              <Calendar size={18} /> Today
            </button>
            <button 
              onClick={() => setActiveTab('scans')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'scans' ? 'bg-black text-white shadow-[0_4px_14px_0_rgb(0,0,0,0.39)] ring-1 ring-black/5 hover:translate-x-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95 transition-all duration-200' : 'text-neutral-500 hover:bg-slate-100 hover:translate-x-1 hover:shadow-sm active:scale-95 transition-all duration-300 ease-out'}`}
            >
              <FileUp size={18} /> Report Uploads
            </button>
            <button 
              onClick={() => setActiveTab('protocol')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'protocol' ? 'bg-black text-white shadow-[0_4px_14px_0_rgb(0,0,0,0.39)] ring-1 ring-black/5 hover:translate-x-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95 transition-all duration-200' : 'text-neutral-500 hover:bg-slate-100 hover:translate-x-1 hover:shadow-sm active:scale-95 transition-all duration-300 ease-out'}`}
            >
              <ShieldCheck size={18} /> Recovery System
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'history' ? 'bg-black text-white shadow-[0_4px_14px_0_rgb(0,0,0,0.39)] ring-1 ring-black/5 hover:translate-x-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95 transition-all duration-200' : 'text-neutral-500 hover:bg-slate-100 hover:translate-x-1 hover:shadow-sm active:scale-95 transition-all duration-300 ease-out'}`}
            >
              <History size={18} /> History
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'profile' ? 'bg-black text-white shadow-[0_4px_14px_0_rgb(0,0,0,0.39)] ring-1 ring-black/5 hover:translate-x-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95 transition-all duration-200' : 'text-neutral-500 hover:bg-slate-100 hover:translate-x-1 hover:shadow-sm active:scale-95 transition-all duration-300 ease-out'}`}
            >
              <User size={18} /> Profile
            </button>
          </nav>

          <div className="mt-auto space-y-2 pt-6 border-t border-neutral-200">
            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-neutral-500 hover:text-black">
              <HelpCircle size={18} /> Help
            </button>
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-neutral-500 hover:text-black">
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
                <div className="lg:col-span-5 mb-6">
                  <AIAnalysisHub athleteId={athlete.id} />
            </div>
            <div className="lg:col-span-3 bg-white rounded-xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 border-l-4 border-l-[#0A0A0A] flex flex-col opacity-0 animate-reveal-up animation-delay-100">
                  <h3 className="font-sans font-bold text-black mb-4">AI Coach Insights</h3>
                  <p className="text-sm leading-relaxed text-neutral-500 flex-1">
                    "{report?.athleteMessage || `You've balanced yesterday's high-intensity block perfectly with deep sleep, ${athlete.name.split(' ')[0]}. Your heart rate variability is trending up, showing great nervous system resilience. While your legs feel heavy, the data suggests you're ready for a technical session today—just keep the impact low. How about a focused mobility flow before your workout?`}"
                  </p>
                  <button onClick={() => setActiveTab('protocol')} className="self-start mt-6 bg-black hover:bg-neutral-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-[0_4px_14px_0_rgb(0,0,0,0.39)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)] transition-all duration-300 active:scale-95">
                    View Daily Protocol
                  </button>
                </div>
              </div>

              {/* Pill Tags */}
              <div className="flex flex-wrap gap-4">
                <div className="bg-white px-5 py-2.5 rounded-xl border border-neutral-100 flex items-center gap-3 text-sm font-medium shadow-[0_4px_20px_rgb(0,0,0,0.03)] opacity-0 animate-scale-in animation-delay-200 hover:-translate-y-1 hover:shadow-md transition-all cursor-default">
                  <span className="text-[#0A0A0A]">🌙</span> Sleep: {log.sleepHours}h <div className="w-2 h-2 rounded-xl bg-[#00C9A7] shadow-[0_0_8px_rgba(0,201,167,0.8)] animate-pulse"></div>
                </div>
                <div className="bg-white px-5 py-2.5 rounded-xl border border-neutral-100 flex items-center gap-3 text-sm font-medium shadow-[0_4px_20px_rgb(0,0,0,0.03)] opacity-0 animate-scale-in animation-delay-200 hover:-translate-y-1 hover:shadow-md transition-all cursor-default">
                  <span className="text-black">🧠</span> CNS: Restored <div className="w-2 h-2 rounded-xl bg-[#00C9A7] shadow-[0_0_8px_rgba(0,201,167,0.8)] animate-pulse"></div>
                </div>
                <div className="bg-white px-5 py-2.5 rounded-xl border border-neutral-100 flex items-center gap-3 text-sm font-medium shadow-[0_4px_20px_rgb(0,0,0,0.03)] opacity-0 animate-scale-in animation-delay-200 hover:-translate-y-1 hover:shadow-md transition-all cursor-default">
                  <span className="text-[#0A0A0A]">🍴</span> Nutrition: Balanced <div className="w-2 h-2 rounded-xl bg-[#00C9A7] shadow-[0_0_8px_rgba(0,201,167,0.8)] animate-pulse"></div>
                </div>
                <div className="bg-white px-5 py-2.5 rounded-xl border border-neutral-100 flex items-center gap-3 text-sm font-medium shadow-[0_4px_20px_rgb(0,0,0,0.03)] opacity-0 animate-scale-in animation-delay-200 hover:-translate-y-1 hover:shadow-md transition-all cursor-default">
                  <span className="text-[#0A0A0A]">💧</span> Hydration: Optimal <div className="w-2 h-2 rounded-xl bg-[#00C9A7] shadow-[0_0_8px_rgba(0,201,167,0.8)] animate-pulse"></div>
                </div>
              </div>

              {/* 6 Grid Metrics & 3D Body */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 6 Cards */}
                <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Physio Load */}
                  <div className="bg-white p-5 rounded-xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between aspect-square opacity-0 animate-reveal-up animation-delay-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center text-black">📈</div>
                      <span className="font-bold text-lg">{report?.dimensions?.physiologicalLoad || 92}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Physio Load</p>
                      <div className="h-1.5 w-full bg-white rounded-xl overflow-hidden">
                        <div className="h-full bg-black rounded-xl" style={{ width: `${report?.dimensions?.physiologicalLoad || 92}%` }}></div>
                      </div>
                    </div>
                  </div>
                  {/* Sleep Quality */}
                  <div className="bg-white p-5 rounded-xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between aspect-square opacity-0 animate-reveal-up animation-delay-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[#0A0A0A]">🌙</div>
                      <span className="font-bold text-lg">{report?.dimensions?.sleepQuality || 88}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Sleep Quality</p>
                      <div className="h-1.5 w-full bg-slate-100 rounded-xl overflow-hidden">
                        <div className="h-full bg-black rounded-xl" style={{ width: `${report?.dimensions?.sleepQuality || 88}%` }}></div>
                      </div>
                    </div>
                  </div>
                  {/* Historical Risk */}
                  <div className="bg-white p-5 rounded-xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between aspect-square opacity-0 animate-reveal-up animation-delay-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center text-[#0A0A0A]">⚡</div>
                      <span className="font-bold text-lg">{report?.dimensions?.historicalRisk || 76}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Historical Risk</p>
                      <div className="h-1.5 w-full bg-neutral-100 rounded-xl overflow-hidden">
                        <div className="h-full bg-[#0A0A0A] rounded-xl" style={{ width: `${report?.dimensions?.historicalRisk || 76}%` }}></div>
                      </div>
                    </div>
                  </div>
                  {/* Muscle Fatigue */}
                  <div className="bg-white p-5 rounded-xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between aspect-square opacity-0 animate-reveal-up animation-delay-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center text-black">🦾</div>
                      <span className="font-bold text-lg">{report?.dimensions?.muscleSoreness || 45}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Muscle Fatigue</p>
                      <div className="h-1.5 w-full bg-white rounded-xl overflow-hidden">
                        <div className="h-full bg-black rounded-xl" style={{ width: `${report?.dimensions?.muscleSoreness || 45}%` }}></div>
                      </div>
                    </div>
                  </div>
                  {/* Mental Clarity */}
                  <div className="bg-white p-5 rounded-xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between aspect-square opacity-0 animate-reveal-up animation-delay-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[#0A0A0A]">🧘</div>
                      <span className="font-bold text-lg">{100 - (report?.dimensions?.mentalStress || 6)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Mental Clarity</p>
                      <div className="h-1.5 w-full bg-slate-100 rounded-xl overflow-hidden">
                        <div className="h-full bg-black rounded-xl" style={{ width: `${100 - (report?.dimensions?.mentalStress || 6)}%` }}></div>
                      </div>
                    </div>
                  </div>
                  {/* Cell Hydration */}
                  <div className="bg-white p-5 rounded-xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between aspect-square opacity-0 animate-reveal-up animation-delay-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center text-[#0A0A0A]">💧</div>
                      <span className="font-bold text-lg">{report?.dimensions?.nutritionStatus || 82}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Nutrition Status</p>
                      <div className="h-1.5 w-full bg-neutral-100 rounded-xl overflow-hidden">
                        <div className="h-full bg-[#0A0A0A] rounded-xl" style={{ width: `${report?.dimensions?.nutritionStatus || 82}%` }}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 7-Day Recovery Trend Chart (Spans 3 cols) */}
                  <div className="col-span-2 md:col-span-3 bg-white p-6 rounded-xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mt-2 opacity-0 animate-reveal-up animation-delay-400">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-medium text-black">7-Day Recovery Trend</h3>
                      <span className="text-xs text-neutral-500">Last Week</span>
                    </div>
                    <div className="flex items-end justify-between h-32 gap-3 relative border-b border-neutral-200 pb-2 bg-[linear-gradient(to_bottom,transparent_0px,transparent_calc(100%-1px),#f5f5f5_calc(100%-1px))] bg-[length:100%_25%]">
                      {[40, 60, 50, 80, 65, 85, 90].map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                          <div 
                            className={`w-full rounded-t-sm transition-all ${i === 6 ? 'bg-[#0A0A0A]' : 'bg-white group-hover:bg-[#EEDADA]'}`} 
                            style={{ height: `${val}%` }}
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
                <div className="bg-white rounded-xl p-6 border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col opacity-0 animate-reveal-up animation-delay-500">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-medium text-black w-24 leading-tight">Muscular Tension</h3>
                    <div className="flex bg-[#FAFAFA] rounded-xl p-1 text-[10px] font-bold">
                      <button className="px-3 py-1 bg-white rounded-xl shadow-none text-black">Front</button>
                      <button className="px-3 py-1 text-neutral-500">Back</button>
                    </div>
                  </div>

                  <div className="flex-1 bg-[#F5F5F5] rounded-xl flex items-center justify-center relative overflow-hidden mb-6">
                    {/* Placeholder for 3D body image */}
                    <img src="https://images.unsplash.com/photo-1532384816664-01b8b7238c8d?q=80&w=400&auto=format&fit=crop" alt="Muscles" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-20" />
                    
                    {log.symptomLocation && log.symptomLocation !== 'None' && (
                      <div className="absolute z-10 p-2 rounded-xl bg-black/20 border border-teal-600/40 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-xl bg-black"></div>
                      </div>
                    )}
                  </div>

                  <div className="bg-[#FAFAFA] rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-sm text-black">{log.symptomLocation !== 'None' ? log.symptomLocation : 'No localized pain'}</h4>
                      <span className="bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-xl">
                        {log.painLevel > 0 ? 'Moderate Tension' : 'Clear'}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      {log.painLevel > 0 ? `Consistent with yesterday's volume. Apply foam rolling for 5 minutes.` : 'No structural issues detected. Proceed with normal load.'}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'scans' && (
            <div className="max-w-4xl mx-auto space-y-6 opacity-0 animate-reveal-up">
              <h2 className="font-serif text-3xl font-black tracking-tight text-black">Report Uploads</h2>
              <p className="text-neutral-500">Securely upload your MRI, X-Ray, or clinician reports for AI parsing.</p>
              
              <div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-none">
                <div className="border-2 border-dashed border-neutral-200 rounded-xl p-12 text-center hover:bg-[#FAFAFA] transition-colors relative">
                  <input 
                    type="file" 
                    accept="image/*,.pdf" 
                    onChange={handleDocumentUpload} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {uploadLoading ? (
                    <div className="flex flex-col items-center gap-4 text-black">
                      <Loader2 className="animate-spin w-8 h-8" />
                      <p className="font-mono text-xs font-bold uppercase tracking-widest">Analyzing Medical Scan OCR...</p>
                    </div>
                  ) : uploadSuccess ? (
                    <div className="flex flex-col items-center gap-4 text-[#0A0A0A]">
                      <ShieldCheck className="w-8 h-8" />
                      <p className="font-mono text-xs font-bold uppercase tracking-widest">Scan Successfully Parsed & Added</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-neutral-500">
                      <FileUp className="w-8 h-8" />
                      <p className="font-sans font-medium text-sm text-black">Click or drag file to upload</p>
                      <p className="font-mono text-[10px] tracking-widest uppercase">Supports DICOM, PDF, JPEG</p>
                    </div>
                  )}
                </div>

                {medicalReportData && (
                  <div className="mt-8 p-6 bg-white border border-neutral-200 rounded-xl">
                    <h3 className="font-bold text-black mb-4">Extracted Medical Data</h3>
                    <div className="space-y-3 font-mono text-xs">
                      <div><span className="text-neutral-500">Diagnosis:</span> <span className="font-bold text-black">{medicalReportData.diagnosis || 'N/A'}</span></div>
                      <div><span className="text-neutral-500">Focus Area:</span> <span className="font-bold text-black">{medicalReportData.focus_area || 'N/A'}</span></div>
                      <div><span className="text-neutral-500">Key Flags/Restrictions:</span> <span className="font-bold text-black">{medicalReportData.flags?.join(', ') || 'None'}</span></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'protocol' && (
            <div className="max-w-4xl mx-auto space-y-6 opacity-0 animate-reveal-up">
              <h2 className="font-serif text-3xl font-black tracking-tight text-black">Recovery System</h2>
              <p className="text-neutral-500">Your personalized, AI-generated physiological recovery protocol.</p>

              {report ? (
                <div className="space-y-6">
                  {/* Directives */}
                  <div className="bg-white p-8 rounded-xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6 opacity-0 animate-reveal-up">
                    <h3 className="font-bold text-black flex items-center gap-2"><span className="w-6 h-6 rounded-xl bg-white text-black flex items-center justify-center text-xs">1</span> Training Adjustment</h3>
                    <p className="text-sm text-neutral-500">{report.directives.trainingAdjustment}</p>

                    <h3 className="font-bold text-black flex items-center gap-2"><span className="w-6 h-6 rounded-xl bg-white text-black flex items-center justify-center text-xs">2</span> Recovery Protocol</h3>
                    <p className="text-sm text-neutral-500">{report.directives.recoveryProtocol}</p>

                    <h3 className="font-bold text-black flex items-center gap-2"><span className="w-6 h-6 rounded-xl bg-white text-black flex items-center justify-center text-xs">3</span> Nutrition Focus</h3>
                    <p className="text-sm text-neutral-500">{report.directives.nutritionFocus}</p>
                  </div>

                  {/* Deductions & Risks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-0 animate-reveal-up animation-delay-200">
                    <div className="bg-[#FAFAFA] p-6 rounded-xl border border-neutral-200 shadow-inner">
                      <h4 className="font-bold text-sm text-black mb-4">Score Deductions</h4>
                      <ul className="space-y-3">
                        {((report as any).deductions || []).map((d: any, i: number) => (
                          <li key={i} className="flex items-start gap-3 text-xs text-neutral-500">
                            <span className="font-mono text-black bg-white px-2 py-0.5 rounded border border-neutral-200">{d.points}</span>
                            {d.reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                      <h4 className="font-bold text-sm text-black mb-4">Historical Risk Pattern</h4>
                      {report.patternMatch.isMatch ? (
                        <div className="space-y-2">
                          <span className="inline-block px-3 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-widest text-neutral-500 rounded-xl">High Correlation</span>
                          <p className="text-sm font-medium text-black">Matches conditions preceding {report.patternMatch.injuryName}.</p>
                          <p className="text-xs text-neutral-500">{report.riskExplanation}</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-24 text-neutral-400">
                          <ShieldCheck size={24} className="mb-2 text-[#0A0A0A]" />
                          <span className="text-xs">No concerning historical patterns detected.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-xl border border-neutral-200 text-center">
                  <p className="text-neutral-500">No protocol available today.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="max-w-4xl mx-auto space-y-6 opacity-0 animate-reveal-up">
              <h2 className="font-serif text-3xl font-black tracking-tight text-black">History</h2>
              <div className="bg-white p-8 rounded-xl border border-neutral-200 text-center">
                <p className="text-neutral-500">Historical logs will be shown here.</p>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-4xl mx-auto space-y-6 opacity-0 animate-reveal-up">
              <h2 className="font-serif text-3xl font-black tracking-tight text-black">Athlete Profile</h2>
              
              <div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-sm space-y-8">
                <div className="flex items-center gap-6 pb-8 border-b border-neutral-100">
                  <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden border-2 border-neutral-200">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(athlete.name)}&background=0f172a&color=fff&size=128`} alt={athlete.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-black">{athlete.name}</h3>
                    <p className="text-neutral-500">{athlete.sport} • {athlete.position}</p>
                    <div className="flex gap-4 mt-2 text-sm font-medium text-black">
                      <span>{athlete.age} yrs</span>
                      <span className="text-neutral-300">|</span>
                      <span>{athlete.heightCm} cm</span>
                      <span className="text-neutral-300">|</span>
                      <span>{athlete.weightKg} kg</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-black flex items-center gap-2"><User size={20}/> Connect to Coach</h3>
                  <p className="text-sm text-neutral-500">Enter your coach's email address to share your daily readiness scores, recovery metrics, and AI protocols with their clinical dashboard.</p>
                  
                  <div className="flex gap-4 max-w-md">
                    <input 
                      type="email"
                      placeholder="coach@example.com"
                      className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-black focus:outline-none focus:ring-2 focus:ring-black transition-all"
                      defaultValue={linkedCoach}
                      id="coach-email-input"
                    />
                    <button 
                      onClick={() => {
                        const email = (document.getElementById('coach-email-input') as HTMLInputElement).value;
                        if (email) {
                          localStorage.setItem(`linked_coach_${athlete.id}`, email);
                          setLinkedCoach(email);
                        }
                      }}
                      className="bg-black hover:bg-neutral-800 text-white px-6 py-3 rounded-lg font-bold text-sm shadow-[0_4px_14px_0_rgb(0,0,0,0.39)] transition-transform hover:-translate-y-0.5 active:scale-95"
                    >
                      Connect
                    </button>
                  </div>
                  {linkedCoach && (
                    <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-1">
                      <p className="text-sm font-bold text-emerald-800 flex items-center gap-2">
                        <ShieldCheck size={16}/> Link Pending: {linkedCoach}
                      </p>
                      <p className="text-xs text-emerald-600 font-medium">
                        When {linkedCoach} registers on Punarva, your recovery data will automatically appear on their dashboard.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Floating FAB for Action */}
      <button 
        onClick={() => setActiveTab('checkin')}
        className="fixed bottom-8 right-8 w-14 h-14 bg-black hover:bg-neutral-800 text-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-50"
      >
        <Plus size={24} />
      </button>

    </div>
  );
}
