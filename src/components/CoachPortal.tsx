import { useState } from 'react';
import { Bell, Settings, Search, User, Activity, Clock, ShieldAlert, LogOut, Calendar } from 'lucide-react';
import type { Athlete, RecoveryReport } from '../types';

interface Props {
  athletes: Athlete[];
  coachOverrides: Record<string, string>;
  onSaveOverride: (athleteId: string, override: string) => void;
  onLogout: () => void;
  selectedAthleteId: string;
  setSelectedAthleteId: (id: string) => void;
  reports: Record<string, RecoveryReport | null>;
}

export function CoachPortal({ athletes, onLogout, selectedAthleteId, setSelectedAthleteId, reports, coachOverrides, onSaveOverride }: Props) {
  const [activeNav, setActiveNav] = useState<'Dashboard' | 'Team' | 'Analytics' | 'History'>('Dashboard');
  const [overrideText, setOverrideText] = useState('');
  const [overrideSaving, setOverrideSaving] = useState(false);
  const [semanticQuery, setSemanticQuery] = useState('');
  const [semanticResult, setSemanticResult] = useState<any>(null);
  const [queryLoading, setQueryLoading] = useState(false);

  // Semantic AI Query — sends coach question to the RAG pipeline
  const handleSemanticQuery = async () => {
    if (!semanticQuery.trim()) return;
    setQueryLoading(true);
    setSemanticResult(null);
    try {
      const res = await fetch('http://localhost:3001/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          athleteId: currentAthlete?.id || 'coach-query',
          parsedData: {},
          queryText: semanticQuery
        })
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Query failed: ${res.status} - ${errText}`);
      }
      const json = await res.json();
      setSemanticResult(json);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED')) {
        alert('⏳ Rate limit hit. Please wait 60 seconds and try again.');
      } else {
        alert('Query failed: ' + err.message);
      }
    } finally {
      setQueryLoading(false);
    }
  };

  // Save Override to Supabase
  const handleSaveOverride = async () => {
    if (!overrideText.trim()) return;
    setOverrideSaving(true);
    try {
      const dateStr = new Date().toISOString().split('T')[0];
      await fetch('http://localhost:3001/api/db/override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          athleteId: currentAthlete.id,
          dateStr,
          overrideText: overrideText.trim()
        })
      });
      onSaveOverride(currentAthlete.id, overrideText);
      setOverrideText('');
    } catch (err: any) {
      console.error(err);
      alert('Failed to save override: ' + err.message);
    } finally {
      setOverrideSaving(false);
    }
  };

  const currentAthlete = athletes.find(a => a.id === selectedAthleteId) || athletes[0];
  const report = reports[currentAthlete?.id];

  // Risk color mapping
  const riskColor = (level: string | undefined) => {
    switch (level) {
      case 'CRITICAL': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' };
      case 'HIGH_RISK': return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' };
      case 'MODERATE': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' };
      default: return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' };
    }
  };

  const rc = riskColor(report?.riskLevel);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-black flex flex-col">
      {/* Top Navbar — matches Athlete Dashboard style */}
      <header className="h-16 bg-[#FAFAFA] border-b border-neutral-200 px-4 md:px-8 flex items-center justify-between shrink-0">
        <div className="flex-none md:flex-1">
          <span className="font-serif text-xl md:text-3xl font-black tracking-tighter text-black">PUNARVA</span>
          <span className="ml-2 text-[10px] font-bold tracking-widest text-neutral-400 uppercase hidden md:inline">Coach</span>
        </div>
        
        <nav className="flex-1 flex md:justify-center gap-4 lg:gap-8 text-sm font-medium overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap px-4 md:px-0">
          {(['Dashboard', 'Team', 'Analytics', 'History'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveNav(tab)}
              className={`pb-4 pt-4 border-b-2 px-2 transition-colors shrink-0 ${activeNav === tab ? 'border-slate-900 text-black' : 'border-transparent text-neutral-500 hover:text-black hover:-translate-y-1 transition-all duration-200'}`}
            >
              {tab}
            </button>
          ))}
        </nav>
        
        <div className="flex-none md:flex-1 flex items-center justify-end gap-2 md:gap-4 text-neutral-500">
          <div className="relative hidden md:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input type="text" placeholder="Search athletes..." className="pl-9 pr-4 py-1.5 bg-white border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-black outline-none w-48 text-black" />
          </div>
          <button className="hover:text-black hidden sm:block"><Bell size={20} /></button>
          <button className="hover:text-black hidden sm:block"><Settings size={20} /></button>
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden ml-0 md:ml-2 border border-neutral-200">
            <img src="https://ui-avatars.com/api/?name=Coach&background=0f172a&color=fff" alt="Coach" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — matches Athlete Dashboard style */}
        <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col p-6 shrink-0 hidden lg:flex">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-white border border-neutral-200 rounded-lg flex items-center justify-center shadow-none">
              <Activity size={20} />
            </div>
            <div>
              <h2 className="font-bold text-sm text-black">Coach Hub</h2>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Team Management</p>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            {[
              { id: 'Dashboard' as const, icon: Calendar, label: 'Dashboard' },
              { id: 'Team' as const, icon: User, label: 'Team Roster' },
              { id: 'Analytics' as const, icon: Activity, label: 'Analytics' },
              { id: 'History' as const, icon: Clock, label: 'History' },
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeNav === item.id ? 'bg-black text-white shadow-[0_4px_14px_0_rgb(0,0,0,0.39)]' : 'text-neutral-500 hover:bg-slate-100 hover:translate-x-1 transition-all duration-300 ease-out'}`}
              >
                <item.icon size={18} /> {item.label}
              </button>
            ))}
          </nav>

          {/* Athlete Selector */}
          <div className="mt-auto space-y-4 pt-6 border-t border-neutral-200">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Active Athlete</p>
            <select
              value={selectedAthleteId}
              onChange={(e) => setSelectedAthleteId(e.target.value)}
              className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-sm font-medium focus:ring-1 focus:ring-black outline-none"
            >
              {athletes.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-neutral-500 hover:text-black">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-12">
          
          {/* ── DASHBOARD TAB ── */}
          {activeNav === 'Dashboard' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4">
                <div>
                  <h1 className="text-3xl font-serif font-black tracking-tight text-black">Team Dashboard</h1>
                  <p className="text-sm text-neutral-500 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} • Viewing: {currentAthlete?.name}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-4 py-1.5 ${rc.bg} ${rc.text} rounded-full text-[10px] font-bold uppercase tracking-wider`}>
                    {report?.riskLevel || 'STABLE'}
                  </span>
                </div>
              </div>

              {/* Score + Insights Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Recovery Score Ring */}
                <div className="bg-white rounded-xl p-8 border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center opacity-0 animate-reveal-up">
                  <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase mb-6">Athlete Recovery</span>
                  
                  <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#f5f5f5" strokeWidth="6" />
                      <circle 
                        cx="50" cy="50" r="42" fill="none" 
                        stroke={report?.riskLevel === 'CRITICAL' ? '#ef4444' : report?.riskLevel === 'HIGH_RISK' ? '#f97316' : '#0A0A0A'} 
                        strokeWidth="6" 
                        strokeDasharray={`${(report?.dimensions?.physiologicalLoad || 80) / 100 * 264} 264`} 
                        strokeLinecap="round" 
                      />
                    </svg>
                    <div className="text-center">
                      <span className="block text-4xl font-black text-black">{report?.dimensions?.physiologicalLoad || 80}</span>
                      <span className="block text-[10px] font-bold tracking-widest text-neutral-400 uppercase mt-1">
                        {report?.riskLevel === 'STABLE' ? 'Ready' : 'Monitor'}
                      </span>
                    </div>
                  </div>

                  <p className="text-center text-sm text-neutral-500 px-4 leading-relaxed">
                    {currentAthlete?.name}'s autonomic system is {report?.nervousSystemStatus?.toLowerCase() || 'recovered'}.
                  </p>
                </div>

                {/* Metrics Grid */}
                <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { emoji: '🌙', label: 'Sleep', value: report?.sleepStatus || 'Optimal', color: report?.sleepStatus === 'Critical Risk' ? '#ef4444' : '#0A0A0A' },
                    { emoji: '🧠', label: 'CNS Status', value: report?.nervousSystemStatus || 'Recovered', color: report?.nervousSystemStatus === 'Stressed' ? '#ef4444' : '#0A0A0A' },
                    { emoji: '🍴', label: 'Nutrition', value: report?.nutritionStatus || 'Adequate', color: '#0A0A0A' },
                    { emoji: '💧', label: 'Hydration', value: 'Optimal', color: '#0A0A0A' },
                    { emoji: '🏋️', label: 'Mental Load', value: report?.mentalLoadStatus || 'Low', color: report?.mentalLoadStatus === 'High' ? '#ef4444' : '#0A0A0A' },
                    { emoji: '📊', label: 'Trend', value: report?.trendInterpretation?.direction || 'Stable', color: '#0A0A0A' },
                  ].map((m, i) => (
                    <div key={i} className="bg-white p-5 rounded-xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between opacity-0 animate-reveal-up hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all" style={{ animationDelay: `${i * 80}ms` }}>
                      <div className="flex justify-between items-start">
                        <div className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center">{m.emoji}</div>
                      </div>
                      <div className="mt-3">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">{m.label}</p>
                        <p className="text-lg font-bold" style={{ color: m.color }}>{m.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coach Insight + Override */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 border-l-4 border-l-[#0A0A0A] flex flex-col opacity-0 animate-reveal-up animation-delay-200">
                  <h3 className="font-bold text-black mb-4">AI Coach Insights</h3>
                  <p className="text-sm leading-relaxed text-neutral-500 flex-1 italic">
                    "{report?.athleteMessage || 'No analysis available yet.'}"
                  </p>
                  <div className="mt-6 pt-4 border-t border-neutral-100">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Risk Explanation</h4>
                    <p className="text-xs text-neutral-600">{report?.riskExplanation || 'No specific risk factors identified.'}</p>
                  </div>
                </div>

                {/* Coach Override */}
                <div className="bg-white rounded-xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 flex flex-col opacity-0 animate-reveal-up animation-delay-300">
                  <h3 className="font-bold text-black mb-4 flex items-center gap-2">
                    <ShieldAlert size={18} /> Coach Override
                  </h3>
                  <p className="text-xs text-neutral-500 mb-4">Add manual notes or override the AI recommendation for {currentAthlete?.name}.</p>
                  <textarea
                    value={overrideText || coachOverrides[currentAthlete?.id] || ''}
                    onChange={(e) => setOverrideText(e.target.value)}
                    placeholder="e.g. Skip plyometrics today, focus on upper body only..."
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-sm focus:ring-1 focus:ring-black outline-none mb-4 flex-1 min-h-[100px]"
                    rows={4}
                  />
                  <button 
                    onClick={handleSaveOverride}
                    disabled={overrideSaving || !overrideText.trim()}
                    className="self-start bg-black hover:bg-neutral-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-[0_4px_14px_0_rgb(0,0,0,0.39)] hover:-translate-y-0.5 transition-all duration-300 active:scale-95 disabled:opacity-50"
                  >
                    {overrideSaving ? 'Saving to Supabase...' : 'Save Override'}
                  </button>
                  {coachOverrides[currentAthlete?.id] && (
                    <div className="mt-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Active Override</p>
                      <p className="text-xs text-black font-medium">{coachOverrides[currentAthlete.id]}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Directives */}
              {report && (
                <div className="bg-white p-8 rounded-xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6 opacity-0 animate-reveal-up animation-delay-400">
                  <h3 className="font-bold text-black mb-2">Recovery Directives</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Training</p>
                      <p className="text-sm text-neutral-700">{report.directives.trainingAdjustment}</p>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Recovery</p>
                      <p className="text-sm text-neutral-700">{report.directives.recoveryProtocol}</p>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Nutrition</p>
                      <p className="text-sm text-neutral-700">{report.directives.nutritionFocus}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Semantic AI Query */}
              <div className="bg-white p-8 rounded-xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] opacity-0 animate-reveal-up animation-delay-500">
                <h3 className="font-bold text-black mb-2 flex items-center gap-2">
                  <Search size={18} /> Semantic AI Query
                </h3>
                <p className="text-xs text-neutral-500 mb-4">Ask the clinical RAG database any question about your athletes.</p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={semanticQuery}
                    onChange={(e) => setSemanticQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSemanticQuery()}
                    placeholder="e.g. What recovery protocols apply for hamstring strain?"
                    className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-black outline-none"
                  />
                  <button
                    onClick={handleSemanticQuery}
                    disabled={queryLoading || !semanticQuery.trim()}
                    className="bg-black hover:bg-neutral-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-[0_4px_14px_0_rgb(0,0,0,0.39)] hover:-translate-y-0.5 transition-all duration-300 active:scale-95 disabled:opacity-50 whitespace-nowrap"
                  >
                    {queryLoading ? 'Querying...' : 'Ask AI'}
                  </button>
                </div>

                {semanticResult && (
                  <div className="mt-6 p-5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-4 animate-reveal-up">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-black">RAG Response</h4>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        semanticResult.risk_level === 'CRITICAL' ? 'bg-red-50 text-red-700' :
                        semanticResult.risk_level === 'HIGH_RISK' ? 'bg-orange-50 text-orange-700' :
                        semanticResult.risk_level === 'MODERATE' ? 'bg-amber-50 text-amber-700' :
                        'bg-emerald-50 text-emerald-700'
                      }`}>
                        {semanticResult.risk_level}
                      </span>
                    </div>
                    {semanticResult.suggestions?.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Suggestions</p>
                        <ul className="space-y-1">
                          {semanticResult.suggestions.map((s: string, i: number) => (
                            <li key={i} className="text-sm text-neutral-700 flex items-start gap-2">
                              <span className="text-neutral-400 mt-0.5">•</span> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {semanticResult.nutrition && (
                      <div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Nutrition</p>
                        <p className="text-sm text-neutral-700">{semanticResult.nutrition}</p>
                      </div>
                    )}
                    {semanticResult.drills?.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Drills</p>
                        <ul className="space-y-1">
                          {semanticResult.drills.map((d: string, i: number) => (
                            <li key={i} className="text-sm text-neutral-700 flex items-start gap-2">
                              <span className="text-emerald-500 mt-0.5">✓</span> {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {semanticResult.citation && (
                      <p className="text-xs text-neutral-400 pt-2 border-t border-neutral-200">📎 {semanticResult.citation}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TEAM TAB ── */}
          {activeNav === 'Team' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <h1 className="text-3xl font-serif font-black tracking-tight text-black">Team Roster</h1>
              <p className="text-sm text-neutral-500">Click an athlete to view their recovery data.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {athletes.map((a, i) => {
                  const r = reports[a.id];
                  const c = riskColor(r?.riskLevel);
                  return (
                    <button
                      key={a.id}
                      onClick={() => { setSelectedAthleteId(a.id); setActiveNav('Dashboard'); }}
                      className={`bg-white p-6 rounded-xl border text-left transition-all hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] opacity-0 animate-reveal-up ${selectedAthleteId === a.id ? 'border-black shadow-[0_4px_14px_0_rgb(0,0,0,0.15)]' : 'border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'}`}
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border border-neutral-200">
                          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(a.name)}&background=0f172a&color=fff`} alt={a.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="font-bold text-black">{a.name}</h3>
                          <p className="text-xs text-neutral-500">{a.sport} • {a.position}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 ${c.bg} ${c.text} rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`}></div>
                          {r?.riskLevel || 'STABLE'}
                        </span>
                        <span className="text-xs text-neutral-400">{a.trackedDays} days tracked</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── ANALYTICS TAB ── */}
          {activeNav === 'Analytics' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <h1 className="text-3xl font-serif font-black tracking-tight text-black">Team Analytics</h1>
              <p className="text-sm text-neutral-500">Aggregate recovery trends across the entire roster.</p>
              
              {/* Team Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Athletes', value: athletes.length, emoji: '👥' },
                  { label: 'Avg Sleep', value: 'Optimal', emoji: '🌙' },
                  { label: 'At Risk', value: athletes.filter(a => ['CRITICAL', 'HIGH_RISK'].includes(reports[a.id]?.riskLevel || '')).length, emoji: '⚠️' },
                  { label: 'Cleared', value: athletes.filter(a => reports[a.id]?.riskLevel === 'STABLE').length, emoji: '✅' },
                ].map((s, i) => (
                  <div key={i} className="bg-white p-5 rounded-xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] opacity-0 animate-reveal-up" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="text-2xl mb-2">{s.emoji}</div>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">{s.label}</p>
                    <p className="text-2xl font-black text-black">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* 7-Day Team Chart */}
              <div className="bg-white p-6 rounded-xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] opacity-0 animate-reveal-up animation-delay-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-medium text-black">7-Day Team Recovery Trend</h3>
                  <span className="text-xs text-neutral-500">Last Week</span>
                </div>
                <div className="flex items-end justify-between h-32 gap-3 relative border-b border-neutral-200 pb-2">
                  {[65, 70, 60, 75, 68, 82, 85].map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                      <div 
                        className={`w-full rounded-t-sm transition-all ${i === 6 ? 'bg-[#0A0A0A]' : 'bg-neutral-200 group-hover:bg-neutral-400'}`} 
                        style={{ height: `${val}%` }}
                      ></div>
                      <span className="text-[9px] text-neutral-400 font-mono">{['M','T','W','T','F','S','S'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── HISTORY TAB ── */}
          {activeNav === 'History' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-3xl font-serif font-black tracking-tight text-black">Session History</h1>
              <p className="text-sm text-neutral-500">Past recovery logs and override history.</p>
              
              <div className="space-y-3">
                {[
                  { date: 'Today', athlete: currentAthlete?.name, status: report?.riskLevel || 'STABLE', note: report?.directives?.trainingAdjustment || 'Standard training load' },
                  { date: 'Yesterday', athlete: currentAthlete?.name, status: 'STABLE', note: 'Full training session completed' },
                  { date: '2 days ago', athlete: currentAthlete?.name, status: 'MODERATE', note: 'Reduced intensity due to fatigue' },
                ].map((entry, i) => {
                  const ec = riskColor(entry.status);
                  return (
                    <div key={i} className="bg-white p-5 rounded-xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between opacity-0 animate-reveal-up" style={{ animationDelay: `${i * 100}ms` }}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center">
                          <Clock size={18} className="text-neutral-400" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-black">{entry.date} — {entry.athlete}</p>
                          <p className="text-xs text-neutral-500 mt-0.5">{entry.note}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 ${ec.bg} ${ec.text} rounded-full text-[10px] font-bold uppercase tracking-wider`}>
                        {entry.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
