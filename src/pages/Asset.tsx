import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Loading from "../components/Loading";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserData } from "../slice/userdataSlice";
import { RootState, AppDispatch } from "../store";

const Asset: React.FC = () => {
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

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const userData = useSelector((state: RootState) => state.userData.data);
  const userDataStatus = useSelector(
    (state: RootState) => state.userData.status
  );

  useEffect(() => {
    if (username) {
      dispatch(fetchUserData(username));
    }
  }, [username, dispatch]);

  const transactionClass = (type: number) => {
    return type < 0 ? "text-green-400" : "text-red-400";
  };

  const floatingasset = () => {
    let sum = 0;
    if (userData) {
      userData.stocks.forEach((stock) => {
        sum += stock.recent_price * stock.quantity * 1000;
      });
    }
    return sum;
  };

  const handleStockSelect = (id: string, name: string): void => {
    navigate(`/trade/price/${id}`, {
      state: { stockName: name, username, isvip },
    });
  };

  let totalAssets = 0;
  let assetsPercent = 0;
  let floatingPercent = 0;
  if (userData) {
    totalAssets = userData.assets + floatingasset();
    assetsPercent = (userData.assets / totalAssets) * 100;
    floatingPercent = (floatingasset() / totalAssets) * 100;
  }

  return (
    <div className="bg-container">
      <div className="w-full h-[9%] bg-color-1 text-white">
        <Header
          username={username}
          isvip={isvip}
          onUpdateUserInfo={updateUserInfo}
        ></Header>
        <div className="breathing-divider"></div>
      </div>
      {userDataStatus === "succeeded" && userData ? (
        <div className="h-full">
          <div className="h-[40%] flex ">
            <div className="w-[45%] text-color-5 flex items-center flex-col mx-2 space-y-4">
              <div className="mt-10">
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      fill="transparent"
                      stroke="#3B82F6"
                      strokeWidth="10"
                      strokeDasharray={`${(220 * assetsPercent) / 100} 220`}
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      fill="transparent"
                      stroke="#10B981"
                      strokeWidth="10"
                      strokeDasharray={`${(220 * floatingPercent) / 100} 220`}
                      strokeDashoffset={`-${(220 * assetsPercent) / 100}`}
                    />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-semibold text-gray-100">
                    資產
                  </div>
                </div>
                <div className="my-5">
                  <div className="text-[18px] font-bold text-color-5">
                    總資產: <br />${totalAssets.toFixed(2)}
                    <span
                      className={`ml-1 text-sm ${transactionClass(
                        totalAssets - 10000000
                      )}`}
                    >
                      {(((totalAssets - 10000000) * 100) / 10000000).toFixed(2)}
                      %
                    </span>
                  </div>
                  <div className="mt-2 text-[17px] text-color-5">
                    可用現金: <br />${userData.assets.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[55%] overflow-y-auto">
              <h1 className="mt-7 mb-2 mx-7 font-semibold text-color-4 text-[16px] sm:text-[20px] sticky top-0">
                持倉中:
              </h1>
              <table
                className="mx-7 text-gray-300 py-1 table-auto border-slate-400 p-1 rounded-md shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-20 relative"
                style={{ boxShadow: "0 0 10px 5px rgba(255, 0, 0, 0.5)" }}
              >
                <tbody>
                  {userData.stocks.map((stock) => (
                    <tr
                      key={stock.stock_id}
                      onClick={() =>
                        handleStockSelect(stock.stock_id, stock.name)
                      }
                      className="cursor-pointer my-1 py-1 hover:bg-slate-700 "
                    >
                      <td className="px-1 py-1 text-left text-[12px] sm:text-[15px] font-semibold w-full">
                        {stock.name} - {stock.quantity}張 - 現價:
                        {stock.recent_price} 漲跌幅:
                        <span
                          className={transactionClass(
                            stock.recent_price - stock.price_per_unit
                          )}
                        >
                          {(
                            ((stock.recent_price - stock.price_per_unit) /
                              stock.price_per_unit) *
                            100
                          ).toFixed(2)}
                          %
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="h-1/2 overflow-y-auto text-color-4">
            <div className="font-bold ml-3 text-[16px] sm:text-[20px] mb-2 sticky top-0">
              歷史交易數據:
            </div>
            <div className="mt-2 ml-1">
              <table className="table-fixed border-collapse border border-gray-200 bg-slate-950 text-[12px] sm:text-[15px]">
                <thead className="sticky top-0 bg-slate-950">
                  <tr>
                    <th className="border border-r-0 border-gray-300 sm:px-2 py-1 text-center">
                      股票 ID
                    </th>
                    <th className="border border-x-0 border-gray-300 sm:px-2 py-1 text-center">
                      數量
                    </th>
                    <th className="border border-x-0 border-gray-300 sm:px-2 py-1 text-center">
                      損益
                    </th>
                    <th className="border border-x-0 border-gray-300 sm:px-2 sm:py-5 xl:py-1 text-center">
                      買入時間
                    </th>
                    <th className="border border-x-0 border-gray-300 sm:px-2 py-1 text-center">
                      買價
                    </th>
                    <th className="border border-x-0 border-gray-300 sm:px-2 sm:py-5 xl:py-1 text-center">
                      賣出時間
                    </th>
                    <th className="border border-l-0 border-gray-300 sm:px-2 py-1 text-center">
                      賣價
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userData.transactions
                    .slice()
                    .sort(
                      (a, b) =>
                        new Date(b.sold_timestamp).getTime() -
                        new Date(a.sold_timestamp).getTime()
                    )
                    .map((tx) => (
                      <tr
                        key={tx.transaction_id}
                        className={transactionClass(tx.profit_loss)}
                      >
                        <td className="border border-r-0 border-gray-300 px-4 py-2 text-center">
                          {tx.stock_id}
                        </td>
                        <td className="border border-x-0 border-gray-300 px-4 py-2 text-center">
                          {tx.quantity}
                        </td>
                        <td className="border border-x-0 border-gray-300 px-4 py-2 text-center">
                          {(tx.profit_loss * 1000).toFixed(0)}
                          <p>({((tx.profit_loss)*100/(tx.price_per_unit * tx.quantity)).toFixed(1)}%)</p>
                        </td>
                        <td className="border border-x-0 border-gray-300 px-4 py-2 text-center">
                          {tx.timestamp.split(' ')[0]}
                        </td>
                        <td className="border border-x-0 border-gray-300 px-4 py-2 text-center">
                          {tx.price_per_unit.toFixed(1)}
                        </td>
                        <td className="border border-x-0 border-gray-300 px-4 py-2 text-center">
                          {tx.sold_timestamp.split(' ')[0]}
                        </td>
                        <td className="border border-l-0 border-gray-300 px-4 py-2 text-center">
                          {tx.sold_price.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : username ? (
        <div className="flex justify-center mt-20">
          <Loading></Loading>
        </div>
      ) : (
        <div className="text-white text-[22px] font-bold text-center mt-10">
          先登入後才有此功能
        </div>
      )}
    </div>
  );
};

export default Asset;
