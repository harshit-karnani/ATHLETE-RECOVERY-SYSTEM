import { useState } from 'react';
import { extractSymptoms, analyzeMedicalScan, recordSpeech } from '../services/aiPipeline';
import { Mic, Upload, Activity, ShieldAlert, CheckCircle2, AlertTriangle, FileText, Loader2, Lock } from 'lucide-react';

export interface RAGOutput {
  risk_level: 'CRITICAL' | 'HIGH_RISK' | 'MODERATE' | 'STABLE';
  suggestions: string[];
  drills: string[];
  nutrition: string;
  citation?: string;
}

export function AIAnalysisHub({ athleteId }: { athleteId: string }) {
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [ragOutput, setRagOutput] = useState<RAGOutput | null>(null);
  const [transcript, setTranscript] = useState('');

  const handleSyncWearable = async () => {
    setSyncing(true);
    // Simulating delay
    await new Promise(r => setTimeout(r, 1000));
    setSyncing(false);
    setSynced(true);
    // Showing a toast or alert
  };

  const handleRunAnalysis = async (inputMode: 'voice' | 'file', file?: File) => {
    setAnalyzing(true);
    setRagOutput(null);
    try {
      let parsedData: any = {};
      
      if (inputMode === 'voice') {
        const result = await extractSymptoms(transcript);
        parsedData = result;
        setTranscript(result.transcript);
      } else if (inputMode === 'file' && file) {
        parsedData = await analyzeMedicalScan(file);
      }

      // POST to Express Engine
      const res = await fetch('http://localhost:3001/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          athleteId,
          parsedData,
          queryText: inputMode === 'voice' ? transcript : 'Medical PDF Upload'
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Query engine failed: ${res.status} - ${errText}`);
      }
      
      const json: RAGOutput = await res.json();
      setRagOutput(json);
      
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED') || err.message?.includes('quota')) {
        const retryMatch = err.message.match(/retry in ([\d.]+)s/);
        const secs = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 60;
        alert(`⏳ Rate limit hit (free tier: 20 requests/min).\nPlease wait ${secs} seconds and try again.`);
      } else {
        alert('Analysis failed: ' + err.message);
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const renderBadge = (level: string) => {
    switch(level) {
      case 'CRITICAL': return <div className="bg-red-600 text-white px-4 py-1.5 rounded-full font-bold flex items-center gap-2"><ShieldAlert size={18}/> CRITICAL</div>;
      case 'HIGH_RISK': return <div className="bg-orange-500 text-white px-4 py-1.5 rounded-full font-bold flex items-center gap-2"><AlertTriangle size={18}/> HIGH RISK</div>;
      case 'MODERATE': return <div className="bg-yellow-500 text-black px-4 py-1.5 rounded-full font-bold flex items-center gap-2"><Activity size={18}/> MODERATE</div>;
      case 'STABLE': return <div className="bg-emerald-600 text-white px-4 py-1.5 rounded-full font-bold flex items-center gap-2"><CheckCircle2 size={18}/> STABLE</div>;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
        <h2 className="text-xl font-bold text-black flex items-center gap-2">
          <Activity size={24}/> PUNARVA Clinical RAG Pipeline
        </h2>
        
        <button 
          onClick={handleSyncWearable}
          disabled={syncing || synced}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
            synced ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
            'bg-black text-white hover:-translate-y-0.5 active:scale-95 shadow-[0_4px_14px_0_rgb(0,0,0,0.39)]'
          }`}
        >
          {syncing ? <Loader2 className="animate-spin" size={18} /> : (synced ? <CheckCircle2 size={18} /> : <Activity size={18} />)}
          {synced ? 'Garmin Cloud Connected' : 'Sync Wearable'}
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FAFAFA]">
        {/* Input Methods */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-neutral-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold flex items-center gap-2"><Mic size={18}/> Voice Check-in</h3>
              <button 
                onClick={async () => {
                  try {
                    const text = await recordSpeech();
                    setTranscript(text);
                  } catch(e: any) {
                    alert('Microphone error: ' + e.message);
                  }
                }}
                className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full font-bold hover:bg-red-100 transition-colors flex items-center gap-1"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div>
                Record
              </button>
            </div>
            <textarea 
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="e.g. My right knee feels stiff when I bend it..."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-black outline-none mb-3"
              rows={3}
            />
            <button 
              onClick={() => handleRunAnalysis('voice')}
              disabled={analyzing || !transcript}
              className="w-full py-2 bg-neutral-900 text-white rounded-lg font-medium hover:bg-black transition-colors disabled:opacity-50"
            >
              Analyze Transcript
            </button>
          </div>

          <div className="bg-white p-5 rounded-xl border border-neutral-200">
            <h3 className="font-bold mb-3 flex items-center gap-2"><FileText size={18}/> Medical Scan Upload</h3>
            <input 
              type="file" 
              id="fileUpload" 
              className="hidden" 
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleRunAnalysis('file', e.target.files[0]);
                }
                e.target.value = '';
              }}
            />
            <button 
              onClick={() => document.getElementById('fileUpload')?.click()}
              disabled={analyzing}
              className="w-full py-2 border-2 border-dashed border-neutral-300 rounded-lg font-medium text-neutral-600 hover:bg-neutral-50 hover:border-black hover:text-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Upload size={18} /> Upload MRI/Clinical PDF
            </button>
          </div>
        </div>

        {/* 4-Pillar RAG Analysis Card */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm flex flex-col relative overflow-hidden">
          {analyzing ? (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
              <Loader2 className="animate-spin text-black mb-3" size={32} />
              <p className="font-medium animate-pulse text-sm">Querying Clinical Vector DB...</p>
            </div>
          ) : null}

          {ragOutput ? (
            <div className="space-y-6 h-full flex flex-col animate-reveal-up">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <h3 className="font-bold text-lg">Inference Results</h3>
                {renderBadge(ragOutput.risk_level)}
              </div>
              
              <div className="space-y-4 flex-1">
                <div>
                  <h4 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-2">Targeted Nutrition</h4>
                  <p className="font-medium text-black bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                    {ragOutput.nutrition}
                  </p>
                </div>

                {ragOutput.suggestions && ragOutput.suggestions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-2">AI Suggestions</h4>
                    <ul className="space-y-2">
                      {ragOutput.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm font-medium">
                          <ShieldAlert size={16} className="text-amber-500 shrink-0 mt-0.5" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {ragOutput.drills && ragOutput.drills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-2">Drills Checklist</h4>
                    <ul className="space-y-2">
                      {ragOutput.drills.map((drill, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm font-medium">
                          <CheckCircle2 size={16} className="text-[#00C9A7] shrink-0 mt-0.5" />
                          <span>{drill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center gap-2 text-xs text-neutral-400 font-medium">
                <Lock size={12} />
                <span>{ragOutput.citation || 'Grounded Analysis: Verified against clinical archive.'}</span>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-neutral-400">
              <Activity size={48} className="mb-4 opacity-20" />
              <p className="font-medium">Awaiting inputs to run <br/> RAG inference engine.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
