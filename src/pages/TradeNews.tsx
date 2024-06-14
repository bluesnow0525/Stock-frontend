import React, { useState } from 'react';
import Header from '../components/Header';
import AnimatedComponent from '../components/AnimatedComponent';
import { useParams, useLocation, useNavigate, useMatch } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { testData } from './testdata';

Chart.register(...registerables);

const TradeNews: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const areaMatch = useMatch(`/trade/area/${id}`);
    const newsMatch = useMatch(`/trade/news/${id}`);
    const { stockName, username } = location.state as { stockName: string, username?: string };

    const [viewMode, setViewMode] = useState<string>('balance-sheet');

    const timePeriods = Array.from(new Set(testData.map(data => data["年度-季度"][0])));

    const labels = testData.map(data => data["年度-季度"][0] as string);
    const equityData = testData.map(data => data["歸屬於母公司業主之權益合計"][0] / 1000); // 股東權益
    const liabilityData = testData.map(data => data["負債總額"][0] / 1000); // 負債

    const data = {
        labels,
        datasets: [
            {
                label: '股東權益',
                data: equityData,
                backgroundColor: 'rgba(0, 229, 238)', // Dark blue
                borderColor: 'rgba(0, 0, 0, 1)',
                borderWidth: 1,
            },
            {
                label: '負債',
                data: liabilityData,
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

    const handleNavigate = (path: string) => {
        navigate(path, { state: { stockName: stockName, username } });
    };

    return (
        <>
            <AnimatedComponent y={-100} opacity={0} duration={0.8}>
                <Header />
            </AnimatedComponent>
            <AnimatedComponent y={0} opacity={0} duration={1.5} delay={0.6}>
                <div className=" mx-auto">
                    <div className="h-12 flex justify-center items-center">
                        {/* Buttons for navigation */}
                        <button
                            className={`link-hover-gradient px-4 py-1 rounded mr-4 ${areaMatch ? 'border-red-300 border' : ''}`}
                            onClick={() => handleNavigate(`/trade/area/${id}`)}
                        >
                            價格區
                        </button>
                        <button
                            className={`link-hover-gradient px-4 py-1 rounded mr-4 ${newsMatch ? 'border-red-300 border' : ''}`}
                            onClick={() => handleNavigate(`/trade/news/${id}`)}
                        >
                            資訊區
                        </button>
                    </div>
                    <div className="breathing-divider"></div>
                    <div className='flex flex-col sm:flex-row'>
                        <div className="w-full sm:w-1/6 sm:h-[800px] text-white mt-10">
                            <div className="flex flex-col p-4 space-y-4">
                                <button
                                    onClick={() => setViewMode('balance-sheet')}
                                    className={`px-4 py-2 rounded ${viewMode === 'balance-sheet' ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                                >
                                    資產負債表
                                </button>
                                <button
                                    onClick={() => setViewMode('income-statement')}
                                    className={`px-4 py-2 rounded ${viewMode === 'income-statement' ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                                >
                                    綜合損益表
                                </button>
                                <button
                                    onClick={() => setViewMode('cash-flow')}
                                    className={`px-4 py-2 rounded ${viewMode === 'cash-flow' ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                                >
                                    現金流量表
                                </button>
                                <button
                                    onClick={() => setViewMode('dividends')}
                                    className={`px-4 py-2 rounded ${viewMode === 'dividends' ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                                >
                                    股利
                                </button>
                            </div>
                        </div>
                        <div className="w-full sm:w-[95%] sm:h-[600px] flex flex-col sm:flex-row">
                            <div className="flex justify-center items-center h-[600px] w-full sm:w-1/2">
                                {/* 柱狀圖 */}
                                <Bar data={data} options={options} className='my-10 w-full h-full' />
                            </div>
                            <div className="mt-2 mx-7 text-gray-300 bg-slate-800 py-1 h-[600px] sm:w-1/2 border-slate-400 p-1 rounded-md shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-20 relative" style={{ boxShadow: '0 0 10px 5px rgba(255, 0, 0, 0.5)', overflowY: 'auto', overflowX: 'auto' }}>
                                <table className="w-full">
                                    <thead>
                                        <tr className='sticky top-0 bg-slate-950 bg-opacity-80 text-[18px] font-bold'>
                                            <th className="text-left px-1 py-1" style={{ width: '500px', whiteSpace: 'nowrap' }}>資產負債表</th>
                                            {timePeriods.map(period => (
                                                <th key={period} colSpan={2} className="text-center px-1 py-1">{period}</th>
                                            ))}
                                        </tr>
                                        <tr className='sticky top-10 bg-slate-950 bg-opacity-80 text-[14px] font-bold'>
                                            <th style={{ width: '500px' }}></th>
                                            {timePeriods.map(period => (
                                                <React.Fragment key={period}>
                                                    <th className="text-left px-1 py-1">千元</th>
                                                    <th className="text-left px-1 py-1 border-r">百分比</th>
                                                </React.Fragment>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(testData[0]).filter(key => key !== "年度-季度").map((key) => (
                                            <tr key={key} className="my-1 py-1">
                                                <td className="px-1 py-1 text-left text-[12px] sm:text-[15px] font-semibold w-full" style={{ width: '300px', whiteSpace: 'nowrap' }}>{key}</td>
                                                {timePeriods.map(period => {
                                                    const data = testData.find(d => d["年度-季度"][0] === period);
                                                    const value = data ? data[key] : null;
                                                    return (
                                                        <React.Fragment key={period}>
                                                            <td className="px-1 py-1 text-left text-[12px] sm:text-[15px]">{value && value[0] !== null ? (value[0] / 1000).toFixed(2) : 'N/A'}</td>
                                                            <td className="px-1 py-1 text-left text-[12px] sm:text-[15px] border-r">{value && value[1] !== null ? value[1].toFixed(2) + '%' : 'N/A'}</td>
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedComponent>
        </>
    );
};

export default TradeNews;
