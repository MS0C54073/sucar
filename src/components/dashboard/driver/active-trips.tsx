"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-provider";
import { Separator } from "@/components/ui/separator";
import { Car, MapPin, Wrench, Loader2 } from "lucide-react";
import { useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import type { Booking } from "@/lib/types";

export function ActiveTrips() {
  const { user } = useAuth();
  const { firestore } = useFirebase();

  const driverBookingsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, "bookings"),
      where("driverId", "==", user.userId),
      where("status", "not-in", ["delivered", "cancelled"])
    );
  }, [user, firestore]);

  const {
    data: driverBookings,
    isLoading,
    error,
  } = useCollection<Booking>(driverBookingsQuery);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
       <Card className="text-center py-12 bg-destructive/10 border-destructive">
        <CardContent>
          <h3 className="text-xl font-semibold text-destructive">Error Loading Trips</h3>
          <p className="text-destructive/80 mt-2">
            Could not fetch your active trips. Please check your connection or try again later.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!driverBookings || driverBookings.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <h3 className="text-xl font-semibold">No Active Trips</h3>
          <p className="text-muted-foreground mt-2">
            You have no assigned trips at the moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {driverBookings.map((booking) => (
        <Card key={booking.id} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Booking #{booking.id.slice(-6)}</CardTitle>
                <CardDescription>Client: {booking.clientName}</CardDescription>
              </div>
              <Badge
                variant={booking.status === "picked_up" ? "secondary" : "default"}
              >
                {booking.status.replace("_", " ")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{booking.pickupLocation}</span>
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <Car className="w-5 h-5 text-muted-foreground" />
                <span>
                  {booking.carDetails.year} {booking.carDetails.make}{" "}
                  {booking.carDetails.model} ({booking.carDetails.plate})
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Wrench className="w-5 h-5 text-muted-foreground" />
                <span>{booking.service.name}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Update Status</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
