import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import BalancesheetBar from "../components/Balancesheet";
import Incomesheet from "../components/Incomesheet";
import CashFlowSheet from "../components/Cashflowsheet";
import DividendBar from "../components/Dividendsheet";
import RevenueChart from "../components/Revenuesheet";
import Loading from "../components/Loading";
import { useParams, useLocation, useNavigate, useMatch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchSheetData } from "../slice/sheetSlice";
import { RootState, AppDispatch } from "../store";
import { FinancialData } from "../slice/sheetSlice";

const StockFinance: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const priceMatch = useMatch(`/trade/price/${id}`);
  const infoMatch = useMatch(`/trade/info/${id}`);
  const financeMatch = useMatch(`/trade/finance/${id}`);
  const { stockName, ETF } = location.state as { stockName: string; ETF: boolean };

  const [username, setusername] = useState(
    location.state ? (location.state as { username: string }).username : undefined
  );
  const [isvip, setisvip] = useState(
    location.state ? (location.state as { isvip: Boolean }).isvip : undefined
  );

  const updateUserInfo = (newUsername: string, newIsVip: boolean) => {
    setusername(newUsername);
    setisvip(newIsVip);
  };

  const dispatch = useDispatch<AppDispatch>();
  const sheetData = useSelector((state: RootState) => state.sheetData.data);
  const sheetDataStatus = useSelector((state: RootState) => state.sheetData.status);

  useEffect(() => {
    if (id) {
      dispatch(fetchSheetData(id));
    }
  }, [id, dispatch]);

  const sortTimePeriods = (periods: string[]) => {
    return periods.sort((a, b) => {
      const [yearA, quarterA] = a.split("Q").map(Number);
      const [yearB, quarterB] = b.split("Q").map(Number);
      if (yearA !== yearB) {
        return yearB - yearA;
      }
      return quarterB - quarterA;
    });
  };

  // const sortYears = (years: string[]) => {
  //   return years.sort((a, b) => Number(b) - Number(a));
  // };

  // const sortYearMonths = (periods: string[]) => {
  //   return periods.sort((a, b) => {
  //     const [yearA, monthA] = a.split("M").map(Number);
  //     const [yearB, monthB] = b.split("M").map(Number);
  //     if (yearA !== yearB) {
  //       return yearB - yearA;
  //     }
  //     return monthB - monthA;
  //   });
  // };

  const [viewMode, setViewMode] = useState<string>("balance");
  const [currentData, setCurrentData] = useState<FinancialData[] | undefined>(undefined);
  const [timePeriods, setTimePeriods] = useState<string[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [equityData, setEquityData] = useState<number[]>([]);
  const [liabilityData, setLiabilityData] = useState<number[]>([]);

  useEffect(() => {
    if (sheetData) {
      let periods: string[] = [];
      if (viewMode === "balance" && sheetData.balance_sheet) {
        setCurrentData(sheetData.balance_sheet);
        periods = sheetData.balance_sheet
          .map((data) => data["年度-季度"]?.[0] as string)
          .filter(Boolean);
        setEquityData(
          sheetData.balance_sheet.map((data) => {
            const value = data["股東權益（淨值）"]?.[0];
            return typeof value === "number" ? value / 1000 : 0;
          })
        );
        setLiabilityData(
          sheetData.balance_sheet.map((data) => {
            const value = data["總負債"]?.[0];
            return typeof value === "number" ? value / 1000 : 0;
          })
        );
      } else if (viewMode === "income" && sheetData.income_statement) {
        setCurrentData(sheetData.income_statement);
        periods = sheetData.income_statement
          .map((data) => data["年度-季度"]?.[0] as string)
          .filter(Boolean);
      } else if (viewMode === "cash-flow" && sheetData.cash_flow) {
        setCurrentData(sheetData.cash_flow);
        periods = sheetData.cash_flow
          .map((data) => data["年度-季度"]?.[0] as string)
          .filter(Boolean);
      } else if (viewMode === "dividend" && sheetData.dividend) {
        setCurrentData(sheetData.dividend);
        periods = sheetData.dividend
          .map((data) => data["年度"]?.[0] as string)
          .filter(Boolean);
      } else if (viewMode === "revenue" && sheetData.revenue) {
        setCurrentData(sheetData.revenue);
        periods = sheetData.revenue
          .map((data) => data["年度-月份"]?.[0] as string)
          .filter(Boolean);
      }
      setTimePeriods(sortTimePeriods(periods));
      setLabels(periods);
    }
  }, [viewMode, sheetData]);

  const handleNavigate = (path: string) => {
    navigate(path, { state: { stockName: stockName, username, isvip, ETF } });
  };

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

      <div className="w-full">
        <div className="h-12 flex justify-center items-center mt-5">
          {/* Buttons for navigation */}
          <button
            className={`3xl:text-[20px] link-hover-gradient px-1 py-1 rounded mr-4 ${
              priceMatch ? "border-color-3" : ""
            }`}
            onClick={() => handleNavigate(`/trade/price/${id}`)}
          >
            價格
          </button>
          <button
            className={`3xl:text-[20px] link-hover-gradient px-1 py-1 rounded mr-4 ${
              infoMatch ? "border-color-3" : ""
            }`}
            onClick={() => handleNavigate(`/trade/info/${id}`)}
          >
            分析
          </button>
          {ETF !== true && (
            <button
              className={`3xl:text-[20px] link-hover-gradient px-4 py-1 border rounded mr-4 ${
                financeMatch ? "border-color-3" : ""
              }`}
              onClick={() => handleNavigate(`/trade/finance/${id}`)}
            >
              財報
            </button>
          )}
        </div>
        <div className="breathing-divider "></div>
      </div>
      {sheetDataStatus === "succeeded" && currentData && username && (
        <>
          <div className="flex">
            <div className="flex flex-col w-[15%] ">
              <div className="h-[80%] text-white mt-3">
                <div className="flex flex-col p-2 space-y-2">
                  <button
                    onClick={() => setViewMode("revenue")}
                    className={`px-4 py-3 rounded ${
                      viewMode === "revenue"
                        ? "bg-red-500"
                        : "bg-gray-700 hover:bg-gray-600"
                    } sm:writing-mode-vertical sm:text-orientation-upright 3xl:text-[20px]`}
                  >
                    月營收
                  </button>
                  <button
                    onClick={() => setViewMode("income")}
                    className={`px-4 py-3 rounded ${
                      viewMode === "income"
                        ? "bg-red-500"
                        : "bg-gray-700 hover:bg-gray-600"
                    } sm:writing-mode-vertical sm:text-orientation-upright 3xl:text-[20px]`}
                  >
                    綜合損益表
                  </button>
                  <button
                    onClick={() => setViewMode("balance")}
                    className={`px-4 py-3 rounded ${
                      viewMode === "balance"
                        ? "bg-red-500"
                        : "bg-gray-700 hover:bg-gray-600"
                    } sm:writing-mode-vertical sm:text-orientation-upright 3xl:text-[20px]`}
                  >
                    資產負債表
                  </button>
                  <button
                    onClick={() => setViewMode("cash-flow")}
                    className={`px-4 py-3 rounded ${
                      viewMode === "cash-flow"
                        ? "bg-red-500"
                        : "bg-gray-700 hover:bg-gray-600"
                    } sm:writing-mode-vertical sm:text-orientation-upright 3xl:text-[20px]`}
                  >
                    現金流量表
                  </button>
                  <button
                    onClick={() => setViewMode("dividend")}
                    className={`px-4 py-3 rounded ${
                      viewMode === "dividend"
                        ? "bg-red-500"
                        : "bg-gray-700 hover:bg-gray-600"
                    } sm:writing-mode-vertical sm:text-orientation-upright 3xl:text-[20px]`}
                  >
                    股利
                  </button>
                </div>
              </div>
            </div>
            <div className="w-[85%]">
              <div
                className="h-[38vh] mt-2 mx-3 text-gray-300 h- bg-slate-800 py-1 border-slate-400 p-1 rounded-md shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-20 relative"
                style={{
                  boxShadow: "0 0 10px 5px rgba(255, 0, 0, 0.5)",
                  overflowY: "auto",
                  overflowX: "auto",
                }}
              >
                <table className="w-full">
                  <thead>
                    <tr className="sticky top-0 bg-slate-950 bg-opacity-90 text-[14px] font-bold">
                      <th
                        className="text-left px-1 py-1"
                        style={{ width: "200px", whiteSpace: "nowrap" }}
                      >
                        {viewMode}
                      </th>
                      {timePeriods?.map((period) => (
                        <th key={period} className="text-center px-1 py-1">
                          {period}
                        </th>
                      ))}
                    </tr>
                    <tr className="sticky top-10 bg-slate-950 bg-opacity-90 text-[11px] sm:text-[14px] font-bold">
                      <th style={{ width: "300px" }}></th>
                      {timePeriods?.map((period) => (
                        <React.Fragment key={period}>
                          <th className="text-left px-1 py-1">
                            {viewMode === "dividend" ? "元" : "千元"}
                          </th>
                        </React.Fragment>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentData &&
                      Object.keys(currentData[0] || {})
                        .filter(
                          (key) =>
                            key !== "年度-季度" &&
                            key !== "年度" &&
                            key !== "年度-月份"
                        )
                        .map((key) => (
                          <tr key={key} className="my-1 py-1">
                            <td
                              className="px-1 py-1 text-left text-[12px] sm:text-[15px] font-semibold w-full sticky left-0 bg-slate-950 bg-opacity-80 top-20"
                              style={{ width: "300px", whiteSpace: "nowrap" }}
                            >
                              {key}
                            </td>
                            {timePeriods?.map((period) => {
                              const data = currentData.find((d) => {
                                if (viewMode === "dividend") {
                                  return d["年度"]?.[0] === period;
                                } else if (viewMode === "revenue") {
                                  return d["年度-月份"]?.[0] === period;
                                } else {
                                  return d["年度-季度"]?.[0] === period;
                                }
                              });
                              const value = data ? data[key] : null;
                              return (
                                <React.Fragment key={period}>
                                  <td className="px-1 py-1 text-left text-[12px] sm:text-[15px]">
                                    {value && Array.isArray(value) && value[0] !== null
                                      ? Number(value[0]).toFixed(2)
                                      : "N/A"}
                                  </td>
                                </React.Fragment>
                              );
                            })}
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
              <div className="h-[50%] w-[95%] flex justify-center items-center mt-2">
                {viewMode === "balance" && (
                  <BalancesheetBar
                    labels={labels}
                    equityData={equityData}
                    liabilityData={liabilityData}
                  />
                )}
                {viewMode === "income" && <Incomesheet data={currentData} />}
                {viewMode === "cash-flow" && (
                  <CashFlowSheet data={currentData} />
                )}
                {viewMode === "dividend" && <DividendBar data={currentData} />}
                {viewMode === "revenue" && <RevenueChart data={currentData} />}
              </div>
            </div>
          </div>
        </>
      )}
      {sheetDataStatus === "loading" && (
        <div className="flex justify-center items-center mt-56">
          <Loading></Loading>
        </div>
      )}
    </div>
  );
};

export default StockFinance;
