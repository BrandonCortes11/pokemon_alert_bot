"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StoresBreadcrumbs } from "@/components/breadcrumbs";
import { 
  Store, 
  ExternalLink, 
  Package, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function StoresPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Get stores with statistics
  const { data: stores = [], isLoading } = api.stores.getWithStats.useQuery();

  // Map store names to route paths
  const getStoreBrowsePath = (storeName: string) => {
    const routeMap: Record<string, string> = {
      'pokemon_center': 'pokemon-center',
      'best_buy': 'best-buy',
      'target': 'target',
      'walmart': 'walmart'
    };
    return `/dashboard/stores/${routeMap[storeName] || storeName}/browse`;
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const getStoreStatusInfo = (store: any) => {
    if (!store.isActive) {
      return {
        icon: <Clock className="h-5 w-5 text-yellow-500" />,
        badge: <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Coming Soon</Badge>,
        description: "Store monitoring is coming soon"
      };
    }
    
    if (store.stats.totalProducts === 0) {
      return {
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        badge: <Badge variant="destructive">No Products</Badge>,
        description: "No products available for monitoring yet"
      };
    }

    return {
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      badge: <Badge className="bg-green-100 text-green-800">Active</Badge>,
      description: `${store.stats.totalProducts} products available`
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumbs */}
        <div className="mb-6">
          <StoresBreadcrumbs />
        </div>
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Store className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Browse Stores</h1>
              <p className="text-gray-600">Select a store to browse products and create alerts</p>
            </div>
          </div>
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => {
            const statusInfo = getStoreStatusInfo(store);
            const canBrowse = store.isActive && store.stats.totalProducts > 0;

            return (
              <Card key={store.id} className="p-6 hover:shadow-lg transition-all duration-200">
                <div className="space-y-4">
                  {/* Store Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {store.logoUrl ? (
                        <img
                          src={store.logoUrl}
                          alt={`${store.displayName} logo`}
                          className="w-12 h-12 rounded-lg object-contain bg-white border"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Store className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div className="hidden w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Store className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {store.displayName}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {statusInfo.icon}
                          {statusInfo.badge}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Store Stats */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Products</span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {store.stats.totalProducts.toLocaleString()}
                      </span>
                    </div>

                    {store.stats.inStockProducts > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-gray-600">In Stock</span>
                        </div>
                        <span className="font-medium text-green-600">
                          {store.stats.inStockProducts.toLocaleString()}
                        </span>
                      </div>
                    )}

                    {store.stats.productsWithAlerts > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-indigo-500" />
                          <span className="text-gray-600">With Alerts</span>
                        </div>
                        <span className="font-medium text-indigo-600">
                          {store.stats.productsWithAlerts.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600">
                    {statusInfo.description}
                  </p>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    {canBrowse ? (
                      <Button asChild className="flex-1">
                        <Link href={getStoreBrowsePath(store.name)}>
                          <Package className="h-4 w-4 mr-2" />
                          Browse Products
                        </Link>
                      </Button>
                    ) : (
                      <Button disabled className="flex-1">
                        <Package className="h-4 w-4 mr-2" />
                        {store.isActive ? "No Products" : "Coming Soon"}
                      </Button>
                    )}

                    <Button variant="outline" size="sm" asChild>
                      <Link href={store.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  {/* Additional Info for Inactive/Empty Stores */}
                  {!store.isActive && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        {store.displayName} monitoring is coming soon. We'll notify you when it's available!
                      </p>
                    </div>
                  )}

                  {store.isActive && store.stats.totalProducts === 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-orange-600">
                        Our system is working to add products from this store. Check back soon!
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="mt-12">
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">💡</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-900 mb-2">
                  How to Get Started
                </h3>
                <div className="text-sm text-blue-800 space-y-2">
                  <p>
                    <strong>1. Browse Products:</strong> Click "Browse Products" on any active store to discover available items.
                  </p>
                  <p>
                    <strong>2. Create Alerts:</strong> Found something interesting? Click "Create Alert" on any product card.
                  </p>
                  <p>
                    <strong>3. Get Notified:</strong> We'll monitor the product and notify you when it matches your alert conditions.
                  </p>
                </div>
                <div className="mt-4">
                  <Link href="/dashboard/alerts/new">
                    <Button size="sm">
                      Get Started - Create Your First Alert
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}