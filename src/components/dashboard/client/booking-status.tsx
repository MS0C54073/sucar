
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle2,
  Circle,
  CircleDashed,
  Loader,
  Car,
  Wind,
  Sparkles,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Booking, BookingStatus as BookingStatusType } from "@/lib/types";


const allStatuses: BookingStatusType[] = [
  "requested",
  "confirmed",
  "picked_up",
  "in_wash",
  "drying",
  "done",
  "delivered",
];

const statusIcons: Record<BookingStatusType, React.ReactNode> = {
  requested: <CircleDashed />,
  confirmed: <ShieldCheck />,
  picked_up: <KeyRound />,
  in_wash: <Car />,
  drying: <Wind />,
  done: <Sparkles />,
  delivered: <CheckCircle2 />,
  cancelled: <Circle />,
};

export const statusText: Record<BookingStatusType, string> = {
  requested: "Booking Requested",
  confirmed: "Driver Confirmed",
  picked_up: "Car Picked Up",
  in_wash: "In Wash",
  drying: "Drying",
  done: "Ready for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

interface BookingStatusProps {
    activeBooking?: Booking;
}

export function BookingStatus({ activeBooking }: BookingStatusProps) {
  
  if (!activeBooking) {
    return (
      <Card className="flex items-center justify-center h-full min-h-[200px]">
        <CardContent className="text-center pt-6">
          <Car className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">
            You have no active bookings.
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentStatus = activeBooking.status;
  const currentIndex = currentStatus ? allStatuses.indexOf(currentStatus) : -1;

  if (activeBooking.status === "cancelled") {
    return (
       <Card>
        <CardHeader>
          <CardTitle>Booking #{activeBooking.bookingId.slice(-6)}</CardTitle>
          <CardDescription>
            This booking has been cancelled.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center flex-col text-center h-48">
            <Circle className="h-12 w-12 text-destructive" />
            <p className="mt-4 font-bold text-destructive">Booking Cancelled</p>
        </CardContent>
      </Card>
    )
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking #{activeBooking.bookingId.slice(-6)}</CardTitle>
        <CardDescription>
          {activeBooking.vehicle.make}{" "}
          {activeBooking.vehicle.model}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {allStatuses.map((status, index) => {
            const isCompleted = currentIndex > index;
            const isCurrent = index === currentIndex;

            return (
              <div key={status} className="flex items-center gap-4">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                    isCurrent && "bg-accent text-accent-foreground"
                  )}
                >
                  {isCurrent ? (
                    <Loader className="animate-spin" />
                  ) : isCompleted ? (
                    <CheckCircle2 />
                  ) : (
                    statusIcons[status]
                  )}
                </div>
                <span
                  className={cn(
                    "font-medium transition-colors",
                    isCompleted && "text-muted-foreground line-through",
                    isCurrent && "font-bold text-accent"
                  )}
                >
                  {statusText[status]}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
