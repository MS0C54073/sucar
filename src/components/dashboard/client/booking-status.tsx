
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/auth-provider";
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
import type { BookingStatus as BookingStatusType } from "@/lib/types";
import { MOCK_BOOKINGS } from "@/lib/mock-data";


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

const statusText: Record<BookingStatusType, string> = {
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
    onStatusChange: (status: BookingStatusType) => void;
}

export function BookingStatus({ onStatusChange }: BookingStatusProps) {
  const { user } = useAuth();
  
  // Find an active booking for the current mock user
  const activeBooking = MOCK_BOOKINGS.find(
    (b) =>
      b.clientId === user?.userId &&
      b.status !== "delivered" &&
      b.status !== "cancelled"
  );
  
  const [currentStatus, setCurrentStatus] = useState<
    BookingStatusType | undefined
  >(activeBooking?.status);

  // This effect is for demo purposes to simulate status progression
  useEffect(() => {
    if (!activeBooking) return;
    
    // Set initial status and notify parent
    const initialStatus = activeBooking.status;
    setCurrentStatus(initialStatus);
    onStatusChange(initialStatus);


    const statusIndex = allStatuses.indexOf(initialStatus);
    if (statusIndex < 0 || statusIndex === allStatuses.length - 1) return;

    const interval = setInterval(() => {
      setCurrentStatus(prevStatus => {
        if (!prevStatus) return prevStatus;

        const currentIndex = allStatuses.indexOf(prevStatus);
        const nextIndex = currentIndex + 1;

        if (nextIndex < allStatuses.length) {
            const newStatus = allStatuses[nextIndex];
            onStatusChange(newStatus); // Notify parent of status change
            return newStatus;
        }
        
        clearInterval(interval);
        return prevStatus;
      });
    }, 8000); // Simulate status change every 8 seconds

    return () => clearInterval(interval);
  }, [activeBooking, onStatusChange]);

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

  const currentIndex = currentStatus ? allStatuses.indexOf(currentStatus) : -1;

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
            const isCompleted = index < currentIndex;
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
                    isCurrent && "font-bold"
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
