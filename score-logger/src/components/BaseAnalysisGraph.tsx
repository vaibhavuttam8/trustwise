import { Box, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Helper function for moving average
export const calculateMovingAverage = (data: number[], windowSize: number = 5): number[] => {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const window = data.slice(start, i + 1);
    const average = window.reduce((sum, val) => sum + val, 0) / window.length;
    result.push(Number(average.toFixed(1)));
  }
  return result;
};

export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ p: { xs: 1, sm: 2 }, boxShadow: 2 }}>
        <Typography 
          variant="subtitle2" 
          color="text.secondary"
          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
        >
          {label}
        </Typography>
        {payload.map((entry: any) => (
          <Typography 
            key={entry.name} 
            sx={{ 
              color: entry.color,
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            {entry.name}: {entry.value.toFixed(1)}%
          </Typography>
        ))}
      </Paper>
    );
  }
  return null;
};

interface BaseAnalysisGraphProps {
  title: string;
  data: any[];
  children: React.ReactNode;
}

export default function BaseAnalysisGraph({ title, data, children }: BaseAnalysisGraphProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box>
      <Typography 
        variant="h5" 
        component="h2" 
        gutterBottom
        sx={{ 
          color: theme.palette.primary.main,
          fontWeight: 'medium',
          fontSize: { xs: '1.25rem', sm: '1.5rem' }
        }}
      >
        {title}
      </Typography>
      
      <Paper 
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          height: { xs: 300, sm: 400 },
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis 
              dataKey="time" 
              stroke={theme.palette.text.secondary}
              tick={{ 
                fill: theme.palette.text.secondary,
                fontSize: isMobile ? 10 : 12 
              }}
              tickLine={{ stroke: theme.palette.divider }}
              interval={isMobile ? 1 : 0}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              tick={{ 
                fill: theme.palette.text.secondary,
                fontSize: isMobile ? 10 : 12
              }}
              tickLine={{ stroke: theme.palette.divider }}
              domain={[0, 100]}
              width={isMobile ? 30 : 40}
            />
            <Tooltip 
              content={<CustomTooltip />}
              wrapperStyle={{ outline: 'none' }}
            />
            <Legend 
              wrapperStyle={{ 
                paddingTop: isMobile ? '10px' : '20px',
                fontSize: isMobile ? '0.75rem' : '0.875rem'
              }}
            />
            {children}
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
} 