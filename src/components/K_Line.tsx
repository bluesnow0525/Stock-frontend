import React, { useRef, useEffect } from "react";
import { createChart, IChartApi, ISeriesApi } from "lightweight-charts";
import Loading from "./Loading";

interface StockData {
  time: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

interface CandlestickChartProps {
  stockPrices: StockData[];
  pricesStatus: "idle" | "loading" | "succeeded" | "failed";
  id: string;
  stockName: string;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({
  stockPrices,
  pricesStatus,
  id,
  stockName,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  let chart: IChartApi | null = null;
  let candleSeries: ISeriesApi<"Candlestick"> | null = null;

  useEffect(() => {
    const getChartHeight = () => {
      if (window.innerWidth > 1536) {
        // Tailwind 的 3xl 断点是 1536px
        return 800;
      }
      return 370;
    };

    if (
      pricesStatus === "succeeded" &&
      stockPrices &&
      chartContainerRef.current
    ) {
      chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: getChartHeight(),
        layout: {
          background: { color: "rgba(0, 0, 0, 0.3)" },
          textColor: "#d1d4dc",
        },
        grid: {
          vertLines: { color: "#2B2B43" },
          horzLines: { color: "#363C4E" },
        },
      });

      candleSeries = chart.addCandlestickSeries({
        upColor: "#FF0000", // 上涨颜色（红色）
        downColor: "#00FF00", // 下跌颜色（绿色）
        borderUpColor: "#FF0000", // 上涨边框颜色（红色）
        borderDownColor: "#00FF00", // 下跌边框颜色（绿色）
        wickUpColor: "#FF0000", // 上涨蜡烛芯颜色（红色）
        wickDownColor: "#00FF00", // 下跌蜡烛芯颜色（绿色）
      });

      const pricesCopy = [...stockPrices];
      const uniqueSortedPrices = pricesCopy
        .sort((a, b) => a.time.localeCompare(b.time))
        .filter((v, i, a) => !i || v.time !== a[i - 1].time);

      candleSeries.setData(
        uniqueSortedPrices.map((item: StockData) => ({
          time: item.time,
          open: parseFloat(item.open),
          high: parseFloat(item.high),
          low: parseFloat(item.low),
          close: parseFloat(item.close),
        }))
      );

      const resizeChart = () => {
        if (chartContainerRef.current && chart) {
          const parentNode = chartContainerRef.current
            .parentNode as HTMLDivElement;
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

      window.addEventListener("resize", resizeChart);

      return () => {
        if (chart) {
          chart.remove();
          window.removeEventListener("resize", resizeChart);
        }
      };
    }
  }, [stockPrices, pricesStatus, chartContainerRef]);

  return (
    <div className="w-full">
      <div className="bg-gray-800 text-white py-2 w-full">
        <span className="text-left ml-1">{id}</span>
        <span className="px-5">{stockName}</span>
        日K線圖
      </div>
      <div ref={chartContainerRef} className="" />
      {pricesStatus === "loading" && (
        <div className="flex justify-center mt-20">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default CandlestickChart;
