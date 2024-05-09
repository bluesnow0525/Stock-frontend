import { useLocation, useNavigate } from 'react-router-dom';
import AnimatedComponent from '../components/AnimatedComponent';
import Header from '../components/Header';
import Loading from '../components/Loading';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserData } from '../slice/userdataSlice';
import { RootState, AppDispatch } from '../store';

const Asset: React.FC = () => {
    const location = useLocation();
    const username = location.state ? (location.state as { username: string }).username : undefined;
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const userData = useSelector((state: RootState) => state.userData.data);
    const userDataStatus = useSelector((state: RootState) => state.userData.status);

    useEffect(() => {
        if (username) {
            dispatch(fetchUserData(username))
        }
    }, [username, dispatch]);

    const transactionClass = (type: number) => {
        return type < 0 ? 'text-green-400' : 'text-red-400';
    };
    const floatingasset = () => {
        var sum = 0;
        if (userData) {
            userData.stocks.map(stock => (
                sum += stock.recent_price * stock.quantity * 1000
            ))
        }
        return sum;
    }
    const handleStockSelect = (id: string, name: string): void => {
        navigate(`/trade/area/${id}`, { state: { stockName: name, username } }); // Navigate to Trade Area with selected stock ID as URL parameter
    };
    var totalAssets = 0
    var assetsPercent = 0
    var floatingPercent = 0
    if (userData) {
        totalAssets = userData.assets + floatingasset();
        assetsPercent = (userData.assets / totalAssets) * 100;
        floatingPercent = (floatingasset() / totalAssets) * 100;
    }

    return (
        <><div className='bg-container'>
            <AnimatedComponent y={-100} opacity={0} duration={0.8}>
                <Header username={username}></Header>
            </AnimatedComponent>
            <div className="p-4 text-white ">
                {userDataStatus === 'succeeded' && userData ? (
                    <>
                        <div className="grid grid-rows-2 sm:grid-cols-[6fr,4fr]">
                            <div className="grid grid-rows-[1fr,3fr]">
                                <div className="flex items-center space-x-4">
                                    <div className="relative w-20 h-20">
                                        <svg className="w-full h-full transform -rotate-90">
                                            {/* Blue segment for user assets */}
                                            <circle cx="40" cy="40" r="35" fill="transparent" stroke="#3B82F6" strokeWidth="10"
                                                strokeDasharray={`${220 * assetsPercent / 100} 220`} />
                                            {/* Green segment for floating assets */}
                                            <circle cx="40" cy="40" r="35" fill="transparent" stroke="#10B981" strokeWidth="10"
                                                strokeDasharray={`${220 * floatingPercent / 100} 220`}
                                                strokeDashoffset={`-${220 * assetsPercent / 100}`} />
                                        </svg>
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-semibold text-gray-100">
                                            資產
                                        </div>
                                    </div>

                                    <div className='sticky text-[21px]'>總資產: <br />${totalAssets.toFixed(2)}<span className={`ml-1 text-sm ${transactionClass(totalAssets - 10000000)}`}>{(((totalAssets - 10000000) * 100) / 10000000).toFixed(2)}%</span></div>
                                </div>
                                <div className='h-[400px]'>
                                    <div className=' font-bold ml-1 text-[20px] mb-2 sticky'>歷史交易數據:</div>
                                    <div className='h-[380px] overflow-y-auto'>
                                        <table className="table-fixed border-collapse border border-gray-200 bg-slate-950">
                                            <thead className='sticky top-0 bg-slate-950'>
                                                <tr>
                                                    <th className="border border-r-0 border-gray-300 px-2 py-1 text-center ">股票 ID</th>
                                                    <th className="border border-x-0 border-gray-300 px-2 py-1 text-center ">數量</th>
                                                    <th className="border border-x-0 border-gray-300 px-2 py-1 text-center ">損益</th>
                                                    <th className="border border-x-0 border-gray-300 px-2 py-1 text-center ">買入時間</th>
                                                    <th className="border border-x-0 border-gray-300 px-2 py-1 text-center ">買價</th>
                                                    <th className="border border-x-0 border-gray-300 px-2 py-1 text-center ">賣出時間</th>
                                                    <th className="border border-l-0 border-gray-300 px-2 py-1 text-center ">賣價</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {userData.transactions.slice()
                                                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                                    .map(tx => (
                                                        <tr key={tx.transaction_id} className={transactionClass(tx.profit_loss)}>
                                                            <td className="border border-r-0 border-gray-300 px-4 py-2 text-center">{tx.stock_id}</td>
                                                            <td className="border border-x-0 border-gray-300 px-4 py-2 text-center">{tx.quantity}</td>
                                                            <td className="border border-x-0 border-gray-300 px-4 py-2 text-center">{(tx.profit_loss * 1000).toFixed(0)}</td>
                                                            <td className="border border-x-0 border-gray-300 px-4 py-2 text-center">{tx.timestamp}</td>
                                                            <td className="border border-x-0 border-gray-300 px-4 py-2 text-center">{tx.price_per_unit.toFixed(1)}</td>
                                                            <td className="border border-x-0 border-gray-300 px-4 py-2 text-center">{tx.sold_timestamp}</td>
                                                            <td className="border border-l-0 border-gray-300 px-4 py-2 text-center">{tx.sold_price.toFixed(1)}</td>

                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="mx-1 mt-1 h-[500px]">
                                <h1 className='mb-2 mx-7 font-semibold text-[20px] sticky top-0'>持倉中:</h1>

                                <table className='mx-7 text-gray-300 py-1 table-auto w-9/10 border-slate-400 p-1 rounded-md shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-20 relative' style={{ boxShadow: '0 0 10px 5px rgba(255, 0, 0, 0.5)' }}>
                                    <tbody>
                                        {userData.stocks.map(stock => (
                                            <tr key={stock.stock_id} onClick={() => handleStockSelect(stock.stock_id, stock.name)} className="cursor-pointer my-1 py-1 hover:bg-slate-700">
                                                <td className="px-1 py-1 text-left text-[15px] font-semibold w-full">{stock.name} - {stock.quantity}張 - 現價:{stock.recent_price}  漲跌幅:<span className={transactionClass(stock.recent_price - stock.price_per_unit)}>{(((stock.recent_price - stock.price_per_unit) / stock.price_per_unit) * 100).toFixed(2)}%</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* {userData.stocks.map(stock => (
                                    <div key={stock.stock_id}>{stock.name} - {stock.quantity}張 - 現價{stock.recent_price} 漲跌幅{(((stock.recent_price-stock.price_per_unit)/stock.price_per_unit)*100).toFixed(2)}%</div>
                                ))} */}
                            </div>
                        </div>
                    </>
                ) : (
                    username ?
                        <div className='flex justify-center mt-20'>
                            <Loading></Loading>
                        </div> :
                        <div className='text-white text-[22px] font-bold text-center'>先登入後才有此功能</div>
                )}
            </div>
        </div >
        </>
    )
}
export default Asset;
