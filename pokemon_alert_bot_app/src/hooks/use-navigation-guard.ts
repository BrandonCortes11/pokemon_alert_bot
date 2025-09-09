import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface UseNavigationGuardOptions {
  hasUnsavedChanges: boolean;
  message?: string;
  onNavigateAway?: () => Promise<boolean> | boolean;
}

export function useNavigationGuard({ 
  hasUnsavedChanges, 
  message = "You have unsaved changes. Are you sure you want to leave?",
  onNavigateAway 
}: UseNavigationGuardOptions) {
  const router = useRouter();

  // Handle browser navigation (back button, refresh, etc.)
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, message]);

  // Create a safe navigation function
  const navigateWithConfirmation = useCallback(
    async (href: string) => {
      if (!hasUnsavedChanges) {
        router.push(href);
        return;
      }

      let shouldNavigate = true;

      // If custom handler is provided, use it
      if (onNavigateAway) {
        shouldNavigate = await onNavigateAway();
      } else {
        // Default confirmation dialog
        shouldNavigate = window.confirm(message);
      }

      if (shouldNavigate) {
        router.push(href);
      }
    },
    [hasUnsavedChanges, router, message, onNavigateAway]
  );

  return { navigateWithConfirmation };
}

// Higher-order component for protected navigation
export function useProtectedNavigation() {
  const router = useRouter();

  const createProtectedLink = useCallback(
    (href: string, hasUnsavedChanges: boolean, confirmationMessage?: string) => {
      return {
        href,
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          
          if (hasUnsavedChanges) {
            const message = confirmationMessage || "You have unsaved changes. Are you sure you want to leave?";
            if (window.confirm(message)) {
              router.push(href);
            }
          } else {
            router.push(href);
          }
        }
      };
    },
    [router]
  );

  return { createProtectedLink };
}