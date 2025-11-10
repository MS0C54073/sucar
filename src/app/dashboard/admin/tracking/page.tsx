
"use client";

import { LiveMapView } from "@/components/dashboard/live-map-view";
import { useAuth } from "@/context/auth-provider";

export default function AdminTrackingPage() {
    const { role } = useAuth();
    
    if (role !== 'admin') {
        return <p>Access Denied.</p>;
    }

    return (
        <div>
             <div className="mb-8">
                <h1 className="text-2xl font-bold font-headline">Live Fleet Tracking</h1>
                <p className="text-muted-foreground">
                    Monitor all active and available drivers in real-time.
                </p>
            </div>
            <div className="h-[60vh] lg:h-[70vh]">
                 <LiveMapView perspective="admin" />
            </div>
        </div>
    )
}
