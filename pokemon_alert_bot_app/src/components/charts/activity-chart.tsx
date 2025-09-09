"use client";

import { useMemo } from "react";

interface ActivityChartProps {
  data: Array<{
    hour: number;
    count: number;
  }>;
  className?: string;
}

export function ActivityChart({ data, className = "" }: ActivityChartProps) {
  const maxCount = useMemo(() => Math.max(...data.map(d => d.count)), [data]);
  
  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-end h-32 space-x-1">
        {data.map(({ hour, count }) => {
          const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
          
          return (
            <div key={hour} className="flex-1 flex flex-col items-center group">
              <div
                className="bg-indigo-500 hover:bg-indigo-600 transition-colors rounded-t-sm w-full min-h-[2px] relative"
                style={{ height: `${Math.max(height, 1.5)}%` }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {count} checks
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-top-left w-8">
                {hour % 4 === 0 ? formatHour(hour) : ""}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">Activity by Hour (24-hour period)</p>
      </div>
    </div>
  );
}