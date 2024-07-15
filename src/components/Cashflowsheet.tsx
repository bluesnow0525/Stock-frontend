import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Legend,
  Tooltip,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { FinancialData } from '../slice/sheetSlice';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Legend,
  Tooltip
);

interface CashFlowChartProps {
  data: FinancialData[];
}
 
const CashFlowSheet: React.FC<CashFlowChartProps> = ({ data }) => {
  const labels = data.map(item => item['年度-季度']?.[0] || 'N/A');

  const operatingCashFlow = data.map(item => item['營業現金流']?.[0] || 0);
  const investingCashFlow = data.map(item => item['投資現金流']?.[0] || 0);
  const financingCashFlow = data.map(item => item['融資現金流']?.[0] || 0);
  const netChangeCash = data.map(item => item['淨現金流']?.[0] || 0);

  const chartData = {
    labels,
    datasets: [
      {
        type: 'line' as const,
        label: '營業現金流',
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192)',
        data: operatingCashFlow,
        yAxisID: 'y',
      },
      {
        type: 'line' as const,
        label: '投資現金流',
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235)',
        data: investingCashFlow,
        yAxisID: 'y',
      },
      {
        type: 'line' as const,
        label: '融資現金流',
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255)',
        data: financingCashFlow,
        yAxisID: 'y',
      },
      {
        type: 'line' as const,
        label: '淨現金流',
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64)',
        data: netChangeCash,
        yAxisID: 'y',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        ticks: {
          color: 'white',
        },
        title: {
          display: true,
          text: 'Value',
          color: 'white',
        },
      },
      x: {
        ticks: {
          color: 'white',
        },
        title: {
          display: true,
          text: 'Period',
          color: 'white',
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      },
    },
  };

  return (
    <Chart type='line' data={chartData} options={options} style={{ height: '100%', width: '100%' }} />
  );
};

export default CashFlowSheet;
