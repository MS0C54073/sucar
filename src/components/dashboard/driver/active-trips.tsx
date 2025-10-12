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
import { mockBookings } from "@/lib/placeholder-data";
import { useAuth } from "@/context/auth-provider";
import { Separator } from "@/components/ui/separator";
import { Car, MapPin, Wrench } from "lucide-react";

export function ActiveTrips() {
  const { user } = useAuth();
  const driverBookings = mockBookings.filter(
    (b) => b.driverId === user?.userId && b.status !== "delivered" && b.status !== 'cancelled'
  );

  if (driverBookings.length === 0) {
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
        <Card key={booking.bookingId} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Booking #{booking.bookingId.slice(-6)}</CardTitle>
                <CardDescription>Client: {booking.clientName}</CardDescription>
              </div>
              <Badge variant={booking.status === 'picked_up' ? 'secondary' : 'default'}>{booking.status.replace("_", " ")}</Badge>
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
                    <span>{booking.carDetails.year} {booking.carDetails.make} {booking.carDetails.model} ({booking.carDetails.plate})</span>
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
