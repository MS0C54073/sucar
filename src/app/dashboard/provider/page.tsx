import { ServicesTable } from "@/components/dashboard/provider/services-table";
import { StatsCards } from "@/components/dashboard/admin/stats-cards"; // Reusing for placeholder
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Map } from "lucide-react";

export default function ProviderDashboardPage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold font-headline">Provider Dashboard</h1>
                    <p className="text-muted-foreground">
                        Manage your services and track incoming vehicles.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/provider/tracking">
                        <Map />
                        <span>Track Incoming</span>
                    </Link>
                </Button>
            </div>
            <StatsCards />
            <ServicesTable />
        </div>
    );
}
