import React, { useState } from 'react';
import { AnalysisStatus, MatchResult, OptimizationResult } from './types';
import FileUpload from './components/FileUpload';
import ResultsPanel from './components/ResultsPanel';
import { analyzeResumeMatch, optimizeResumeText } from './services/geminiService';
import { LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);
  
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [optimization, setOptimization] = useState<OptimizationResult | null>(null);

  const handleCheckMatch = async () => {
    if (!resumeFile || !jdFile) return;

    setStatus(AnalysisStatus.ANALYZING);
    setResult(null);
    setOptimization(null);

    try {
      const matchData = await analyzeResumeMatch(resumeFile, jdFile);
      setResult(matchData);
      setStatus(AnalysisStatus.COMPLETE);
    } catch (e) {
      console.error(e);
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const handleFixIt = async () => {
    if (!result) return;
    
    setStatus(AnalysisStatus.OPTIMIZING);
    try {
      const optResult = await optimizeResumeText(result.extractedResumeText, result.missingKeywords);
      setOptimization(optResult);
      setStatus(AnalysisStatus.COMPLETE);
    } catch (e) {
      console.error(e);
      // Revert to complete so they can try again, or show specific error
      setStatus(AnalysisStatus.COMPLETE); 
    }
  };

  const canAnalyze = resumeFile !== null && jdFile !== null && status !== AnalysisStatus.ANALYZING;

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans text-stone-700 flex flex-col max-w-[1600px] mx-auto">
      
      {/* Header */}
      <header className="mb-8 flex items-center justify-between px-2">
        <div className="flex items-center space-x-3">
            <div className="bg-stone-800 text-white p-2.5 rounded-xl shadow-lg shadow-stone-300">
                <LayoutDashboard size={24} />
            </div>
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-stone-800">Resume Match Dashboard</h1>
                <p className="text-stone-500 text-sm">Beat the ATS with AI-powered optimization</p>
            </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-full">
        
        {/* Left Column: Inputs */}
        <section className="lg:col-span-4 flex flex-col gap-6 h-full">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 flex flex-col h-full relative">
                <h2 className="text-lg font-bold text-stone-800 mb-6">Documents</h2>
                
                <FileUpload 
                    label="1. Upload Resume (PDF)" 
                    onFileSelect={setResumeFile} 
                />
                
                <FileUpload 
                    label="2. Job Description (PDF)" 
                    onFileSelect={setJdFile} 
                />

                <div className="mt-auto pt-6 sticky bottom-0 bg-white z-10 pb-2">
                    <button
                        onClick={handleCheckMatch}
                        disabled={!canAnalyze}
                        className={`
                            w-full py-4 rounded-xl font-bold text-lg shadow-md transition-all
                            ${canAnalyze 
                                ? 'bg-gradient-to-br from-stone-800 to-stone-700 text-white hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]' 
                                : 'bg-stone-200 text-stone-400 cursor-not-allowed'}
                        `}
                    >
                        Check Match
                    </button>
                </div>
            </div>
        </section>

        {/* Right Column: Results */}
        <section className="lg:col-span-8 h-full min-h-[500px]">
           <ResultsPanel 
             status={status}
             result={result}
             optimization={optimization}
             onFixIt={handleFixIt}
           />
        </section>

      </main>
    </div>
  );
};

export default App;
