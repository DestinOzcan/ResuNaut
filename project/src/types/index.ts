export interface Resume {
  id: string;
  fileName: string;
  fileType: string;
  content: string;
  uploadedAt: Date;
}

export interface JobDescription {
  title: string;
  company: string;
  content: string;
  keywords: string[];
  requirements: string[];
}

export interface AnalysisResult {
  matchScore: number;
  missingKeywords: string[];
  strengthKeywords: string[];
  suggestions: Suggestion[];
  optimizedContent: string;
}

export interface Suggestion {
  id: string;
  type: 'keyword' | 'formatting' | 'content' | 'ats';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  original?: string;
  improved?: string;
  enabled?: boolean;
  section?: string;
}

export interface AnalysisStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  progress: number;
}

export interface OptimizationState {
  [suggestionId: string]: boolean;
}