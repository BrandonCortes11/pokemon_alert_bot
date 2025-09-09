"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/lib/trpc";
import { useAutoRefresh } from "@/hooks/use-auto-refresh";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Play, Pause } from "lucide-react";
import { ActivityChart, TrendIndicator, SimpleBarChart } from "@/components/charts";
import { ActivityFeed } from "@/components/activity-feed";
import { AlertPerformance } from "@/components/alert-performance";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { MobileNav, MobileQuickActions } from "@/components/mobile-nav";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Fetch dashboard data
  const { data: dashboardStats, isLoading: statsLoading, refetch: refetchStats } = api.dashboard.getStats.useQuery(
    undefined,
    { enabled: !!session }
  );

  const { data: systemHealth, isLoading: healthLoading, refetch: refetchHealth } = api.dashboard.getSystemHealth.useQuery(
    undefined,
    { enabled: !!session }
  );

  const { data: analytics, isLoading: analyticsLoading, refetch: refetchAnalytics } = api.dashboard.getAnalytics.useQuery(
    { days: 7 },
    { enabled: !!session }
  );

  const { data: trends, isLoading: trendsLoading, refetch: refetchTrends } = api.dashboard.getTrends.useQuery(
    undefined,
    { enabled: !!session }
  );

  // Auto-refresh functionality
  const { isEnabled: autoRefreshEnabled, toggleAutoRefresh, lastRefresh } = useAutoRefresh({
    interval: 60000, // 1 minute
    enabled: !!session,
    onRefresh: () => {
      refetchStats();
      refetchHealth();
      refetchAnalytics();
      refetchTrends();
    }
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading" || statsLoading || healthLoading || analyticsLoading || trendsLoading) {
    return <DashboardSkeleton />;
  }

  if (!session) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center py-6 space-y-4 lg:space-y-0">
            <div className="flex items-center">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Pokemon Alert Dashboard
              </h1>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              {/* Auto-refresh controls */}
              <div className="flex items-center space-x-2 text-sm text-gray-600 order-3 sm:order-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleAutoRefresh}
                  className="flex items-center space-x-1"
                >
                  {autoRefreshEnabled ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  <span className="hidden sm:inline">{autoRefreshEnabled ? 'Pause' : 'Resume'}</span>
                </Button>
                <span className="text-xs hidden md:inline">
                  Last updated: {lastRefresh.toLocaleTimeString()}
                </span>
              </div>
              
              <div className="flex items-center space-x-3 order-1 sm:order-2">
                <Link href="/dashboard/alerts" className="hidden md:inline-block">
                  <Button variant="outline" size="sm">
                    Manage Alerts
                  </Button>
                </Link>
                <span className="text-gray-700 text-sm hidden lg:inline">
                  Welcome, {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm font-medium hidden md:block"
                >
                  Sign out
                </button>
                
                {/* Mobile Navigation */}
                <MobileNav />
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Active Alerts Card */}
            <Card className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {dashboardStats?.alerts.active || 0}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Alerts
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Currently monitoring
                    </dd>
                  </dl>
                </div>
              </div>
            </Card>

            {/* Total Alerts Card */}
            <Card className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {dashboardStats?.alerts.total || 0}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Alerts
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      All time created
                    </dd>
                  </dl>
                </div>
              </div>
            </Card>

            {/* Monitored Stores Card */}
            <Card className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {dashboardStats?.products.stores || 0}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Monitored Stores
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Pokemon Center & More
                    </dd>
                  </dl>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <Card className="p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link href="/dashboard/alerts/new">
                  <div className="relative group bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-gray-200 hover:border-indigo-300 cursor-pointer transition-colors">
                    <h4 className="font-semibold text-gray-900">Create New Alert</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Set up custom alerts for your favorite Pokemon cards
                    </p>
                  </div>
                </Link>
                <Link href="/dashboard/stores">
                  <div className="relative group bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-gray-200 hover:border-green-300 cursor-pointer transition-colors">
                    <h4 className="font-semibold text-gray-900">Browse Products</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Discover products from Pokemon Center and other stores
                    </p>
                  </div>
                </Link>
                <Link href="/dashboard/alerts">
                  <div className="relative group bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-gray-200 hover:border-yellow-300 cursor-pointer transition-colors">
                    <h4 className="font-semibold text-gray-900">Manage Alerts</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      View, edit, and manage your existing alerts
                    </p>
                  </div>
                </Link>
                <div className="relative group bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900">System Status</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      systemHealth?.database.status === 'connected' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      Database: {systemHealth?.database.status || 'Unknown'}
                    </span>
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Analytics and Trends */}
          {trends && (
            <div className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <TrendIndicator 
                  value={trends.triggers.thisWeek}
                  percentChange={trends.triggers.percentChange}
                  label="Alert Triggers This Week"
                />
                <TrendIndicator 
                  value={trends.newAlerts}
                  percentChange="0"
                  label="New Alerts Created"
                />
                <TrendIndicator 
                  value={trends.stockActivity.inStock + trends.stockActivity.outOfStock}
                  percentChange="0"
                  label="Stock Checks This Week"
                />
              </div>
            </div>
          )}

          {/* Activity Pattern */}
          {analytics?.hourlyActivity && (
            <div className="mt-8">
              <Card className="p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Activity Patterns (Last 7 Days)
                </h3>
                <ActivityChart data={analytics.hourlyActivity} />
                {analytics.summary.mostActiveHour !== undefined && (
                  <p className="text-sm text-gray-600 mt-4 text-center">
                    Most active hour: {analytics.summary.mostActiveHour}:00
                  </p>
                )}
              </Card>
            </div>
          )}

          {/* Top Performing Alerts */}
          {analytics?.topAlerts && analytics.topAlerts.length > 0 && (
            <div className="mt-8">
              <Card className="p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Top Performing Alerts
                </h3>
                <SimpleBarChart 
                  data={analytics.topAlerts.slice(0, 5).map(alert => ({
                    label: alert.name,
                    value: alert.triggerCount,
                    color: alert.isActive ? "bg-green-500" : "bg-gray-400"
                  }))}
                />
              </Card>
            </div>
          )}

          {/* Insights */}
          {trends?.insights && trends.insights.length > 0 && (
            <div className="mt-8">
              <Card className="p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Insights & Recommendations
                </h3>
                <div className="space-y-3">
                  {trends.insights.map((insight, index) => (
                    <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">{insight}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Alert Performance Metrics */}
          <div className="mt-8">
            <AlertPerformance />
          </div>

          {/* Enhanced Activity Feed */}
          <div className="mt-8">
            <ActivityFeed />
          </div>
        </div>
      </main>

      {/* Mobile Quick Actions */}
      <MobileQuickActions />
    </div>
  );
}