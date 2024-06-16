import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import BalancesheetBar from '../components/BalancesheetBar';
import Incomesheet from '../components/Incomesheet';
import CashFlowSheet from '../components/Cashflowsheet';
import AnimatedComponent from '../components/AnimatedComponent';
import Loading from '../components/Loading';
import { useParams, useLocation, useNavigate, useMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSheetData } from '../slice/sheetSlice';
import { RootState, AppDispatch } from '../store';
import { FinancialData } from '../slice/sheetSlice';

const TradeNews: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const areaMatch = useMatch(`/trade/area/${id}`);
    const newsMatch = useMatch(`/trade/news/${id}`);
    const { stockName, username } = location.state as { stockName: string, username?: string };

    const dispatch = useDispatch<AppDispatch>();
    const sheetData = useSelector((state: RootState) => state.sheetData.data);
    const sheetDataStatus = useSelector((state: RootState) => state.sheetData.status);

    useEffect(() => {
        if (id) {
            dispatch(fetchSheetData(id))
        }
    }, [id, dispatch]);

    const sortTimePeriods = (periods: string[]) => {
        return periods.sort((a, b) => {
            const [yearA, quarterA] = a.split('Q').map(Number);
            const [yearB, quarterB] = b.split('Q').map(Number);
            if (yearA !== yearB) {
                return yearB - yearA;
            }
            return quarterB - quarterA;
        });
    };

    const [viewMode, setViewMode] = useState<string>('balance-sheet');
    const [currentData, setCurrentData] = useState<FinancialData[] | undefined>(undefined);
    const [timePeriods, settimePeriods] = useState<string[]>([]);
    const [labels, setLabels] = useState<string[]>([]);
    const [equityData, setEquityData] = useState<number[]>([]);
    const [liabilityData, setLiabilityData] = useState<number[]>([]);

    useEffect(() => {
        if (sheetData) {
            if (viewMode === 'balance-sheet') {
                setCurrentData(sheetData.balance_sheet);
                settimePeriods(sortTimePeriods(sheetData.balance_sheet.map(data => data["年度-季度"]?.[0] as string).filter(Boolean)))
                setLabels(sortTimePeriods(sheetData.balance_sheet.map(data => data["年度-季度"]?.[0] as string).filter(Boolean)));
                setEquityData(sheetData.balance_sheet.map(data => (data["歸屬於母公司業主之權益合計"][0] as number) / 1000));
                setLiabilityData(sheetData.balance_sheet.map(data => (data["負債總額"][0] as number) / 1000));
            } else if (viewMode === 'income-statement') {
                setCurrentData(sheetData?.income_statement);
                settimePeriods(sortTimePeriods(sheetData.income_statement.map(data => data["年度-季度"]?.[0] as string).filter(Boolean)))
            } else if (viewMode === 'cash-flow') {
                setCurrentData(sheetData?.cash_flow);
                settimePeriods(sortTimePeriods(sheetData.cash_flow.map(data => data["年度-季度"]?.[0] as string).filter(Boolean)))
            } else if (viewMode === 'dividend') {
                // setCurrentData(sheetData?.dividend);
            }
        }
    }, [viewMode, sheetData]);

    const handleNavigate = (path: string) => {
        navigate(path, { state: { stockName: stockName, username } });
    };

    return (
        <>
            <AnimatedComponent y={-100} opacity={0} duration={0.8}>
                <Header username={username} />
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
                        <div className="w-full sm:w-1/6 sm:h-[500px] text-white mt-8">
                            <div className="flex sm:flex-col sm:p-3 sm:space-y-3">
                                <button
                                    onClick={() => setViewMode('balance-sheet')}
                                    className={`px-4 py-1 rounded ${viewMode === 'balance-sheet' ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                                >
                                    資產負債表
                                </button>
                                <button
                                    onClick={() => setViewMode('income-statement')}
                                    className={`px-4 py-1 rounded ${viewMode === 'income-statement' ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                                >
                                    綜合損益表
                                </button>
                                <button
                                    onClick={() => setViewMode('cash-flow')}
                                    className={`px-4 py-1 rounded ${viewMode === 'cash-flow' ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                                >
                                    現金流量表
                                </button>
                                <button
                                    onClick={() => setViewMode('dividend')}
                                    className={`px-4 py-1 rounded ${viewMode === 'dividend' ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                                >
                                    股利
                                </button>
                            </div>
                        </div>

                        {
                            sheetDataStatus === 'succeeded' && currentData && (
                                <div className="w-full sm:w-[95%] h-[800px] sm:h-[580px] flex flex-col sm:flex-row">
                                    <div className="flex justify-center items-center h-[800px] sm:h-[580px] w-full sm:w-1/2">
                                        {/* 柱狀圖 */}
                                        {viewMode === 'balance-sheet' && (<BalancesheetBar labels={labels} equityData={equityData} liabilityData={liabilityData} />)}
                                        {viewMode === 'income-statement' && (<Incomesheet data={currentData} />)}
                                        {viewMode === 'cash-flow' && (<CashFlowSheet data={currentData} />)}
                                    </div>
                                    <div className="mt-2 mx-7 text-gray-300 bg-slate-800 py-1 h-[800px] sm:h-[580px] sm:w-1/2 border-slate-400 p-1 rounded-md shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-20 relative" style={{ boxShadow: '0 0 10px 5px rgba(255, 0, 0, 0.5)', overflowY: 'auto', overflowX: 'auto' }}>
                                        <table className="w-full">
                                            <thead>
                                                <tr className='sticky top-0 bg-slate-950 bg-opacity-90 sm:text-[18px] font-bold'>
                                                    <th className="text-left px-1 py-1" style={{ width: '300px', whiteSpace: 'nowrap' }}>{viewMode}</th>
                                                    {timePeriods?.map(period => (
                                                        <th key={period} colSpan={viewMode === 'cash-flow' ? 1 : 2} className="text-center px-1 py-1">{period}</th>
                                                    ))}
                                                </tr>
                                                <tr className='sticky top-10 bg-slate-950 bg-opacity-90 text-[11px] sm:text-[14px] font-bold'>
                                                    <th style={{ width: '300px' }}></th>
                                                    {timePeriods?.map(period => (
                                                        <React.Fragment key={period}>
                                                            <th className="text-left px-1 py-1">千元</th>
                                                            {viewMode !== 'cash-flow' && <th className="text-left px-1 py-1 border-r">百分比</th>}
                                                        </React.Fragment>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentData && Object.keys(currentData[0] || {}).filter(key => key !== "年度-季度").map((key) => (
                                                    <tr key={key} className="my-1 py-1">
                                                        <td className="px-1 py-1 text-left text-[12px] sm:text-[15px] font-semibold w-full sticky left-0 bg-slate-950 bg-opacity-80 top-20" style={{ width: '300px', whiteSpace: 'nowrap' }}>{key}</td>
                                                        {timePeriods?.map(period => {
                                                            const data = currentData.find(d => d["年度-季度"]?.[0] === period);
                                                            const value = data ? data[key] : null;
                                                            return (
                                                                <React.Fragment key={period}>
                                                                    <td className="px-1 py-1 text-left text-[12px] sm:text-[15px]">{value && Array.isArray(value) && value[0] !== null ? (Number(value[0])).toFixed(2) : 'N/A'}</td>
                                                                    {viewMode !== 'cash-flow' && <td className="px-1 py-1 text-left text-[12px] sm:text-[15px] border-r">{value && Array.isArray(value) && value[1] !== null ? `${value[1]}%` : 'N/A'}</td>}
                                                                </React.Fragment>
                                                            );
                                                        })}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                    </div>
                                </div>
                            )
                        }
                        {sheetDataStatus === 'loading' && <div className='flex justify-center mt-10'><Loading></Loading></div>}
                    </div>
                </div>
            </AnimatedComponent>
        </>
    );
};

export default TradeNews;
