import React from 'react';
import { AnalysisStatus, MatchResult, OptimizationResult } from '../types';
import MatchGauge from './MatchGauge';
import { AlertCircle, Wand2, Download, Check } from 'lucide-react';
import { generateDocx } from '../services/docxService';

interface ResultsPanelProps {
  status: AnalysisStatus;
  result: MatchResult | null;
  optimization: OptimizationResult | null;
  onFixIt: () => void;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ status, result, optimization, onFixIt }) => {
  if (status === AnalysisStatus.IDLE) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-stone-400 p-12 text-center opacity-60">
        <div className="w-24 h-24 mb-6 rounded-full bg-stone-200/50 flex items-center justify-center">
          <Wand2 size={40} />
        </div>
        <h3 className="text-xl font-medium mb-2">Ready to Analyze</h3>
        <p className="max-w-xs">Upload your resume and the job description to see your match score and optimize gaps.</p>
      </div>
    );
  }

  if (status === AnalysisStatus.ANALYZING) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center animate-pulse">
        <div className="w-16 h-16 border-4 border-stone-300 border-t-stone-600 rounded-full animate-spin mb-6"></div>
        <h3 className="text-lg font-medium text-stone-600">Analyzing compatibility...</h3>
        <p className="text-stone-400 text-sm mt-2">Scanning keywords and experience</p>
      </div>
    );
  }

  if (status === AnalysisStatus.ERROR) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-lg font-medium text-red-600">Analysis Failed</h3>
        <p className="text-stone-500 text-sm mt-2">Please try uploading your documents again.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-8 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Top Section: Score & Summary */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
             {result && <MatchGauge score={result.score} />}
          </div>
          <div className="flex-grow text-center md:text-left">
            <h2 className="text-2xl font-bold text-stone-800 mb-2">Match Analysis</h2>
            <p className="text-stone-600 leading-relaxed text-sm">
              {result?.summaryAnalysis}
            </p>
          </div>
        </div>
      </div>

      {/* Gap Analysis */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 flex-grow">
        <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center">
          <AlertCircle size={20} className="text-red-500 mr-2" />
          Missing Keywords
        </h3>
        
        {result?.missingKeywords && result.missingKeywords.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-6">
            {result.missingKeywords.map((keyword, idx) => (
              <span 
                key={idx} 
                className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-100 rounded-lg text-sm font-medium"
              >
                {keyword}
              </span>
            ))}
          </div>
        ) : (
            <p className="text-stone-500 italic mb-6">No critical keywords missing! Great job.</p>
        )}

        <div className="border-t border-stone-100 pt-6">
            <h4 className="text-sm font-bold text-stone-500 uppercase tracking-wide mb-4">Optimization Actions</h4>
            
            <div className="flex flex-col gap-4">
                {!optimization ? (
                    <button 
                        onClick={onFixIt}
                        disabled={status === AnalysisStatus.OPTIMIZING}
                        className="
                            group relative flex items-center justify-center w-full py-4 px-6 
                            bg-gradient-to-r from-stone-800 to-stone-700 
                            text-stone-50 rounded-xl font-semibold shadow-md 
                            hover:shadow-lg hover:-translate-y-0.5 transition-all
                            disabled:opacity-70 disabled:cursor-not-allowed
                        "
                    >
                        {status === AnalysisStatus.OPTIMIZING ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                Optimizing Resume...
                            </>
                        ) : (
                            <>
                                <Wand2 className="mr-2 group-hover:rotate-12 transition-transform" size={20} />
                                Fix It: Auto-Optimize Resume
                            </>
                        )}
                    </button>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
                            <div className="flex items-start">
                                <Check className="text-green-600 mt-1 mr-3 flex-shrink-0" size={20} />
                                <div>
                                    <h5 className="font-semibold text-stone-800 text-sm">Optimization Complete</h5>
                                    <p className="text-stone-600 text-xs mt-1">{optimization.changesMade}</p>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => generateDocx(optimization.optimizedText)}
                            className="
                                flex items-center justify-center w-full py-4 px-6 
                                bg-white text-stone-700 border border-stone-200
                                rounded-xl font-semibold shadow-sm 
                                hover:bg-stone-50 hover:border-stone-300 hover:shadow-md 
                                transition-all
                            "
                        >
                            <Download className="mr-2" size={20} />
                            Download Optimized .docx
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;
