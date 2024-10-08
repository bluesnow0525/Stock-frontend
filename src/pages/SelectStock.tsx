import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import React, { useState, ChangeEvent, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchStocks } from "../slice/selectstockSlice";
import { addToFavorites, deleteFavorites } from "../slice/favoritesSlice";
import { RootState, AppDispatch } from "../store";
import Loading from "../components/Loading";

type Stock = {
  Code: string;
  Name: string;
  Category: string;
  Trading: string;
  ETF: boolean;
};

const SelectTarget: React.FC = () => {
  const location = useLocation();
  const [username, setusername] = useState(
    location.state
      ? (location.state as { username: string }).username
      : undefined
  );
  const [isvip, setisvip] = useState(
    location.state ? (location.state as { isvip: Boolean }).isvip : undefined
  );

  const updateUserInfo = (newUsername: string, newIsVip: boolean) => {
    setusername(newUsername);
    setisvip(newIsVip);
  };

  const [searchTerm, setSearchTerm] = useState<string>("");
  // const [showFavorites, setShowFavorites] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<string>("all");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isFavoriteAdded = useSelector(
    (state: RootState) => state.favorites.isFavoriteAdded
  );
  // 获取股票数据
  const allstocksData = useSelector((state: RootState) => state.stocks.data);
  const Status = useSelector((state: RootState) => state.stocks.status);
  const stocksData = allstocksData.all_stocks || [];

  const filteredStocks = stocksData.filter(
    (stock: Stock) =>
      stock.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.Code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 在组件加载时获取数据
  useEffect(() => {
    dispatch(fetchStocks({ username: username, type: viewMode }));
  }, [dispatch, isFavoriteAdded, viewMode]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
  };

  const handleStockSelect = (id: string, name: string, ETF: boolean): void => {
    navigate(`/trade/price/${id}`, {
      state: { stockName: name, username, isvip, ETF },
    }); // Navigate to Trade Area with selected stock ID as URL parameter
  };

  const handleAddToFavorites = (stockId: string, stock_name: string) => {
    dispatch(addToFavorites({ username, stockId, stock_name }));
  };

  const handleDeleteFavorites = (stockId: string) => {
    dispatch(deleteFavorites({ username, stockId }));
  };

  return (
    <>
      <div className="bg-container">
        <div className="w-full h-[9%] bg-color-1 text-white">
          <Header
            username={username}
            isvip={isvip}
            onUpdateUserInfo={updateUserInfo}
          ></Header>
          <div className="breathing-divider"></div>
        </div>
        <div className="p-4 flex justify-center mt-2 h-full">
          <div className="w-[95%]">
            <div className="sticky top-0 text-white flex justify-between text-[13px] lg:text-[16px]">
              <div>
                <button
                  onClick={() => setViewMode("all")}
                  className={`border border-b-0 border-color-2 rounded px-1 lg:px-2 py-1 ${
                    viewMode === "all" ? "text-color-3" : "text-white"
                  }`}
                >
                  全部
                </button>
                <button
                  onClick={() => setViewMode("fav")}
                  className={`border border-b-0 border-l-0 border-color-2 rounded px-1 lg:px-2 py-1 ${
                    viewMode === "fav" ? "text-color-3" : "text-white"
                  }`}
                >
                  自選
                </button>
                <button
                  onClick={() => setViewMode("toplong")}
                  className={`border border-b-0 border-l-0 border-color-2 rounded px-1 lg:px-2 py-1 ${
                    viewMode === "toplong" ? "text-color-3" : "text-white"
                  }`}
                >
                  價值排行
                </button>
                <button
                  onClick={() => setViewMode("topshort")}
                  className={`border border-b-0 border-l-0 border-color-2 rounded px-1 lg:px-2 py-1 ${
                    viewMode === "topshort" ? "text-color-3" : "text-white"
                  }`}
                >
                  AI排行
                </button>
              </div>
              <input
                type="text"
                placeholder="搜索股票..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input bg-[#1e1515] w-1/3 h-10 outline-none text-[15px] lg:text-[17px]"
              />
            </div>
            <div className="breathing-divider"></div>
            <div className="mt-1 h-[600px] overflow-y-auto">
              {Status === "succeeded" && (
                <table className="text-gray-300 py-1 table-fixed w-full sticky">
                  <tbody>
                    {filteredStocks.map((stock: Stock) => (
                      <tr
                        key={stock.Code}
                        className="cursor-pointer my-1 py-1 hover:bg-slate-800"
                      >
                        <td
                          onClick={() =>
                            handleStockSelect(stock.Code, stock.Name, stock.ETF)
                          }
                          className="px-1 py-2 text-left text-[20px] font-semibold w-1/3"
                        >
                          {stock.Name} <br />
                          <span className="font-mono text-[14px]">
                            {stock.Code}
                          </span>
                        </td>
                        <td
                          onClick={() =>
                            handleStockSelect(stock.Code, stock.Name, stock.ETF)
                          }
                          className="px-4 py-2 text-[16px] font-semibold w-1/3"
                        >
                          {stock.Category}
                        </td>
                        <td
                          onClick={() =>
                            handleStockSelect(stock.Code, stock.Name, stock.ETF)
                          }
                          className="px-8 py-2 text-right text-[22px] font-semibold"
                        >
                          {stock.Trading}
                          <span className="font-mono text-[14px]">
                            {stock.ETF ? " ETF" : ""}
                          </span>
                        </td>
                        {(viewMode === "all" ||
                          viewMode === "toplong" ||
                          viewMode === "topshort") &&
                          username && (
                            <td className="text-right pr-4">
                              <button
                                onClick={() =>
                                  handleAddToFavorites(stock.Code, stock.Name)
                                }
                                className="bg-white text-red-500 hover:text-white hover:bg-red-500 rounded-full p-2 ml-4"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                              </button>
                            </td>
                          )}
                        {viewMode === "fav" && (
                          <td className="text-right pr-4">
                            <button
                              onClick={() => handleDeleteFavorites(stock.Code)}
                              className="bg-white text-red-500 hover:text-white hover:bg-red-500 rounded-full p-2 ml-4"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 18M6 6L18 6M9 6L9 3L15 3L15 6M10 6L10 18M14 6L14 18"
                                />
                              </svg>
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {Status === "loading" && (
                <div className="flex justify-center items-center mt-56">
                  <Loading></Loading>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectTarget;
