"use client";

import { useMemo } from "react";

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface SimpleBarChartProps {
  data: BarChartData[];
  title?: string;
  className?: string;
}

const defaultColors = [
  "bg-blue-500",
  "bg-green-500", 
  "bg-purple-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-gray-500"
];

export function SimpleBarChart({ data, title, className = "" }: SimpleBarChartProps) {
  const maxValue = useMemo(() => Math.max(...data.map(d => d.value)), [data]);

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      )}
      
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          const colorClass = item.color || defaultColors[index % defaultColors.length];
          
          return (
            <div key={item.label} className="flex items-center space-x-3">
              <div className="w-24 text-sm text-gray-700 truncate" title={item.label}>
                {item.label}
              </div>
              
              <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                <div
                  className={`h-full ${colorClass} transition-all duration-500 ease-out flex items-center justify-end pr-2`}
                  style={{ width: `${Math.max(percentage, 2)}%` }}
                >
                  {item.value > 0 && (
                    <span className="text-white text-xs font-medium">
                      {item.value}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No data available</p>
        </div>
      )}
    </div>
  );
}