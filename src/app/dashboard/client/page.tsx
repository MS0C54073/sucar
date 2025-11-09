
"use client";

import { useState } from "react";
import { BookingForm } from "@/components/dashboard/client/booking-form";
import { BookingStatus } from "@/components/dashboard/client/booking-status";
import { MapView } from "@/components/dashboard/client/map-view";
import { LocationPromptDialog } from "@/components/dashboard/client/location-prompt-dialog";
import type { BookingStatus as BookingStatusType } from "@/lib/types";

export default function ClientDashboardPage() {
  const [locationSet, setLocationSet] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<BookingStatusType | undefined>(undefined);

  if (!locationSet) {
    return <LocationPromptDialog onLocationSet={() => setLocationSet(true)} />;
  }

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Book a New Wash</h1>
          <p className="text-muted-foreground">
            Your location is set. Let’s help you book your car wash.
          </p>
        </div>
        <BookingForm />
      </div>
      <div className="lg:col-span-3">
        <h2 className="text-2xl font-bold mb-6">Live Tracking</h2>
        <MapView currentStatus={currentStatus} />
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Live Status</h2>
          <BookingStatus onStatusChange={setCurrentStatus} />
        </div>
      </div>
    </div>
  );
}
