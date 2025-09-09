"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error boundary caught an error:", error, errorInfo);
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === "production") {
      // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h1>
            
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Please try refreshing the page or go back to the dashboard.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                  Error details (development only)
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs text-red-600 overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            
            <div className="space-y-3">
              <Button 
                onClick={this.handleReset}
                className="w-full"
              >
                Try Again
              </Button>
              
              <Button 
                variant="outline" 
                onClick={this.handleReload}
                className="w-full flex items-center justify-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reload Page</span>
              </Button>
              
              <Link href="/dashboard" className="block">
                <Button 
                  variant="ghost" 
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <Home className="h-4 w-4" />
                  <span>Go to Dashboard</span>
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based error boundary for functional components
export function useErrorHandler() {
  const handleError = (error: Error) => {
    console.error("Handled error:", error);
    
    // In a real app, you'd send this to an error reporting service
    if (process.env.NODE_ENV === "production") {
      // Example: Sentry.captureException(error);
    }
    
    // Show user-friendly error message
    throw error; // Let the error boundary handle it
  };

  return { handleError };
}

// Specialized error boundaries for different sections
export function DashboardErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen bg-gray-50 p-4">
          <div className="max-w-2xl mx-auto pt-20">
            <Card className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Dashboard Error
              </h2>
              <p className="text-gray-600 mb-6">
                There was a problem loading your dashboard. Please try refreshing the page.
              </p>
              <div className="space-y-3">
                <Button onClick={() => window.location.reload()}>
                  Refresh Dashboard
                </Button>
                <Link href="/">
                  <Button variant="outline">Go to Home</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

export function AlertFormErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen bg-gray-50 p-4">
          <div className="max-w-md mx-auto pt-20">
            <Card className="p-6 text-center">
              <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Form Error
              </h2>
              <p className="text-gray-600 mb-6">
                Something went wrong with the alert form. Your progress may have been lost.
              </p>
              <div className="space-y-3">
                <Link href="/dashboard/alerts/new">
                  <Button>Start Over</Button>
                </Link>
                <Link href="/dashboard/alerts">
                  <Button variant="outline">Back to Alerts</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}