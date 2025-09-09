"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/trpc";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, X } from "lucide-react";
import { EditAlertBreadcrumbs } from "@/components/breadcrumbs";

type StepType = "conditions" | "notifications" | "review";

export default function EditAlertPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const alertId = params.id as string;
  
  const [currentStep, setCurrentStep] = useState<StepType>("conditions");
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

  // Get alert data
  const { data: alert, isLoading: alertLoading } = api.alerts.getById.useQuery(
    { id: alertId },
    { enabled: !!session && !!alertId }
  );

  // Update alert mutation
  const updateAlertMutation = api.alerts.update.useMutation({
    onSuccess: () => {
      router.push("/dashboard/alerts");
    },
  });

  // Populate form when alert data loads
  useEffect(() => {
    if (alert) {
      setAlertName(alert.name);
      setSelectedConditions(alert.stockConditions);
      setPriceThreshold(alert.priceThreshold?.toString() || "");
      setPriceDirection(alert.priceDirection || "BELOW");
      setNotifications({
        email: alert.emailNotify,
        sms: alert.smsNotify,
        push: alert.pushNotify,
        webhookUrl: alert.webhookUrl || "",
        discordWebhook: alert.discordWebhook || "",
      });
    }
  }, [alert]);

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

  const handleUpdateAlert = () => {
    if (!alert || !alertName || selectedConditions.length === 0) return;

    updateAlertMutation.mutate({
      id: alert.id,
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
    const steps: StepType[] = ["conditions", "notifications", "review"];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(step);
    
    if (stepIndex < currentIndex) return "bg-green-500 text-white";
    if (stepIndex === currentIndex) return "bg-indigo-500 text-white";
    return "bg-gray-200 text-gray-600";
  };

  if (status === "loading" || alertLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading alert...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect via useEffect
  }

  if (!alert) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Alert Not Found</h1>
          <p className="text-gray-600 mb-8">The alert you're looking for doesn't exist or you don't have permission to edit it.</p>
          <Link href="/dashboard/alerts">
            <Button>Back to Alerts</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/alerts">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Alerts</span>
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Alert</h1>
                <p className="text-gray-600">{alert.product.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/dashboard/alerts">
                <Button variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </Link>
              <Button 
                onClick={handleUpdateAlert}
                disabled={updateAlertMutation.isLoading || !alertName || selectedConditions.length === 0}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>
                  {updateAlertMutation.isLoading ? "Updating..." : "Update Alert"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <EditAlertBreadcrumbs alertName={alert?.name} />
        </div>
        <div className="flex items-center justify-center space-x-4 mb-8">
          {(["conditions", "notifications", "review"] as StepType[]).map((step, index) => (
            <div key={step} className="flex items-center">
              <button
                onClick={() => setCurrentStep(step)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${getStepColor(step)}`}
              >
                {index + 1}
              </button>
              <span className="ml-2 text-sm text-gray-600 capitalize">{step}</span>
              {index < 2 && <div className="w-8 h-px bg-gray-300 mx-4" />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="max-w-2xl mx-auto">
          {currentStep === "conditions" && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Alert Configuration</h2>
              
              {/* Alert Name */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alert Name
                </label>
                <Input
                  type="text"
                  value={alertName}
                  onChange={(e) => setAlertName(e.target.value)}
                  placeholder="e.g., Charizard Restock Alert"
                  className="w-full"
                />
              </div>

              {/* Stock Conditions */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Stock Conditions (select at least one)
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {stockConditions.map((condition) => (
                    <label
                      key={condition.value}
                      className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedConditions.includes(condition.value)
                          ? `border-${condition.color}-500 bg-${condition.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedConditions.includes(condition.value)}
                        onChange={() => handleConditionToggle(condition.value)}
                        className={`mr-3 text-${condition.color}-600`}
                      />
                      <span className="font-medium">{condition.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Threshold */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Threshold (optional)
                </label>
                <div className="flex space-x-2">
                  <select
                    value={priceDirection}
                    onChange={(e) => setPriceDirection(e.target.value as "ABOVE" | "BELOW")}
                    className="px-3 py-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="BELOW">Below</option>
                    <option value="ABOVE">Above</option>
                  </select>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <Input
                      type="number"
                      value={priceThreshold}
                      onChange={(e) => setPriceThreshold(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setCurrentStep("notifications")}>
                  Next: Notifications
                </Button>
              </div>
            </Card>
          )}

          {currentStep === "notifications" && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
              
              {/* Basic Notifications */}
              <div className="space-y-4 mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) => setNotifications(prev => ({ ...prev, email: e.target.checked }))}
                    className="mr-3 text-indigo-600"
                  />
                  <span className="font-medium">Email Notifications</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notifications.sms}
                    onChange={(e) => setNotifications(prev => ({ ...prev, sms: e.target.checked }))}
                    className="mr-3 text-indigo-600"
                  />
                  <span className="font-medium">SMS Notifications</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={(e) => setNotifications(prev => ({ ...prev, push: e.target.checked }))}
                    className="mr-3 text-indigo-600"
                  />
                  <span className="font-medium">Push Notifications</span>
                </label>
              </div>

              {/* Advanced Notifications */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Webhook URL (optional)
                  </label>
                  <Input
                    type="url"
                    value={notifications.webhookUrl}
                    onChange={(e) => setNotifications(prev => ({ ...prev, webhookUrl: e.target.value }))}
                    placeholder="https://example.com/webhook"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discord Webhook URL (optional)
                  </label>
                  <Input
                    type="url"
                    value={notifications.discordWebhook}
                    onChange={(e) => setNotifications(prev => ({ ...prev, discordWebhook: e.target.value }))}
                    placeholder="https://discord.com/api/webhooks/..."
                  />
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep("conditions")}
                >
                  Back: Conditions
                </Button>
                <Button onClick={() => setCurrentStep("review")}>
                  Next: Review
                </Button>
              </div>
            </Card>
          )}

          {currentStep === "review" && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Changes</h2>
              
              <div className="space-y-6">
                {/* Product Info */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Product</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">{alert.product.name}</p>
                    <p className="text-sm text-gray-600">{alert.product.store.displayName}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.product.url}</p>
                  </div>
                </div>

                {/* Alert Configuration */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Alert Configuration</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p><span className="font-medium">Name:</span> {alertName}</p>
                    <p><span className="font-medium">Conditions:</span> {selectedConditions.map(c => 
                      stockConditions.find(sc => sc.value === c)?.label
                    ).join(", ")}</p>
                    {priceThreshold && (
                      <p><span className="font-medium">Price:</span> {priceDirection} ${priceThreshold}</p>
                    )}
                  </div>
                </div>

                {/* Notifications */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Notifications</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-1">
                    {notifications.email && <p>✓ Email notifications</p>}
                    {notifications.sms && <p>✓ SMS notifications</p>}
                    {notifications.push && <p>✓ Push notifications</p>}
                    {notifications.webhookUrl && <p>✓ Webhook: {notifications.webhookUrl}</p>}
                    {notifications.discordWebhook && <p>✓ Discord webhook configured</p>}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep("notifications")}
                >
                  Back: Notifications
                </Button>
                <Button 
                  onClick={handleUpdateAlert}
                  disabled={updateAlertMutation.isLoading || !alertName || selectedConditions.length === 0}
                  className="flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>
                    {updateAlertMutation.isLoading ? "Updating..." : "Update Alert"}
                  </span>
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}