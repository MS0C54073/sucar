
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
import { MOCK_BOOKINGS } from "@/lib/mock-data";
import { format } from "date-fns";

export default function MyBookingsPage() {
  // In a real app, you'd fetch this for the logged in user
  const bookings = MOCK_BOOKINGS;

  return (
    <div>
        <div className="mb-8">
            <h1 className="text-2xl font-bold font-headline">My Bookings</h1>
            <p className="text-muted-foreground">
                View and manage all your car wash bookings.
            </p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Your Bookings</CardTitle>
                <CardDescription>A list of your current and past bookings.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Booking ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Vehicle</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Cost</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.map((booking) => (
                        <TableRow key={booking.bookingId}>
                            <TableCell className="font-medium">#{booking.bookingId.slice(-6)}</TableCell>
                            <TableCell>{format(booking.createdAt, "PPP")}</TableCell>
                            <TableCell>{booking.vehicle.make} {booking.vehicle.model}</TableCell>
                            <TableCell>
                                <Badge variant="outline">{booking.status.replace("_", " ")}</Badge>
                            </TableCell>
                            <TableCell className="text-right">K{booking.cost.toFixed(2)}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
