"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "danger";
  loading?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  loading = false,
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <Card className="relative w-full max-w-md mx-4 p-6 bg-white shadow-xl">
        <div className="flex items-start">
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            variant === "danger" ? "bg-red-100" : "bg-yellow-100"
          }`}>
            <AlertTriangle className={`h-6 w-6 ${
              variant === "danger" ? "text-red-600" : "text-yellow-600"
            }`} />
          </div>
          
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {message}
            </p>
            
            <div className="flex space-x-3">
              <Button
                onClick={handleConfirm}
                disabled={loading}
                variant={variant === "danger" ? "destructive" : "default"}
                className="flex-1"
              >
                {loading ? "Processing..." : confirmText}
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                disabled={loading}
                className="flex-1"
              >
                {cancelText}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </Card>
    </div>
  );
}

// Hook for managing confirmation dialog state
export function useConfirmationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: "default" | "danger";
    confirmText?: string;
    cancelText?: string;
  }>({
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const showConfirmation = (newConfig: typeof config) => {
    setConfig(newConfig);
    setIsOpen(true);
  };

  const hideConfirmation = () => {
    setIsOpen(false);
  };

  const handleConfirm = () => {
    config.onConfirm();
    hideConfirmation();
  };

  return {
    isOpen,
    config,
    showConfirmation,
    hideConfirmation,
    handleConfirm,
    ConfirmationDialog: (props: Partial<ConfirmationDialogProps>) => (
      <ConfirmationDialog
        isOpen={isOpen}
        onClose={hideConfirmation}
        onConfirm={handleConfirm}
        title={config.title}
        message={config.message}
        variant={config.variant}
        confirmText={config.confirmText}
        cancelText={config.cancelText}
        {...props}
      />
    ),
  };
}