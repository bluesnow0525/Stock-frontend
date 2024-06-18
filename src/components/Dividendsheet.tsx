import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { FinancialData } from '../slice/sheetSlice';

Chart.register(...registerables);

interface DividendBarProps {
    data: FinancialData[];
}

const DividendBar: React.FC<DividendBarProps> = ({ data }) => {
    // 提取年份和股利數據
    const years = data.map(d => d["年度"]?.[0] as string);
    const cashDividends = data.map(d => d["現金股利"]?.[0] as number);
    const stockDividends = data.map(d => d["股票股利"]?.[0] as number);

    const chartData = {
        labels: years || [],
        datasets: [
            {
                label: '現金股利',
                data: cashDividends || [],
                backgroundColor: 'rgba(0, 229, 238)', // Dark blue
                borderColor: 'rgba(0, 0, 0, 1)',
                borderWidth: 1,
            },
            {
                label: '股票股利',
                data: stockDividends || [],
                backgroundColor: 'rgba(225, 193, 37)', // Light blue
                borderColor: 'rgba(0, 0, 0, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: 'white',
                },
            },
            y: {
                stacked: true,
                title: {
                    display: true,
                    text: '元',
                    color: 'white',
                },
                ticks: {
                    color: 'white',
                },
            },
        },
        plugins: {
            tooltip: {
                mode: 'index' as const,
                intersect: false,
            },
            legend: {
                position: 'top' as const,
                labels: {
                    color: 'white',
                },
            },
        },
        maintainAspectRatio: false,
    };

    return (
        <div className="w-full">
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default DividendBar;
