import { useNavigate, useLocation } from 'react-router-dom';
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
  const [showFavorites, setShowFavorites] = useState<boolean>(true);
  const [isFavoriteAdded, setIsFavoriteAdded] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // 获取股票数据
  const allstocksData = useSelector((state: RootState) => state.stocks.data);
  const stocksData = allstocksData.all_stocks;
  const favstocksData = allstocksData.user_favorites;
  // 搜索和过滤逻辑
  // const filteredStocks = stocksData.filter((stock: Stock) =>
  //   stock.Name.toLowerCase().includes(searchTerm.toLowerCase()) || stock.Code.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  const filteredStocks = showFavorites ? favstocksData : stocksData.filter((stock: Stock) =>
    stock.Name.toLowerCase().includes(searchTerm.toLowerCase()) || stock.Code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 在组件加载时获取数据
  useEffect(() => {
    dispatch(fetchStocks(username));
  }, [dispatch, isFavoriteAdded]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
  };

  const handleStockSelect = (id: string, name: string): void => {
    navigate(`/trade/area/${id}`, { state: { stockName: name, username } }); // Navigate to Trade Area with selected stock ID as URL parameter
  };

  const addToFavorites = async (stockId: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/add_favorite_stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, stock_id: stockId })
      });

      const data = await response.json();

      if (response.status === 200) {
        setIsFavoriteAdded(prev => !prev);
        alert(`Stock added to favorites: ${data.message}`);
        // Optionally, you can update the state to reflect the changes in the UI
      } else {
        // console.error('Failed to add stock to favorites:', data.message);
        alert(`Failed to add stock to favorites: ${data.message}`);
      }
    } catch (error) {
      console.error('Error adding stock to favorites:', error);
    }
  };

  const deleteFavorites = async (stockId: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/remove_favorite_stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, stock_id: stockId })
      });

      const data = await response.json();

      if (response.status === 200) {
        setIsFavoriteAdded(prev => !prev);
        alert(`Stock removed from favorites: ${data.message}`);
      } else {
        alert(`Failed to remove stock from favorites: ${data.message}`);
      }
    } catch (error) {
      console.error('Error removing stock from favorites:', error);
    }
  };

  return (
    <>
      <div className='bg-container'>
        <AnimatedComponent y={-100} opacity={0} duration={0.8}>
          <Header username={username} />
        </AnimatedComponent>
        <AnimatedComponent y={0} opacity={0} duration={1.3} delay={0.8}>
          <div className="p-4 flex justify-center">
            <div className=" w-[500px]">
              <div className="h-[500px]">
                <div className="sticky top-0 text-white flex justify-between">
                  <div>
                    <button
                      onClick={() => setShowFavorites(false)}
                      className={`border border-b-0 border-red-300 rounded px-2 py-1 ${!showFavorites ? 'text-red-500' : 'text-white'
                        }`}
                    >
                      全部
                    </button>
                    <button
                      onClick={() => setShowFavorites(true)}
                      className={`border border-b-0 border-l-0 border-red-300 rounded px-2 py-1 ${showFavorites ? 'text-red-500' : 'text-white'
                        }`}
                    >
                      自選
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="搜索股票..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input bg-[#1e1515] w-1/3 h-10 outline-none text-[17px]"
                  />
                </div>
                <div className="breathing-divider"></div>
                <div className="mt-1 h-[calc(500px-42px)] overflow-y-auto">
                  <table className=' text-gray-300 py-1 table-fixed w-full sticky'>
                    <tbody>
                      {filteredStocks.map((stock: Stock) => (
                        <tr key={stock.Code} className="cursor-pointer my-1 py-1 hover:bg-slate-800">
                          <td onClick={() => handleStockSelect(stock.Code, stock.Name)} className="px-1 py-2 text-left text-[20px] font-semibold w-2/3">{stock.Name} <br /> <span className='font-mono text-[14px]'>{stock.Code}</span></td>
                          <td onClick={() => handleStockSelect(stock.Code, stock.Name)} className="px-8 py-2 text-right text-[22px] font-semibold ">{stock.Trading}<span className='font-mono text-[14px]'>{stock.ETF ? " ETF" : ""}</span></td>
                          {!showFavorites && (
                            <td className="text-right pr-4">
                              <button onClick={() => addToFavorites(stock.Code)} className=" bg-white text-red-500 hover:text-white hover:bg-red-500 rounded-full p-2 ml-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </td>
                          )}
                          {showFavorites && (
                            <td className="text-right pr-4">
                              <button onClick={() => deleteFavorites(stock.Code)} className=" bg-white text-red-500 hover:text-white hover:bg-red-500 rounded-full p-2 ml-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 18M6 6L18 6M9 6L9 3L15 3L15 6M10 6L10 18M14 6L14 18" />
                                </svg>
                              </button>
                            </td>
                          )}
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
