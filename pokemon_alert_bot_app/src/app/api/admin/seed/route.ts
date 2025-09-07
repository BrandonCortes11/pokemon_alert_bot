import { NextRequest, NextResponse } from "next/server";
import { seedStoreData, getStoreStats } from "@/lib/seed-data";
import { scheduleStoreMonitoring } from "@/lib/queue";

export async function POST(request: NextRequest) {
  try {
    // Basic security check - in production, add proper authentication
    const { action, secret } = await request.json();
    
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    switch (action) {
      case 'seed-stores':
        const seedResult = await seedStoreData();
        return NextResponse.json({
          message: "Store data seeded successfully",
          data: seedResult,
        });

      case 'schedule-monitoring':
        await scheduleStoreMonitoring();
        return NextResponse.json({
          message: "Store monitoring scheduled successfully",
        });

      case 'stats':
        const stats = await getStoreStats();
        return NextResponse.json({
          message: "Current system stats",
          data: stats,
        });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error("Admin seed error:", error);
    
    return NextResponse.json(
      { 
        error: "Operation failed", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const stats = await getStoreStats();
    
    return NextResponse.json({
      message: "Pokemon Alert Bot - System Status",
      data: stats,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Stats error:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to get stats", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}