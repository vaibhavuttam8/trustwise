import { Box } from '@mui/material';
import RawAnalysisGraph from './RawAnalysisGraph';
import MovingAverageGraph from './MovingAverageGraph';

export default function AnalysisView() {
  return (
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
      gap: 2
    }}>
      <RawAnalysisGraph />
      <MovingAverageGraph />
    </Box>
  );
} 