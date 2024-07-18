import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
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
    BarElement,
    LineElement,
    PointElement,
    Legend,
    Tooltip
);

interface CombinedChartProps {
    data: FinancialData[];
}

const RevenueChart: React.FC<CombinedChartProps> = ({ data }) => {
    const labels = data.map(item => item['年度-月份']?.[0] || 'N/A');

    const barData = data.map(item => item['當月營收']?.[0] || 0);
    const lineData1 = data.map(item => item['去年累計營收年增率%']?.[0] || 0);
    const lineData2 = data.map(item => item['去年同月營收年增率%']?.[0] || 0);

    const chartData = {
        labels,
        datasets: [
            {
                type: 'bar' as const,
                label: '當月營收',
                backgroundColor: 'rgba(135, 206, 250, 0.7)',
                borderColor: 'rgb(255, 159, 64)',
                data: barData,
                yAxisID: 'y1',
                order: 2,
            },
            {
                type: 'line' as const,
                label: '去年累計營收年增率%',
                borderColor: 'rgb(178, 34, 34)',
                backgroundColor: 'rgba(178, 34, 34, 0.5)',
                data: lineData1,
                yAxisID: 'y',
                order: 1,
            },
            {
                type: 'line' as const,
                label: '去年同月營收年增率%',
                borderColor: 'rgb(0, 255, 0)',
                backgroundColor: 'rgba(0, 255, 0, 0.5)',
                data: lineData2,
                yAxisID: 'y',
                order: 1,
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
                    text: 'Percentage',
                    color: 'white',
                },
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    color: 'white',
                },
                title: {
                    display: true,
                    text: 'Revenue',
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
        <Chart type='bar' data={chartData} options={options} className='sm:my-10 w-full h-full' />
    );
};

export default RevenueChart;
