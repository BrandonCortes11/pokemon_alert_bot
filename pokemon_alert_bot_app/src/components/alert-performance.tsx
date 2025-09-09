"use client";

import { useState } from "react";
import { api } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SimpleBarChart, TrendIndicator } from "@/components/charts";
import { Calendar, TrendingUp, Target, Zap, Clock, Award } from "lucide-react";

export function AlertPerformance() {
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(7);
  
  const { data: analytics, isLoading } = api.dashboard.getAnalytics.useQuery({ 
    days: timeRange 
  });

  const { data: trends } = api.dashboard.getTrends.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-32 bg-gray-100 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const performanceMetrics = [
    {
      label: "Success Rate",
      value: analytics?.summary.totalTriggers ? 
        `${Math.round((analytics.summary.totalTriggers / (analytics.triggerHistory.length || 1)) * 100)}%` : "0%",
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50 border-green-200"
    },
    {
      label: "Avg Response Time",
      value: "< 1min",
      icon: Clock,
      color: "text-blue-600", 
      bgColor: "bg-blue-50 border-blue-200"
    },
    {
      label: "Peak Performance",
      value: analytics?.summary.mostActiveHour !== undefined ? 
        `${analytics.summary.mostActiveHour}:00` : "N/A",
      icon: Zap,
      color: "text-purple-600",
      bgColor: "bg-purple-50 border-purple-200"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Performance Period</span>
          </div>
          <div className="flex space-x-1">
            {[7, 30, 90].map((days) => (
              <Button
                key={days}
                variant={timeRange === days ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(days as 7 | 30 | 90)}
              >
                {days} days
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {performanceMetrics.map((metric, index) => (
          <Card key={index} className={`p-4 border ${metric.bgColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{metric.label}</p>
                <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
              </div>
              <metric.icon className={`h-8 w-8 ${metric.color}`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Alert Trigger Trends */}
      {trends && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TrendIndicator
            value={trends.triggers.thisWeek}
            percentChange={trends.triggers.percentChange}
            label="Alert Triggers This Week"
            className="h-full"
          />
          <TrendIndicator
            value={trends.newAlerts}
            percentChange="0"
            label="New Alerts Created"
            className="h-full"
          />
        </div>
      )}

      {/* Top Performing Alerts */}
      {analytics?.topAlerts && analytics.topAlerts.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="h-5 w-5 text-yellow-600" />
            <h3 className="text-lg font-medium text-gray-900">Top Performing Alerts</h3>
          </div>
          
          <div className="space-y-4">
            {analytics.topAlerts.slice(0, 5).map((alert, index) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium">
                      #{index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{alert.name}</p>
                    <p className="text-xs text-gray-600">
                      {alert.productName} • {alert.storeName}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant={alert.isActive ? "default" : "secondary"} className="text-xs">
                    {alert.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{alert.triggerCount}</p>
                    <p className="text-xs text-gray-500">triggers</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Performance Analytics Chart */}
      {analytics?.triggerHistory && analytics.triggerHistory.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-medium text-gray-900">Alert Performance Analytics</h3>
          </div>
          
          <SimpleBarChart 
            title="Trigger Count by Alert"
            data={analytics.triggerHistory.slice(0, 8).map(alert => ({
              label: alert.name.length > 20 ? alert.name.substring(0, 20) + "..." : alert.name,
              value: alert.triggerCount,
              color: "bg-indigo-500"
            }))}
          />
        </Card>
      )}

      {/* Performance Summary Stats */}
      {analytics?.summary && (
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{analytics.summary.totalTriggers}</p>
              <p className="text-sm text-blue-600">Total Triggers</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {analytics.summary.avgTriggersPerAlert.toFixed(1)}
              </p>
              <p className="text-sm text-green-600">Avg per Alert</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{timeRange}</p>
              <p className="text-sm text-purple-600">Days Analyzed</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}