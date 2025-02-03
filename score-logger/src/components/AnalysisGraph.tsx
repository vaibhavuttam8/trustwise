import { Box, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAnalysis } from '../context/AnalysisContext';

const CustomTooltip = ({ active, payload, label }: any) => {
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

export default function AnalysisGraph() {
  const { analyses } = useAnalysis();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Prepare data for the chart
  const chartData = analyses
    .map(analysis => ({
      time: new Date(analysis.created_at).toLocaleTimeString([], 
        isMobile ? { hour: '2-digit', minute: '2-digit' } : undefined
      ),
      toxicity: Number((analysis.toxicity_score * 100).toFixed(1)),
      gibberish: Number(((1-analysis.gibberish_score) * 100).toFixed(1)),
    }))
    .reverse(); // Show newest data on the right

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
        Analysis Trends
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
          <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
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
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
} 