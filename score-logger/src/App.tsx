import { Container, Box, Typography, Paper, useTheme, useMediaQuery, CssBaseline } from '@mui/material';
import AnalysisForm from './components/AnalysisForm';
import AnalysisHistory from './components/AnalysisHistory';
import AnalysisGraph from './components/AnalysisGraph';
import ThemeToggle from './components/ThemeToggle';
import { AnalysisProvider } from './context/AnalysisContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider>
      <CssBaseline />
      <AnalysisProvider>
        <Box 
          sx={{ 
            minHeight: '100vh',
            width: '100%',
            backgroundColor: 'background.default',
            color: 'text.primary',
          }}
        >
          <ThemeToggle />
          <Container 
            maxWidth="xl"
            sx={{ 
              py: { xs: 2, sm: 3, md: 4 },
              px: { xs: 2, sm: 3 },
              margin: '0 auto',
            }}
          >
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{ 
                textAlign: 'center',
                color: 'primary.main',
                fontWeight: 'bold',
                mb: { xs: 2, sm: 3, md: 4 },
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              Text Analysis Dashboard
            </Typography>
            
            <Box sx={{ 
              display: 'grid', 
              gap: { xs: 2, sm: 3 },
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            }}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: { xs: 2, sm: 3 },
                  borderRadius: 2,
                  backgroundColor: 'background.paper',
                  gridColumn: '1 / -1',
                  overflow: 'hidden'
                }}
              >
                <AnalysisForm />
              </Paper>

              <Paper 
                elevation={2} 
                sx={{ 
                  p: { xs: 2, sm: 3 },
                  borderRadius: 2,
                  backgroundColor: 'background.paper',
                  overflow: 'hidden',
                  height: '100%'

                }}
              >
                <AnalysisGraph />
              </Paper>
              
              <Paper 
                elevation={2} 
                sx={{ 
                  p: { xs: 2, sm: 3 },
                  borderRadius: 2,
                  backgroundColor: 'background.paper',
                  overflow: 'hidden',
                  height: '100%'
                }}
              >
                <AnalysisHistory />
              </Paper>
            </Box>
          </Container>
        </Box>
      </AnalysisProvider>
    </ThemeProvider>
  );
}

export default App;