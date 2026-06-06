import { useState } from 'react';
import { Mic, MicOff, ArrowRight, CheckCircle2, Activity, Droplets, Utensils, Moon } from 'lucide-react';
import type { TodayLog } from '../types';

interface Props {
  log: TodayLog;
  isRecording: boolean;
  onStartVoice: () => void;
  onStopVoice: () => void;
  speechError: string | null;
  onComplete: (log: TodayLog) => void;
}

export function DailyCheckin({ log, isRecording, onStartVoice, onStopVoice, speechError, onComplete }: Props) {
  const hasTranscript = !!log.symptomTranscript;
  const showResults = hasTranscript && !isRecording;
  const [isEditing, setIsEditing] = useState(false);
  const [manualSnippet, setManualSnippet] = useState(
    log.painLevel > 0 
      ? `Athlete reports localized sharp discomfort in ${log.symptomLocation} area post-load. Intensity ${log.painLevel}/10.` 
      : (log.symptomTranscript || 'Athlete reports no active localized discomfort.')
  );

  // Form State
  const [sleepHours, setSleepHours] = useState(log.sleepHours);
  const [restingHeartRate, setRestingHeartRate] = useState(log.restingHeartRate);
  const [mentalStress, setMentalStress] = useState(log.mentalStress);
  const [hydration, setHydration] = useState(log.hydration);
  const [protein, setProtein] = useState(log.protein);
  const [painLevel, setPainLevel] = useState(log.painLevel);
  const [symptomLocation, setSymptomLocation] = useState(log.symptomLocation);

  const handleComplete = () => {
    onComplete({
      ...log,
      sleepHours,
      restingHeartRate,
      mentalStress,
      hydration,
      protein,
      painLevel,
      symptomLocation,
      symptomTranscript: manualSnippet
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up w-full px-4 md:px-0">
      {/* Top Progress */}
      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest mb-4">
        <span className="text-black">Step 1 of 5</span>
        <span className="text-black">Morning Check-In</span>
      </div>
      <div className="flex gap-2 h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
        <div className="bg-black w-1/5 h-full rounded-full transition-all"></div>
        <div className="bg-neutral-200 flex-1 h-full rounded-full"></div>
        <div className="bg-neutral-200 flex-1 h-full rounded-full"></div>
        <div className="bg-neutral-200 flex-1 h-full rounded-full"></div>
        <div className="bg-neutral-200 flex-1 h-full rounded-full"></div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-10 flex flex-col items-center w-full">
        {!showResults ? (
          <>
            <h2 className="text-2xl md:text-3xl font-serif font-black tracking-tight text-black mb-12 text-center">How are you feeling?</h2>
            
            <button 
              onClick={isRecording ? onStopVoice : onStartVoice}
              className={`w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl mb-12 relative ${
                isRecording 
                  ? 'bg-black text-white scale-110 shadow-black/40' 
                  : 'bg-neutral-900 hover:bg-black text-white hover:scale-105'
              }`}
            >
              {isRecording && (
                <span className="absolute inset-0 rounded-full animate-ping border-[3px] border-black opacity-50"></span>
              )}
              {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
            </button>

            <div className="w-full text-center px-4 md:px-8 border-t border-neutral-100 pt-8">
              <p className="text-black text-lg italic opacity-50">
                {isRecording ? "Listening..." : `"I'm feeling a bit of tightness in my right hamstring..."`}
              </p>
              {speechError && <p className="text-red-600 text-xs mt-4 font-medium">{speechError}</p>}
            </div>

            <div className="flex flex-wrap gap-2 md:gap-4 mt-8 w-full justify-center opacity-50 pointer-events-none">
              <span className="px-4 py-1.5 bg-neutral-100 text-black rounded-full text-xs font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-black"></span> Right Soleus
              </span>
              <span className="px-4 py-1.5 bg-neutral-100 text-black rounded-full text-xs font-medium flex items-center gap-2">
                ⚡ Pain Level: 3
              </span>
              <span className="px-4 py-1.5 bg-neutral-100 text-black rounded-full text-xs font-medium">
                Tightness
              </span>
            </div>

            <div className="w-full mt-4 bg-neutral-50 border border-neutral-100 rounded-xl p-6 text-left opacity-50 pointer-events-none">
              <span className="text-xs text-neutral-500 mb-1 block uppercase tracking-widest font-bold">Functional Impact</span>
              <span className="font-bold text-black">Minor Stiffness during gait</span>
            </div>
          </>
        ) : (
          <div className="w-full">
            <h2 className="text-2xl md:text-3xl font-serif font-black tracking-tight text-black mb-4">Daily Readiness Check</h2>
            <p className="text-sm text-neutral-500 mb-8">Review your recorded symptoms and fill in your daily biometrics.</p>
            
            <div className="border-l-4 border-black pl-6 py-2 mb-10 bg-neutral-50 rounded-r-xl">
              <p className="text-lg md:text-xl text-black italic">"{log.symptomTranscript}"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Detected Issues */}
              <div className="border border-neutral-200 rounded-xl p-6 shadow-sm bg-white">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold flex items-center gap-2 text-black"><CheckCircle2 size={18} className="text-black"/> Extracted Symptoms</h3>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-200">Verified</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-neutral-100 pb-2">
                    <span className="text-xs text-neutral-500 uppercase tracking-widest font-bold mt-2">Location</span>
                    <input 
                      type="text" 
                      className="font-bold text-black text-right border-b border-neutral-300 focus:outline-none focus:border-black"
                      value={symptomLocation}
                      onChange={e => setSymptomLocation(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between border-b border-neutral-100 pb-2">
                    <span className="text-xs text-neutral-500 uppercase tracking-widest font-bold mt-2">Intensity (0-10)</span>
                    <input 
                      type="number" 
                      min="0" max="10"
                      className="font-bold text-black text-right border-b border-neutral-300 focus:outline-none focus:border-black w-16"
                      value={painLevel}
                      onChange={e => setPainLevel(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-neutral-500 uppercase tracking-widest font-bold mt-2">Stress (1-10)</span>
                    <input 
                      type="number" 
                      min="1" max="10"
                      className="font-bold text-black text-right border-b border-neutral-300 focus:outline-none focus:border-black w-16"
                      value={mentalStress}
                      onChange={e => setMentalStress(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Clinical Snippet */}
              <div className="border border-neutral-200 rounded-xl p-6 shadow-sm bg-white flex flex-col h-full">
                <h3 className="font-bold flex items-center gap-2 text-black mb-4"><CheckCircle2 size={18}/> Manual Transcript Override</h3>
                <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-100 flex-1">
                  {isEditing ? (
                    <textarea 
                      className="w-full h-full min-h-[80px] bg-white border border-neutral-300 rounded-lg p-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                      value={manualSnippet}
                      onChange={(e) => setManualSnippet(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <p className="text-sm italic text-neutral-700">
                      "{manualSnippet}"
                    </p>
                  )}
                </div>
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-[10px] font-bold text-neutral-500 hover:text-black uppercase tracking-widest transition-colors flex items-center gap-1"
                  >
                    {isEditing ? 'Save Details' : 'Edit Manual Details'} <ArrowRight size={12}/>
                  </button>
                </div>
              </div>
            </div>

            <h3 className="font-serif font-black tracking-tight text-xl mb-4 text-black">Morning Biometrics & Nutrition</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Recovery */}
              <div className="border border-neutral-200 rounded-xl p-6 shadow-sm bg-white space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-neutral-700 mb-2"><Moon size={16}/> Sleep (Hours)</label>
                  <input 
                    type="range" min="0" max="14" step="0.5" 
                    className="w-full accent-black"
                    value={sleepHours} onChange={e => setSleepHours(Number(e.target.value))}
                  />
                  <div className="text-right text-sm font-bold mt-1">{sleepHours} hrs</div>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-neutral-700 mb-2"><Activity size={16}/> Resting Heart Rate</label>
                  <input 
                    type="range" min="40" max="100" step="1" 
                    className="w-full accent-black"
                    value={restingHeartRate} onChange={e => setRestingHeartRate(Number(e.target.value))}
                  />
                  <div className="text-right text-sm font-bold mt-1">{restingHeartRate} bpm</div>
                </div>
              </div>

              {/* Nutrition */}
              <div className="border border-neutral-200 rounded-xl p-6 shadow-sm bg-white space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-neutral-700 mb-2"><Droplets size={16}/> Hydration (Liters)</label>
                  <input 
                    type="range" min="0" max="6" step="0.1" 
                    className="w-full accent-black"
                    value={hydration} onChange={e => setHydration(Number(e.target.value))}
                  />
                  <div className="text-right text-sm font-bold mt-1">{hydration} L</div>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-neutral-700 mb-2"><Utensils size={16}/> Protein (Grams)</label>
                  <input 
                    type="range" min="0" max="300" step="5" 
                    className="w-full accent-black"
                    value={protein} onChange={e => setProtein(Number(e.target.value))}
                  />
                  <div className="text-right text-sm font-bold mt-1">{protein} g</div>
                </div>
              </div>
            </div>
            
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center px-4 gap-4 sm:gap-0 mt-8 pb-8">
        <button className="w-full sm:w-auto text-sm font-bold text-neutral-500 hover:text-black transition-colors py-3" onClick={() => handleComplete()}>Skip for now</button>
        <button 
          onClick={handleComplete}
          className="w-full sm:w-auto bg-black hover:bg-neutral-800 text-white px-8 py-4 rounded-xl font-bold text-sm shadow-[0_4px_14px_0_rgb(0,0,0,0.39)] flex items-center justify-center sm:justify-start gap-2 transition-transform hover:-translate-y-0.5 active:scale-95"
        >
          {showResults ? 'Save & Calculate Report' : 'Continue'} <ArrowRight size={18} />
        </button>
      </div>

    </div>
  );
}
