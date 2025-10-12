import { ActiveTrips } from "@/components/dashboard/driver/active-trips";

export default function DriverDashboardPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Your Active Trips</h1>
            <ActiveTrips />
        </div>
    );
}
