
"use client";

import { useState } from "react";
import { LocationPromptDialog } from "@/components/dashboard/client/location-prompt-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapView } from "@/components/dashboard/client/map-view";
import { BookingStatus } from "@/components/dashboard/client/booking-status";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import type { BookingStatus as BookingStatusType, Booking } from "@/lib/types";
import { useBooking } from "@/context/booking-provider";
import { useAuth } from "@/context/auth-provider";

export default function ClientDashboardPage() {
  const [locationSet, setLocationSet] = useState(false);
  const { user } = useAuth();
  const { bookings } = useBooking();

  const activeBooking = bookings.find(
    (b) =>
      b.clientId === user?.userId &&
      b.status !== "delivered" &&
      b.status !== "cancelled"
  );
  
  const currentStatus = activeBooking?.status;

  if (!locationSet) {
    return <LocationPromptDialog onLocationSet={() => setLocationSet(true)} />;
  }

  return (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold font-headline">Client Dashboard</h1>
                <p className="text-muted-foreground">
                    Here's an overview of your car wash activities.
                </p>
            </div>
            <Button asChild>
                <Link href="/dashboard/new-booking">
                    <PlusCircle />
                    <span>New Booking</span>
                </Link>
            </Button>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Live Driver Tracking</CardTitle>
                        <CardDescription>See nearby drivers and track your active pickup.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MapView activeBooking={activeBooking} />
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2">
                 <BookingStatus activeBooking={activeBooking} />
            </div>
        </div>
    </div>
  );
}
