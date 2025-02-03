export interface TextAnalysis {
  id: number;
  input_text: string;
  toxicity_score: number;
  gibberish_score: number;
  created_at: string;
}

export interface TextAnalysisCreate {
  input_text: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
} 