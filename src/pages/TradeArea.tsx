// import { Link } from 'react-router-dom';
import AnimatedComponent from '../components/AnimatedComponent';
import Header from '../components/Header';
import Loading from '../components/Loading';
import BuySellGauge from '../components/BuySellGauge';
import React, { useEffect, useRef, useState } from 'react';
// import { NavLink } from 'react-router-dom';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';
import { useParams, useLocation, useNavigate, useMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStocksPrice } from '../slice/selectstockSlice';
import { RootState, AppDispatch } from '../store';
import { fetchStart, fetchSuccess, fetchFailure } from '../slice/aiSlice';
import { fetchAiData } from '../service/aireviewAPI';
import { fetchAssets, buyStock, sellStock } from '../slice'

export interface StockData {
  time: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

const TradeArea: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // const navigate = useNavigate();
  const location = useLocation();
  const navigate = useNavigate();
  const areaMatch = useMatch(`/trade/area/${id}`);
  const newsMatch = useMatch(`/trade/news/${id}`);

  const { stockName, username } = location.state as { stockName: string, username?: string };
  const dispatch = useDispatch<AppDispatch>();
  const dispatchai = useDispatch<AppDispatch>();
  const dispatchasset = useDispatch<AppDispatch>();
  const stockPrices = useSelector((state: RootState) => state.stocks.prices);
  const pricesStatus = useSelector((state: RootState) => state.stocks.pricesStatus);
  const assets = useSelector((state: RootState) => state.assets.assets);
  const { imageUrl, info, status, error } = useSelector((state: RootState) => state.ai);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  let chart: IChartApi | null = null;
  let candleSeries: ISeriesApi<"Candlestick"> | null = null;

  const [quantity, setQuantity] = useState<number>(0);
  const [isWithinTime, setIsWithinTime] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const dayOfWeek = now.getDay();  // 星期几 (0-星期日, 1-星期一, ..., 6-星期六)
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const totalMinutes = hours * 60 + minutes;

      // 9:00 AM 的总分钟数是 540, 1:30 PM 的总分钟数是 810
      if (dayOfWeek >= 0 && dayOfWeek <= 5 && totalMinutes >= -540 && totalMinutes <= 19810) {
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

  useEffect(() => {
    if (username) {
      dispatchasset(fetchAssets(username));
    }
  }, [dispatchasset, username]);

  const handleNavigate = (path: string) => {
    navigate(path, { state: { stockName: stockName, username } });
  };

  const handleBuy = async () => {
    if (username && id) {
      try {
        const result = await dispatch(buyStock({ quantity, stockname: stockName, username, stockId: id })).unwrap();
        alert(result.message);  // 显示从服务器返回的消息
        window.location.reload();
      } catch (err) {
        if (err && typeof err === 'object' && 'message' in err) {
          alert('餘額不足');  // 显示服务器错误消息
        } else {
          alert('Error executing buy operation');
        }
      }
    }
  };

  const handleSell = async () => {
    if (username && id) {
      try {
        const result = await dispatch(sellStock({ quantity, username, stockId: id })).unwrap();
        alert(result.message);  // 显示从服务器返回的消息
        window.location.reload();
      } catch (err) {
        if (err && typeof err === 'object' && 'message' in err) {
          alert('庫存不足');  // 显示服务器错误消息
        } else {
          alert('Error executing sell operation');
        }
      }
    }
  };

  useEffect(() => {
    if (username) {
      dispatchai(fetchStart());
      const params = { query: { id } }; // 设置你想发送给后端的参数
      fetchAiData(params)
        .then(data => {
          dispatchai(fetchSuccess({
            imageUrl: data.imageBase64,
            info: data.info
          }));
        })
        .catch(error => {
          dispatchai(fetchFailure(error.message));
        });
    }
  }, [dispatchai, id]);

  useEffect(() => {
    if (id) {
      dispatch(fetchStocksPrice(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    const getChartHeight = () => {
      if (window.innerWidth > 1536) { // Tailwind's 3xl breakpoint is 1536px
        return 800;
      }
      return 550;
    };
    // console.log("useEffect triggered");
    if (pricesStatus === 'succeeded' && stockPrices && chartContainerRef.current) {
      chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: getChartHeight(),
        layout: {
          background: { color: 'rgba(0, 0, 0, 0.3)' },
          textColor: '#d1d4dc',
        },
        grid: {
          vertLines: { color: '#2B2B43' },
          horzLines: { color: '#363C4E' },
        },
      });

      candleSeries = chart.addCandlestickSeries({
        upColor: '#FF0000',      // 上涨颜色（红色）
        downColor: '#00FF00',    // 下跌颜色（绿色）
        borderUpColor: '#FF0000', // 上涨边框颜色（红色）
        borderDownColor: '#00FF00', // 下跌边框颜色（绿色）
        wickUpColor: '#FF0000',  // 上涨蜡烛芯颜色（红色）
        wickDownColor: '#00FF00' // 下跌蜡烛芯颜色（绿色）
      });

      const pricesCopy = [...stockPrices];
      const uniqueSortedPrices = pricesCopy
        .sort((a, b) => a.time.localeCompare(b.time))
        .filter((v, i, a) => !i || v.time !== a[i - 1].time);

      candleSeries.setData(uniqueSortedPrices.map((item: StockData) => ({
        time: item.time,
        open: parseFloat(item.open),
        high: parseFloat(item.high),
        low: parseFloat(item.low),
        close: parseFloat(item.close),
      })));

      const resizeChart = () => {
        // 首先检查 chart 和 chartContainerRef.current 是否存在
        if (chartContainerRef.current && chart) {
          // 然后检查 parentNode 是否存在
          const parentNode = chartContainerRef.current.parentNode as HTMLDivElement;

          if (parentNode) {
            const gridWidth = parentNode.clientWidth;
            const chartWidth = gridWidth * (149 / 150); // 保持 5fr 和 4fr 的比例

            chart.applyOptions({
              width: chartWidth,
              height: chartContainerRef.current.clientHeight,
            });
          }
        }
      };

      window.addEventListener('resize', resizeChart);

      return () => {
        if (chart) {
          chart.remove();
          window.removeEventListener('resize', resizeChart);
        }
      };
    }
  }, [stockPrices, pricesStatus, chartContainerRef]);


  return (
    <>
      <AnimatedComponent y={-100} opacity={0} duration={0.8}>
        <Header username={username} />
      </AnimatedComponent>
      <AnimatedComponent y={0} opacity={0} duration={1.5} delay={0.6}>
        <div className=" mx-0 sm:mx-15">
          <div className="h-12 3xl:h-20 flex justify-center items-center">
            {/* Buttons for navigation */}
            <button
              className={`3xl:text-[20px] link-hover-gradient px-4 py-1 border rounded mr-4 ${areaMatch ? 'border-red-300' : ''}`}
              onClick={() => handleNavigate(`/trade/area/${id}`)}
            >
              價格區
            </button>
            <button
              className={`3xl:text-[20px] link-hover-gradient rounded mr-4 ${newsMatch ? 'border-red-300' : ''}`}
              onClick={() => handleNavigate(`/trade/news/${id}`)}
            >
              資訊區
            </button>
          </div>
          <div className="breathing-divider"></div>
          <div className="grid grid-rows-2 sm:grid-cols-[5fr,4fr] 3xl:h-[2000px]">
            <div className=" w-full">
              {/* 左侧区块 */}
              <div className="bg-gray-800 text-white py-2 w-full">
                <span className='text-left ml-1'>{id}</span>
                <span className='px-5'>{stockName}</span>
                日K線圖
              </div>
              <div ref={chartContainerRef} className="" />
              {pricesStatus === 'loading' && <div className='flex justify-center mt-20'><Loading></Loading></div>}
            </div>
            <div className="grid grid-rows-[3fr,1fr]">
              <div className="">
                {/* 右上区块 */}
                {status === 'succeeded' && imageUrl && username && (
                  <>
                    <div className="bg-gray-800 text-white py-2 w-full text-center">AI評分</div>
                    
                    <div className='flex justify-center px-2 my-1 bg-slate-800 border border-slate-400 p-1 rounded-md shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-20 relative' style={{ boxShadow: '0 0 10px 5px rgba(255, 0, 0, 0.4)' }}>
                      <div className='flex w-full'>
                        <div className='text-white flex flex-col justify-center items-center w-1/3 sm:w-1/2'>
                          <BuySellGauge score={info.評價分數} />
                          <p className='text-[18px] text-center font-extrabold'>{info.評價分數}</p>
                          <p className='text-[14px] font-bold text-slate-200'>AI信心分數:{info.評價分數}</p>
                          <p className='text-[14px] font-bold text-slate-200'>準確率: {info.準確率}</p>
                        </div>
                        <div className='text-white text-center px-2 w-1/2'>
                          {info.合理價 !== 0 && <p className='text-[18px] font-extrabold text-slate-200'>合理價: {info.合理價}</p>}
                          {info.長期評價 !== '' && <p className='text-[16px] font-extrabold text-slate-200'>長期評價: {info.長期評價}</p>}                          
                        </div>
                      </div>
                    </div>
                    <img src={`data:image/jpeg;base64,${imageUrl}`} alt="Description" className='w-full h-[300px]' />
                  </>
                )}
                {status === 'loading' && <div className='flex justify-center mt-10'><Loading></Loading></div>}
                {status === 'failed' && <p className='text-white'>Error: {error}</p>}
                {!username && <p className='text-white text-center text-[30px] mt-20'>付費解鎖AI診斷+虛擬金功能</p>}
              </div>
              <div className="text-white">
                {/* 右下区块 */}
                {username && isWithinTime ? (
                  <div className='py-2'>
                    <h1 className='w-full mb-4 text-center bg-slate-800 border border-slate-400 p-1 rounded-md shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-20 relative' style={{ boxShadow: '0 0 10px 5px rgba(255, 0, 0, 0.5)' }}>
                      可用資產：{assets} <span className='ml-8'>限價:{info.現價}</span>
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
                      className='bg-black p-1 w-[60px] ml-1'
                    />
                    <button
                      onClick={handleBuy}
                      className='mx-10 px-4 rounded-full hover:bg-white hover:text-emerald-800 bg-emerald-600 text-white py-2 transition-colors duration-300'>
                      買
                    </button>
                    <button
                      onClick={handleSell}
                      className='px-4 rounded-full hover:bg-white hover:text-red-500 bg-red-500 text-white py-2 transition-colors duration-300'>
                      賣
                    </button>
                  </div>
                ) : (
                  <>
                    {username ? <p className='text-center mt-4 text-[18px] font-semibold'>未開盤</p> :
                      <div className=' bg-slate-950 h-[115px] flex justify-center'>
                        <img
                          src="https://photo.16pic.com/00/88/39/16pic_8839292_b.png"
                          className="mt-6 w-[50px] h-[50px]"
                        />

                      </div>}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </AnimatedComponent >
    </>
  );
};

export default TradeArea;
