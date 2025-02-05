import { useTheme, useMediaQuery } from '@mui/material';
import { Line } from 'recharts';
import { useAnalysis } from '../context/AnalysisContext';
import BaseAnalysisGraph from './BaseAnalysisGraph';

export default function RawAnalysisGraph() {
  const { analyses } = useAnalysis();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const chartData = analyses
    .map(analysis => ({
      time: new Date(analysis.created_at).toLocaleTimeString([], 
        isMobile ? { hour: '2-digit', minute: '2-digit' } : undefined
      ),
      toxicity: Number((analysis.toxicity_score * 100).toFixed(1)),
      gibberish: Number(((1-analysis.gibberish_score) * 100).toFixed(1)),
    }))
    .reverse();

  return (
    <BaseAnalysisGraph title="Raw Analysis Trends" data={chartData}>
      <Line 
        type="monotone" 
        dataKey="toxicity" 
        name="Toxicity Score" 
        stroke={theme.palette.error.main}
        strokeWidth={isMobile ? 1.5 : 2}
        dot={{ fill: theme.palette.error.main, r: isMobile ? 3 : 4 }}
        activeDot={{ r: isMobile ? 5 : 6, fill: theme.palette.error.light }}
      />
      <Line 
        type="monotone" 
        dataKey="gibberish" 
        name="Gibberish Score" 
        stroke={theme.palette.primary.main}
        strokeWidth={isMobile ? 1.5 : 2}
        dot={{ fill: theme.palette.primary.main, r: isMobile ? 3 : 4 }}
        activeDot={{ r: isMobile ? 5 : 6, fill: theme.palette.primary.light }}
      />
    </BaseAnalysisGraph>
  );
} 