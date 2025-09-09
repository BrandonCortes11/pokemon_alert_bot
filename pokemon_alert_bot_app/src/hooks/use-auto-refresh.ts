import { useEffect, useRef, useState } from 'react';

interface UseAutoRefreshOptions {
  interval?: number; // in milliseconds
  enabled?: boolean;
  onRefresh?: () => void;
}

export function useAutoRefresh({ 
  interval = 30000, // Default 30 seconds
  enabled = true,
  onRefresh 
}: UseAutoRefreshOptions = {}) {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const intervalRef = useRef<NodeJS.Timeout>();

  const refresh = () => {
    if (onRefresh) {
      onRefresh();
    }
    setLastRefresh(new Date());
  };

  const toggleAutoRefresh = () => {
    setIsEnabled(!isEnabled);
  };

  useEffect(() => {
    if (isEnabled && interval > 0) {
      intervalRef.current = setInterval(refresh, interval);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isEnabled, interval, onRefresh]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isEnabled,
    toggleAutoRefresh,
    refresh,
    lastRefresh,
    setEnabled: setIsEnabled
  };
}