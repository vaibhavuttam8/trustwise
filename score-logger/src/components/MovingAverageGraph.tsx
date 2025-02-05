import { useTheme, useMediaQuery } from '@mui/material';
import { Line } from 'recharts';
import { useAnalysis } from '../context/AnalysisContext';
import BaseAnalysisGraph, { calculateMovingAverage } from './BaseAnalysisGraph';

export default function MovingAverageGraph() {
  const { analyses } = useAnalysis();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const rawData = analyses
    .map(analysis => ({
      time: new Date(analysis.created_at).toLocaleTimeString([], 
        isMobile ? { hour: '2-digit', minute: '2-digit' } : undefined
      ),
      toxicity: Number((analysis.toxicity_score * 100).toFixed(1)),
      gibberish: Number(((1-analysis.gibberish_score) * 100).toFixed(1)),
    }))
    .reverse();

  // Calculate moving averages
  const toxicityValues = rawData.map(d => d.toxicity);
  const gibberishValues = rawData.map(d => d.gibberish);
  const toxicityMA = calculateMovingAverage(toxicityValues);
  const gibberishMA = calculateMovingAverage(gibberishValues);

  // Combine data with moving averages
  const chartData = rawData.map((data, index) => ({
    ...data,
    toxicityMA: toxicityMA[index],
    gibberishMA: gibberishMA[index],
  }));

  return (
    <BaseAnalysisGraph title="Moving Average Trends" data={chartData}>
      <Line 
        type="monotone" 
        dataKey="toxicityMA" 
        name="Toxicity MA (5-point)" 
        stroke={theme.palette.error.dark}
        strokeWidth={isMobile ? 2 : 2.5}
        dot={false}
        strokeDasharray="5 5"
      />
      <Line 
        type="monotone" 
        dataKey="gibberishMA" 
        name="Gibberish MA (5-point)" 
        stroke={theme.palette.primary.dark}
        strokeWidth={isMobile ? 2 : 2.5}
        dot={false}
        strokeDasharray="5 5"
      />
    </BaseAnalysisGraph>
  );
} 