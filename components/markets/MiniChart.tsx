"use client";

import { useMemo } from "react";

export const MiniChart = ({ isPositive }: { isPositive: boolean }) => {
  const color = isPositive ? "#10b981" : "#f43f5e";

  const points = useMemo(() => {
    let data = [50];
    for (let i = 0; i < 10; i++) {
      const change = (Math.random() - 0.5) * 20;
      data.push(data[data.length - 1] + change);
    }
    if (isPositive && data[data.length - 1] < data[0]) {
      data[data.length - 1] = data[0] + 20;
    } else if (!isPositive && data[data.length - 1] > data[0]) {
      data[data.length - 1] = data[0] - 20;
    }

    const min = Math.min(...data);
    const max = Math.max(...data);
    return data
      .map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((d - min) / (max - min)) * 100;
        return `${x},${y}`;
      })
      .join(" ");
  }, [isPositive]);

  return (
    <div className="w-24 h-10 overflow-hidden opacity-80">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="3"
          points={points}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
