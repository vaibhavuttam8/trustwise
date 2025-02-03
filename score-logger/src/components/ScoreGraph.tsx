import { Box, Paper } from '@mui/material';
import { ResponsiveLine } from '@nivo/line';

interface ScoreData {
  id: string;
  data: Array<{
    x: string;
    y: number;
  }>;
}

const ScoreGraph = () => {
  // Example data - you'll replace this with real data from your API
  const data: ScoreData[] = [
    {
      id: "scores",
      data: [
        { x: "2024-01", y: 85 },
        { x: "2024-02", y: 90 },
        { x: "2024-03", y: 88 },
      ],
    },
  ];

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Box sx={{ height: 400 }}>
        <ResponsiveLine
          data={data}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 0, max: 100 }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Date',
            legendOffset: 36,
            legendPosition: 'middle'
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Score',
            legendOffset: -40,
            legendPosition: 'middle'
          }}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          enablePointLabel={true}
          pointLabel="y"
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              symbolSize: 12,
              symbolShape: 'circle',
            }
          ]}
        />
      </Box>
    </Paper>
  );
};

export default ScoreGraph;