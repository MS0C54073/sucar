
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
import { useBooking } from "@/context/booking-provider";
import { Separator } from "@/components/ui/separator";
import { Car, MapPin, User as UserIcon } from "lucide-react";
import { MOCK_USERS } from "@/lib/mock-data";
import type { BookingStatus } from "@/lib/types";
import { toast } from "@/hooks/use-toast";

const statusProgression: Record<BookingStatus, BookingStatus | null> = {
  requested: "confirmed",
  confirmed: "picked_up",
  picked_up: "in_wash",
  in_wash: "drying",
  drying: "done",
  done: "delivered",
  delivered: null,
  cancelled: null,
};

const getNextStatusText = (status: BookingStatus): string => {
    switch (status) {
        case "requested": return "Accept Job";
        case "confirmed": return "Confirm Pickup";
        case "picked_up": return "Arrived at Car Wash";
        case "in_wash": return "Mark as Drying";
        case "drying": return "Mark as Ready";
        case "done": return "Confirm Delivery";
        default: return "Update Status";
    }
}

export function ActiveTrips() {
  const { user } = useAuth();
  const { bookings, drivers, updateBookingStatus } = useBooking();
  
  const driverDetails = drivers.find(d => d.userId === user?.userId);

  const driverBookings = bookings.filter(
    (b) =>
      b.driverId === driverDetails?.driverId &&
      b.status !== "delivered" &&
      b.status !== "cancelled"
  );

  const handleUpdateStatus = (bookingId: string, currentStatus: BookingStatus) => {
    const nextStatus = statusProgression[currentStatus];
    if (nextStatus) {
      updateBookingStatus(bookingId, nextStatus);
      toast({
        title: "Status Updated!",
        description: `Booking status changed to "${nextStatus.replace("_", " ")}".`
      })
    } else {
        toast({
            variant: "destructive",
            title: "Cannot Update",
            description: "This booking is already completed or cancelled.",
        })
    }
  };


  if (!user || !driverDetails) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <h3 className="text-xl font-semibold">Not a Driver</h3>
          <p className="text-muted-foreground mt-2">
            This dashboard is for drivers only.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!driverDetails.approved) {
     return (
      <Card className="text-center py-12">
        <CardContent>
          <h3 className="text-xl font-semibold">Account Pending Approval</h3>
          <p className="text-muted-foreground mt-2">
            Your account is currently under review by an administrator. You will be able to see trips once approved.
          </p>
        </CardContent>
      </Card>
    );
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
      {driverBookings.map((booking) => {
        const client = MOCK_USERS.find(u => u.userId === booking.clientId);
        const canUpdate = booking.status !== 'delivered' && booking.status !== 'cancelled';
        return (
            <Card key={booking.bookingId} className="flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-start">
                <div>
                    <CardTitle>Booking #{booking.bookingId.slice(-6)}</CardTitle>
                    <CardDescription>
                        For: {client?.name}
                    </CardDescription> 
                </div>
                <Badge
                    variant={"outline"}
                >
                    {booking.status.replace("_", " ")}
                </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                <div className="flex items-center gap-3">
                    <UserIcon className="w-5 h-5 text-muted-foreground" />
                    <div>
                        <p className="font-medium">{client?.name}</p>
                        <p className="text-sm text-muted-foreground">{client?.phone}</p>
                    </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">{booking.pickupLocation}</span>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                    <Car className="w-5 h-5 text-muted-foreground" />
                    <span>
                    {booking.vehicle.make}{" "}
                    {booking.vehicle.model} ({booking.vehicle.plate_no})
                    </span>
                </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button 
                    className="w-full"
                    onClick={() => handleUpdateStatus(booking.bookingId, booking.status)}
                    disabled={!canUpdate}
                >
                    {getNextStatusText(booking.status)}
                </Button>
            </CardFooter>
            </Card>
        )
      })}
    </div>
  );
}
