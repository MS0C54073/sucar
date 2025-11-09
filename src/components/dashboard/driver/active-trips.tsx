
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
import { Car, MapPin, User as UserIcon } from "lucide-react";
import { MOCK_BOOKINGS, MOCK_DRIVERS, MOCK_USERS } from "@/lib/mock-data";

export function ActiveTrips() {
  const { user } = useAuth();
  
  const driverDetails = MOCK_DRIVERS.find(d => d.userId === user?.userId);

  const driverBookings = MOCK_BOOKINGS.filter(
    (b) =>
      b.driverId === driverDetails?.driverId &&
      b.status !== "delivered" &&
      b.status !== "cancelled"
  );

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
        return (
            <Card key={booking.bookingId} className="flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-start">
                <div>
                    <CardTitle>Booking #{booking.bookingId.slice(-6)}</CardTitle>
                    <CardDescription>
                        Status: <span className="font-semibold text-foreground">{booking.status.replace("_", " ")}</span>
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
                <Button className="w-full">Update Status</Button>
            </CardFooter>
            </Card>
        )
      })}
    </div>
  );
}
