import { StatsCards } from "@/components/dashboard/admin/stats-cards";
import { OverviewChart } from "@/components/dashboard/admin/overview-chart";
import { RecentBookings } from "@/components/dashboard/admin/recent-bookings";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Map } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
       <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold font-headline">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                    Here's an overview of the SuCAR platform.
                </p>
            </div>
            <Button asChild>
                <Link href="/dashboard/admin/tracking">
                    <Map />
                    <span>Live Tracking</span>
                </Link>
            </Button>
        </div>
      <StatsCards />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OverviewChart />
        </div>
        <div>
          <RecentBookings />
        </div>
      </div>
    </div>
  );
}
