import { useNavigate,useLocation } from 'react-router-dom';
import Header from '../components/Header';
import React, { useState, ChangeEvent, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStocks } from '../slice/selectstockSlice';
import { RootState, AppDispatch } from '../store';
import AnimatedComponent from '../components/AnimatedComponent';

type Stock = {
  Code: string;
  Name: string;
  Trading: string;
  ETF: boolean;
};
const SelectTarget: React.FC = () => {
  const location = useLocation();
  const username = location.state ? (location.state as { username: string }).username : undefined;

  const [searchTerm, setSearchTerm] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // 获取股票数据
  const stocksData = useSelector((state: RootState) => state.stocks.data);

  // 搜索和过滤逻辑
  const filteredStocks = stocksData.filter((stock: Stock) =>
    stock.Name.toLowerCase().includes(searchTerm.toLowerCase()) || stock.Code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 在组件加载时获取数据
  useEffect(() => {
    dispatch(fetchStocks());
  }, [dispatch]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
  };

  const handleStockSelect = (id: string, name: string): void => {
    navigate(`/trade/area/${id}`, { state: { stockName: name,username } }); // Navigate to Trade Area with selected stock ID as URL parameter
  };
  return (
    <>
    <div className='bg-container'>
      <AnimatedComponent y={-100} opacity={0} duration={0.8}>
        <Header username={username}/>
      </AnimatedComponent>
      <AnimatedComponent y={0} opacity={0} duration={1.3} delay={0.8}>
        <div className="p-4 flex justify-center">
          <div className=" w-[500px]">
            <div className="h-[500px]">
              <div className="sticky top-0 text-white">
                <input
                  type="text"
                  placeholder="搜索股票..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input bg-[#1e1515] w-full h-10 outline-none"
                />
              </div>
              <div className="breathing-divider"></div>
              <div className="mt-1 h-[calc(500px-42px)] overflow-y-auto">
                <table className=' text-gray-300 py-1 table-fixed w-full sticky'>

                  <tbody>
                    {filteredStocks.map((stock: Stock) => (
                      <tr key={stock.Code} onClick={() => handleStockSelect(stock.Code, stock.Name)} className="cursor-pointer my-1 py-1 hover:bg-slate-800">
                        <td className="px-1 py-2 text-left text-[20px] font-semibold w-1/2">{stock.Name} <br /> <span className='font-mono text-[14px]'>{stock.Code}</span></td>
                        <td className="px-8 py-2 text-right text-[22px] font-semibold w-1/2">{stock.Trading}<span className='font-mono text-[14px]'>{stock.ETF ? " ETF" : ""}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </AnimatedComponent>
      </div>
    </>
  );
};

export default SelectTarget;
