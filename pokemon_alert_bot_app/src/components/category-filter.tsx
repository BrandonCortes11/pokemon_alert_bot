"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";

interface Category {
  name: string;
  count: number;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalProducts?: number;
  loading?: boolean;
  className?: string;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  totalProducts,
  loading = false,
  className = ""
}: CategoryFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleClearFilters = () => {
    onCategoryChange(null);
    onSearchChange("");
  };

  const hasActiveFilters = selectedCategory || searchQuery;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Categories</span>
            {selectedCategory && (
              <Badge variant="secondary" className="ml-2">
                1
              </Badge>
            )}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <X className="h-4 w-4" />
              <span>Clear filters</span>
            </Button>
          )}
        </div>

        {totalProducts !== undefined && (
          <div className="text-sm text-gray-600">
            {loading ? (
              <span>Loading...</span>
            ) : (
              <span>{totalProducts} products</span>
            )}
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedCategory && (
            <Badge 
              variant="secondary" 
              className="flex items-center space-x-1 cursor-pointer hover:bg-gray-200"
              onClick={() => onCategoryChange(null)}
            >
              <span>Category: {selectedCategory}</span>
              <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
          {searchQuery && (
            <Badge 
              variant="secondary" 
              className="flex items-center space-x-1 cursor-pointer hover:bg-gray-200"
              onClick={() => onSearchChange("")}
            >
              <span>Search: "{searchQuery}"</span>
              <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
        </div>
      )}

      {/* Category Filter Dropdown */}
      {isFilterOpen && (
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <h4 className="font-medium text-gray-900 mb-3">Filter by Category</h4>
          
          <div className="space-y-2">
            {/* All Categories Option */}
            <button
              onClick={() => {
                onCategoryChange(null);
                setIsFilterOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                !selectedCategory
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <span>All Categories</span>
              {!selectedCategory && (
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                  Active
                </Badge>
              )}
            </button>

            {/* Individual Categories */}
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => {
                  onCategoryChange(category.name);
                  setIsFilterOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedCategory === category.name
                    ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <span>{category.name}</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {category.count}
                  </Badge>
                  {selectedCategory === category.name && (
                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                      Active
                    </Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Compact horizontal category tabs
export function CategoryTabs({
  categories,
  selectedCategory,
  onCategoryChange,
  className = ""
}: Omit<CategoryFilterProps, 'searchQuery' | 'onSearchChange' | 'totalProducts' | 'loading'>) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <Button
        variant={!selectedCategory ? "default" : "outline"}
        size="sm"
        onClick={() => onCategoryChange(null)}
        className="flex items-center space-x-2"
      >
        <span>All</span>
        <Badge variant="secondary" className="bg-gray-100 text-gray-600">
          {categories.reduce((sum, cat) => sum + cat.count, 0)}
        </Badge>
      </Button>

      {categories.map((category) => (
        <Button
          key={category.name}
          variant={selectedCategory === category.name ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.name)}
          className="flex items-center space-x-2"
        >
          <span>{category.name}</span>
          <Badge variant="secondary" className="bg-gray-100 text-gray-600">
            {category.count}
          </Badge>
        </Button>
      ))}
    </div>
  );
}