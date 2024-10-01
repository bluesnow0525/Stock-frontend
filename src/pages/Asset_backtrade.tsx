import { useLocation } from "react-router-dom";
import React, { useState, ChangeEvent, useEffect } from "react";
import Header from "../components/Header";
import { useSelector, useDispatch } from "react-redux";
import { fetchStocks } from "../slice/selectstockSlice";
import { RootState, AppDispatch } from "../store";

const Asset_backtrade: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
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

  const allstocksData = useSelector((state: RootState) => state.stocks.data);
  const Status = useSelector((state: RootState) => state.stocks.status);
  const stocksData = allstocksData.all_stocks || [];

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [weights, setWeights] = useState<number[]>([]);
  const [allocation, setAllocation] = useState<number>(0);

  useEffect(() => {
    dispatch(fetchStocks({ username: username, type: "all" }));
  }, [dispatch]);

  const handleAddStock = (code: string) => {
    if (selectedCodes.includes(code)) {
      alert("This stock is already added.");
      return;
    }
    setSelectedCodes([...selectedCodes, code]);
    setWeights([...weights, allocation]);
  };

  const handleAllocationChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAllocation(Number(event.target.value));
  };

  const handleStockChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const stockCode = event.target.value;
    if (stockCode) {
      handleAddStock(stockCode);
    }
  };

  const handleSubmit = () => {
    const totalWeight = weights.reduce((acc, curr) => acc + curr, 0);

    if (totalWeight !== 100) {
      alert("Total allocation must be 100%");
      return;
    }

    alert(`
      Codes: ${selectedCodes}
      Weights: ${weights}
      Start Date: ${startDate}
      End Date: ${endDate}
    `);
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
      {Status === "succeeded" && (
        <div className="h-full max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
          <h1 className="text-2xl font-bold mb-4">Backtest Asset Allocation</h1>

          <div className="mb-4">
            <label className="block text-gray-700">Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full mt-2 p-2 border rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full mt-2 p-2 border rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Select Stock:</label>
            <select
              onChange={handleStockChange}
              className="w-full mt-2 p-2 border rounded-lg"
            >
              <option value="">Select a stock</option>
              {stocksData.map((stock) => (
                <option key={stock.Code} value={stock.Code}>
                  {stock.Name} ({stock.Code})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Allocation %:</label>
            <input
              type="number"
              value={allocation}
              onChange={handleAllocationChange}
              className="w-full mt-2 p-2 border rounded-lg"
              placeholder="Enter allocation percentage"
            />
          </div>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
            onClick={handleSubmit}
          >
            Submit
          </button>

          <div className="mt-6">
            <h2 className="text-xl font-semibold">Selected Stocks</h2>
            {selectedCodes.length === 0 ? (
              <p>No stocks selected.</p>
            ) : (
              <ul className="list-disc list-inside">
                {selectedCodes.map((code, index) => (
                  <li key={code}>
                    {code} - {weights[index]}%
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Asset_backtrade;
