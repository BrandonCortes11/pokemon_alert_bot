"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/trpc";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertsBreadcrumbs } from "@/components/breadcrumbs";
import { MobileNav, MobileQuickActions } from "@/components/mobile-nav";

export default function AlertsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);

  // Fetch alerts data
  const { data: alerts, isLoading, refetch } = api.alerts.getAll.useQuery(
    undefined,
    { enabled: !!session }
  );

  // Toggle alert mutation
  const toggleAlertMutation = api.alerts.toggle.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // Delete alert mutation
  const deleteAlertMutation = api.alerts.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const handleToggleAlert = (alertId: string) => {
    toggleAlertMutation.mutate({ id: alertId });
  };

  const handleDeleteAlert = (alertId: string) => {
    if (confirm("Are you sure you want to delete this alert?")) {
      deleteAlertMutation.mutate({ id: alertId });
    }
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "IN_STOCK":
        return "text-green-600 bg-green-100";
      case "OUT_OF_STOCK":
        return "text-red-600 bg-red-100";
      case "PREORDER":
        return "text-blue-600 bg-blue-100";
      case "LIMITED_STOCK":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your alerts...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                ← Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Alert Management
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/alerts/new">
                <Button>Create New Alert</Button>
              </Link>
              <span className="text-gray-700">
                Welcome, {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={() => signOut()}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <AlertsBreadcrumbs />
          </div>
          {/* Stats */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {alerts?.filter(a => a.isActive).length || 0}
                  </span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Active Alerts</h3>
                  <p className="text-gray-600">Currently monitoring</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {alerts?.filter(a => a.triggerCount > 0).length || 0}
                  </span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Triggered</h3>
                  <p className="text-gray-600">Have been triggered</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {alerts?.length || 0}
                  </span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Total Alerts</h3>
                  <p className="text-gray-600">All time</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Alerts List */}
          {alerts && alerts.length > 0 ? (
            <div className="space-y-6">
              {alerts.map((alert) => (
                <Card key={alert.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {alert.name}
                        </h3>
                        <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
                          alert.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {alert.isActive ? "Active" : "Paused"}
                        </span>
                      </div>
                      
                      <div className="mt-2 flex items-center text-sm text-gray-600">
                        <span className="mr-4">
                          <strong>{alert.product.store.displayName}</strong> • {alert.product.name}
                        </span>
                        {alert.product.latestStock && (
                          <span className={`px-2 py-1 rounded-full text-xs ${getStockStatusColor(alert.product.latestStock.status)}`}>
                            {alert.product.latestStock.status.replace('_', ' ')}
                            {alert.product.latestStock.price && (
                              <span className="ml-1">${alert.product.latestStock.price}</span>
                            )}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>
                            Conditions: {alert.stockConditions.join(", ")}
                          </span>
                          {alert.priceThreshold && (
                            <span>
                              Price {alert.priceDirection === "BELOW" ? "≤" : "≥"} ${alert.priceThreshold}
                            </span>
                          )}
                        </div>
                        <div className="mt-1">
                          Triggered {alert.triggerCount} times
                          {alert.lastTriggered && (
                            <span className="ml-2">
                              • Last: {new Date(alert.lastTriggered).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleAlert(alert.id)}
                        disabled={toggleAlertMutation.isLoading}
                      >
                        {alert.isActive ? "Pause" : "Activate"}
                      </Button>
                      
                      <Link href={`/dashboard/alerts/${alert.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAlert(alert.id)}
                        disabled={deleteAlertMutation.isLoading}
                        className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <div className="max-w-sm mx-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No alerts yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Create your first alert to start monitoring Pokemon card restocks
                </p>
                <Link href="/dashboard/alerts/new">
                  <Button>Create Your First Alert</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}