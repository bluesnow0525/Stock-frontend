import React from 'react';

interface Evaluation {
  low: number;
  high: number;
}

const Thermometer: React.FC<{ label: string; evaluation: Evaluation; recentPrice: number }> = ({
  label,
  evaluation,
  recentPrice,
}) => {
  const sortedValues = [0, evaluation.low, recentPrice, evaluation.high].sort((a, b) => a - b);

  const calculateWidth = (value: number) => {
    const minValue = 0; // 最左边为 0
    const maxValue = sortedValues[sortedValues.length - 1]; // 最大值
    return ((value - minValue) / (maxValue - minValue)) * 100;
  };

  const getColor = () => {
    if (recentPrice < evaluation.low) {
      return 'bg-green-400';
    } else if (recentPrice > evaluation.high) {
      return 'bg-red-400';
    } else {
      return 'bg-green-400';
    }
  };

  const isOverlap = (val1: number, val2: number) => {
    return Math.abs(calculateWidth(val1) - calculateWidth(val2)) < 5;
  };

  const getOffsetClass = (val1: number, val2: number) => {
    return isOverlap(val1, val2) ? 'translate-y-3' : '';
  };

  return (
    <div className="">
      <div className="relative w-[70%] mx-auto">
        {/* 数字显示 */}
        <div
          className={`absolute top-0 left-0 transform -translate-y-5 text-xs text-red-500`}
          style={{ left: `${calculateWidth(0)}%`, transform: 'translateX(-50%)' }}
        >
        </div>
        <div
          className={`absolute top-0 transform -translate-y-5 text-xs text-red-500 ${getOffsetClass(evaluation.low, recentPrice)}`}
          style={{ left: `${calculateWidth(evaluation.low)}%`, transform: 'translateX(-50%)' }}
        >
          {evaluation.low}
        </div>
        
        <div
          className={`absolute top-0 right-0 transform -translate-y-5 text-xs text-red-500 ${getOffsetClass(evaluation.high, recentPrice)}`}
          style={{ left: `${calculateWidth(evaluation.high)}%`, transform: 'translateX(-50%)' }}
        >
          {evaluation.high}
        </div>
        {/* 温度计 */}
        <div className="relative top-4 w-full h-3">
          <div className="absolute inset-y-0 left-0 w-full bg-gray-300 rounded-full"></div>
          <div
            className="absolute inset-y-0 left-0 h-full border-b-4 border-b-yellow-300 opacity-100 z-5"
            style={{
              left: `${calculateWidth(evaluation.low)}%`,
              width: `${calculateWidth(evaluation.high) - calculateWidth(evaluation.low)}%`,
            }}
          ></div>
          <div
            className={`absolute inset-y-0 left-0 h-full rounded-full ${getColor()}`}
            style={{ width: `${calculateWidth(recentPrice)}%` }}
          ></div>
        </div>
        <div
          className={`absolute top-7 transform text-xs text-green-500 ${getOffsetClass(recentPrice, evaluation.low)} ${getOffsetClass(recentPrice, evaluation.high)}`}
          style={{ left: `${calculateWidth(recentPrice)}%`, transform: 'translateX(-50%)' }}
        >
          {recentPrice}
        </div>
      </div>
      <p className="text-xs text-slate-200 mt-7 text-center">{label}</p>
    </div>
  );
};

export default Thermometer;
