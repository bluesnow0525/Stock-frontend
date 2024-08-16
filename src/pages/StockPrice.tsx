import Header from "../components/Header";
import React, { useEffect, useState } from "react";
import CandlestickChart from "../components/K_Line";
import {
  useParams,
  useLocation,
  useNavigate,
  useMatch,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchStocksPrice } from "../slice/stockPriceSlice";
import { RootState, AppDispatch } from "../store";
import { fetchAssets, buyStock, sellStock } from "../slice";

const StockPrice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const priceMatch = useMatch(`/trade/price/${id}`);
  const infoMatch = useMatch(`/trade/info/${id}`);
  const financeMatch = useMatch(`/trade/finance/${id}`);

  const { stockName, ETF } = location.state as {
    stockName: string;
    ETF: boolean;
  };

  const [username, setusername] = useState(
    location.state
      ? (location.state as { username: string }).username
      : undefined
  );
  const [isvip, setisvip] = useState(
    location.state ? (location.state as { isvip: Boolean }).isvip : undefined
  );

  const [quantity, setQuantity] = useState<number>(0);
  const [isWithinTime, setIsWithinTime] = useState(false);
  const [asset_change, setasset_change] = useState<Boolean>(true);

  const updateUserInfo = (newUsername: string, newIsVip: boolean) => {
    setusername(newUsername);
    setisvip(newIsVip);
  };

  const dispatch = useDispatch<AppDispatch>();

  const stockPrices = useSelector(
    (state: RootState) => state.stocksPrice.prices
  );
  const pricesStatus = useSelector(
    (state: RootState) => state.stocksPrice.pricesStatus
  );
  const assets = useSelector((state: RootState) => state.assets.assets);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const dayOfWeek = now.getDay(); // 星期几 (0-星期日, 1-星期一, ..., 6-星期六)
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const totalMinutes = hours * 60 + minutes;

      // 9:00 AM 的总分钟数是 540, 1:30 PM 的总分钟数是 810
      if (
        (dayOfWeek < 6 && totalMinutes >= 540 && totalMinutes <= 870)
      ) {
        setIsWithinTime(true);
      } else {
        setIsWithinTime(false);
      }
    };

    // 检查时间的间隔设置为 1 分钟
    const intervalId = setInterval(checkTime, 60000);

    // 立即执行一次检查
    checkTime();

    // 清理函数
    return () => clearInterval(intervalId);
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path, { state: { stockName: stockName, username, isvip, ETF } });
  };

  const handleBuy = async () => {
    if (username && id) {
      try {
        const result = await dispatch(
          buyStock({ quantity, stockname: stockName, username, stockId: id })
        ).unwrap();
        alert(result.message); // 显示从服务器返回的消息
        setasset_change(!asset_change)
      } catch (err) {
        if (err && typeof err === "object" && "message" in err) {
          alert("餘額不足"); // 显示服务器错误消息
        } else {
          alert("Error executing buy operation");
        }
      }
    }
  };

  const handleSell = async () => {
    if (username && id) {
      try {
        const result = await dispatch(
          sellStock({ quantity, username, stockId: id })
        ).unwrap();
        alert(result.message); // 显示从服务器返回的消息
        setasset_change(!asset_change)
      } catch (err) {
        if (err && typeof err === "object" && "message" in err) {
          alert("庫存不足"); // 显示服务器错误消息
        } else {
          alert("Error executing sell operation");
        }
      }
    }
  };

  useEffect(() => {
    if (username) {
      dispatch(fetchAssets(username));
    }
  }, [dispatch, username, asset_change]);

  useEffect(() => {
    if (id) {
      dispatch(fetchStocksPrice(id));
    }
  }, [dispatch, id]);

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
      <div className="h-full flex flex-col items-center">
        <div className="w-full">
          <div className="h-12 flex justify-center items-center mt-5">
            {/* Buttons for navigation */}
            <button
              className={`3xl:text-[20px] link-hover-gradient px-4 py-1 border rounded mr-4 ${
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
                className={`3xl:text-[20px] link-hover-gradient px-1 py-1 rounded mr-4 ${
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
        <div className="h-3/5 w-[95%]">
          <CandlestickChart
            stockPrices={stockPrices}
            pricesStatus={pricesStatus}
            id={id}
            stockName={stockName}
          />
        </div>
        <div className="h-[20vh] w-[90%] text-color-5">
          {username && isWithinTime ? (
            <div className="py-2">
              <h1
                className="w-full mb-4 text-center bg-slate-800 border border-slate-400 p-1 rounded-md shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-20 relative"
                style={{ boxShadow: "0 0 10px 5px rgba(255, 0, 0, 0.5)" }}
              >
                可用資產：{assets}{" "}
                <span className="ml-8">現價:{stockPrices.length > 0 ? stockPrices[stockPrices.length - 1].close : 'N/A'}</span>
              </h1>
              <span>下單數量</span>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const newQuantity = parseInt(e.target.value, 10);
                  setQuantity(newQuantity >= 0 ? newQuantity : 0);
                }}
                placeholder="数量"
                className="bg-black p-1 w-[60px] ml-1"
              />
              <button
                onClick={handleBuy}
                className="mx-10 px-4 rounded-full hover:bg-white hover:text-emerald-800 bg-emerald-600 text-white py-2 transition-colors duration-300"
              >
                買
              </button>
              <button
                onClick={handleSell}
                className="px-4 rounded-full hover:bg-white hover:text-red-500 bg-red-500 text-white py-2 transition-colors duration-300"
              >
                賣
              </button>
            </div>
          ) : (
            <>
              {username ? (
                <p className="text-center mt-4 text-[18px] font-semibold">
                  未開盤
                </p>
              ) : (
                <div className=" bg-slate-950 h-[115px] flex justify-center">
                  <img
                    src="https://photo.16pic.com/00/88/39/16pic_8839292_b.png"
                    className="mt-6 w-[50px] h-[50px]"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockPrice;
