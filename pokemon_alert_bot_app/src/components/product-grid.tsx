"use client";

import { useState } from "react";
import { ProductCard, ProductCardSkeleton } from "./product-card";

interface Product {
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
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onCreateAlert?: (productId: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
  showAlertButtons?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function ProductGrid({
  products,
  loading = false,
  onCreateAlert,
  onLoadMore,
  hasMore = false,
  loadingMore = false,
  showAlertButtons = true,
  emptyMessage = "No products found",
  className = ""
}: ProductGridProps) {
  
  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {[...Array(12)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">📦</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Products</h3>
          <p className="text-gray-600">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onCreateAlert={onCreateAlert}
            showAlertButton={showAlertButtons}
          />
        ))}
        
        {/* Loading more cards */}
        {loadingMore && (
          [...Array(4)].map((_, i) => (
            <ProductCardSkeleton key={`loading-${i}`} />
          ))
        )}
      </div>

      {/* Load More Button */}
      {hasMore && onLoadMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loadingMore ? "Loading..." : "Load More Products"}
          </button>
        </div>
      )}
    </div>
  );
}

// Compact grid for smaller spaces
export function CompactProductGrid({
  products,
  loading = false,
  onCreateAlert,
  showAlertButtons = true,
  maxItems = 8,
  className = ""
}: Omit<ProductGridProps, 'hasMore' | 'onLoadMore' | 'loadingMore'> & { maxItems?: number }) {
  
  const displayProducts = products.slice(0, maxItems);

  if (loading) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
        {[...Array(maxItems)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (displayProducts.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-600">No products found</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {displayProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onCreateAlert={onCreateAlert}
          showAlertButton={showAlertButtons}
          className="text-sm"
        />
      ))}
    </div>
  );
}