import { useEffect, useMemo, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  TableSortLabel,
  LinearProgress,
  Tooltip,
  useTheme,
  Fade,
  Alert,
  FormControlLabel,
  Switch
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useAnalysis } from '../context/AnalysisContext';
import { TextAnalysis } from '../types/api';

type Order = 'asc' | 'desc';

interface HeadCell {
  id: keyof TextAnalysis;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'input_text',
    numeric: false,
    label: 'Text',
  },
  {
    id: 'toxicity_score',
    numeric: true,
    label: 'Toxicity Score',
  },
  {
    id: 'gibberish_score',
    numeric: true,
    label: 'Gibberish Score',
  },
  {
    id: 'created_at',
    numeric: false,
    label: 'Date',
  },
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  // Special handling for gibberish score (invert the comparison since we display 100 - score)
  if (orderBy === 'gibberish_score') {
    if ((1 - (b[orderBy] as number)) < (1 - (a[orderBy] as number))) {
      return -1;
    }
    if ((1 - (b[orderBy] as number)) > (1 - (a[orderBy] as number))) {
      return 1;
    }
    return 0;
  }

  // Special handling for toxicity score (multiply by 100 for proper comparison)
  if (orderBy === 'toxicity_score') {
    if ((b[orderBy] as number) * 100 < (a[orderBy] as number) * 100) {
      return -1;
    }
    if ((b[orderBy] as number) * 100 > (a[orderBy] as number) * 100) {
      return 1;
    }
    return 0;
  }

  // Default comparison for other fields
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof TextAnalysis>(
  order: Order,
  orderBy: Key,
): (a: TextAnalysis, b: TextAnalysis) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface EnhancedTableHeadProps {
  order: Order;
  orderBy: keyof TextAnalysis;
  onRequestSort: (property: keyof TextAnalysis) => void;
}

function EnhancedTableHead(props: EnhancedTableHeadProps) {
  const { order, orderBy, onRequestSort } = props;
  const theme = useTheme();

  const createSortHandler = (property: keyof TextAnalysis) => () => {
    onRequestSort(property);
  };

  return (
    <TableHead>
      <TableRow sx={{ backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900] }}>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              color: theme.palette.text.primary
            }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function AnalysisHistory() {
  const { analyses, loading, error, refreshAnalyses } = useAnalysis();
  const theme = useTheme();
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof TextAnalysis>('created_at');
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    refreshAnalyses();
  }, [refreshAnalyses]);

  const handleRequestSort = (property: keyof TextAnalysis) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const visibleRows = useMemo(() => {
    return [...analyses]
      .sort(getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [analyses, order, orderBy, page, rowsPerPage]);

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: { xs: 1.5, sm: 2 } }}>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Fade in>
        <Alert 
          severity="error"
          sx={{ 
            borderRadius: 2,
            mt: { xs: 1.5, sm: 2 }
          }}
        >
          {error}
        </Alert>
      </Fade>
    );
  }

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
        Analysis History
      </Typography>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table 
            size={dense ? 'small' : 'medium'}
            aria-label="analysis history table"
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {visibleRows.map((analysis) => (
                <TableRow 
                  hover
                  key={analysis.id}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: theme.palette.action.hover 
                    },
                    cursor: 'pointer'
                  }}
                >
                  <TableCell>
                    <Tooltip title={analysis.input_text} arrow>
                      <Typography
                        sx={{ 
                          maxWidth: { xs: 150, sm: 300 }, 
                          whiteSpace: 'nowrap', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          cursor: 'pointer',
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          color: theme.palette.text.primary
                        }}
                      >
                        {analysis.input_text}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={analysis.toxicity_score * 100}
                        sx={{ 
                          width: { xs: 60, sm: 100 },
                          height: { xs: 6, sm: 8 },
                          borderRadius: 4
                        }}
                      />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          color: theme.palette.text.primary
                        }}
                      >
                        {(analysis.toxicity_score * 100).toFixed(1)}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={(1-analysis.gibberish_score) * 100}
                        sx={{ 
                          width: { xs: 60, sm: 100 },
                          height: { xs: 6, sm: 8 },
                          borderRadius: 4
                        }}
                      />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          color: theme.palette.text.primary
                        }}
                      >
                        {((1-analysis.gibberish_score) * 100).toFixed(1)}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      sx={{ 
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        color: theme.palette.text.primary
                      }}
                    >
                      {new Date(analysis.created_at).toLocaleString()}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={analyses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            color: theme.palette.text.primary,
            '.MuiTablePagination-select': {
              color: theme.palette.text.primary
            },
            '.MuiTablePagination-selectIcon': {
              color: theme.palette.text.primary
            }
          }}
        />
      </Paper>
      <FormControlLabel
        control={
          <Switch 
            checked={dense} 
            onChange={handleChangeDense}
            sx={{
              '& .MuiSwitch-thumb': {
                color: theme.palette.primary.main
              }
            }}
          />
        }
        label="Compact view"
        sx={{
          color: theme.palette.text.primary
        }}
      />
    </Box>
  );
} 