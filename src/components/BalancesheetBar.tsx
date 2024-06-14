import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import React from 'react';

Chart.register(...registerables);

interface BalanceProps {
    labels: string[] | undefined;
    equityData: number[] | undefined;
    liabilityData: number[] | undefined;
}

const BalancesheetBar: React.FC<BalanceProps> = ({ labels, equityData, liabilityData }) => {
    // 仅在数据有效时使用数据
    const data = {
        labels: labels || [],
        datasets: [
            {
                label: '股東權益',
                data: equityData || [],
                backgroundColor: 'rgba(0, 229, 238)', // Dark blue
                borderColor: 'rgba(0, 0, 0, 1)',
                borderWidth: 1,
            },
            {
                label: '負債',
                data: liabilityData || [],
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
                    text: '千元',
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

    return <Bar data={data} options={options} className='my-10 w-full h-full' />;
};

export default BalancesheetBar;
