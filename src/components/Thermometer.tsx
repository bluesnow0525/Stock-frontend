import React from "react";

interface Evaluation {
  low: number;
  high: number;
}

const Thermometer: React.FC<{
  label: string;
  evaluation: Evaluation;
  recentPrice: number;
}> = ({ label, evaluation, recentPrice }) => {
  const sortedValues = [0, evaluation.low, recentPrice, evaluation.high].sort(
    (a, b) => a - b
  );

  const calculateWidth = (value: number) => {
    const minValue = 0; // 最左边为 0
    const maxValue = sortedValues[sortedValues.length - 1]; // 最大值
    return ((value - minValue) / (maxValue - minValue)) * 100;
  };

  const getOffsetClass = (val1: number, val2: number) => {
    return Math.abs(calculateWidth(val1) - calculateWidth(val2)) < 5
      ? "translate-y-3"
      : "";
  };

  return (
    <div className="h-full w-full">
      <p className="text-xs text-slate-200 mt-8 text-center">{label}</p>
      <div className="relative w-[70%] mx-auto">
        {/* 数字显示 */}
        <div
          className={`absolute top-0 transform -translate-y-5 text-xs text-red-500 ${getOffsetClass(
            evaluation.low,
            recentPrice
          )}`}
          style={{
            left: `${calculateWidth(evaluation.low)}%`,
            transform: "translateX(-50%)",
          }}
        >
          {evaluation.low}
        </div>
        <div
          className={`absolute top-0 transform -translate-y-5 text-xs text-red-500 ${getOffsetClass(
            evaluation.high,
            recentPrice
          )}`}
          style={{
            left: `${calculateWidth(evaluation.high)}%`,
            transform: "translateX(-50%)",
          }}
        >
          {evaluation.high}
        </div>
        {/* 温度计 */}
        <div className="relative top-4 w-full h-3">
          {/* 0 到 evaluation.low 的区间（绿色） */}
          <div
            className="absolute inset-y-0 left-0 h-full bg-green-400 z-10"
            style={{
              width: `${calculateWidth(evaluation.low)}%`,
              borderTopLeftRadius: "9999px",
              borderBottomLeftRadius: "9999px",
            }}
          ></div>
          {/* evaluation.low 到 evaluation.high 的区间（黄色） */}
          <div
            className="absolute inset-y-0 left-0 h-full bg-yellow-300 z-10"
            style={{
              left: `${calculateWidth(evaluation.low)}%`,
              width: `${
                calculateWidth(evaluation.high) - calculateWidth(evaluation.low)
              }%`,
              borderTopRightRadius:
                recentPrice < evaluation.high ? "9999px" : "0",
              borderBottomRightRadius:
                recentPrice < evaluation.high ? "9999px" : "0",
            }}
          ></div>
          {/* evaluation.high 以上的区间（红色） */}
          {recentPrice > evaluation.high && (
            <div
              className="absolute inset-y-0 left-0 h-full bg-red-400 z-0"
              style={{
                left: `${calculateWidth(evaluation.high)}%`,
                width: `${
                  calculateWidth(recentPrice) - calculateWidth(evaluation.high)
                }%`,
                borderTopRightRadius: "9999px",
                borderBottomRightRadius: "9999px",
              }}
            ></div>
          )}
        </div>
        {/* recentPrice 标记 */}
        <div
          className="absolute top-4 h-3 w-3 bg-white rounded-full border border-gray-700 z-20"
          style={{
            left: `${calculateWidth(recentPrice)}%`,
            transform: "translateX(-50%)",
          }}
        ></div>
        {/* recentPrice 数字显示 */}
        <div
          className={`absolute top-7 transform text-xs text-green-500 z-20 ${getOffsetClass(
            recentPrice,
            evaluation.low
          )} ${getOffsetClass(recentPrice, evaluation.high)}`}
          style={{
            left: `${calculateWidth(recentPrice)}%`,
            transform: "translateX(-50%)",
          }}
        >
          {recentPrice}
        </div>
      </div>
    </div>
  );
};

export default Thermometer;
