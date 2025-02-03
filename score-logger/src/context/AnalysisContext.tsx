import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { TextAnalysis } from '../types/api';
import { analysisApi } from '../services/api';

interface AnalysisContextType {
  analyses: TextAnalysis[];
  loading: boolean;
  error: string | null;
  refreshAnalyses: () => Promise<void>;
}

const AnalysisContext = createContext<AnalysisContextType | null>(null);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [analyses, setAnalyses] = useState<TextAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshAnalyses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await analysisApi.getAnalyses();
      setAnalyses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analyses');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AnalysisContext.Provider value={{ analyses, loading, error, refreshAnalyses }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
} 