const fs = require('fs');

let content = fs.readFileSync('src/components/AthleteDashboard.tsx', 'utf8');

// 1. Update Props type and imports
content = content.replace(
  "import { Bell, Settings, Plus, Calendar, History, User, HelpCircle, LogOut } from 'lucide-react';",
  "import { useState } from 'react';\nimport { Bell, Settings, Plus, Calendar, History, User, HelpCircle, LogOut, FileUp, ShieldCheck, Loader2 } from 'lucide-react';\nimport { analyzeMedicalScan } from '../services/aiPipeline';"
);

content = content.replace(
  "activeTab: 'overview' | 'checkin' | 'history' | 'profile';",
  "activeTab: 'overview' | 'checkin' | 'history' | 'profile' | 'scans' | 'protocol';"
);

content = content.replace(
  "setActiveTab: (tab: 'overview' | 'checkin' | 'history' | 'profile') => void;",
  "setActiveTab: (tab: 'overview' | 'checkin' | 'history' | 'profile' | 'scans' | 'protocol') => void;"
);

// Add local states to AthleteDashboard
content = content.replace(
  "export function AthleteDashboard({ athlete, log, report, onLogout, activeTab, setActiveTab }: Props) {",
  `export function AthleteDashboard({ athlete, log, report, onLogout, activeTab, setActiveTab }: Props) {
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
  };`
);

// 2. Add Sidebar tabs
const newTabs = `            <button 
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
          </nav>`;
content = content.replace("          </nav>", newTabs);


// 3. Add Top Nav tabs
const newTopTabs = `          <button 
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
        </nav>`;
content = content.replace("        </nav>", newTopTabs);


// 4. Add the Views
const newViews = `          )}

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
          )}`;
content = content.replace("          )}", newViews);

fs.writeFileSync('src/components/AthleteDashboard.tsx', content, 'utf8');
console.log('Done padding AthleteDashboard.tsx');
