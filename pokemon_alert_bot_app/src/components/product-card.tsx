"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, Bell, ExternalLink } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    url: string;
    imageUrl?: string | null;
    category: string;
    store: {
      id: string;
      name: string;
      displayName: string;
    };
    latestStock?: {
      status: string;
      price: number | null;
      timestamp: Date;
    } | null;
  };
  onCreateAlert?: (productId: string) => void;
  showAlertButton?: boolean;
  className?: string;
}

export function ProductCard({ 
  product, 
  onCreateAlert, 
  showAlertButton = true,
  className = "" 
}: ProductCardProps) {
  const router = useRouter();
  const [isCreatingAlert, setIsCreatingAlert] = useState(false);

  const getStockStatusInfo = (status?: string) => {
    switch (status) {
      case 'IN_STOCK':
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          badge: <Badge className="bg-green-100 text-green-800">In Stock</Badge>,
          color: 'text-green-600'
        };
      case 'OUT_OF_STOCK':
        return {
          icon: <AlertCircle className="h-4 w-4 text-red-500" />,
          badge: <Badge variant="destructive">Out of Stock</Badge>,
          color: 'text-red-600'
        };
      case 'PREORDER':
        return {
          icon: <Clock className="h-4 w-4 text-yellow-500" />,
          badge: <Badge className="bg-yellow-100 text-yellow-800">Pre-order</Badge>,
          color: 'text-yellow-600'
        };
      case 'LIMITED_STOCK':
        return {
          icon: <AlertCircle className="h-4 w-4 text-orange-500" />,
          badge: <Badge className="bg-orange-100 text-orange-800">Limited Stock</Badge>,
          color: 'text-orange-600'
        };
      default:
        return {
          icon: <Clock className="h-4 w-4 text-gray-500" />,
          badge: <Badge variant="secondary">Unknown</Badge>,
          color: 'text-gray-600'
        };
    }
  };

  const handleCreateAlert = async () => {
    if (onCreateAlert) {
      setIsCreatingAlert(true);
      try {
        await onCreateAlert(product.id);
      } finally {
        setIsCreatingAlert(false);
      }
    } else {
      // Navigate to alert creation with product pre-selected
      router.push(`/dashboard/alerts/new?productId=${product.id}`);
    }
  };

  const stockInfo = getStockStatusInfo(product.latestStock?.status);

  return (
    <Card className={`p-4 hover:shadow-lg transition-all duration-200 ${className}`}>
      <div className="space-y-4">
        {/* Product Image */}
        <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=${encodeURIComponent(product.name.substring(0, 20))}`;
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📦</span>
                </div>
                <span className="text-sm">No Image</span>
              </div>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
          </div>

          {/* Stock Status */}
          <div className="absolute top-2 right-2">
            {stockInfo.badge}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <h3 className="font-medium text-sm line-clamp-2 leading-tight" title={product.name}>
            {product.name}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {stockInfo.icon}
              {product.latestStock?.price && (
                <span className="font-semibold text-gray-900">
                  ${product.latestStock.price.toFixed(2)}
                </span>
              )}
            </div>

            <div className="text-xs text-gray-500">
              {product.store.displayName}
            </div>
          </div>

          {/* Last Updated */}
          {product.latestStock?.timestamp && (
            <div className="text-xs text-gray-500">
              Updated {new Date(product.latestStock.timestamp).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          {showAlertButton && (
            <Button
              size="sm"
              onClick={handleCreateAlert}
              disabled={isCreatingAlert}
              className="flex-1"
            >
              <Bell className="h-4 w-4 mr-2" />
              {isCreatingAlert ? "Creating..." : "Create Alert"}
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            asChild
            className={showAlertButton ? "" : "flex-1"}
          >
            <Link href={product.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

// Loading skeleton for product cards
export function ProductCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-4">
        {/* Image skeleton */}
        <div className="aspect-square rounded-lg bg-gray-200 animate-pulse" />

        {/* Content skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
          
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
          </div>

          <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
        </div>

        {/* Buttons skeleton */}
        <div className="flex space-x-2">
          <div className="h-8 bg-gray-200 rounded flex-1 animate-pulse" />
          <div className="h-8 bg-gray-200 rounded w-20 animate-pulse" />
        </div>
      </div>
    </Card>
  );
}