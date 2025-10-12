import { StatsCards } from "@/components/dashboard/admin/stats-cards";
import { OverviewChart } from "@/components/dashboard/admin/overview-chart";
import { RecentBookings } from "@/components/dashboard/admin/recent-bookings";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
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
