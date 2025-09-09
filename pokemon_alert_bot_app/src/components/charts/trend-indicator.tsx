"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TrendIndicatorProps {
  value: number;
  percentChange: string;
  label: string;
  className?: string;
}

export function TrendIndicator({ value, percentChange, label, className = "" }: TrendIndicatorProps) {
  const changeValue = parseFloat(percentChange);
  const isPositive = changeValue > 0;
  const isNegative = changeValue < 0;
  const isNeutral = changeValue === 0;

  const getTrendColor = () => {
    if (isPositive) return "text-green-600";
    if (isNegative) return "text-red-600";
    return "text-gray-600";
  };

  const getTrendBg = () => {
    if (isPositive) return "bg-green-50 border-green-200";
    if (isNegative) return "bg-red-50 border-red-200";
    return "bg-gray-50 border-gray-200";
  };

  const TrendIcon = () => {
    if (isPositive) return <TrendingUp className="h-4 w-4" />;
    if (isNegative) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  return (
    <div className={`p-4 rounded-lg border ${getTrendBg()} ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
        <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
          <TrendIcon />
          <span className="font-medium">
            {isPositive && "+"}
            {percentChange}%
          </span>
        </div>
      </div>
    </div>
  );
}