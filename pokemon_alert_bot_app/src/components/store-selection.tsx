"use client";

import { api } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, Store } from "lucide-react";

interface StoreSelectionProps {
  selectedStoreId?: string;
  onStoreSelect: (storeId: string, storeName: string) => void;
  className?: string;
}

export function StoreSelection({ selectedStoreId, onStoreSelect, className = "" }: StoreSelectionProps) {
  const { data: stores, isLoading } = api.stores.getWithStats.useQuery();

  const getStatusIcon = (isActive: boolean, productCount: number) => {
    if (!isActive) return <Clock className="h-5 w-5 text-yellow-500" />;
    if (productCount === 0) return <AlertCircle className="h-5 w-5 text-red-500" />;
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  };

  const getStatusBadge = (isActive: boolean, productCount: number) => {
    if (!isActive) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Coming Soon</Badge>;
    }
    if (productCount === 0) {
      return <Badge variant="destructive">No Products</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Active</Badge>;
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg" />
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-48 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-24" />
              </div>
              <div className="w-20 h-6 bg-gray-200 rounded-full" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!stores || stores.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No stores available</h3>
        <p className="text-gray-600">Please check back later for store availability.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Choose a Store</h2>
        <p className="text-gray-600">Select the store you want to monitor for Pokemon products.</p>
      </div>

      {stores.map((store) => (
        <Card
          key={store.id}
          className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedStoreId === store.id
              ? "ring-2 ring-indigo-500 bg-indigo-50 border-indigo-200"
              : "hover:border-gray-300"
          } ${
            !store.isActive || store.stats.totalProducts === 0
              ? "opacity-75"
              : ""
          }`}
          onClick={() => {
            if (store.isActive && store.stats.totalProducts > 0) {
              onStoreSelect(store.id, store.displayName);
            }
          }}
        >
          <div className="flex items-center space-x-4">
            {/* Store Logo/Icon */}
            <div className="flex-shrink-0">
              {store.logoUrl ? (
                <img
                  src={store.logoUrl}
                  alt={`${store.displayName} logo`}
                  className="w-16 h-16 rounded-lg object-contain bg-white border"
                  onError={(e) => {
                    // Fallback to icon if logo fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Store className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div className="hidden w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <Store className="h-8 w-8 text-gray-400" />
              </div>
            </div>

            {/* Store Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {store.displayName}
                </h3>
                {getStatusIcon(store.isActive, store.stats.totalProducts)}
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center space-x-4">
                  <span>{store.stats.totalProducts} products</span>
                  {store.stats.inStockProducts > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-green-600 font-medium">
                        {store.stats.inStockProducts} in stock
                      </span>
                    </>
                  )}
                </div>
                
                {store.stats.productsWithAlerts > 0 && (
                  <div className="text-indigo-600">
                    {store.stats.productsWithAlerts} products with active alerts
                  </div>
                )}
                
                {store.stats.recentChecks > 0 && (
                  <div className="text-gray-500 text-xs">
                    {store.stats.recentChecks} checks in last 24h
                  </div>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex-shrink-0">
              {getStatusBadge(store.isActive, store.stats.totalProducts)}
            </div>

            {/* Selected Indicator */}
            {selectedStoreId === store.id && (
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </div>
            )}
          </div>

          {/* Additional Info for Inactive Stores */}
          {!store.isActive && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                {store.displayName} monitoring is coming soon. We'll notify you when it's available!
              </p>
            </div>
          )}

          {/* No Products Warning */}
          {store.isActive && store.stats.totalProducts === 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-orange-600">
                No products available for monitoring yet. Our system is working to add products from this store.
              </p>
            </div>
          )}
        </Card>
      ))}

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          </div>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Getting Started</p>
            <p>
              Select Pokemon Center to browse from hundreds of available products. 
              More stores like Best Buy, Target, and Walmart are coming soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}