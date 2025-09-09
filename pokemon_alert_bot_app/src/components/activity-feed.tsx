"use client";

import { useState } from "react";
import { api } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, TrendingUp, TrendingDown, AlertCircle, Check } from "lucide-react";

interface ActivityFeedProps {
  className?: string;
}

export function ActivityFeed({ className = "" }: ActivityFeedProps) {
  const [limit, setLimit] = useState(10);
  
  const { data: activityData, isLoading, refetch, fetchNextPage, hasNextPage } = 
    api.dashboard.getActivityFeed.useInfiniteQuery(
      { limit },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const allActivities = activityData?.pages.flatMap(page => page.activities) ?? [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'IN_STOCK':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'OUT_OF_STOCK':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'LIMITED_STOCK':
        return <TrendingDown className="h-4 w-4 text-yellow-600" />;
      case 'PREORDER':
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'IN_STOCK':
        return "bg-green-100 text-green-800 border-green-200";
      case 'OUT_OF_STOCK':
        return "bg-red-100 text-red-800 border-red-200";
      case 'LIMITED_STOCK':
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 'PREORDER':
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatPrice = (price: number | null) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (isLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Live Activity Feed</h3>
          <div className="animate-spin">
            <RefreshCw className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-4 h-4 bg-gray-300 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Live Activity Feed</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {allActivities.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No recent activity to display</p>
          <p className="text-sm text-gray-500 mt-1">Stock checks will appear here as they happen</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allActivities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-shrink-0">
                {getStatusIcon(activity.status)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.product.name}
                  </p>
                  <Badge className={`text-xs ${getStatusBadgeColor(activity.status)}`}>
                    {activity.status.replace('_', ' ')}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-xs text-gray-600">{activity.product.store}</p>
                  {activity.price && (
                    <>
                      <span className="text-xs text-gray-400">•</span>
                      <p className="text-xs font-medium text-gray-700">
                        {formatPrice(activity.price)}
                      </p>
                    </>
                  )}
                  <span className="text-xs text-gray-400">•</span>
                  <p className="text-xs text-gray-500">
                    {formatRelativeTime(new Date(activity.timestamp))}
                  </p>
                </div>

                {activity.alerts.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {activity.alerts.slice(0, 2).map((alert) => (
                      <span key={alert.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-700">
                        {alert.name}
                      </span>
                    ))}
                    {activity.alerts.length > 2 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                        +{activity.alerts.length - 2} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {hasNextPage && (
            <div className="text-center pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchNextPage()}
                disabled={isLoading}
              >
                Load More Activity
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}