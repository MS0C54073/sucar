"use client";

import { useState, useEffect, useMemo } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BookingStatus, Booking } from "@/lib/types";
import { useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import { collection, query, where, limit } from "firebase/firestore";

const allStatuses: BookingStatus[] = [
  "requested",
  "picked_up",
  "in_wash",
  "drying",
  "done",
  "delivered",
];

const statusIcons: Record<BookingStatus, React.ReactNode> = {
  requested: <CircleDashed />,
  picked_up: <KeyRound />,
  in_wash: <Car />,
  drying: <Wind />,
  done: <Sparkles />,
  delivered: <CheckCircle2 />,
  cancelled: <Circle />,
};

const statusText: Record<BookingStatus, string> = {
  requested: "Booking Requested",
  picked_up: "Car Picked Up",
  in_wash: "In Wash",
  drying: "Drying",
  done: "Ready for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function BookingStatus() {
  const { user } = useAuth();
  const { firestore } = useFirebase();

  const bookingsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, "bookings"),
      where("clientId", "==", user.userId),
      where("status", "not-in", ["delivered", "cancelled"]),
      limit(1)
    );
  }, [user, firestore]);

  const { data: bookings, isLoading } = useCollection<Booking>(bookingsQuery);
  const activeBooking = bookings?.[0];

  const [currentStatus, setCurrentStatus] = useState<
    BookingStatus | undefined
  >(activeBooking?.status);

  useEffect(() => {
    if (activeBooking) {
      setCurrentStatus(activeBooking.status);
    }
  }, [activeBooking]);

  // This effect is for demo purposes to simulate status progression
  useEffect(() => {
    if (!activeBooking || activeBooking.status === 'delivered' || activeBooking.status === 'cancelled') return;

    const statusIndex = allStatuses.indexOf(activeBooking.status);
    if (statusIndex < 0 || statusIndex === allStatuses.length - 1) return;

    const interval = setInterval(() => {
      setCurrentStatus(prevStatus => {
        if (!prevStatus) return prevStatus;
        const currentIndex = allStatuses.indexOf(prevStatus);
        const nextIndex = currentIndex + 1;
        if (nextIndex < allStatuses.length) {
          // In a real app, this would be a Firestore update
          // For now, we just update the local state
          return allStatuses[nextIndex];
        }
        clearInterval(interval);
        return prevStatus;
      });
    }, 10000); // Simulate status change every 10 seconds

    return () => clearInterval(interval);
  }, [activeBooking]);


  if (isLoading) {
    return (
      <Card className="flex items-center justify-center h-full min-h-[200px]">
        <CardContent className="text-center pt-6">
          <Loader className="mx-auto h-12 w-12 text-muted-foreground animate-spin" />
          <p className="mt-4 text-muted-foreground">
            Loading your active booking...
          </p>
        </CardContent>
      </Card>
    );
  }
  
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
        <CardTitle>Booking #{activeBooking.id.slice(-6)}</CardTitle>
        <CardDescription>
          {activeBooking.carDetails.year} {activeBooking.carDetails.make}{" "}
          {activeBooking.carDetails.model}
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
                    "flex h-8 w-8 items-center justify-center rounded-full",
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
                    "font-medium",
                    isCompleted && "text-muted-foreground line-through",
                    isCurrent && "text-accent-foreground"
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
