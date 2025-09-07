import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">
            Pokemon Alert Bot 🎯
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Never miss another Pokemon card restock! Get instant alerts from your favorite retailers.
          </p>
          
          {/* Navigation Links */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🔄 Real-time Monitoring
                </CardTitle>
                <CardDescription>
                  Continuous stock checking every 5 minutes across multiple retailers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Advanced web scraping technology monitors Pokemon Center, Best Buy, Target, and Walmart for instant stock updates.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📱 Smart Notifications
                </CardTitle>
                <CardDescription>
                  Multiple alert channels to never miss a restock
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get notified via email, SMS, push notifications, Discord webhooks, or custom webhooks.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ⚙️ Custom Alerts
                </CardTitle>
                <CardDescription>
                  Personalized tracking for your specific needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Set alerts based on stock status, price thresholds, and specific products or entire collections.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Status Card */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                Phase 2 development complete - monitoring engine ready!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  ✅ <span>Authentication System</span>
                </div>
                <div className="flex items-center gap-2">
                  ✅ <span>Database Schema</span>
                </div>
                <div className="flex items-center gap-2">
                  ✅ <span>Pokemon Center Monitor</span>
                </div>
                <div className="flex items-center gap-2">
                  ✅ <span>Job Queue System</span>
                </div>
                <div className="flex items-center gap-2">
                  ✅ <span>Notification Service</span>
                </div>
                <div className="flex items-center gap-2">
                  ✅ <span>Modern UI Components</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-3">Supported Stores</h4>
                <div className="flex flex-wrap justify-center gap-3 text-sm">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full">
                    Pokemon Center ✅
                  </span>
                  <span className="bg-muted px-3 py-1 rounded-full">
                    Best Buy (Coming Soon)
                  </span>
                  <span className="bg-muted px-3 py-1 rounded-full">
                    Target (Coming Soon)
                  </span>
                  <span className="bg-muted px-3 py-1 rounded-full">
                    Walmart (Coming Soon)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}