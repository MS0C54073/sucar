import { ServicesTable } from "@/components/dashboard/provider/services-table";
import { StatsCards } from "@/components/dashboard/admin/stats-cards"; // Reusing for placeholder

export default function ProviderDashboardPage() {
    return (
        <div className="space-y-8">
            <StatsCards />
            <ServicesTable />
        </div>
    );
}
