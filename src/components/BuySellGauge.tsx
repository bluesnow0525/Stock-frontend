import React from 'react';

interface BuySellGaugeProps {
  score: number;
}

const BuySellGauge: React.FC<BuySellGaugeProps> = ({ score }) => {
  const rotation = (score / 100) * 180 - 90; // 将0-100的分数转换为-90到90度的旋转

  return (
    <div className="relative w-32 h-24">
      {/* 半圆背景 */}
      <div className="top-0 left-0 w-full h-full flex justify-center items-center">
        <div className="relative w-full h-full">
          <svg className="top-0 left-0 w-full h-full">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="100%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'green', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: 'gray', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'red', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path id="arc" d="M 7 95 A 55 55 0 0 1 120 95" stroke="url(#grad1)" strokeWidth="10" fill="none" />
            <text fontSize="12" fill="white">
              <textPath href="#arc" startOffset="0%">超鳥</textPath>
              <textPath href="#arc" startOffset="25%">弱</textPath>
              <textPath href="#arc" startOffset="50%" textAnchor="middle">持平</textPath>
              <textPath href="#arc" startOffset="75%" textAnchor="end">強</textPath>
              <textPath href="#arc" startOffset="100%" textAnchor="end">超屌</textPath>
            </text>
          </svg>
        </div>
      </div>
      {/* 指针 */}
      <div className="absolute inset-0 flex justify-center items-end">
        <div className="relative flex flex-col items-center">
          <div
            className="w-0.5 h-10 bg-white transform origin-bottom"
            style={{ transform: `rotate(${rotation}deg)` }}
          />
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default BuySellGauge;
