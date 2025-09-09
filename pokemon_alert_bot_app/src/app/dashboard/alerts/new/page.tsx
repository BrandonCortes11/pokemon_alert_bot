"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/trpc";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CreateAlertBreadcrumbs } from "@/components/breadcrumbs";
import { useNavigationGuard } from "@/hooks/use-navigation-guard";
import { useConfirmationDialog } from "@/components/confirmation-dialog";
import { useToast } from "@/components/toast";
import { StoreSelection } from "@/components/store-selection";

type StepType = "store" | "search" | "conditions" | "notifications" | "review";

export default function CreateAlertPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState<StepType>("store");
  const [selectedStore, setSelectedStore] = useState<{ id: string; name: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [alertName, setAlertName] = useState("");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [priceThreshold, setPriceThreshold] = useState("");
  const [priceDirection, setPriceDirection] = useState<"ABOVE" | "BELOW">("BELOW");
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    webhookUrl: "",
    discordWebhook: "",
  });

  // Track form changes for navigation guard
  const hasUnsavedChanges = Boolean(
    selectedStore ||
    selectedProduct || 
    alertName || 
    selectedConditions.length > 0 || 
    priceThreshold ||
    notifications.webhookUrl ||
    notifications.discordWebhook ||
    !notifications.email ||
    notifications.sms ||
    !notifications.push
  );

  // Confirmation dialog for navigation
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  // Toast notifications
  const toast = useToast();

  // Navigation guard
  useNavigationGuard({
    hasUnsavedChanges,
    message: "You have unsaved changes to your alert. Are you sure you want to leave?",
  });

  // Search products (filtered by selected store)
  const { data: searchResults, isLoading: searchLoading } = api.products.search.useQuery(
    { query: searchQuery, limit: 10, storeId: selectedStore?.id },
    { enabled: searchQuery.length > 2 && !!selectedStore }
  );

  // Get stores
  const { data: stores } = api.products.getStores.useQuery();

  // Create alert mutation
  const createAlertMutation = api.alerts.create.useMutation({
    onSuccess: () => {
      toast.success(
        "Alert Created Successfully!",
        `Your alert "${alertName}" is now monitoring ${selectedProduct?.name}.`
      );
      router.push("/dashboard/alerts");
    },
    onError: (error) => {
      toast.error(
        "Failed to Create Alert",
        error.message || "Something went wrong. Please try again."
      );
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const stockConditions = [
    { value: "IN_STOCK", label: "In Stock", color: "green" },
    { value: "PREORDER", label: "Pre-order Available", color: "blue" },
    { value: "LIMITED_STOCK", label: "Limited Stock", color: "yellow" },
  ];

  const handleConditionToggle = (condition: string) => {
    setSelectedConditions(prev => 
      prev.includes(condition) 
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const handleCreateAlert = () => {
    if (!selectedProduct || !alertName || selectedConditions.length === 0) return;

    createAlertMutation.mutate({
      productId: selectedProduct.id,
      name: alertName,
      stockConditions: selectedConditions as any,
      priceThreshold: priceThreshold ? parseFloat(priceThreshold) : undefined,
      priceDirection: priceThreshold ? priceDirection : undefined,
      emailNotify: notifications.email,
      smsNotify: notifications.sms,
      pushNotify: notifications.push,
      webhookUrl: notifications.webhookUrl || undefined,
      discordWebhook: notifications.discordWebhook || undefined,
    });
  };

  const getStepColor = (step: StepType) => {
    const steps: StepType[] = ["store", "search", "conditions", "notifications", "review"];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(step);
    
    if (stepIndex < currentIndex) return "bg-green-500 text-white";
    if (stepIndex === currentIndex) return "bg-indigo-500 text-white";
    return "bg-gray-200 text-gray-600";
  };

  const handleStoreSelect = (storeId: string, storeName: string) => {
    setSelectedStore({ id: storeId, name: storeName });
    // Clear any existing product selection when store changes
    setSelectedProduct(null);
    setSearchQuery("");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
              <button
                onClick={() => {
                  if (hasUnsavedChanges) {
                    showConfirmation({
                      title: "Unsaved Changes",
                      message: "You have unsaved changes to your alert. Are you sure you want to leave?",
                      confirmText: "Leave",
                      cancelText: "Stay",
                      variant: "danger",
                      onConfirm: () => router.push("/dashboard/alerts")
                    });
                  } else {
                    router.push("/dashboard/alerts");
                  }
                }}
                className="text-gray-500 hover:text-gray-700 mr-4 transition-colors"
              >
                ← Alerts
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Create New Alert
              </h1>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <CreateAlertBreadcrumbs />
          </div>
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[
                { step: "store" as StepType, label: "Choose Store", number: 1 },
                { step: "search" as StepType, label: "Select Product", number: 2 },
                { step: "conditions" as StepType, label: "Alert Conditions", number: 3 },
                { step: "notifications" as StepType, label: "Notifications", number: 4 },
                { step: "review" as StepType, label: "Review", number: 5 },
              ].map(({ step, label, number }) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${getStepColor(step)}`}>
                    {number}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">{label}</span>
                  {number < 5 && <div className="w-16 h-1 bg-gray-200 mx-4" />}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card className="p-8">
            {currentStep === "store" && (
              <div>
                <StoreSelection
                  selectedStoreId={selectedStore?.id}
                  onStoreSelect={handleStoreSelect}
                />
                
                <div className="mt-8 flex justify-end">
                  <Button
                    onClick={() => setCurrentStep("search")}
                    disabled={!selectedStore}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {currentStep === "search" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Search for a Pokemon Card
                </h2>
                {selectedStore && (
                  <p className="text-gray-600 mb-6">
                    Searching products from <span className="font-medium">{selectedStore.name}</span>
                  </p>
                )}
                
                <div className="mb-6">
                  <Input
                    type="text"
                    placeholder="Search Pokemon cards..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>

                {searchLoading && (
                  <div className="text-center py-4">
                    <div className="animate-pulse text-gray-500">Searching...</div>
                  </div>
                )}

                {searchResults && searchResults.length > 0 && (
                  <div className="space-y-3">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedProduct?.id === product.id
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedProduct(product)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{product.name}</h3>
                            <p className="text-sm text-gray-600">{product.store.displayName}</p>
                            {product.category && (
                              <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                            )}
                          </div>
                          <div className="text-right">
                            {product.latestStock && (
                              <div className="text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  product.latestStock.status === "IN_STOCK" ? "bg-green-100 text-green-800" :
                                  product.latestStock.status === "OUT_OF_STOCK" ? "bg-red-100 text-red-800" :
                                  product.latestStock.status === "PREORDER" ? "bg-blue-100 text-blue-800" :
                                  "bg-gray-100 text-gray-800"
                                }`}>
                                  {product.latestStock.status.replace('_', ' ')}
                                </span>
                                {product.latestStock.price && (
                                  <div className="mt-1 font-medium">${product.latestStock.price}</div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {searchQuery.length > 2 && searchResults?.length === 0 && !searchLoading && (
                  <div className="text-center py-8 text-gray-500">
                    No products found matching "{searchQuery}"
                  </div>
                )}

                <div className="mt-8 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep("store")}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep("conditions")}
                    disabled={!selectedProduct}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {currentStep === "conditions" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Set Alert Conditions
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alert Name
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., Charizard V Restock Alert"
                      value={alertName}
                      onChange={(e) => setAlertName(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Stock Conditions (select all that apply)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {stockConditions.map((condition) => (
                        <div
                          key={condition.value}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedConditions.includes(condition.value)
                              ? `border-${condition.color}-500 bg-${condition.color}-50`
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => handleConditionToggle(condition.value)}
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedConditions.includes(condition.value)}
                              onChange={() => {}}
                              className="mr-3"
                            />
                            <span className="font-medium">{condition.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Threshold (optional)
                    </label>
                    <div className="flex items-center space-x-4">
                      <select
                        value={priceDirection}
                        onChange={(e) => setPriceDirection(e.target.value as "ABOVE" | "BELOW")}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="BELOW">Below or equal to</option>
                        <option value="ABOVE">Above or equal to</option>
                      </select>
                      <div className="flex items-center">
                        <span className="mr-2">$</span>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={priceThreshold}
                          onChange={(e) => setPriceThreshold(e.target.value)}
                          className="w-24"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep("search")}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep("notifications")}
                    disabled={!alertName || selectedConditions.length === 0}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {currentStep === "notifications" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Notification Preferences
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Basic Notifications
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notifications.email}
                          onChange={(e) => setNotifications(prev => ({ ...prev, email: e.target.checked }))}
                          className="mr-3"
                        />
                        <span>Email notifications</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notifications.sms}
                          onChange={(e) => setNotifications(prev => ({ ...prev, sms: e.target.checked }))}
                          className="mr-3"
                        />
                        <span>SMS notifications (requires phone number in settings)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notifications.push}
                          onChange={(e) => setNotifications(prev => ({ ...prev, push: e.target.checked }))}
                          className="mr-3"
                        />
                        <span>Browser push notifications</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Advanced Notifications (Optional)
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Webhook URL
                        </label>
                        <Input
                          type="url"
                          placeholder="https://your-webhook-url.com"
                          value={notifications.webhookUrl}
                          onChange={(e) => setNotifications(prev => ({ ...prev, webhookUrl: e.target.value }))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Discord Webhook URL
                        </label>
                        <Input
                          type="url"
                          placeholder="https://discord.com/api/webhooks/..."
                          value={notifications.discordWebhook}
                          onChange={(e) => setNotifications(prev => ({ ...prev, discordWebhook: e.target.value }))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep("conditions")}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep("review")}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {currentStep === "review" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Review Your Alert
                </h2>

                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Product</h3>
                    <div className="text-sm text-gray-600">
                      <div>{selectedProduct?.name}</div>
                      <div>{selectedProduct?.store.displayName}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Alert Details</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div><strong>Name:</strong> {alertName}</div>
                      <div><strong>Conditions:</strong> {selectedConditions.join(", ")}</div>
                      {priceThreshold && (
                        <div>
                          <strong>Price:</strong> {priceDirection === "BELOW" ? "≤" : "≥"} ${priceThreshold}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Notifications</h3>
                    <div className="text-sm text-gray-600">
                      {notifications.email && <div>• Email notifications</div>}
                      {notifications.sms && <div>• SMS notifications</div>}
                      {notifications.push && <div>• Browser push notifications</div>}
                      {notifications.webhookUrl && <div>• Webhook URL</div>}
                      {notifications.discordWebhook && <div>• Discord webhook</div>}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep("notifications")}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleCreateAlert}
                    disabled={createAlertMutation.isLoading}
                  >
                    {createAlertMutation.isLoading ? "Creating..." : "Create Alert"}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* Confirmation Dialog */}
      <ConfirmationDialog />
    </div>
  );
}