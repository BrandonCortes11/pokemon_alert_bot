"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Auto-generate breadcrumbs from pathname if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: "Dashboard", href: "/dashboard", icon: <Home className="h-4 w-4" /> }
    ];

    let currentPath = "";
    
    for (let i = 0; i < segments.length; i++) {
      currentPath += `/${segments[i]}`;
      
      // Skip dashboard since it's already added
      if (segments[i] === 'dashboard') continue;
      
      let label = segments[i];
      
      // Customize labels for known routes
      switch (segments[i]) {
        case 'alerts':
          label = i + 1 < segments.length ? "Alerts" : "Alerts";
          break;
        case 'new':
          label = "Create Alert";
          break;
        case 'edit':
          label = "Edit Alert";
          break;
        default:
          // For dynamic routes like [id], try to make them more readable
          if (segments[i].match(/^[a-f0-9]{24,}$/i)) {
            label = "Alert Details";
          } else {
            label = segments[i].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          }
          break;
      }
      
      // Don't add href for the current page
      const isCurrentPage = i === segments.length - 1;
      
      breadcrumbs.push({
        label,
        href: isCurrentPage ? undefined : currentPath
      });
    }
    
    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  if (breadcrumbItems.length <= 1) {
    return null; // Don't show breadcrumbs if there's only one item
  }

  return (
    <nav className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400 mr-2" />
            )}
            
            {item.href ? (
              <Link 
                href={item.href} 
                className="flex items-center space-x-1 hover:text-indigo-600 transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span className="flex items-center space-x-1 text-gray-900 font-medium">
                {item.icon}
                <span>{item.label}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Pre-configured breadcrumb components for common pages
export function DashboardBreadcrumbs() {
  return <Breadcrumbs />;
}

export function AlertsBreadcrumbs() {
  return (
    <Breadcrumbs 
      items={[
        { label: "Dashboard", href: "/dashboard", icon: <Home className="h-4 w-4" /> },
        { label: "Alerts" }
      ]} 
    />
  );
}

export function CreateAlertBreadcrumbs() {
  return (
    <Breadcrumbs 
      items={[
        { label: "Dashboard", href: "/dashboard", icon: <Home className="h-4 w-4" /> },
        { label: "Alerts", href: "/dashboard/alerts" },
        { label: "Create Alert" }
      ]} 
    />
  );
}

export function EditAlertBreadcrumbs({ alertName }: { alertName?: string }) {
  return (
    <Breadcrumbs 
      items={[
        { label: "Dashboard", href: "/dashboard", icon: <Home className="h-4 w-4" /> },
        { label: "Alerts", href: "/dashboard/alerts" },
        { label: alertName ? `Edit: ${alertName}` : "Edit Alert" }
      ]} 
    />
  );
}

export function StoresBreadcrumbs() {
  return (
    <Breadcrumbs 
      items={[
        { label: "Dashboard", href: "/dashboard", icon: <Home className="h-4 w-4" /> },
        { label: "Browse Stores" }
      ]} 
    />
  );
}

export function BrowseStoreBreadcrumbs({ storeName }: { storeName: string }) {
  return (
    <Breadcrumbs 
      items={[
        { label: "Dashboard", href: "/dashboard", icon: <Home className="h-4 w-4" /> },
        { label: "Browse Stores", href: "/dashboard/stores" },
        { label: storeName },
        { label: "Browse Products" }
      ]} 
    />
  );
}