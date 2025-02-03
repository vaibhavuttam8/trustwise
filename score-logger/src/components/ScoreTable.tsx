import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
  } from '@mui/material';
  
  interface ScoreEntry {
    id: number;
    text: string;
    score: number;
    timestamp: string;
  }
  
  const ScoreTable = () => {
    // Example data - you'll replace this with real data from your API
    const scores: ScoreEntry[] = [
      { id: 1, text: "Sample text 1", score: 85, timestamp: "2024-01-15" },
      { id: 2, text: "Sample text 2", score: 90, timestamp: "2024-02-15" },
      { id: 3, text: "Sample text 3", score: 88, timestamp: "2024-03-15" },
    ];
  
    return (
      <Paper elevation={3}>
        <Typography variant="h5" sx={{ p: 2 }}>
          Score History
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Text</TableCell>
                <TableCell align="right">Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scores.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.timestamp}</TableCell>
                  <TableCell>{entry.text}</TableCell>
                  <TableCell align="right">{entry.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  };
  
  export default ScoreTable;