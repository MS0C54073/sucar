
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
import { Button } from "@/components/ui/button";
import { useBooking } from "@/context/booking-provider";
import { useAuth } from "@/context/auth-provider";
import { format } from "date-fns";
import { Star } from "lucide-react";

export default function HistoryPage() {
  const { user, role } = useAuth();
  const { bookings: allBookings, drivers, users: allUsers } = useBooking();

  const userBookings = allBookings.filter(b => {
    if (role === 'admin') return true;
    if (role === 'client') return b.clientId === user?.userId;
    if (role === 'driver') {
        const driverDetails = drivers.find(d => d.userId === user?.userId);
        return b.driverId === driverDetails?.driverId;
    }
     if (role === 'provider') return b.providerId === user?.userId; // Assuming providerId matches userId for providers
    return false;
  })

  const completedBookings = userBookings.filter(
    (b) => b.status === "delivered" || b.status === "cancelled"
  );

  const getClientName = (clientId: string) => allUsers.find(u => u.userId === clientId)?.name || 'N/A';
  const getDriverName = (driverId: string) => drivers.find(d => d.driverId === driverId)?.name || 'N/A';


  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-headline">Booking History</h1>
        <p className="text-muted-foreground">
          Review your past car wash services.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Completed Bookings</CardTitle>
          <CardDescription>
            A list of all your completed and cancelled bookings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                 {role === 'admin' && <TableHead>Client</TableHead>}
                 {role === 'admin' && <TableHead>Driver</TableHead>}
                <TableHead>Vehicle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                 <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedBookings.map((booking) => (
                <TableRow key={booking.bookingId}>
                  <TableCell>{format(booking.createdAt, "PPP")}</TableCell>
                   {role === 'admin' && <TableCell>{getClientName(booking.clientId)}</TableCell>}
                   {role === 'admin' && <TableCell>{getDriverName(booking.driverId)}</TableCell>}
                  <TableCell>
                    {booking.vehicle.make} {booking.vehicle.model}
                  </TableCell>
                  <TableCell>
                    <Badge variant={booking.status === 'cancelled' ? 'destructive' : 'secondary'}>{booking.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    K{booking.cost.toFixed(2)}
                  </TableCell>
                   <TableCell className="text-right">
                    <Button variant="outline" size="sm" disabled={role !== 'client'}>
                        <Star className="mr-2 h-4 w-4" />
                        Rate Service
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
               {completedBookings.length === 0 && (
                <TableRow>
                    <TableCell colSpan={role === 'admin' ? 7 : 5} className="text-center h-24">No completed bookings yet.</TableCell>
                </TableRow>
               )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
