"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryFilter, CategoryTabs } from "@/components/category-filter";
import { ProductGrid } from "@/components/product-grid";
import { useToast } from "@/components/toast";
import { useConfirmationDialog } from "@/components/confirmation-dialog";
import { BrowseStoreBreadcrumbs } from "@/components/breadcrumbs";
import { 
  Download, 
  Plus, 
  RefreshCw, 
  Search, 
  Store, 
  Package,
  Zap,
  Link as LinkIcon
} from "lucide-react";

export default function PokemonCenterBrowsePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { success, error } = useToast();
  const { showConfirmation } = useConfirmationDialog();

  // State
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddCustomProduct, setShowAddCustomProduct] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [isScrapingCatalog, setIsScrapingCatalog] = useState(false);

  // Get Pokemon Center store
  const { data: stores } = api.stores.getAll.useQuery();
  const pokemonCenterStore = stores?.find(store => store.name === 'pokemon_center');

  // Get categories for Pokemon Center
  const { data: categories = [], isLoading: categoriesLoading } = api.products.getCategories.useQuery(
    { storeId: pokemonCenterStore?.id || "" },
    { enabled: !!pokemonCenterStore }
  );

  // Get products based on filters
  const {
    data: productsData,
    isLoading: productsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchProducts
  } = selectedCategory
    ? api.products.getByCategory.useInfiniteQuery(
        {
          storeId: pokemonCenterStore?.id || "",
          category: selectedCategory,
          limit: 24,
        },
        {
          enabled: !!pokemonCenterStore,
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
      )
    : api.products.getByStore.useInfiniteQuery(
        {
          storeId: pokemonCenterStore?.id || "",
          limit: 24,
        },
        {
          enabled: !!pokemonCenterStore,
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
      );

  // Search products when search query is provided
  const { data: searchResults, isLoading: searchLoading } = api.products.search.useQuery(
    {
      query: searchQuery,
      storeId: pokemonCenterStore?.id,
      category: selectedCategory || undefined,
      limit: 50,
    },
    { 
      enabled: !!searchQuery && searchQuery.length > 2 && !!pokemonCenterStore 
    }
  );

  // URL validation
  const { data: urlValidation } = api.products.validateUrl.useQuery(
    { url: customUrl },
    { enabled: customUrl.length > 0 }
  );

  // Mutations
  const scrapeCatalogMutation = api.products.scrapeCatalog.useMutation({
    onSuccess: (result) => {
      success(
        "Catalog Scraping Complete",
        `Scraped ${result.scraped} products. Saved ${result.saved} new products, updated ${result.updated} existing products.`
      );
      refetchProducts();
    },
    onError: (err) => {
      error("Scraping Failed", err.message);
    }
  });

  const addFromUrlMutation = api.products.addFromUrl.useMutation({
    onSuccess: (result) => {
      success(
        result.isNew ? "Product Added" : "Product Found",
        result.isNew ? "Product has been added to the catalog" : "This product already exists in our catalog"
      );
      setCustomUrl("");
      setShowAddCustomProduct(false);
      refetchProducts();
      
      // Navigate to create alert for this product
      router.push(`/dashboard/alerts/new?productId=${result.product.id}`);
    },
    onError: (err) => {
      error("Failed to Add Product", err.message);
    }
  });

  // Authentication check
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  if (!pokemonCenterStore) {
    return <div>Pokemon Center store not found</div>;
  }

  // Determine which products to display
  const displayProducts = searchQuery.length > 2 
    ? searchResults || []
    : productsData?.pages.flatMap(page => page.products) || [];

  const isLoading = searchQuery.length > 2 ? searchLoading : productsLoading;

  const handleScrapeCatalog = async () => {
    const confirmed = await showConfirmation({
      title: "Scrape Pokemon Center Catalog",
      message: "This will discover new products from Pokemon Center. It may take several minutes to complete. Continue?",
      confirmText: "Start Scraping"
    });

    if (confirmed) {
      setIsScrapingCatalog(true);
      try {
        await scrapeCatalogMutation.mutateAsync({
          storeId: pokemonCenterStore.id,
          maxProductsPerCategory: 100
        });
      } finally {
        setIsScrapingCatalog(false);
      }
    }
  };

  const handleAddCustomProduct = async () => {
    if (!customUrl || !urlValidation?.isValid) return;

    await addFromUrlMutation.mutateAsync({
      url: customUrl,
      storeId: pokemonCenterStore.id
    });
  };

  const handleCreateAlert = (productId: string) => {
    router.push(`/dashboard/alerts/new?productId=${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumbs */}
        <div className="mb-6">
          <BrowseStoreBreadcrumbs storeName="Pokémon Center" />
        </div>
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Store className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Browse Pokemon Center Products</h1>
              <p className="text-gray-600">Discover and create alerts for Pokemon Center products</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <Button
              onClick={handleScrapeCatalog}
              disabled={isScrapingCatalog}
              className="flex items-center space-x-2"
            >
              {isScrapingCatalog ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Scraping Catalog...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Update Catalog</span>
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowAddCustomProduct(!showAddCustomProduct)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Custom Product</span>
            </Button>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4" />
                <span>{categories.reduce((sum, cat) => sum + cat.count, 0)} Products</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>{categories.length} Categories</span>
              </div>
            </div>
          </div>
        </div>

        {/* Add Custom Product Section */}
        {showAddCustomProduct && (
          <Card className="p-6 mb-8 border-dashed border-indigo-300 bg-indigo-50">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <LinkIcon className="h-5 w-5 text-indigo-600" />
                <h3 className="text-lg font-medium text-indigo-900">Add Product from URL</h3>
              </div>
              
              <p className="text-sm text-indigo-700">
                Paste any Pokemon Center product URL to add it to our catalog and create an alert
              </p>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    type="url"
                    placeholder="https://www.pokemoncenter.com/product/..."
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className={`${
                      customUrl && !urlValidation?.isValid 
                        ? "border-red-300 focus:border-red-500" 
                        : customUrl && urlValidation?.isValid
                        ? "border-green-300 focus:border-green-500"
                        : ""
                    }`}
                  />
                  {customUrl && !urlValidation?.isValid && (
                    <p className="text-xs text-red-600 mt-1">
                      Please enter a valid Pokemon Center product URL
                    </p>
                  )}
                  {customUrl && urlValidation?.isValid && (
                    <p className="text-xs text-green-600 mt-1">
                      Valid Pokemon Center URL ✓
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleAddCustomProduct}
                  disabled={!customUrl || !urlValidation?.isValid || addFromUrlMutation.isLoading}
                  className="flex items-center space-x-2"
                >
                  {addFromUrlMutation.isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Add Product</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Category Tabs - Mobile */}
        <div className="block lg:hidden mb-6">
          <CategoryTabs
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Filters and Search - Desktop */}
        <div className="hidden lg:block mb-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalProducts={displayProducts.length}
            loading={isLoading}
          />
        </div>

        {/* Mobile Search */}
        <div className="block lg:hidden mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Products Grid */}
        <ProductGrid
          products={displayProducts}
          loading={isLoading}
          onCreateAlert={handleCreateAlert}
          onLoadMore={searchQuery.length <= 2 ? () => fetchNextPage() : undefined}
          hasMore={searchQuery.length <= 2 && hasNextPage}
          loadingMore={isFetchingNextPage}
          emptyMessage={
            selectedCategory 
              ? `No products found in ${selectedCategory} category`
              : searchQuery.length > 2
              ? `No products found for "${searchQuery}"`
              : "No products found. Try updating the catalog."
          }
        />
      </div>
    </div>
  );
}