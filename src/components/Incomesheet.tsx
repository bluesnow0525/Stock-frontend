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

const Incomesheet: React.FC<CombinedChartProps> = ({ data }) => {
    const labels = data.map(item => item['年度-季度']?.[0] || 'N/A');

    const lineData1 = data.map(item => item['營業毛利']?.[0] || 0);
    const lineData2 = data.map(item => item['營業利益']?.[0] || 0);
    const lineData3 = data.map(item => item['稅後淨利']?.[0] || 0);
    const barData = data.map(item => item['稀釋每股盈餘']?.[0] || 0);

    const chartData = {
        labels,
        datasets: [
            {
                type: 'line' as const,
                label: '營業毛利（毛損）',
                borderColor: 'rgb(178, 34, 34)',
                backgroundColor: 'rgba(178, 34, 34)',
                data: lineData1,
                yAxisID: 'y',
            },
            {
                type: 'line' as const,
                label: '營業利益（損失）',
                borderColor: 'rgb(0, 255, 0)',
                backgroundColor: 'rgba(0, 255, 0)',
                data: lineData2,
                yAxisID: 'y',
            },
            {
                type: 'line' as const,
                label: '稅後淨利',
                borderColor: 'rgb(193, 22, 255)',
                backgroundColor: 'rgba(193, 22, 255)',
                data: lineData3,
                yAxisID: 'y',
            },
            {
                type: 'bar' as const,
                label: '稀釋每股盈餘',
                backgroundColor: 'rgba(135, 206, 250, 0.7)',
                borderColor: 'rgb(255, 159, 64)',
                data: barData,
                yAxisID: 'y1',
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
                    color: 'white', // 設置 y 軸字體顏色
                },
                title: {
                    display: true,
                    text: 'Value',
                    color: 'white', // 設置 y 軸標題顏色
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
                    color: 'white', // 設置 y1 軸字體顏色
                },
                title: {
                    display: true,
                    text: 'Value',
                    color: 'white', // 設置 y1 軸標題顏色
                },
            },
            x: {
                ticks: {
                    color: 'white', // 設置 x 軸字體顏色
                },
                title: {
                    display: true,
                    text: 'Period',
                    color: 'white', // 設置 x 軸標題顏色
                },
            },
        },
        plugins: {
            legend: {
                labels: {
                    color: 'white', // 設置圖例標籤顏色
                },
            },
        },
    };
    return (
        <Chart type='bar' data={chartData} options={options} className='sm:my-10 w-full h-full' />
    );
};

export default Incomesheet;
