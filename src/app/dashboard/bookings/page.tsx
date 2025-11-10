
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useBooking } from "@/context/booking-provider";
import { format } from "date-fns";
import { statusText } from "@/components/dashboard/client/booking-status";

export default function AllBookingsPage() {
  const { bookings, users, drivers } = useBooking();

  return (
    <div>
        <div className="mb-8">
            <h1 className="text-2xl font-bold font-headline">All Bookings</h1>
            <p className="text-muted-foreground">
                View and manage all bookings across the platform.
            </p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Platform Bookings</CardTitle>
                <CardDescription>A list of all current and past bookings.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Booking ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Driver</TableHead>
                            <TableHead>Vehicle</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Cost</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.map((booking) => {
                           const client = users.find(u => u.userId === booking.clientId);
                           const driver = drivers.find(d => d.driverId === booking.driverId);
                           return (
                                <TableRow key={booking.bookingId}>
                                    <TableCell className="font-medium">#{booking.bookingId.slice(-6)}</TableCell>
                                    <TableCell>{format(booking.createdAt, "PPP")}</TableCell>
                                    <TableCell>{client?.name}</TableCell>
                                    <TableCell>{driver?.name}</TableCell>
                                    <TableCell>{booking.vehicle.make} {booking.vehicle.model}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">{statusText[booking.status] || booking.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">K{booking.cost.toFixed(2)}</TableCell>
                                </TableRow>
                           )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
