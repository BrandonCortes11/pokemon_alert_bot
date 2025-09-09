"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Menu, X, Home, Bell, Plus, Settings, LogOut, Store } from "lucide-react";
import { signOut } from "next-auth/react";

interface MobileNavProps {
  className?: string;
}

export function MobileNav({ className = "" }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navigationItems = [
    { label: "Dashboard", href: "/dashboard", icon: Home },
    { label: "Browse Stores", href: "/dashboard/stores", icon: Store },
    { label: "Alerts", href: "/dashboard/alerts", icon: Bell },
    { label: "Create Alert", href: "/dashboard/alerts/new", icon: Plus },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className={`md:hidden ${className}`}>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full w-64 bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {navigationItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive(item.href)
                            ? "bg-indigo-100 text-indigo-700"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Footer Actions */}
              <div className="p-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsOpen(false);
                    signOut();
                  }}
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Quick actions component for mobile
export function MobileQuickActions() {
  return (
    <div className="md:hidden fixed bottom-4 right-4 z-40">
      <Link href="/dashboard/alerts/new">
        <Button
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  );
}

// Mobile-friendly header component
export function MobileHeader({ 
  title, 
  subtitle, 
  backHref,
  actions 
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          {backHref && (
            <Link 
              href={backHref}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← 
            </Link>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-gray-600 truncate">{subtitle}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {actions}
          <MobileNav />
        </div>
      </div>
    </div>
  );
}