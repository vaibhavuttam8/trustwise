import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  CircularProgress, 
  Alert,
  Paper,
  Fade,
  LinearProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { analysisApi } from '../services/api';
import type { TextAnalysis } from '../types/api';
import { useAnalysis } from '../context/AnalysisContext';

export default function AnalysisForm() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TextAnalysis | null>(null);
  const { refreshAnalyses } = useAnalysis();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const analysis = await analysisApi.analyzeText({ input_text: text });
      setResult(analysis);
      setText(''); // Clear form after successful submission
      refreshAnalyses(); // Refresh the analysis list and graph
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze text');
    } finally {
      setLoading(false);
    }
  };

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
        Analyze Text
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={isMobile ? 3 : 4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text to analyze"
          variant="outlined"
          disabled={loading}
          sx={{ 
            mb: { xs: 1.5, sm: 2 },
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
          placeholder="Type or paste your text here for analysis..."
        />

        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading || !text.trim()}
          sx={{ 
            mb: { xs: 1.5, sm: 2 },
            borderRadius: 2,
            px: { xs: 3, sm: 4 },
            py: { xs: 1, sm: 1.5 },
            alignSelf: 'flex-start'
          }}
          endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
        >
          {loading ? 'Analyzing...' : 'Analyze Text'}
        </Button>

        {loading && (
          <Box sx={{ width: '100%', mb: { xs: 1.5, sm: 2 } }}>
            <LinearProgress />
          </Box>
        )}

        {error && (
          <Fade in>
            <Alert 
              severity="error" 
              sx={{ 
                mb: { xs: 1.5, sm: 2 },
                borderRadius: 2
              }}
            >
              {error}
            </Alert>
          </Fade>
        )}

        {result && (
          <Fade in>
            <Paper 
              elevation={1}
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                mt: { xs: 1.5, sm: 2 },
                borderRadius: 2,
                backgroundColor: theme.palette.mode === 'dark' 
                  ? theme.palette.grey[900] 
                  : theme.palette.grey[50],
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  color: theme.palette.primary.main,
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  fontWeight: 'medium'
                }}
              >
                Analysis Results
              </Typography>
              
              <Box sx={{ display: 'grid', gap: { xs: 1.5, sm: 2 } }}>
                <Box>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      color: theme.palette.text.secondary,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      mb: 0.5
                    }}
                  >
                    Toxicity Score
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={result.toxicity_score * 100}
                      sx={{ 
                        flexGrow: 1,
                        height: { xs: 8, sm: 10 },
                        borderRadius: 5,
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.12)' 
                          : 'rgba(0, 0, 0, 0.12)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: theme.palette.error.main
                        }
                      }}
                    />
                    <Typography 
                      variant="body2"
                      sx={{ 
                        color: theme.palette.text.primary,
                        minWidth: '4rem',
                        textAlign: 'right'
                      }}
                    >
                      {(result.toxicity_score * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      color: theme.palette.text.secondary,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      mb: 0.5
                    }}
                  >
                    Gibberish Score
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={(1-result.gibberish_score) * 100}
                      sx={{ 
                        flexGrow: 1,
                        height: { xs: 8, sm: 10 },
                        borderRadius: 5,
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.12)' 
                          : 'rgba(0, 0, 0, 0.12)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: theme.palette.primary.main
                        }
                      }}
                    />
                    <Typography 
                      variant="body2"
                      sx={{ 
                        color: theme.palette.text.primary,
                        minWidth: '4rem',
                        textAlign: 'right'
                      }}
                    >
                      {((1-result.gibberish_score) * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Fade>
        )}
      </Box>
    </Box>
  );
} 