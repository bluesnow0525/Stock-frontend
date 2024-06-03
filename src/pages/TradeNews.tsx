import React from 'react';
import Header from '../components/Header';
import AnimatedComponent from '../components/AnimatedComponent';
import { useParams, useLocation, useNavigate, useMatch } from 'react-router-dom';
import { useEffect } from 'react';
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

    const timePeriods = Array.from(new Set(testData.map(data => data["年度-季度"])));

    const labels = testData.map(data => data["年度-季度"] as string);
    const equityData = testData.map(data => data["歸屬於母公司業主之權益合計"][0] / 1000); // 股東權益
    const liabilityData = testData.map(data => data["負債總額"][0] / 1000); // 負債

    const data = {
        labels,
        datasets: [
            {
                label: '負債',
                data: liabilityData,
                backgroundColor: 'rgba(173, 216, 230, 0.6)', // Light blue
                borderColor: 'rgba(173, 216, 230, 1)',
                borderWidth: 1,
            },
            {
                label: '股東權益',
                data: equityData,
                backgroundColor: 'rgba(0, 0, 139, 0.6)', // Dark blue
                borderColor: 'rgba(0, 0, 139, 1)',
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
                <div className="container mx-auto">
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
                    <div className="h-[650px] grid grid-rows-2 sm:grid-cols-2">
                        <div className="w-full flex justify-center items-center h-[500px]">
                            {/* 柱狀圖 */}
                            <Bar data={data} options={options} className='my-10 ' />
                        </div>
                        <div className="mx-7 text-gray-300 bg-slate-800 py-1 w-9/10 border-slate-400 p-1 rounded-md shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-20 relative" style={{ boxShadow: '0 0 10px 5px rgba(255, 0, 0, 0.5)', height: '500px', overflowY: 'auto', overflowX: 'auto' }}>
                            <table className="w-full">
                                <thead>
                                    <tr className='sticky top-0 bg-slate-950 bg-opacity-80 text-[18px] font-bold'>
                                        <th className="text-left px-1 py-1" style={{ width: '300px', whiteSpace: 'nowrap' }}>資產負債表</th>
                                        {timePeriods.map(period => (
                                            <th key={period} colSpan={2} className="text-center px-1 py-1">{period}</th>
                                        ))}
                                    </tr>
                                    <tr className='sticky top-10 bg-slate-950 bg-opacity-80 text-[14px] font-bold'>
                                        <th style={{ width: '300px' }}></th>
                                        {timePeriods.map(period => (
                                            <React.Fragment key={period}>
                                                <th className="text-left px-1 py-1">千元</th>
                                                <th className="text-left px-1 py-1">百分比</th>
                                            </React.Fragment>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(testData[0]).filter(key => key !== "年度-季度").map((key) => (
                                        <tr key={key} className="my-1 py-1">
                                            <td className="px-1 py-1 text-left text-[12px] sm:text-[15px] font-semibold w-full" style={{ width: '300px', whiteSpace: 'nowrap' }}>{key}</td>
                                            {timePeriods.map(period => {
                                                const data = testData.find(d => d["年度-季度"] === period);
                                                const value = data ? data[key] : null;
                                                return (
                                                    <React.Fragment key={period}>
                                                        <td className="px-1 py-1 text-left text-[12px] sm:text-[15px]">{value && value[0] !== null ? (value[0] / 1000).toFixed(2) : 'N/A'}</td>
                                                        <td className="px-1 py-1 text-left text-[12px] sm:text-[15px]">{value && value[1] !== null ? value[1].toFixed(2) + '%' : 'N/A'}</td>
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
            </AnimatedComponent>
        </>
    );
};

export default TradeNews;
