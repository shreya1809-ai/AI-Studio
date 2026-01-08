export interface MatchResult {
  score: number;
  missingKeywords: string[];
  summaryAnalysis: string;
  extractedResumeText: string; // We keep the text to optimize it later
}

export interface OptimizationResult {
  optimizedText: string;
  changesMade: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
  OPTIMIZING = 'OPTIMIZING',
}
