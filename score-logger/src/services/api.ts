import axios from 'axios';
import { TextAnalysis, TextAnalysisCreate } from '../types/api';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analysisApi = {
  // Get all analyses
  getAnalyses: async (skip: number = 0, limit: number = 100): Promise<TextAnalysis[]> => {
    const response = await api.get<TextAnalysis[]>('/analyses/', {
      params: { skip, limit }
    });
    return response.data;
  },

  // Analyze new text
  analyzeText: async (analysis: TextAnalysisCreate): Promise<TextAnalysis> => {
    const response = await api.post<TextAnalysis>('/analyze/', analysis);
    return response.data;
  }
}; 