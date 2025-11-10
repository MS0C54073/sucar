
"use client";

import { LiveMapView } from "@/components/dashboard/live-map-view";
import { useAuth } from "@/context/auth-provider";

export default function ProviderTrackingPage() {
    const { role } = useAuth();
    
    if (role !== 'provider') {
        return <p>Access Denied.</p>;
    }

    return (
        <div>
             <div className="mb-8">
                <h1 className="text-2xl font-bold font-headline">Incoming Vehicles</h1>
                <p className="text-muted-foreground">
                    Track drivers currently en route to your car wash.
                </p>
            </div>
            <div className="h-[60vh] lg:h-[70vh]">
                 <LiveMapView perspective="provider" />
            </div>
        </div>
    )
}
